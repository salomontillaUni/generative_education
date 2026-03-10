"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  FileText,
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "../../components/ui/utils";

const navItems = [
  { icon: Home, label: "Inicio", path: "/views/dashboard" },
  { icon: FileText, label: "Documentos", path: "/views/documents" },
  { icon: BookOpen, label: "Resúmenes", path: "/views/summaries" },
  { icon: BrainCircuit, label: "Evaluaciones", path: "/views/quizzes" },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize(); // Initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center min-w-8 w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-md">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">AdaptiveAI</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? 260 : isCollapsed ? 80 : 260,
          x: isMobile ? (isMobileMenuOpen ? 0 : -260) : 0,
          transition: { type: "spring", bounce: 0, duration: 0.4 },
        }}
        className={cn(
          "flex flex-col bg-white shadow-xl lg:shadow-sm z-50",
          "fixed lg:relative top-0 left-0 bottom-0 h-dvh lg:h-full lg:border-r border-gray-200/60",
        )}
      >
        <div className="flex items-center justify-between p-6 mb-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center min-w-8 w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-md">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <motion.span
              className="ml-3 font-semibold text-lg whitespace-nowrap overflow-hidden"
              animate={{
                opacity: isCollapsed && !isMobile ? 0 : 1,
                width: isCollapsed && !isMobile ? 0 : "auto",
              }}
            >
              AdaptiveAI
            </motion.span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (pathname.startsWith(item.path) && item.path !== "/");
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-200 ease-in-out relative",
                    isActive
                      ? "bg-indigo-50/80 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-50 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <div className="relative flex items-center w-full">
                    <item.icon
                      className={cn(
                        "w-5 h-5 min-w-5",
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-500 group-hover:text-gray-700",
                      )}
                    />
                    <motion.span
                      className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm"
                      animate={{
                        opacity: isCollapsed && !isMobile ? 0 : 1,
                        width: isCollapsed && !isMobile ? 0 : "auto",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100/80 space-y-1">
          <Link
            href="/views/settings"
            className="flex items-center w-full px-3 py-2.5 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5 min-w-5" />
            <motion.span
              className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm"
              animate={{
                opacity: isCollapsed && !isMobile ? 0 : 1,
                width: isCollapsed && !isMobile ? 0 : "auto",
              }}
            >
              Configuración
            </motion.span>
          </Link>

          <Link
            href="/auth/login"
            className="flex items-center w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 min-w-5" />
            <motion.span
              className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm"
              animate={{
                opacity: isCollapsed && !isMobile ? 0 : 1,
                width: isCollapsed && !isMobile ? 0 : "auto",
              }}
            >
              Cerrar sesión
            </motion.span>
          </Link>

          <div className="flex items-center px-3 py-3 mt-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold min-w-8">
              JE
            </div>
            <motion.div
              className="ml-3 overflow-hidden flex-1"
              animate={{
                opacity: isCollapsed && !isMobile ? 0 : 1,
                width: isCollapsed && !isMobile ? 0 : "auto",
              }}
            >
              <p className="text-sm font-medium text-gray-900 truncate">
                Juan Estudiante
              </p>
            </motion.div>
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm z-50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </motion.aside>

      <main className="flex-1 min-w-0 overflow-y-auto w-full pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
