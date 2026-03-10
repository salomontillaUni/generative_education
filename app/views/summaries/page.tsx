"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Grid,
  List as ListIcon,
  Clock,
  ChevronRight,
  MoreVertical,
  Play,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

const mockSummaries = [
  {
    id: 1,
    title: "Mecánica de la Respiración Celular",
    source: "Respiracion_Celular.pdf",
    date: "Hace 2 horas",
    readTime: "5 min",
    progress: 100,
  },
  {
    id: 2,
    title: "Orígenes del Imperio Romano",
    source: "Historia_Roma_Antigua.docx",
    date: "Ayer",
    readTime: "8 min",
    progress: 40,
  },
  {
    id: 3,
    title: "Principios de la Mecánica Cuántica",
    source: "Intro_Mecanica_Cuantica.pdf",
    date: "Hace 3 días",
    readTime: "12 min",
    progress: 0,
  },
];

export default function SummariesList() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tus Resúmenes
          </h1>
          <p className="text-gray-500 text-lg">
            Repasa y domina tus síntesis generadas por IA.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Buscar resúmenes..."
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex bg-gray-100/80 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              view === "grid"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              view === "list"
                ? "bg-white shadow-sm text-indigo-600"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary List/Grid */}
      <div
        className={cn(
          "gap-6",
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col",
        )}
      >
        {mockSummaries.map((summary) => (
          <Link href={`/views/summaries/${summary.id}`} key={summary.id}>
            <motion.div
              whileHover={{ y: -4 }}
              className={cn(
                "bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 rounded-3xl p-6 flex transition-all group overflow-hidden relative",
                view === "grid"
                  ? "flex-col h-full gap-5"
                  : "flex-row items-center gap-6",
              )}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className={cn(
                  "flex items-center justify-center rounded-2xl shrink-0 transition-colors",
                  view === "grid"
                    ? "w-14 h-14 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                    : "w-12 h-12 bg-indigo-50 text-indigo-600",
                )}
              >
                <BookOpen className={view === "grid" ? "w-6 h-6" : "w-5 h-5"} />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3
                  className="text-gray-900 text-lg font-bold leading-tight mb-1.5 truncate group-hover:text-indigo-700 transition-colors"
                  title={summary.title}
                >
                  {summary.title}
                </h3>
                <p className="text-gray-500 text-sm truncate mb-3">
                  Basado en: {summary.source}
                </p>

                <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> {summary.readTime}
                  </span>
                  <span>•</span>
                  <span>{summary.date}</span>
                </div>
              </div>

              {/* Action / Progress Area */}
              <div
                className={cn(
                  "flex items-center",
                  view === "grid"
                    ? "justify-between mt-auto pt-4 border-t border-gray-50"
                    : "shrink-0 gap-8",
                )}
              >
                {/* Visual Progress Pie/Bar */}
                {view === "list" && (
                  <div className="w-32 hidden md:block">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                      <span>Progreso</span>
                      <span className="text-indigo-600">
                        {summary.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${summary.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {view === "grid" && (
                  <div className="flex flex-col gap-1 w-20">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Leído {summary.progress}%
                    </span>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${summary.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
