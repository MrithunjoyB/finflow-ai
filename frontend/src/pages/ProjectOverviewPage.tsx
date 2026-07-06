import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Bot, Brain, ClipboardCheck, Route, Sparkles, Upload } from "lucide-react";
import type { ReactNode } from "react";
import PageShell from "./PageShell";

const flow = [
  { icon: Upload, label: "Upload" },
  { icon: Route, label: "Route" },
  { icon: Bot, label: "Agents" },
  { icon: ClipboardCheck, label: "Report" }
];

export default function ProjectOverviewPage() {
  return (
    <PageShell
      eyebrow="Mission Brief"
      title="Project Overview"
      subtitle="A live product briefing for FinFlow's task-routed multi-agent finance system."
    >
      <section className="route-page-grid">
        <motion.div className="route-feature-card route-span-2" whileHover={{ y: -4, scale: 1.006 }}>
          <Sparkles className="h-6 w-6 text-cyanx" />
          <h2>FinFlow AI Corporation</h2>
          <p>
            FinFlow AI Corporation is a task-routed multi-agent finance system that reads uploaded financial documents, detects workflow type, activates selected AI agents, logs execution traces, and produces decision-ready executive reports.
          </p>
        </motion.div>

        <div className="route-flow-panel route-span-2">
          <span className="flow-pulse" />
          {flow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="mission-flow-node" key={step.label}>
                <Icon className="h-5 w-5" />
                <b>{step.label}</b>
                {index < flow.length - 1 && <ArrowRight className="flow-arrow h-4 w-4" />}
              </div>
            );
          })}
        </div>

        <BriefCard icon={<Upload />} title="Financial Context Upload" text="PDF, CSV, and TXT inputs become structured finance context for review." />
        <BriefCard icon={<Brain />} title="Routed Agent Intelligence" text="Task routing activates the right leadership and department agents." />
        <BriefCard icon={<BarChart3 />} title="Decision-Ready Reports" text="Final synthesis turns raw signals into risks, findings, and next actions." />

        <div className="mission-chip-row route-span-2">
          {["Revenue analysis", "Expense review", "Market campaign intelligence", "Invoice interpretation", "Cash-flow review", "Recruiter demo"].map((chip) => (
            <span className="mission-chip" key={chip}>{chip}</span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function BriefCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <motion.div className="route-mini-card" whileHover={{ y: -4, scale: 1.012 }}>
      <span>{icon}</span>
      <b>{title}</b>
      <p>{text}</p>
    </motion.div>
  );
}
