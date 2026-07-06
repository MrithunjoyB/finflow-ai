import { motion } from "framer-motion";
import { Target } from "lucide-react";
import PageShell from "./PageShell";

const values = [
  "Not a chatbot wrapper",
  "Task-routed intelligence",
  "Role-specific reasoning",
  "Traceable orchestration",
  "Demo-safe and Live-ready",
  "Decision-ready synthesis"
];

const roadmap = [
  "Export board-ready PDF reports",
  "Add richer evaluation metrics for agent outputs",
  "Add memory across analysis sessions",
  "Add local LLM / Ollama mode",
  "Add more financial datasets and dashboard views"
];

export default function WhyThisMattersPage() {
  return (
    <PageShell
      eyebrow="Impact Board"
      title="Why This Project Matters"
      subtitle="A portfolio pitch for a role-aware, traceable AI workflow product."
    >
      <section className="mission-stack">
        <div className="impact-grid">
          {values.map((value, index) => (
            <motion.div className="impact-card" key={value} whileHover={{ y: -4, scale: 1.012 }}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{value}</b>
            </motion.div>
          ))}
        </div>

        <div className="roadmap">
          {roadmap.map((item, index) => (
            <div className="roadmap-item" key={item}>
              <span className="roadmap-dot">{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <motion.div className="route-feature-card" whileHover={{ y: -4, scale: 1.006 }}>
          <Target className="h-6 w-6 text-cyanx" />
          <h2>Portfolio-grade AI workflow product</h2>
          <p>FinFlow is designed as a portfolio-grade AI workflow product: traceable, role-aware, demo-safe, and live-ready.</p>
        </motion.div>
      </section>
    </PageShell>
  );
}
