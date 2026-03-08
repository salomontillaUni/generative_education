import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  BrainCircuit, 
  Play, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "../../lib/utils";

const mockQuizzes = [
  { id: 1, title: "Mecánica de la Respiración Celular", status: "recommended", score: null, time: "5 min", questions: 10 },
  { id: 2, title: "Historia de la Antigua Roma", status: "completed", score: 85, time: "12 min", questions: 20 },
  { id: 3, title: "Intro a la Mecánica Cuántica", status: "needs_review", score: 45, time: "8 min", questions: 15 },
];

export function Quizzes() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recuerdo Activo</h1>
        <p className="text-gray-500 text-lg">Pon a prueba tus conocimientos y fortalece tus vías neuronales.</p>
      </div>

      {/* Hero / CTA */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <BrainCircuit className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4" />
            Desafío Diario
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
            ¿Listo para tu sesión de repaso personalizada?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base mb-6">
            La IA ha seleccionado 15 preguntas basadas en tu actividad reciente y el algoritmo de repetición espaciada. Concéntrate en tus puntos débiles para maximizar el dominio.
          </p>
          <Link 
            to="/quiz/daily"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-medium transition-all shadow-sm group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            Empezar Repaso Diario
          </Link>
        </div>
        
        <div className="relative z-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center min-w-[200px]">
            <div className="text-4xl font-black mb-1">15</div>
            <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Preguntas</div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs">
              <span className="text-indigo-100"><Clock className="w-3 h-3 inline mr-1"/> ~8 min</span>
              <span className="text-emerald-300 font-semibold">+12% Dominio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cuestionarios por Tema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all hover:shadow-md hover:border-indigo-100"
            >
              {quiz.status === "recommended" && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Recomendado
                </div>
              )}
              {quiz.status === "needs_review" && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Necesita Repaso
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    quiz.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                    quiz.status === "needs_review" ? "bg-orange-50 text-orange-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  {quiz.score !== null && (
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "text-2xl font-black tracking-tighter",
                        quiz.score >= 80 ? "text-emerald-500" : "text-orange-500"
                      )}>
                        {quiz.score}%
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Último Puntaje</span>
                    </div>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900 text-lg leading-tight mb-2 pr-4">{quiz.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {quiz.time}</span>
                  <span>•</span>
                  <span>{quiz.questions} Qs</span>
                </div>
              </div>

              <Link
                to={`/quiz/${quiz.id}`}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  quiz.status === "completed" 
                    ? "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200" 
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white"
                )}
              >
                {quiz.status === "completed" ? (
                  <><CheckCircle className="w-4 h-4" /> Revisar Respuestas</>
                ) : quiz.status === "needs_review" ? (
                  <><AlertCircle className="w-4 h-4" /> Rehacer Prueba</>
                ) : (
                  <><Play className="w-4 h-4" /> Empezar Prueba</>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
