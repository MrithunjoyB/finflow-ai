import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";

export type TimelineStatus = "idle" | "running" | "completed" | "failed";

const stages = [
  "Document received",
  "Secure file validation",
  "Financial text extraction",
  "Task routing detected",
  "Leadership agents activated",
  "Department agents running",
  "Evaluator checking output",
  "Synthesis report generated"
];

export default function MissionTimeline({ activeIndex, status }: { activeIndex: number; status: TimelineStatus }) {
  const progress = status === "completed" ? 100 : status === "idle" ? 0 : Math.max(8, Math.min(100, ((activeIndex + 1) / stages.length) * 100));
  const streamStages = [...stages, ...stages];

  return (
    <Reveal as="section" className="shell py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Live Mission Timeline</p>
          <h2 className="section-title">A finance mission in motion.</h2>
        </div>
      </div>
      <div className="timeline-stream liquid-glass-strong" style={{ "--timeline-progress": `${progress}%` } as CSSProperties}>
        <div className="timeline-data-line" />
        <div className="timeline-particle particle-a" />
        <div className="timeline-particle particle-b" />
        <div className="timeline-particle particle-c" />
        <div className="timeline-stream-track">
          {streamStages.map((stage, streamIndex) => {
            const index = streamIndex % stages.length;
            const stepStatus = status === "failed" && index === activeIndex ? "failed" : status === "completed" || index < activeIndex ? "completed" : index === activeIndex && status === "running" ? "running" : "queued";
            return (
              <InteractiveCard
                key={`${stage}-${streamIndex}`}
                className={`timeline-step ${stepStatus}`}
                intensity={3}
                enableTilt={false}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[.62rem] font-bold uppercase tracking-[.18em] text-white/40">Stage {String(index + 1).padStart(2, "0")}</span>
                  <StageIcon status={stepStatus} />
                </div>
                <div className="mt-5 text-sm font-semibold text-white">{stage}</div>
                <div className="mt-3 text-[.68rem] font-bold uppercase tracking-[.14em] text-white/36">{stepStatus}</div>
                {stepStatus === "running" && <motion.span className="timeline-scan" layoutId="timeline-scan" />}
              </InteractiveCard>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function StageIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-greenx" />;
  if (status === "failed") return <XCircle className="h-5 w-5 text-redx" />;
  if (status === "running") return <Loader2 className="h-5 w-5 animate-spin text-cyanx" />;
  return <Circle className="h-5 w-5 text-slate-600" />;
}
