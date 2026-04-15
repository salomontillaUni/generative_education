"use client";

import { useMemo, useState } from "react";
import {
  Brain,
  TrendingUp,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
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
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { User } from "@supabase/supabase-js";

const COLORS = ["#10B981", "#E5E7EB"];

/** Letras de día L–D (lun–dom) alineadas con getDay() 0=dom … 6=sáb */
const DAY_LETTERS = ["D", "L", "M", "X", "J", "V", "S"] as const;

export type DashboardAttemptRow = {
  score: number | string | null;
  created_at: string;
};

export type DashboardSummaryRow = {
  id: string;
  title: string;
  created_at: string;
};

type Period = "7d" | "month";

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function averageScores(rows: DashboardAttemptRow[]): number {
  if (rows.length === 0) return 0;
  const sum = rows.reduce((acc, r) => acc + Number(r.score ?? 0), 0);
  return Math.round(sum / rows.length);
}

function attemptsForLocalDay(
  attempts: DashboardAttemptRow[],
  dayStart: Date,
): DashboardAttemptRow[] {
  const dayEnd = addDays(dayStart, 1);
  return attempts.filter((a) => {
    const t = new Date(a.created_at);
    return t >= dayStart && t < dayEnd;
  });
}

function buildChartData(
  attempts: DashboardAttemptRow[],
  period: Period,
): { name: string; score: number }[] {
  const today = startOfLocalDay(new Date());
  const days = period === "7d" ? 7 : 30;
  const out: { name: string; score: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = addDays(today, -i);
    const dayAttempts = attemptsForLocalDay(attempts, dayStart);
    const score = averageScores(dayAttempts);

    if (period === "7d") {
      out.push({
        name: DAY_LETTERS[dayStart.getDay()],
        score,
      });
    } else {
      out.push({
        name: format(dayStart, "d/M", { locale: es }),
        score,
      });
    }
  }

  return out;
}

function masteryLabel(avg: number): string {
  if (avg >= 80) return "Excelente";
  if (avg >= 60) return "Bueno";
  if (avg >= 40) return "Regular";
  if (avg > 0) return "En progreso";
  return "Sin datos";
}

export default function Dashboard({
  user,
  attempts,
  lastSummary,
}: {
  user: User | null;
  attempts: DashboardAttemptRow[];
  lastSummary: DashboardSummaryRow | null;
}) {
  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ?? "Estudiante";

  const [period, setPeriod] = useState<Period>("7d");

  const chartData = useMemo(
    () => buildChartData(attempts, period),
    [attempts, period],
  );

  const attemptsInPeriod = useMemo(() => {
    const daysBack = period === "7d" ? 7 : 30;
    const start = addDays(startOfLocalDay(new Date()), -(daysBack - 1));
    return attempts.filter((a) => new Date(a.created_at) >= start);
  }, [attempts, period]);

  const masteryAvg = useMemo(() => {
    if (attemptsInPeriod.length === 0) return 0;
    return averageScores(attemptsInPeriod);
  }, [attemptsInPeriod]);

  const masteryData = useMemo(
    () => [
      { name: "Dominado", value: masteryAvg },
      { name: "Aprendiendo", value: Math.max(0, 100 - masteryAvg) },
    ],
    [masteryAvg],
  );

  const masteryBadge = masteryLabel(masteryAvg);

  const lastSummaryLine = lastSummary
    ? `${lastSummary.title} (${formatDistanceToNow(new Date(lastSummary.created_at), { addSuffix: true, locale: es })})`
    : "Aún no tienes resúmenes";

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Buenos días, {userName}.
        </h1>
        <p className="text-gray-500 text-lg">
          Aquí está tu resumen de aprendizaje de hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />{" "}
                    Rendimiento
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Promedio de puntaje en quizzes por día
                  </p>
                </div>
                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value as Period)
                  }
                  className="bg-gray-50 hover:bg-gray-100 transition-colors border-none text-sm font-semibold rounded-xl px-4 py-2 focus:ring-0 text-gray-700 cursor-pointer outline-none"
                >
                  <option value="7d">Últimos 7 días</option>
                  <option value="month">Últimos 30 días</option>
                </select>
              </div>

              <div className="h-70 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 13, fontWeight: 600 }}
                      dy={15}
                      interval={period === "month" ? "preserveStartEnd" : 0}
                      minTickGap={period === "month" ? 8 : undefined}
                    />
                    <YAxis
                      domain={[0, 100]}
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
                      formatter={(value: number | string) => [
                        `${value}%`,
                        "Promedio",
                      ]}
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

            <div className="bg-white rounded-4xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-500" /> Dominio General
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {period === "7d"
                    ? "Promedio de tus intentos en los últimos 7 días"
                    : "Promedio de tus intentos en los últimos 30 días"}
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
                          key={`cell-${entry.name}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">
                    {masteryAvg}
                    <span className="text-xl text-gray-400">%</span>
                  </span>
                  <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mt-2 border border-emerald-100">
                    {masteryBadge}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/views/documents"
              className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer"
            >
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
              <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </span>
            </Link>

            <Link
              href={
                lastSummary
                  ? `/views/summaries/${lastSummary.id}`
                  : "/views/summaries"
              }
              className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Último Resumen
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {lastSummaryLine}
                  </p>
                </div>
              </div>
              <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
    </div>
  );
}
