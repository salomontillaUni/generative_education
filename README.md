# 🎓 EduMind AI: Plataforma de Aprendizaje Adaptativo

**EduMind AI** es una solución avanzada diseñada para estudiantes universitarios que utiliza Inteligencia Artificial para transformar apuntes densos en herramientas de estudio dinámicas. El objetivo es combatir la sobrecarga informativa y maximizar la retención mediante la personalización del contenido en tiempo real.

---

## 🚀 Características Principales

* **✨ IA de Resumen Inteligente:** Carga tus PDFs o notas y obtén síntesis estructuradas con los conceptos clave en segundos.
* **📝 Generación de Evaluaciones:** Creación automática de quizzes y flashcards basados específicamente en tu material de estudio.
* **📊 Análisis de Desempeño:** Dashboard visual que identifica tus lagunas de conocimiento y áreas de mejora.
* **🧠 Feedback Adaptativo:** La plataforma ajusta la dificultad y el tipo de contenido sugerido según tu progreso individual.
* **📂 Biblioteca de Recursos:** Almacenamiento organizado y categorizado de todos tus materiales académicos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) |
| **Backend / DB** | [Supabase](https://supabase.com/) (PostgreSQL + Realtime) |
| **Autenticación** | [Supabase Auth](https://supabase.com/auth) |
| **IA / LLM** | [OpenAI API](https://openai.com/) (GPT-4o) / LangChain |
| **Vector DB** | [Supabase Vector](https://supabase.com/docs/guides/ai) (pgvector) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) |

---

## 📂 Estructura del Proyecto

```text
├── app/                # Rutas de Next.js (Dashboard, Login, Editor)
├── components/         # Componentes de UI (Atomic Design / Shadcn)
├── hooks/              # Lógica de React reutilizable (SWR, Auth, etc.)
├── lib/                # Configuraciones (Supabase Client, Utils)
├── services/           # Lógica de integración con OpenAI y APIs externas
├── types/              # Definiciones e interfaces de TypeScript
└── public/             # Activos estáticos (Imágenes, Fuentes, Iconos)
