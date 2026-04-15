"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  BrainCircuit, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";

type QuizRow = {
  id: string;
  title: string;
  created_at: string;
  questions: { id: string }[] | null;
};

type AttemptRow = {
  quiz_id: string;
  score: number | null;
  created_at: string;
};

type QuizCard = {
  id: string;
  title: string;
  status: "recommended" | "completed" | "needs_review";
  score: number | null;
  time: string;
  questions: number;
};

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const supabase = createClient();

      const { data: quizzesData, error: quizzesError } = await supabase
        .from("quizzes")
        .select("id, title, created_at, questions(id)")
        .order("created_at", { ascending: false });

      if (quizzesError) {
        console.error("Error fetching quizzes:", quizzesError);
        setLoading(false);
        return;
      }

      setQuizzes(quizzesData || []);

      const quizIds = (quizzesData || []).map((quiz) => quiz.id);
      if (quizIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: attemptsData, error: attemptsError } = await supabase
        .from("quiz_attempts")
        .select("quiz_id, score, created_at")
        .in("quiz_id", quizIds)
        .order("created_at", { ascending: false });

      if (attemptsError) {
        console.error("Error fetching attempts:", attemptsError);
      } else {
        setAttempts(attemptsData || []);
      }

      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  const quizCards = useMemo<QuizCard[]>(() => {
    const latestAttemptByQuiz = new Map<string, AttemptRow>();
    for (const attempt of attempts) {
      if (!latestAttemptByQuiz.has(attempt.quiz_id)) {
        latestAttemptByQuiz.set(attempt.quiz_id, attempt);
      }
    }

    return quizzes.map((quiz) => {
      const latestAttempt = latestAttemptByQuiz.get(quiz.id);
      const score = latestAttempt?.score ?? null;
      const status: QuizCard["status"] =
        score === null ? "recommended" : score < 60 ? "needs_review" : "completed";
      const questionsCount = quiz.questions?.length ?? 0;
      const estimatedMinutes = Math.max(3, Math.ceil(questionsCount * 1.5));

      return {
        id: quiz.id,
        title: quiz.title,
        status,
        score,
        time: `${estimatedMinutes} min`,
        questions: questionsCount,
      };
    });
  }, [quizzes, attempts]);

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recuerdo Activo</h1>
        <p className="text-gray-500 text-lg">Pon a prueba tus conocimientos y fortalece tus vías neuronales.</p>
      </div>

      

      {/* Quiz List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cuestionarios por Tema</h3>
        {loading ? (
          <div className="text-sm text-gray-500">Cargando cuestionarios...</div>
        ) : quizCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-gray-500">
            Aún no tienes quizzes generados. Ve a un resumen y crea tu primer quiz.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizCards.map((quiz) => (
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

              <div className="flex flex-col gap-2 w-full">
                {quiz.score !== null ? (
                  <>
                    <Link
                      href={`/views/quizzes/${quiz.id}/results`}
                      className={cn(
                        "w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                        "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200",
                      )}
                    >
                      <CheckCircle className="w-4 h-4" /> Ver repaso
                    </Link>
                    <Link
                      href={`/views/quizzes/${quiz.id}`}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all"
                    >
                      <Play className="w-4 h-4" /> Reintentar
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/views/quizzes/${quiz.id}`}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                      "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white",
                    )}
                  >
                    <Play className="w-4 h-4" /> Empezar prueba
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

    </div>
  );
}
