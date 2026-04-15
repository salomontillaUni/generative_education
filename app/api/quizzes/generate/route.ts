import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/app/utils/supabase/server";

type GeneratedQuizQuestion = {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type GeneratedQuiz = {
  title: string;
  questions: GeneratedQuizQuestion[];
};

type ApiErrorLike = {
  status?: number;
  message?: string;
};

function isValidGeneratedQuiz(payload: unknown): payload is GeneratedQuiz {
  if (!payload || typeof payload !== "object") return false;

  const quiz = payload as GeneratedQuiz;
  if (!quiz.title || typeof quiz.title !== "string") return false;
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) return false;

  return quiz.questions.every((question) => {
    if (!question || typeof question !== "object") return false;
    if (!question.text || typeof question.text !== "string") return false;
    if (!question.explanation || typeof question.explanation !== "string") return false;
    if (!Array.isArray(question.options) || question.options.length !== 4) return false;
    if (!question.options.every((option) => typeof option === "string" && option.trim().length > 0)) {
      return false;
    }
    return Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex <= 3;
  });
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await req.json()) as { summaryId?: unknown; questionCount?: unknown };
    const summaryId = body?.summaryId;
    const rawQuestionCount = Number(body?.questionCount ?? 5);
    const questionCount = Number.isFinite(rawQuestionCount)
      ? Math.max(3, Math.min(6, Math.floor(rawQuestionCount)))
      : 5;

    if (!summaryId || typeof summaryId !== "string") {
      return NextResponse.json({ error: "summaryId es requerido" }, { status: 400 });
    }

    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .select("id, document_id, title, content")
      .eq("id", summaryId)
      .single();

    if (summaryError || !summary) {
      return NextResponse.json({ error: "Resumen no encontrado" }, { status: 404 });
    }

    const summaryContent = summary.content;
    if (!summaryContent || (typeof summaryContent === "string" && summaryContent.trim().length === 0)) {
      return NextResponse.json({ error: "El resumen no tiene contenido utilizable" }, { status: 422 });
    }

    const { data: existingQuiz, error: existingQuizError } = await supabase
      .from("quizzes")
      .select("id")
      .eq("summary_id", summaryId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingQuizError) {
      console.error("Error checking existing quiz:", existingQuizError);
      return NextResponse.json({ error: "No se pudo comprobar el quiz existente" }, { status: 500 });
    }

    if (existingQuiz?.id) {
      const { data: latestAttempt } = await supabase
        .from("quiz_attempts")
        .select("id")
        .eq("quiz_id", existingQuiz.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return NextResponse.json({
        success: true,
        quizId: existingQuiz.id,
        alreadyExists: true,
        hasAttempt: !!latestAttempt,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const serializedSummary = JSON.stringify(summaryContent).slice(0, 30000);

    const prompt = `
      Eres un asistente experto en educación.
      Genera un quiz de opción múltiple basado en el siguiente resumen.

      IMPORTANTE:
      - Responde ÚNICAMENTE con JSON válido.
      - No uses markdown.
      - Cada pregunta debe tener exactamente 4 opciones.
      - correctIndex debe ser un número entero de 0 a 3 aleatorio.
      - La respuesta correcta debe aparece en una posición aleatoria de las opciones.
      - Crea exactamente ${questionCount} preguntas.

      Estructura esperada:
      {
        "title": "Título breve del quiz",
        "questions": [
          {
            "text": "Pregunta",
            "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
            "correctIndex": 0,
            "explanation": "Explicación corta de por qué esa opción es correcta"
          }
        ]
      }

      Resumen fuente:
      ${serializedSummary}
    `;

    const tryGenerateQuiz = async (modelName: string) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    };

    let generatedQuiz: GeneratedQuiz;
    try {
      generatedQuiz = await tryGenerateQuiz("gemini-2.5-flash");
    } catch (primaryError: unknown) {
      const typedPrimaryError = primaryError as ApiErrorLike;
      if (typedPrimaryError?.status === 429) {
        try {
          generatedQuiz = await tryGenerateQuiz("gemini-2.5-flash-lite");
        } catch (fallbackError: unknown) {
          const typedFallbackError = fallbackError as ApiErrorLike;
          const isQuota =
            typedFallbackError?.status === 429 || typedFallbackError?.message?.includes("quota");
          return NextResponse.json(
            {
              error: isQuota
                ? "Se ha agotado la cuota gratuita de la IA. Por favor, intenta de nuevo en unos minutos."
                : "Error generando el quiz con IA",
            },
            { status: isQuota ? 429 : 500 },
          );
        }
      } else {
        throw typedPrimaryError;
      }
    }

    if (!isValidGeneratedQuiz(generatedQuiz)) {
      return NextResponse.json(
        { error: "La IA devolvió un formato inválido para el quiz. Intenta nuevamente." },
        { status: 500 },
      );
    }

    const normalizedQuestions = generatedQuiz.questions.slice(0, questionCount);
    if (normalizedQuestions.length < 3) {
      return NextResponse.json({ error: "No se generaron suficientes preguntas válidas" }, { status: 500 });
    }

    const { data: quizRow, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        title: generatedQuiz.title,
        user_id: user.id,
        document_id: summary.document_id,
        summary_id: summaryId,
      })
      .select("id")
      .single();

    if (quizError || !quizRow) {
      console.error("Error creating quiz:", quizError);
      return NextResponse.json({ error: "No se pudo guardar el quiz" }, { status: 500 });
    }

    for (const question of normalizedQuestions) {
      const { data: questionRow, error: questionError } = await supabase
        .from("questions")
        .insert({
          quiz_id: quizRow.id,
          question_text: question.text,
          explanation: question.explanation,
        })
        .select("id")
        .single();

      if (questionError || !questionRow) {
        console.error("Error creating question:", questionError);
        return NextResponse.json({ error: "No se pudieron guardar las preguntas" }, { status: 500 });
      }

      const optionsPayload = question.options.map((optionText, index) => ({
        question_id: questionRow.id,
        option_text: optionText,
        is_correct: index === question.correctIndex,
      }));

      const { error: optionsError } = await supabase.from("options").insert(optionsPayload);
      if (optionsError) {
        console.error("Error creating options:", optionsError);
        return NextResponse.json({ error: "No se pudieron guardar las opciones" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      quizId: quizRow.id,
      questionCount: normalizedQuestions.length,
      alreadyExists: false,
      hasAttempt: false,
    });
  } catch (error: unknown) {
    const typedError = error as ApiErrorLike;
    console.error("Quiz generation API error:", error);
    return NextResponse.json({ error: typedError?.message || "Error interno del servidor" }, { status: 500 });
  }
}
