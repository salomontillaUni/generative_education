"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  Highlighter,
  MessageSquare,
  List,
  X,
  ArrowLeft,
  Play,
  ClipboardCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "../../../components/ui/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

const mockSummary = {
  title: "Mecánica de la Respiración Celular",
  content: [
    {
      type: "p",
      text: "La respiración celular es un conjunto de reacciones y procesos metabólicos que tienen lugar en las células de los organismos para convertir la energía bioquímica de los nutrientes en trifosfato de adenosina (ATP) y luego liberar productos de desecho.",
    },
    {
      type: "callout",
      icon: Sparkles,
      text: "Nota clave: El ATP es la 'moneda energética' de la célula. Piénsalo como una batería recargable.",
      title: "Nota IA",
    },
    { type: "h2", text: "Las Tres Etapas" },
    {
      type: "p",
      text: "Las reacciones implicadas en la respiración son reacciones catabólicas, que rompen moléculas grandes en otras más pequeñas, liberando energía debido a que los enlaces débiles de alta energía, en particular en el oxígeno diatómico, son reemplazados por enlaces más fuertes en los productos.",
    },
    {
      type: "list",
      items: [
        "Glucólisis: Ocurre en el citoplasma. Rompe la glucosa en dos moléculas de piruvato.",
        "Ciclo de Krebs (Ciclo del Ácido Cítrico): Ocurre en la matriz mitocondrial. Completa la descomposición de la glucosa.",
        "Cadena de Transporte de Electrones: Ocurre en la membrana mitocondrial interna. Representa la mayor parte de la síntesis de ATP.",
      ],
    },
    {
      type: "p",
      text: "La respiración es una de las formas clave en que una célula libera energía química para impulsar la actividad celular. La reacción global ocurre en una serie de pasos bioquímicos, algunos de los cuales son reacciones redox.",
    },
  ],
  glossary: [
    {
      term: "ATP",
      definition:
        "Trifosfato de adenosina, la molécula principal para almacenar y transferir energía en las células.",
    },
    {
      term: "Catabólico",
      definition:
        "El conjunto de rutas metabólicas que descompone moléculas en unidades más pequeñas que se oxidan para liberar energía.",
    },
    {
      term: "Redox",
      definition:
        "Reacciones químicas en las que cambian los estados de oxidación de los átomos.",
    },
  ],
};

