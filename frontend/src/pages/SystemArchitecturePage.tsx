import { motion } from "framer-motion";
import { Activity, Bot, Brain, ClipboardCheck, Cpu, Layers, Route, ShieldCheck, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageShell from "./PageShell";

const nodes = [
  { icon: Upload, title: "Document Upload", text: "Secure intake for PDF, CSV, and TXT files." },
  { icon: Route, title: "Task Router", text: "Detects workflow, priority, confidence, and selected agents." },
  { icon: Bot, title: "Selected AI Agents", text: "Runs only the routed leadership and department roles." },
  { icon: Activity, title: "Execution Trace", text: "Captures status, timing, preview, and failures." },
  { icon: ShieldCheck, title: "Evaluator Layer", text: "Checks financial summary, risks, actions, and cautions." },
  { icon: ClipboardCheck, title: "Final Report", text: "Synthesizes output into a selected report style." }
];

export default function SystemArchitecturePage() {
  return (
    <PageShell
      eyebrow="AI Corporation Blueprint"
      title="System Architecture"
      subtitle="A technical map of how FinFlow routes a document through an AI corporation."
    >
      <section className="architecture-page">
        <div className="architecture-graph architecture-graph-large">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div className="graph-node" key={node.title} whileHover={{ y: -5, scale: 1.018 }}>
                <Icon className="h-5 w-5" />
                <b>{node.title}</b>
                <small>{node.text}</small>
                {index < nodes.length - 1 && <span className="graph-line" />}
              </motion.div>
            );
          })}
          <span className="architecture-particle particle-one" />
          <span className="architecture-particle particle-two" />
        </div>

        <div className="tech-stack-grid">
          <StackCard title="Frontend" items={["React", "TypeScript", "Tailwind", "Framer Motion"]} icon={Layers} />
          <StackCard title="Backend" items={["Python", "Flask", "Secure file upload"]} icon={Cpu} />
          <StackCard title="AI Layer" items={["Groq", "Agent prompts", "Task routing"]} icon={Brain} />
          <StackCard title="Reliability" items={["Trace logs", "Evaluator", "Demo/Live fallback"]} icon={ShieldCheck} />
        </div>
      </section>
    </PageShell>
  );
}

function StackCard({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <motion.div className="stack-card" whileHover={{ y: -4, scale: 1.01 }}>
      <Icon className="h-5 w-5" />
      <b>{title}</b>
      <div>
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
    </motion.div>
  );
}
