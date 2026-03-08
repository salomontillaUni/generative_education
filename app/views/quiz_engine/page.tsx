import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  RefreshCcw,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";

const mockQuizData = {
  title: "Mecánica de la Respiración Celular",
  questions: [
    {
      id: 1,
      text: "¿Qué molécula es conocida como la 'moneda energética' de la célula?",
      options: ["Glucosa", "ATP", "NADH", "Piruvato"],
      correctIndex: 1,
      explanation: "El ATP (Trifosfato de adenosina) almacena y libera energía para los procesos celulares. Actúa como una batería recargable.",
      reference: "Concepto de ATP en Resumen"
    },
    {
      id: 2,
      text: "¿Dónde ocurre la glucólisis?",
      options: ["Matriz mitocondrial", "Núcleo", "Citoplasma", "Membrana mitocondrial interna"],
      correctIndex: 2,
      explanation: "La glucólisis es el primer paso de la respiración celular y ocurre en el citoplasma, rompiendo la glucosa en piruvato.",
      reference: "Las Tres Etapas > Glucólisis"
    }
  ]
};

export function QuizEngine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = mockQuizData.questions[currentQIndex];
  const totalQs = mockQuizData.questions.length;
  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === question.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < totalQs - 1) {
      setCurrentQIndex(q => q + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans relative z-50 overflow-hidden">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-indigo-100/50 max-w-lg w-full border border-gray-100 relative z-10"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="w-48 h-48 text-indigo-900" />
          </div>
          
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-6 relative shadow-inner border border-indigo-100">
            <Sparkles className="w-10 h-10 text-indigo-500" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
              +{Math.round((score / totalQs) * 100)}%
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight">¡Prueba Completada!</h1>
          <p className="text-gray-500 mb-8 font-medium">Obtuviste {score} de {totalQs}</p>
          
          <div className="space-y-4">
            <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-6 text-left shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                <RefreshCcw className="w-4 h-4 text-indigo-600" /> Plan de Acción
              </h3>
              <p className="text-indigo-800/80 text-sm leading-relaxed">Basado en tus respuestas, te recomendamos repasar la sección "Proceso de Glucólisis" en tus notas antes de avanzar.</p>
              <Link to="/summaries" className="mt-4 bg-white text-indigo-700 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm hover:bg-indigo-50 transition-colors w-full flex justify-between items-center group border border-indigo-100">
                Repasar Conceptos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <Link to="/quizzes" className="flex items-center justify-center w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-md">
              Volver al Panel
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans z-[100] overflow-y-auto">
      
      {/* Top Bar: Progress & Exit */}
      <header className="flex items-center justify-between p-6 shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100">
        <button 
          onClick={() => navigate("/quizzes")}
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex shrink-0"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex-1 max-w-md mx-4 sm:mx-8 flex flex-col items-center">
          <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Pregunta {currentQIndex + 1} de {totalQs}
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: `${((currentQIndex) / totalQs) * 100}%` }}
              animate={{ width: `${((currentQIndex + 1) / totalQs) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>

        <div className="w-10 flex shrink-0" /> {/* Spacer for alignment */}
      </header>

      {/* Main Quiz Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 w-full max-w-3xl mx-auto min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 leading-tight tracking-tight max-w-2xl">
              {question.text}
            </h2>

            <div className="space-y-3 sm:space-y-4 w-full max-w-2xl">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrectOption = index === question.correctIndex;
                
                let optionClasses = "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-700 shadow-sm";
                let letterClasses = "border-gray-300 text-gray-400 group-hover:border-indigo-300 group-hover:text-indigo-400 bg-white";
                
                if (showFeedback) {
                  if (isCorrectOption) {
                    optionClasses = "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md ring-4 ring-emerald-500/10";
                    letterClasses = "border-emerald-500 bg-emerald-500 text-white";
                  } else if (isSelected) {
                    optionClasses = "bg-red-50 border-red-500 text-red-900 shadow-sm opacity-90 ring-4 ring-red-500/10";
                    letterClasses = "border-red-500 bg-red-500 text-white";
                  } else {
                    optionClasses = "bg-white border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
                    letterClasses = "border-gray-200 text-gray-300 bg-gray-50";
                  }
                } else if (isSelected) {
                  optionClasses = "bg-indigo-50 border-indigo-500 text-indigo-900 ring-4 ring-indigo-500/10 shadow-md";
                  letterClasses = "border-indigo-500 bg-indigo-500 text-white";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={showFeedback}
                    className={cn(
                      "w-full text-left px-5 py-4 sm:px-6 sm:py-5 rounded-2xl border-2 text-base sm:text-lg font-medium transition-all duration-200 flex items-center justify-between group",
                      optionClasses
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-colors shrink-0 shadow-sm",
                        letterClasses
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="leading-snug">{option}</span>
                    </div>
                    
                    {showFeedback && isCorrectOption && <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 shrink-0 ml-4" />}
                    {showFeedback && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 shrink-0 ml-4" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Spacer for fixed bottom bar */}
      {showFeedback && <div className="h-48 sm:h-40" />}

      {/* Feedback & Next Button Area (Fixed at bottom) */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className={cn(
              "fixed bottom-0 left-0 w-full border-t p-4 sm:p-6 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] z-30 backdrop-blur-xl",
              isCorrect ? "bg-emerald-50/95 border-emerald-100/50" : "bg-red-50/95 border-red-100/50"
            )}
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <h3 className={cn("text-xl sm:text-2xl font-black tracking-tight", isCorrect ? "text-emerald-900" : "text-red-900")}>
                    {isCorrect ? "¡Excelente!" : "Casi, pero no."}
                  </h3>
                </div>
                
                <p className={cn("text-sm sm:text-base max-w-2xl mb-4 font-medium leading-relaxed", isCorrect ? "text-emerald-800/80" : "text-red-800/80")}>
                  {question.explanation}
                </p>

                {/* Review Concept Button */}
                {!isCorrect && (
                  <Link 
                    to="/summaries" 
                    className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 shadow-sm border border-red-200/50 hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500" /> Repasar Concepto: {question.reference}
                  </Link>
                )}
              </div>

              <button
                onClick={handleNext}
                className={cn(
                  "px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 shrink-0 w-full md:w-auto flex items-center justify-center gap-2 group",
                  isCorrect ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600" : "bg-red-500 shadow-red-500/20 hover:bg-red-600"
                )}
              >
                {currentQIndex < totalQs - 1 ? "Siguiente Pregunta" : "Terminar Prueba"}
                {currentQIndex < totalQs - 1 && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