export default function SummaryDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [summary, setSummary] = useState<any>(null);
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [linkedQuizId, setLinkedQuizId] = useState<string | null>(null);
  const [hasQuizAttempt, setHasQuizAttempt] = useState(false);

  const [activePanel, setActivePanel] = useState<"reading" | "chat">("reading");
  const [selectedText, setSelectedText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchSummary() {
      if (!id) return;
      
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase
          .from("summaries")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        setSummaryId(data.id);
        // The content is stored as JSON in our API
        const summaryData = data.content;
        setSummary(summaryData);
        
        // Initialize chat with title
        setChatMessages([
          {
            role: "ai",
            text: `¡Hola! Estoy listo para ayudarte a entender "${summaryData.title}". Resalta cualquier texto o haz una pregunta aquí.`,
          },
        ]);
      } catch (err: any) {
        console.error("Error fetching summary:", err);
        setError("No se pudo cargar el resumen");
      } finally {
        setLoading(false);
      }
    }
    
    fetchSummary();
  }, [id]);
  const [inputText, setInputText] = useState("");

  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      setSelectedText(selection.toString());
      setShowTooltip(true);
      setTooltipPos({ x: e.clientX, y: e.clientY - 40 });
    } else {
      setShowTooltip(false);
    }
  };

  const explainSelection = () => {
    setActivePanel("chat");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: `Explicar: "${selectedText}"` },
      {
        role: "ai",
        text: "Generando explicación basada en tu base de conocimientos...",
      },
    ]);
    setShowTooltip(false);

    // Mock response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "ai",
          text: `Aquí tienes un desglose más simple de "${selectedText}": Se refiere al proceso central donde las células descomponen las moléculas de los alimentos para obtener energía. Imagínalo como quemar madera en una chimenea, pero controlado cuidadosamente paso a paso para capturar el calor (energía) como ATP.`,
        },
      ]);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", text: inputText }]);
    setInputText("");
    setActivePanel("chat");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "¡Es una gran pregunta! Según tus documentos, el ciclo de Krebs es la segunda etapa principal...",
        },
      ]);
    }, 1000);
  };

  const handleGenerateQuiz = async () => {
    if (!summaryId || isGeneratingQuiz) return;

    try {
      setIsGeneratingQuiz(true);
      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryId, questionCount: 5 }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "No se pudo generar el quiz");
      }

      const sid = summaryId;
      if (payload.alreadyExists && payload.quizId) {
        if (sid) {
          setLinkedQuizId(payload.quizId);
          setHasQuizAttempt(!!payload.hasAttempt);
        }
        router.push(
          payload.hasAttempt
            ? `/views/quizzes/${payload.quizId}/results?fromSummary=${encodeURIComponent(sid ?? "")}`
            : `/views/quizzes/${payload.quizId}`,
        );
        return;
      }

      if (sid) {
        setLinkedQuizId(payload.quizId);
        setHasQuizAttempt(false);
      }
      router.push(`/views/quizzes/${payload.quizId}`);
    } catch (generationError: unknown) {
      const message =
        generationError instanceof Error ? generationError.message : "No se pudo generar el quiz";
      console.error("Error generating quiz:", generationError);
      setError(message);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Cargando material de estudio...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-700 font-bold text-xl">{error || "Resumen no encontrado"}</p>
        <button 
          onClick={() => router.push("/views/summaries")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 shrink-0">
        <button
          onClick={() => router.push("/views/summaries")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Resúmenes
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600 shrink-0" />
              <span className="min-w-0">{summary.title}</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            {!linkedQuizId ? (
              <button
                type="button"
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz || !summaryId}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              >
                {isGeneratingQuiz ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGeneratingQuiz ? "Generando..." : "Generar quiz"}
              </button>
            ) : hasQuizAttempt ? (
              <>
                <Link
                  href={`/views/quizzes/${linkedQuizId}/results?fromSummary=${encodeURIComponent(summaryId ?? "")}`}
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Ver resultados
                </Link>
                <Link
                  href={`/views/quizzes/${linkedQuizId}`}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reintentar
                </Link>
              </>
            ) : (
              <Link
                href={`/views/quizzes/${linkedQuizId}`}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Hacer quiz
              </Link>
            )}
            <div className="lg:hidden flex bg-gray-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePanel("reading")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activePanel === "reading"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-500",
                )}
              >
                Leer
              </button>
              <button
                type="button"
                onClick={() => setActivePanel("chat")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activePanel === "chat"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-500",
                )}
              >
                Chat IA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden relative min-h-0">
        {/* Reading Panel */}
        <div
          className={cn(
            "flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-y-auto relative transition-all duration-300",
            activePanel === "chat" ? "hidden lg:block" : "block",
          )}
          onMouseUp={handleMouseUp}
        >
          <div className="max-w-3xl mx-auto p-8 sm:p-12 pb-24 prose prose-indigo prose-lg font-serif">
            {summary.content.map((block: any, idx: number) => {
              if (block.type === "h2")
                return (
                  <h2
                    key={idx}
                    className="font-sans font-bold text-gray-900 mt-12 mb-6 text-2xl"
                  >
                    {block.text}
                  </h2>
                );
              if (block.type === "p")
                return (
                  <p key={idx} className="text-gray-700 leading-relaxed mb-6">
                    {block.text}
                  </p>
                );
              if (block.type === "list")
                return (
                  <ul key={idx} className="space-y-3 mb-8 text-gray-700">
                    {block.items?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              if (block.type === "callout")
                return (
                  <div
                    key={idx}
                    className="my-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex gap-4 not-prose"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900 text-sm uppercase tracking-wider mb-1">
                        {block.title || "Nota IA"}
                      </h4>
                      <p className="text-indigo-800 leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  </div>
                );
              return null;
            })}
          </div>

          {/* Floating Tooltip for Text Selection */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  left: Math.min(
                    Math.max(tooltipPos.x - 100, 20),
                    window.innerWidth - 200,
                  ),
                  top: Math.max(tooltipPos.y, 20),
                }}
                className="fixed z-50 bg-gray-900 text-white rounded-xl shadow-xl shadow-gray-900/20 p-1 flex gap-1 border border-gray-700"
              >
                <button
                  onClick={explainSelection}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Explicar
                </button>
                <div className="w-px bg-gray-700 my-1" />
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                  <Highlighter className="w-4 h-4 text-emerald-400" /> Resaltar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
