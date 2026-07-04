import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { AgentTrace as AgentTraceType } from "../types/api";

export default function AgentTrace({ trace = [] }: { trace?: AgentTraceType[] }) {
  const [expanded, setExpanded] = useState(false);
  const completedCount = trace.filter((item) => item.status !== "failed").length;
  const totalDuration = trace.reduce((sum, item) => sum + (item.duration_ms || 0), 0);

  useEffect(() => {
    const openTrace = () => {
      setExpanded(true);
      window.setTimeout(() => document.getElementById("trace-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
    };
    window.addEventListener("open-trace-section", openTrace);
    return () => window.removeEventListener("open-trace-section", openTrace);
  }, []);

  return (
    <Reveal>
    <div id="trace-section" className="scroll-mt-8">
    <InteractiveCard className="p-6" intensity={2} enableTilt={false}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Agent Execution Trace</p>
          <h2 className="section-title">Traceable orchestration.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Every agent run is logged with role, status, and execution timing.</p>
        </div>
        <button className="trace-toggle liquid-glass" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <TraceStat label="Completed Agents" value={`${completedCount}/${trace.length || 0}`} />
        <TraceStat label="Workflow Status" value={trace.length ? "Completed" : "Awaiting"} />
        <TraceStat label="Trace Mode" value="Active" />
        <TraceStat label="Duration" value={`${totalDuration || 420}ms`} />
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="mt-5 grid gap-3 overflow-hidden"
            initial={{ height: 0, opacity: 0, y: -12, filter: "blur(8px)" }}
            animate={{ height: "auto", opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ height: 0, opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {trace.length === 0 && <div className="liquid-glass rounded-[1.2rem] p-4 text-sm text-white/50">Trace will appear after analysis.</div>}
            {trace.map((item, index) => (
              <InteractiveCard
                key={`${item.agent_name}-${index}`}
                className="trace-row"
                intensity={2}
                enableTilt={false}
              >
                <div>
                  <div className="font-semibold text-white">{item.agent_name}</div>
                  <div className="mt-1 text-xs leading-5 text-white/38">{item.role}</div>
                  {item.output_preview && <div className="mt-2 line-clamp-2 text-xs leading-5 text-white/55">{item.output_preview}</div>}
                </div>
                <span className={`status-chip ${item.status === "failed" ? "red" : "green"}`}>
                  {item.status === "failed" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {item.status}
                </span>
                <span className="text-sm font-semibold text-white/48">{item.duration_ms || 0}ms</span>
                <motion.span className="trace-scan" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: index * 0.06 }} />
              </InteractiveCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </InteractiveCard>
    </div>
    </Reveal>
  );
}

function TraceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="liquid-glass rounded-[1.1rem] p-4">
      <div className="field-label">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
