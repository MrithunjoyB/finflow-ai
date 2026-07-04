import { motion } from "framer-motion";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { RoutingResult } from "../types/api";

export default function WorkflowPanel({ routing }: { routing?: RoutingResult }) {
  if (!routing) return null;
  const confidence = Math.round((routing.confidence || 0) * 100);
  return (
    <Reveal>
    <div id="workflow-section" className="scroll-mt-8">
    <InteractiveCard className="liquid-glass-strong p-6" intensity={2} enableTilt={false}>
      <p className="eyebrow">Detected Workflow</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h2 className="section-title">{routing.task_type}</h2>
        <span className="status-chip amber">{routing.priority}</span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Field label="Task Type" value={routing.task_type} />
        <Field label="Priority" value={routing.priority.toUpperCase()} />
        <div className="liquid-glass rounded-[1.2rem] p-4">
          <div className="field-label">Confidence</div>
          <div className="mt-2 text-xl font-black text-white">{confidence}%</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyanx to-bluex" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {routing.selected_agents.map((agent) => (
          <span className="agent-chip" key={agent}>{agentLabel(agent)}</span>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-white/56">{routing.reason}</p>
    </InteractiveCard>
    </div>
    </Reveal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="liquid-glass rounded-[1.2rem] p-4">
      <div className="field-label">{label}</div>
      <div className="mt-2 font-black text-white">{value}</div>
    </div>
  );
}

function agentLabel(agent: string) {
  return ({ founder: "Founder", cofounder: "Co-Founder", ceo: "CEO", cfo: "CFO", cmo: "CMO", cto: "CTO", coo: "COO", creative: "Creative", hr: "HR" } as Record<string, string>)[agent] || agent;
}
