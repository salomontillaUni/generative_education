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
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const passwordRequirements = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Una letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Un número", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre completo es obligatorio.";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "La contraseña debe tener al menos una letra mayúscula.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "La contraseña debe tener al menos una letra minúscula.";
    } else if (!/\d/.test(password)) {
      newErrors.password = "La contraseña debe tener al menos un número.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
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

    // For now, redirect to login
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-linear-to-br from-purple-700 via-indigo-700 to-indigo-800 text-white flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300/10 rounded-full blur-2xl" />

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
            Tu experiencia de
            <span className="block bg-linear-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
              estudio personalizada.
            </span>
          </h1>
          <p className="text-indigo-100/80 text-lg leading-relaxed">
            Únete a miles de estudiantes que ya están potenciando su aprendizaje
            con nuestra plataforma de IA adaptativa.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: "98%", label: "Satisfacción" },
              { value: "2x", label: "Más rápido" },
              { value: "+40%", label: "Retención" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
              >
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-indigo-200 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-indigo-200/60 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Impulsado por inteligencia artificial generativa</span>
        </div>
      </div>

      {/* Right Panel — Register Form */}
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
              Crea tu cuenta
            </h2>
            <p className="text-gray-500">
              Comienza tu viaje de aprendizaje inteligente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="Juan Pérez"
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm transition-all outline-none focus:ring-2 shadow-sm ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </motion.p>
              )}
            </div>

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
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
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

              {/* Password strength indicators */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2"
                >
                  {passwordRequirements.map((req, i) => {
                    const met = req.test(password);
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-1.5 text-xs transition-colors",
                          met ? "text-emerald-600" : "text-gray-400",
                        )}
                      >
                        <CheckCircle2
                          className={cn(
                            "w-3 h-3",
                            met ? "text-emerald-500" : "text-gray-300",
                          )}
                        />
                        {req.label}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((p) => ({ ...p, confirmPassword: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 bg-white border rounded-xl text-sm transition-all outline-none focus:ring-2 shadow-sm ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-200/60 flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
