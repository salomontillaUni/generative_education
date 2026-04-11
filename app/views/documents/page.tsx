"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Search,
  Grid,
  List as ListIcon,
  MoreVertical,
  Clock,
  CheckCircle2,
  Loader2,
  BookOpen,
  BrainCircuit,
  Trash2,
} from "lucide-react";
import { cn } from "../../components/ui/utils";
import { toast } from "sonner";
import { useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const mockDocuments = [
  {
    id: 1,
    title: "Respiracion_Celular.pdf",
    status: "processed",
    date: "hace 2 horas",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Historia_Roma_Antigua.docx",
    status: "processed",
    date: "Ayer",
    size: "1.1 MB",
  },
  {
    id: 3,
    title: "Intro_Mecanica_Cuantica.pdf",
    status: "processing",
    date: "Justo ahora",
    size: "5.6 MB",
  },
];

export default function Documents() {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const fetchDocuments = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setDocuments(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStatus("Subiendo archivo...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload and get processing updates
      // Note: Since we don't have a real-time progress for the AI part on a single POST,
      // we'll simulate the internal steps while the request is pending.
      
      const simulateProgress = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) {
            setProcessingStatus("Analizando contenido con IA...");
            return prev + 2;
          }
          if (prev < 90) {
            setProcessingStatus("Generando resumen estructurado...");
            return prev + 1;
          }
          return prev;
        });
      }, 800);

      const response = await fetch("/api/documents/summarize", {
        method: "POST",
        body: formData,
      });

      clearInterval(simulateProgress);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al procesar el documento");
      }

      setProcessingStatus("¡Completado!");
      toast.success("Documento procesado con éxito");

      // Redirect to the new summary
      setTimeout(() => {
        router.push(`/views/summaries/${result.summaryId}`);
      }, 1000);

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Error al subir el documento");
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStatus("");
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Centro de Conocimiento
          </h1>
          <p className="text-gray-500 text-lg">
            Sube y gestiona tus materiales de aprendizaje.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "w-full rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 py-20 sm:p-12 text-center cursor-pointer relative overflow-hidden group",
          isDragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50 bg-white shadow-sm",
          isUploading &&
            "pointer-events-none border-indigo-200 bg-indigo-50/30",
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {isDragActive
                    ? "Suelta los archivos para subir"
                    : "Haz clic o arrastra documentos aquí"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Soporta PDF, DOCX, TXT. Tamaño máx 30MB.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="processing-skeleton"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-6 w-full max-w-md"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg
                  className="animate-spin text-indigo-200 w-full h-full"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {uploadProgress}%
                </div>
              </div>

              <div className="space-y-2 text-center w-full">
                <p className="text-lg font-semibold text-indigo-900 animate-pulse">
                  {processingStatus}
                </p>
                <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 gap-4">
        <div className="relative w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Buscar documentos..."
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

      {/* Click-away overlay for dropdown */}
      {activeDropdown !== null && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}

      {/* Document List/Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Cargando tus documentos...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">No hay documentos</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Sube tu primer material de estudio arriba.</p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "gap-2",
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col",
          )}
        >
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -2 }}
              onClick={() => router.push(`/views/summaries`)} // Note: Ideally should link to specific summary if linked
              className={cn(
                "bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex transition-all group cursor-pointer hover:shadow-md hover:border-indigo-100 relative mb-10",
                view === "grid"
                  ? "flex-col gap-4 h-48"
                  : "flex-row items-center gap-4",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-xl",
                  view === "grid"
                    ? "w-12 h-12 bg-indigo-50 text-indigo-600"
                    : "w-10 h-10 bg-indigo-50 text-indigo-600 shrink-0",
                )}
              >
                <FileText className={view === "grid" ? "w-6 h-6" : "w-5 h-5"} />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="text-gray-900 font-semibold truncate leading-tight mb-1"
                  title={doc.name}
                >
                  {doc.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true, locale: es })}
                  </span>
                </div>
              </div>

              {view === "list" && (
                <div className="hidden sm:flex items-center justify-end px-4 flex-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Procesado
                  </span>
                </div>
              )}

              <div
                className={cn(
                  "flex items-center justify-between mt-auto w-full",
                  view === "list" && "w-auto mt-0",
                )}
              >
                {view === "grid" && (
                  <div>
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                    </span>
                  </div>
                )}

                <div className="relative z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown === doc.id ? null : doc.id,
                      );
                    }}
                    className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors relative z-50"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === doc.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-50 flex flex-col",
                          view === "list"
                            ? "right-0 top-10"
                            : "-right-5 sm:right-0 top-10",
                        )}
                      >
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left w-full">
                          <BookOpen className="w-4 h-4" /> Ver Resumen
                        </button>
                        <div className="h-px bg-gray-100 my-1 mx-2" />
                        <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left w-full">
                          <Trash2 className="w-4 h-4" /> Eliminar Documento
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
