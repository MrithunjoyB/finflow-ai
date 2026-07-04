import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { CSSProperties } from "react";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { EvaluationResult } from "../types/api";

export default function EvaluatorScore({ evaluation }: { evaluation?: EvaluationResult }) {
  const score = evaluation?.score ?? 0;
  const passed = Boolean(evaluation?.passed);
  return (
    <Reveal>
    <InteractiveCard className="p-6" intensity={2} enableTilt={false}>
      <div className="grid items-center gap-6 md:grid-cols-[170px_1fr]">
        <div className="score-ring" style={{ "--score": `${score}%` } as CSSProperties}>
          <div className="score-inner">
            <b>{evaluation ? score : "--"}</b>
            <span>Score</span>
          </div>
        </div>
        <div>
          <p className="eyebrow">Evaluator Score</p>
          <div className={`mt-3 flex items-center gap-2 text-xl font-semibold ${passed ? "text-greenx" : "text-amberx"}`}>
            {passed ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            {evaluation ? (passed ? "Passed quality checks" : "Needs review") : "Awaiting quality check"}
          </div>
          <div className="mt-4 space-y-2 text-sm leading-6 text-white/55">
            <p><b className="text-white/82">Missing Sections:</b> {(evaluation?.missing_sections || []).join(", ") || "None"}</p>
            <p><b className="text-white/82">Recommendations:</b> {(evaluation?.recommendations || []).join(" ") || "No evaluator recommendations returned."}</p>
          </div>
        </div>
      </div>
    </InteractiveCard>
    </Reveal>
  );
}
