import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";
import path from "path";

// Set worker source for pdf-parse (pdfjs-dist)
// This is required in Next.js environments where the worker file isn't automatically found
PDFParse.setWorker(path.join(process.cwd(), "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs"));

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Get file from form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // 3. Extract text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let text = "";
    if (file.type === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else {
      text = buffer.toString("utf-8");
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No se pudo extraer texto del documento" }, { status: 422 });
    }

    // 4. Summarize with Gemini (with fallback)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const prompt = `
      Eres un asistente experto en educación generativa. Tu tarea es analizar el siguiente texto y generar un resumen estructurado para un estudiante.
      
      IMPORTANTE: Debes responder ÚNICAMENTE con un objeto JSON válido.
      
      Estructura del JSON esperada:
      {
        "title": "Un título conciso y atractivo",
        "content": [
          { "type": "p", "text": "Un párrafo introductorio" },
          { "type": "h2", "text": "Un subtítulo de sección" },
          { "type": "list", "items": ["punto 1", "punto 2"] },
          { "type": "callout", "text": "Una nota importante", "title": "Tip de Aprendizaje" }
        ],
        "glossary": [
          { "term": "Término difícil", "definition": "Su explicación" }
        ],
        "readTime": "5 min"
      }

      Texto a analizar:
      ${text.substring(0, 30000)} // Limit text to avoid token issues, though Flash handles more.
    `;
    
    const trySummarize = async (modelName: string) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    };

    let summaryJson;
    try {
      // Try primary model
      summaryJson = await trySummarize("gemini-2.5-flash");
    } catch (primaryError: any) {
      if (primaryError.status === 429) {
        console.warn("Gemini 2.0 Flash quota exceeded, trying 1.5 Flash fallback...");
        try {
          // Try fallback model
          summaryJson = await trySummarize("gemini-2.5-flash-lite");
        } catch (fallbackError: any) {
          console.error("Gemini fallbacks failed:", fallbackError);
          const isQuota = fallbackError.status === 429 || fallbackError.message?.includes("quota");
          return NextResponse.json({ 
            error: isQuota 
              ? "Se ha agotado la cuota gratuita de la IA. Por favor, intenta de nuevo en unos minutos." 
              : "Error procesando el documento con IA" 
          }, { status: isQuota ? 429 : 500 });
        }
      } else {
        throw primaryError;
      }
    }

    // 5. Save to Database
    // First, save the document record
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert({
        name: file.name,
        user_id: user.id,
        status: "processed",
      })
      .select()
      .single();

    if (docError) {
      console.error("Error saving document:", docError);
      return NextResponse.json({ error: "Error guardando el documento" }, { status: 500 });
    }

    // Then, save the summary
    const { data: summaryData, error: summaryError } = await supabase
      .from("summaries")
      .insert({
        document_id: docData.id,
        user_id: user.id,
        title: summaryJson.title,
        content: summaryJson, // We store the whole JSON for the UI to consume
      })
      .select()
      .single();

    if (summaryError) {
      console.error("Error saving summary:", summaryError);
      return NextResponse.json({ error: "Error guardando el resumen" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      summaryId: summaryData.id,
      documentId: docData.id
    });

  } catch (error: any) {
    console.error("Summarization API error:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
