"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  Highlighter, 
  MessageSquare, 
  List,
  X
} from "lucide-react";
import { cn } from "../../components/ui/utils";

const mockSummary = {
  title: "Mecánica de la Respiración Celular",
  content: [
    { type: "p", text: "La respiración celular es un conjunto de reacciones y procesos metabólicos que tienen lugar en las células de los organismos para convertir la energía bioquímica de los nutrientes en trifosfato de adenosina (ATP) y luego liberar productos de desecho." },
    { type: "callout", icon: Sparkles, text: "Nota clave: El ATP es la 'moneda energética' de la célula. Piénsalo como una batería recargable.", title: "Nota IA" },
    { type: "h2", text: "Las Tres Etapas" },
    { type: "p", text: "Las reacciones implicadas en la respiración son reacciones catabólicas, que rompen moléculas grandes en otras más pequeñas, liberando energía debido a que los enlaces débiles de alta energía, en particular en el oxígeno diatómico, son reemplazados por enlaces más fuertes en los productos." },
    { type: "list", items: [
      "Glucólisis: Ocurre en el citoplasma. Rompe la glucosa en dos moléculas de piruvato.",
      "Ciclo de Krebs (Ciclo del Ácido Cítrico): Ocurre en la matriz mitocondrial. Completa la descomposición de la glucosa.",
      "Cadena de Transporte de Electrones: Ocurre en la membrana mitocondrial interna. Representa la mayor parte de la síntesis de ATP."
    ]},
    { type: "p", text: "La respiración es una de las formas clave en que una célula libera energía química para impulsar la actividad celular. La reacción global ocurre en una serie de pasos bioquímicos, algunos de los cuales son reacciones redox." },
  ],
  glossary: [
    { term: "ATP", definition: "Trifosfato de adenosina, la molécula principal para almacenar y transferir energía en las células." },
    { term: "Catabólico", definition: "El conjunto de rutas metabólicas que descompone moléculas en unidades más pequeñas que se oxidan para liberar energía." },
    { term: "Redox", definition: "Reacciones químicas en las que cambian los estados de oxidación de los átomos." },
  ]
};

export default function Summaries() {
  const [activePanel, setActivePanel] = useState<"reading" | "chat">("reading");
  const [selectedText, setSelectedText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "¡Hola! Estoy listo para ayudarte a entender la 'Mecánica de la Respiración Celular'. Resalta cualquier texto o haz una pregunta aquí." }
  ]);
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
    setChatMessages(prev => [
      ...prev, 
      { role: "user", text: `Explicar: "${selectedText}"` },
      { role: "ai", text: "Generando explicación basada en tu base de conocimientos..." }
    ]);
    setShowTooltip(false);
    
    // Mock response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", text: `Aquí tienes un desglose más simple de "${selectedText}": Se refiere al proceso central donde las células descomponen las moléculas de los alimentos para obtener energía. Imagínalo como quemar madera en una chimenea, pero controlado cuidadosamente paso a paso para capturar el calor (energía) como ATP.` }
      ]);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setChatMessages(prev => [...prev, { role: "user", text: inputText }]);
    setInputText("");
    setActivePanel("chat");
    
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { role: "ai", text: "¡Es una gran pregunta! Según tus documentos, el ciclo de Krebs es la segunda etapa principal..." }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Biología 101</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Capítulo 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            {mockSummary.title}
          </h1>
        </div>
        
        {/* Mobile Panel Toggle */}
        <div className="lg:hidden flex bg-gray-100/80 p-1 rounded-xl">
          <button 
            onClick={() => setActivePanel("reading")}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activePanel === "reading" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500")}
          >
            Leer
          </button>
          <button 
            onClick={() => setActivePanel("chat")}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", activePanel === "chat" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500")}
          >
            Chat IA
          </button>
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="flex-1 flex gap-6 overflow-hidden relative min-h-0">
        
        {/* Reading Panel */}
        <div 
          className={cn(
            "flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-y-auto relative transition-all duration-300",
            activePanel === "chat" ? "hidden lg:block" : "block"
          )}
          onMouseUp={handleMouseUp}
        >
          <div className="max-w-3xl mx-auto p-8 sm:p-12 pb-24 prose prose-indigo prose-lg font-serif">
            {mockSummary.content.map((block, idx) => {
              if (block.type === "h2") return <h2 key={idx} className="font-sans font-bold text-gray-900 mt-12 mb-6 text-2xl">{block.text}</h2>;
              if (block.type === "p") return <p key={idx} className="text-gray-700 leading-relaxed mb-6">{block.text}</p>;
              if (block.type === "list") return (
                <ul key={idx} className="space-y-3 mb-8 text-gray-700">
                  {block.items?.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
              if (block.type === "callout") return (
                <div key={idx} className="my-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex gap-4 not-prose">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900 text-sm uppercase tracking-wider mb-1">{block.title}</h4>
                    <p className="text-indigo-800 leading-relaxed">{block.text}</p>
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
                style={{ left: Math.min(Math.max(tooltipPos.x - 100, 20), window.innerWidth - 200), top: Math.max(tooltipPos.y, 20) }}
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

        {/* AI Contextual Panel */}
        <div 
          className={cn(
            "w-full lg:w-80 xl:w-[400px] shrink-0 bg-gray-50/50 rounded-3xl border border-gray-200 shadow-inner flex flex-col transition-all duration-300",
            activePanel === "reading" ? "hidden lg:flex" : "flex"
          )}
        >
          <div className="p-4 border-b border-gray-200/60 bg-white rounded-t-3xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Tutor de IA Adaptativa</h3>
              <p className="text-xs text-gray-500">Haz preguntas sobre el texto</p>
            </div>
            
            {/* Close mobile chat */}
            <button 
              className="lg:hidden ml-auto p-2 text-gray-400 hover:bg-gray-100 rounded-full"
              onClick={() => setActivePanel("reading")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn("flex max-w-[85%]", msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start")}>
                <div className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-sm" 
                    : "bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-200/60 rounded-b-3xl">
            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Haz una pregunta o explica un concepto..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="h-[46px] w-[46px] shrink-0 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
