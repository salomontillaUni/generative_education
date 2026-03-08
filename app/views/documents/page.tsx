import { motion } from "motion/react";
import { Flame, Target, BookOpen, Brain, Sparkles, ChevronRight, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from "../../lib/utils";

const progressData = [
  { name: 'L', score: 40 },
  { name: 'M', score: 30 },
  { name: 'X', score: 55 },
  { name: 'J', score: 45 },
  { name: 'V', score: 70 },
  { name: 'S', score: 65 },
  { name: 'D', score: 85 },
];

const masteryData = [
  { name: 'Dominado', value: 68 },
  { name: 'Aprendiendo', value: 32 },
];
const COLORS = ['#10B981', '#E5E7EB'];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Buenos días, Juan.</h1>
        <p className="text-gray-500 text-lg">Aquí está tu resumen de hoy.</p>
      </div>

      {/* Hero Stats / AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next AI Recommended Step */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Brain className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Próximo paso recomendado
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight max-w-lg">
              Repaso: Mecánica de la Respiración Celular
            </h2>
            <p className="text-indigo-100/80 max-w-md text-sm sm:text-base">
              Tuviste dificultades con la producción de ATP en tu última prueba. Un repaso de 5 minutos puede aumentar tu dominio en un 12%.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex items-center gap-4">
            <button className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Comenzar Repaso
            </button>
            <button className="text-indigo-100 hover:text-white transition-colors text-sm font-medium">
              Omitir por ahora
            </button>
          </div>
        </motion.div>

        {/* Study Streak */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between items-center text-center"
        >
          <div className="p-4 bg-orange-100 rounded-full mb-4">
            <Flame className="w-10 h-10 text-orange-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">14 Días</h3>
            <p className="text-gray-500 font-medium">Racha de Estudio</p>
          </div>
          
          <div className="w-full flex justify-between items-center mt-6 text-sm font-medium text-gray-400">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  i < 5 ? "bg-orange-500 text-white shadow-sm shadow-orange-200" : "bg-gray-100 text-gray-400"
                )}>
                  {i < 5 && <Target className="w-4 h-4" />}
                </div>
                <span>{day}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Progress Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Evolution */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Progreso de Conocimiento</h3>
              <p className="text-sm text-gray-500">Tu rendimiento en los últimos 7 días</p>
            </div>
            <select className="bg-gray-50 border-none text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-0 text-gray-600 cursor-pointer">
              <option>Esta Semana</option>
              <option>Semana Pasada</option>
            </select>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4F46E5', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mastery Score */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Dominio General</h3>
            <p className="text-sm text-gray-500">En todos los temas subidos</p>
          </div>
          
          <div className="h-[200px] w-full relative flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {masteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-gray-900 tracking-tight">68<span className="text-xl">%</span></span>
              <span className="text-emerald-500 text-sm font-medium bg-emerald-50 px-2 py-0.5 rounded-full mt-1">Excelente</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600 font-medium">Dominado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-sm text-gray-600 font-medium">Aprendiendo</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
