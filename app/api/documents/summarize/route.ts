import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import path from "path";
import { pathToFileURL } from "url";

// Set worker source for pdf-parse (pdfjs-dist)
// pathToFileURL is required on Windows: bare paths like C:\... are invalid for dynamic import()
const workerPath = path.join(
  process.cwd(),
  "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs",
);
PDFParse.setWorker(pathToFileURL(workerPath).href);

function fileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

/** .docx es un ZIP (firma PK\x03\x04) */
function looksLikeDocxZip(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  );
}

type ApiErrorLike = {
  status?: number;
  message?: string;
};

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

    // 2.5 Validation: Max size 10MB and allowed formats
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_MIME_TYPES = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      "text/plain"
    ];

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: "El archivo es demasiado grande. El tamaño máximo permitido es 10MB." 
      }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      // Logic for .txt sometimes has empty type on some OS
      const extension = file.name.split(".").pop()?.toLowerCase();
      const isAllowedExt = ["pdf", "docx", "doc", "txt"].includes(extension || "");
      
      if (!isAllowedExt) {
        return NextResponse.json({ 
          error: "Formato de archivo no soportado. Por favor, sube un documento PDF, Word o TXT." 
        }, { status: 400 });
      }
    }

    // 3. Extract text (PDF / Word / plain text)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = fileExtension(file);
    const mime = file.type;

    let text = "";

    const isPdf = ext === "pdf" || mime === "application/pdf";
    const isDocx =
      ext === "docx" ||
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      (looksLikeDocxZip(buffer) &&
        (mime === "" ||
          mime === "application/octet-stream" ||
          mime === "application/zip"));
    const isLegacyDoc = ext === "doc" || mime === "application/msword";
    const isTxt = ext === "txt" || mime === "text/plain";

    if (isPdf) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else if (isDocx) {
      try {
        const { value, messages } = await mammoth.extractRawText({ buffer });
        text = value;
        if (messages?.length) {
          console.warn("mammoth extractRawText messages:", messages);
        }
      } catch (mammothError) {
        console.error("mammoth extractRawText failed:", mammothError);
        return NextResponse.json(
          {
            error:
              "No se pudo leer el contenido del archivo Word. Si es .xlsx u otro formato, exporta a PDF o .docx.",
          },
          { status: 422 },
        );
      }
    } else if (isLegacyDoc) {
      return NextResponse.json(
        {
          error:
            "El formato Word antiguo (.doc) no se puede leer aquí. Abre el archivo en Word y guárdalo como .docx o PDF, luego vuelve a subirlo.",
        },
        { status: 422 },
      );
    } else if (isTxt) {
      text = buffer.toString("utf-8");
    } else {
      // Fallback: treat as plain text only if it does not look like binary
      const asUtf8 = buffer.toString("utf-8");
      const controlChars = (asUtf8.match(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g) ?? []).length;
      if (controlChars > asUtf8.length * 0.02 && asUtf8.length > 200) {
        return NextResponse.json(
          {
            error:
              "No se pudo leer el contenido del archivo (posible binario). Usa PDF, .docx o .txt.",
          },
          { status: 422 },
        );
      }
      text = asUtf8;
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
    } catch (primaryError: unknown) {
      const typedPrimary = primaryError as ApiErrorLike;
      if (typedPrimary.status === 429) {
        console.warn("Gemini 2.0 Flash quota exceeded, trying 1.5 Flash fallback...");
        try {
          // Try fallback model
          summaryJson = await trySummarize("gemini-2.5-flash-lite");
        } catch (fallbackError: unknown) {
          const typedFallback = fallbackError as ApiErrorLike;
          console.error("Gemini fallbacks failed:", fallbackError);
          const isQuota =
            typedFallback.status === 429 || typedFallback.message?.includes("quota");
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

  } catch (error: unknown) {
    console.error("Summarization API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : (error as ApiErrorLike).message || "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
