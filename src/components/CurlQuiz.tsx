import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";

type CurlType = "2A-2C" | "3A-3B" | "3C-4A" | "4B-4C";

const questions = [
  {
    q: "¿Cómo describirías la forma de tu rizo?",
    options: [
      { label: "Ondas suaves en forma de S", value: "wave" },
      { label: "Tirabuzones definidos", value: "curl" },
      { label: "Rizos apretados en espiral", value: "tight" },
      { label: "Zig-zag o muy cerrados", value: "coily" },
    ],
  },
  {
    q: "¿Cómo se siente tu cabello al tacto?",
    options: [
      { label: "Fino y ligero", value: "fine" },
      { label: "Medio, con cuerpo", value: "medium" },
      { label: "Grueso y denso", value: "thick" },
      { label: "Muy denso y áspero", value: "coarse" },
    ],
  },
  {
    q: "¿Cuál es tu mayor preocupación?",
    options: [
      { label: "Falta de definición", value: "definition" },
      { label: "Frizz constante", value: "frizz" },
      { label: "Sequedad extrema", value: "dry" },
      { label: "Encogimiento excesivo", value: "shrink" },
    ],
  },
];

const results: Record<CurlType, { title: string; desc: string; recommend: string[]; emoji: string }> = {
  "2A-2C": {
    title: "Tipo 2 — Ondulado",
    emoji: "🌊",
    desc: "Tus ondas necesitan ligereza. Productos pesados las aplastan; busca espumas y geles ligeros.",
    recommend: ["styling", "hidratacion"],
  },
  "3A-3B": {
    title: "Tipo 3A-3B — Rizado",
    emoji: "✨",
    desc: "Rizos con buena definición que piden hidratación constante y un activador de rizos suave.",
    recommend: ["co-wash", "hidratacion", "styling"],
  },
  "3C-4A": {
    title: "Tipo 3C-4A — Rizo cerrado",
    emoji: "🌀",
    desc: "Rizos tipo tirabuzón muy definidos. Necesitan cremas densas y leche capilar para mantener forma sin frizz.",
    recommend: ["leave-in", "mascarillas", "aceites"],
  },
  "4B-4C": {
    title: "Tipo 4B-4C — Afro",
    emoji: "👑",
    desc: "Cabello con máxima textura. Requiere mantecas, aceites y tratamientos profundos semanales.",
    recommend: ["mascarillas", "aceites", "leave-in"],
  },
};

function calculate(answers: string[]): CurlType {
  const shape = answers[0];
  if (shape === "wave") return "2A-2C";
  if (shape === "curl") return "3A-3B";
  if (shape === "tight") return "3C-4A";
  return "4B-4C";
}

export function CurlQuiz() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);

  const reset = () => {
    setStep(-1);
    setAnswers([]);
  };

  const result = step >= questions.length ? results[calculate(answers)] : null;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            ¿Cuál es tu <span className="text-gradient-teal">rizo</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">Descúbrelo en 3 preguntas</p>
        </motion.div>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 min-h-[320px] flex flex-col justify-center glow-teal">
          <AnimatePresence mode="wait">
            {step === -1 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <Sparkles className="w-12 h-12 mx-auto text-accent mb-4" />
                <p className="text-lg text-foreground/80 mb-6">
                  Te recomendaremos los productos perfectos para tu tipo de cabello.
                </p>
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:glow-teal transition-all hover:scale-105"
                >
                  Empezar quiz <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step >= 0 && step < questions.length && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="flex gap-1 mb-6">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
                    />
                  ))}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold mb-6">{questions[step].q}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setAnswers([...answers, opt.value]);
                        setStep(step + 1);
                      }}
                      className="text-left p-4 rounded-2xl border border-border bg-secondary/30 hover:border-primary hover:bg-primary/10 transition-all text-sm font-medium"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="text-6xl mb-3">{result.emoji}</div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-gradient-gold mb-3">{result.title}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">{result.desc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/productos"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:glow-teal transition-all"
                  >
                    Ver productos recomendados <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground/80 font-medium hover:bg-secondary/50 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> Repetir
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
