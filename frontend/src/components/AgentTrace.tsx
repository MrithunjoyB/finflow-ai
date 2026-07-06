import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { AgentTrace as AgentTraceType } from "../types/api";

export default function AgentTrace({ trace = [] }: { trace?: AgentTraceType[] }) {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const completedCount = trace.filter((item) => item.status !== "failed").length;
  const totalDuration = trace.reduce((sum, item) => sum + (item.duration_ms || 0), 0);

  function scrollToTrace() {
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function openFullTrace() {
    setExpanded(true);
    scrollToTrace();
  }

  function collapseTrace() {
    setExpanded(false);
    scrollToTrace();
  }

  useEffect(() => {
    const openTrace = () => openFullTrace();
    window.addEventListener("open-trace-section", openTrace);
    return () => window.removeEventListener("open-trace-section", openTrace);
  }, []);

  return (
    <Reveal>
      <div id="trace-section" className="scroll-mt-8" ref={sectionRef}>
        <InteractiveCard className="p-6" intensity={2} enableTilt={false}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Agent Execution Trace</p>
              <h2 className="section-title">Traceable orchestration.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Every agent run is logged with role, status, and execution timing.</p>
            </div>
            <button className="trace-toggle liquid-glass" onClick={expanded ? collapseTrace : openFullTrace} type="button" aria-expanded={expanded}>
              {expanded ? "Collapse Trace" : "View Full Trace"}
            </button>
          </div>

          <TraceStats completedCount={completedCount} totalCount={trace.length} totalDuration={totalDuration} />

          <AnimatePresence initial={false}>
            <motion.div
              className="mt-5 grid gap-3 overflow-hidden"
              initial={false}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
            {trace.length === 0 && <div className="liquid-glass rounded-[1.2rem] p-4 text-sm text-white/50">Trace will appear after analysis.</div>}
            {!expanded && trace.length > 0 && (
              <div className="trace-summary-line">
                {completedCount} routed agents completed. Open full trace to inspect execution logs.
              </div>
            )}
            {expanded && trace.length > 0 && (
              <motion.div
                className="trace-scroll-list"
                initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {trace.map((item, index) => {
                  const key = `${item.agent_name}-${index}`;
                  return (
                    <TraceCard
                      item={item}
                      index={index}
                      key={key}
                    />
                  );
                })}
              </motion.div>
            )}
            </motion.div>
          </AnimatePresence>
        </InteractiveCard>
      </div>
    </Reveal>
  );
}

function TraceStats({ completedCount, totalCount, totalDuration }: { completedCount: number; totalCount: number; totalDuration: number }) {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-4">
      <TraceStat label="Completed Agents" value={`${completedCount}/${totalCount || 0}`} />
      <TraceStat label="Workflow Status" value={totalCount ? "Completed" : "Awaiting"} />
      <TraceStat label="Trace Mode" value="Active" />
      <TraceStat label="Duration" value={`${totalDuration || 420}ms`} />
    </div>
  );
}

function TraceCard({
  item,
  index
}: {
  item: AgentTraceType;
  index: number;
}) {
  return (
    <InteractiveCard className="trace-row trace-card" intensity={2} enableTilt={false}>
      <div>
        <div className="font-semibold text-white">{item.agent_name}</div>
        <div className="mt-1 text-xs leading-5 text-white/38">{item.role}</div>
      </div>
      <StatusChip status={item.status} />
      <span className="text-sm font-semibold text-white/48">{item.duration_ms || 0}ms</span>
      <motion.span className="trace-scan" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: index * 0.06 }} />
    </InteractiveCard>
  );
}

function StatusChip({ status }: { status: string }) {
  return (
    <span className={`status-chip ${status === "failed" ? "red" : "green"}`}>
      {status === "failed" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
      {status}
    </span>
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
