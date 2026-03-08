"use client";
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
  Loader2
} from "lucide-react";
import { cn } from "../../components/ui/utils";

const mockDocuments = [
  { id: 1, title: "Respiracion_Celular.pdf", status: "processed", date: "hace 2 horas", size: "2.4 MB" },
  { id: 2, title: "Historia_Roma_Antigua.docx", status: "processed", date: "Ayer", size: "1.1 MB" },
  { id: 3, title: "Intro_Mecanica_Cuantica.pdf", status: "processing", date: "Justo ahora", size: "5.6 MB" },
];

export default function Documents() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setProcessingStatus("Subiendo archivo...");

    // Simulate upload and processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress === 40) setProcessingStatus("Extrayendo conceptos clave...");
      if (progress === 70) setProcessingStatus("Generando mapa mental...");
      if (progress === 90) setProcessingStatus("Finalizando resumen...");

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setProcessingStatus("");
        }, 1000);
      }
    }, 500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Centro de Conocimiento</h1>
          <p className="text-gray-500 text-lg">Sube y gestiona tus materiales de aprendizaje.</p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        {...getRootProps()} 
        className={cn(
          "w-full rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 text-center cursor-pointer relative overflow-hidden group",
          isDragActive 
            ? "border-indigo-500 bg-indigo-50" 
            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50 bg-white shadow-sm",
          isUploading && "pointer-events-none border-indigo-200 bg-indigo-50/30"
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
                  {isDragActive ? "Suelta los archivos para subir" : "Haz clic o arrastra documentos aquí"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Soporta PDF, DOCX, TXT. Tamaño máx 50MB.
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
                <svg className="animate-spin text-indigo-200 w-full h-full" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      <div className="flex justify-between items-center mt-4">
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Buscar documentos..." 
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex bg-gray-100/80 p-1 rounded-xl">
          <button 
            onClick={() => setView("grid")}
            className={cn("p-2 rounded-lg transition-colors", view === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-900")}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView("list")}
            className={cn("p-2 rounded-lg transition-colors", view === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-900")}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document List/Grid */}
      <div className={cn(
        "gap-6",
        view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col"
      )}>
        {mockDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            whileHover={{ y: -2 }}
            className={cn(
              "bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex transition-all group cursor-pointer hover:shadow-md hover:border-indigo-100 relative overflow-hidden",
              view === "grid" ? "flex-col gap-4 h-48" : "flex-row items-center gap-4"
            )}
          >
            {/* Status indicator line for processing */}
            {doc.status === "processing" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100">
                <div className="h-full bg-indigo-500 w-1/3 animate-progress-indeterminate" />
              </div>
            )}

            <div className={cn(
              "flex items-center justify-center rounded-xl",
              view === "grid" ? "w-12 h-12 bg-indigo-50 text-indigo-600" : "w-10 h-10 bg-indigo-50 text-indigo-600 shrink-0"
            )}>
              <FileText className={view === "grid" ? "w-6 h-6" : "w-5 h-5"} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-semibold truncate leading-tight mb-1" title={doc.title}>
                {doc.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {doc.date}
                </span>
                <span>•</span>
                <span>{doc.size}</span>
              </div>
            </div>

            {view === "list" && (
              <div className="hidden sm:flex items-center justify-end px-4 flex-1">
                {doc.status === "processed" ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Procesando
                  </span>
                )}
              </div>
            )}

            <div className={cn(
              "flex items-center justify-between mt-auto w-full",
              view === "list" && "w-auto mt-0"
            )}>
              {view === "grid" && (
                <div>
                  {doc.status === "processed" ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-indigo-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Procesando IA
                    </span>
                  )}
                </div>
              )}
              
              <button className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
