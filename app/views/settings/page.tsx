"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Lock,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  Save,
  Bell,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "Juan Estudiante",
    email: "juan.estudiante@ejemplo.com",
    currentPassword: "",
    newPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg("");

    // Simular llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("¡Los cambios se han guardado exitosamente!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Configuración
        </h1>
        <p className="text-gray-500 text-lg">
          Administra la información básica de tu cuenta y preferencias.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Main Form) */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Success Toast */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-sm font-bold text-center py-2"
              >
                {successMsg}
              </motion.div>
            )}

            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Información Personal
                </h2>
                <p className="text-sm text-gray-500">
                  Actualiza tus datos públicos.
                </p>
              </div>
            </div>

            {/* Profile Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-200">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-700 mb-1">
                  Foto de Perfil
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Recomendado: 256x256px, PNG o JPG.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    Subir foto
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>

          {/* Security Box */}
          <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Seguridad de la Cuenta
                </h2>
                <p className="text-sm text-gray-500">
                  Mantén tu cuenta segura cambiando la contraseña.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                Actualizar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
