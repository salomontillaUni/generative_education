"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { createClient } from "@/app/utils/supabase/client";

type OptionRow = {
  id: string;
  option_text: string;
  is_correct: boolean;
};

type QuestionRow = {
  id: string;
  question_text: string;
  explanation: string | null;
  options: OptionRow[] | null;
};

type QuizData = {
  id: string;
  title: string;
  questions: QuestionRow[] | null;
};

type AttemptRow = {
  id: string;
  score: number | null;
  created_at: string;
};

type AnswerRow = {
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
};

function QuizResultsContent() {
  const { id: quizId } = useParams();
  const searchParams = useSearchParams();
  const summaryId = searchParams.get("fromSummary");

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [attempt, setAttempt] = useState<AttemptRow | null>(null);
  const [answersByQuestion, setAnswersByQuestion] = useState<
    Record<string, AnswerRow>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!quizId || typeof quizId !== "string") {
        setLoading(false);
        setError("Quiz no válido");
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        setError("Inicia sesión para ver tus resultados");
        return;
      }

      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select(
          "id, title, questions(id, question_text, explanation, options(id, option_text, is_correct))",
        )
        .eq("id", quizId)
        .single();

      if (quizError || !quizData) {
        setError("No se pudo cargar el quiz");
        setLoading(false);
        return;
      }

      setQuiz(quizData);

      const { data: attemptData, error: attemptError } = await supabase
        .from("quiz_attempts")
        .select("id, score, created_at")
        .eq("quiz_id", quizId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (attemptError) {
        setError("No se pudo cargar tu intento");
        setLoading(false);
        return;
      }

      if (!attemptData) {
        setAttempt(null);
        setLoading(false);
        return;
      }

      setAttempt(attemptData);

      const { data: answerRows, error: answersError } = await supabase
        .from("answers")
        .select("question_id, selected_option_id, is_correct")
        .eq("attempt_id", attemptData.id);

      if (answersError) {
        setError("No se pudieron cargar tus respuestas");
        setLoading(false);
        return;
      }

      const map: Record<string, AnswerRow> = {};
      for (const row of answerRows || []) {
        map[row.question_id] = row as AnswerRow;
      }
      setAnswersByQuestion(map);
      setLoading(false);
    };

    load();
  }, [quizId]);

  const questionOrder = useMemo(() => quiz?.questions || [], [quiz]);

  const optionTextById = useMemo(() => {
    const m = new Map<string, string>();
    for (const q of questionOrder) {
      for (const o of q.options || []) {
        m.set(o.id, o.option_text);
      }
    }
    return m;
  }, [questionOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-600 font-medium">Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6">
        <p className="text-gray-900 font-semibold">{error}</p>
        <Link
          href="/views/quizzes"
          className="text-indigo-600 font-medium hover:underline"
        >
          Volver a evaluaciones
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (!attempt) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="text-gray-600">
          Aún no has completado este cuestionario.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/views/quizzes/${quiz.id}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Hacer el quiz
          </Link>
          <Link
            href={
              summaryId
                ? `/views/summaries/${summaryId}`
                : "/views/quizzes"
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </div>
    );
  }

  const backHref = summaryId
    ? `/views/summaries/${summaryId}`
    : "/views/quizzes";

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {quiz.title}
          </h1>
          <p className="text-gray-500 mt-1">
            Repaso del último intento
            {attempt.score != null && (
              <span className="font-semibold text-gray-800">
                {" "}
                · {Number(attempt.score).toFixed(0)}% aciertos
              </span>
            )}
          </p>
        </div>
        <Link
          href={`/views/quizzes/${quiz.id}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          Reintentar
        </Link>
      </div>

      <ul className="space-y-6">
        {questionOrder.map((q, idx) => {
          const answer = answersByQuestion[q.id];
          const options = q.options || [];
          const correct = options.find((o) => o.is_correct);
          const selectedId = answer?.selected_option_id ?? null;
          const ok = answer?.is_correct === true;

          return (
            <li
              key={q.id}
              className={cn(
                "rounded-2xl border p-5 sm:p-6 shadow-sm",
                ok ? "border-emerald-100 bg-emerald-50/30" : "border-red-100 bg-red-50/20",
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                {ok ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Pregunta {idx + 1}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                    {q.question_text}
                  </h2>
                </div>
              </div>

              <div className="ml-9 space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Tu respuesta: </span>
                  <span className="font-medium text-gray-900">
                    {selectedId
                      ? optionTextById.get(selectedId) || "—"
                      : "Sin respuesta"}
                  </span>
                </p>
                {!ok && correct && (
                  <p>
                    <span className="text-gray-500">Correcta: </span>
                    <span className="font-medium text-emerald-800">
                      {correct.option_text}
                    </span>
                  </p>
                )}
                {q.explanation && (
                  <p className="text-gray-600 pt-2 border-t border-gray-100/80 mt-2">
                    {q.explanation}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      }
    >
      <QuizResultsContent />
    </Suspense>
  );
}
