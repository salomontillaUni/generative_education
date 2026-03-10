"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For now, just redirect to dashboard
    router.push("/views/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-300/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">AdaptiveAI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
            Aprende de forma
            <span className="block bg-linear-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              inteligente y adaptativa.
            </span>
          </h1>
          <p className="text-indigo-100/80 text-lg leading-relaxed">
            Nuestra IA analiza tus fortalezas y debilidades para crear un camino
            de aprendizaje único y personalizado para ti.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {["JE", "MA", "LC", "SP"].map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-indigo-700 bg-linear-to-tr from-indigo-400 to-purple-400 flex items-center justify-center text-[10px] font-bold"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-indigo-200 text-sm">
              <span className="font-semibold text-white">+2,500</span>{" "}
              estudiantes activos
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-indigo-200/60 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Impulsado por inteligencia artificial generativa</span>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">AdaptiveAI</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Bienvenido de vuelta
            </h2>
            <p className="text-gray-500">
              Inicia sesión para continuar tu aprendizaje.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* General error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm p-3.5 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.general}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="tu@correo.com"
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm transition-all outline-none focus:ring-2 shadow-sm ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 bg-white border rounded-xl text-sm transition-all outline-none focus:ring-2 shadow-sm ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-200/60 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
