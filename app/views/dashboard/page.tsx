"use client";
import { motion } from "motion/react";
import { Brain, TrendingUp, Clock, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "../../components/ui/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

const progressData = [
  { name: "L", score: 40 },
  { name: "M", score: 30 },
  { name: "X", score: 55 },
  { name: "J", score: 45 },
  { name: "V", score: 70 },
  { name: "S", score: 65 },
  { name: "D", score: 85 },
];

const masteryData = [
  { name: "Dominado", value: 68 },
  { name: "Aprendiendo", value: 32 },
];
const COLORS = ["#10B981", "#E5E7EB"];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Buenos días, Juan.
        </h1>
        <p className="text-gray-500 text-lg">
          Aquí está tu resumen de aprendizaje de hoy.
        </p>
      </div>

      {/* Progress Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Evolution */}
        <div className="lg:col-span-2 bg-white rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" /> Rendimiento
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Evolución de tu retención de conocimiento
              </p>
            </div>
            <select className="bg-gray-50 hover:bg-gray-100 transition-colors border-none text-sm font-semibold rounded-xl px-4 py-2 focus:ring-0 text-gray-700 cursor-pointer outline-none">
              <option>Últimos 7 días</option>
              <option>Este mes</option>
            </select>
          </div>

          <div className="h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={progressData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 13, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 13, fontWeight: 500 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{
                    stroke: "#4F46E5",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px",
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: "#4F46E5" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mastery Score */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-500" /> Dominio General
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Comprensión global de todos los temas
            </p>
          </div>

          <div className="h-55 w-full relative flex items-center justify-center my-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  cornerRadius={8}
                >
                  {masteryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">
                68<span className="text-xl text-gray-400">%</span>
              </span>
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mt-2 border border-emerald-100">
                Excelente
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-sm shadow-emerald-200" />
              <span className="text-sm text-gray-700 font-semibold">
                Dominado
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-md bg-gray-200" />
              <span className="text-sm text-gray-500 font-semibold">
                Aprendiendo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity - Optional Extra Polish */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                Subir Documento
              </h4>
              <p className="text-sm text-gray-500">
                Genera nuevos resúmenes y quizzes
              </p>
            </div>
          </div>
          <Link href="/views/documents" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                Último Resumen
              </h4>
              <p className="text-sm text-gray-500">
                Mecánica Cuántica (hace 2 horas)
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Link href="/views/summaries">
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
