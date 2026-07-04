import { AlertCircle, CheckCircle2, FileText, Server, UploadCloud } from "lucide-react";
import type { ReactNode } from "react";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { HealthResponse } from "../types/api";

type UploadMissionProps = {
  health?: HealthResponse;
  file?: File | null;
  loading: boolean;
  error?: string | null;
  onFile: (file: File) => void;
  onLaunch: () => void;
};

export default function UploadMission({ health, file, loading, error, onFile, onLaunch }: UploadMissionProps) {
  const backendOnline = Boolean(health);
  return (
    <Reveal as="section" className="shell py-10" >
      <div id="upload-section" />
      <div id="mission-input">
      <div className="section-head">
        <div>
          <p className="eyebrow">Mission Input</p>
          <h2 className="section-title">Deploy the finance document into the agent network.</h2>
        </div>
        <p className="section-copy">The backend detects the workflow, routes agents, traces execution, evaluates output, and returns a CFO-style report.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <InteractiveCard className="liquid-glass-strong p-5 sm:p-6" intensity={4}>
          <label className="upload-zone" aria-label="Upload financial document">
            <span className="liquid-glass grid h-16 w-16 place-items-center rounded-2xl text-cyanx">
              <UploadCloud className="h-8 w-8" />
            </span>
            <span className="mt-5 block text-2xl font-medium tracking-[-.04em] text-white">Drop financial file</span>
            <span className="mt-2 block text-sm leading-6 text-white/52">PDF / CSV / TXT routed through FinFlow's traceable AI corporation.</span>
            <input
              className="sr-only"
              type="file"
              accept=".pdf,.csv,.txt"
              onChange={(event) => {
                const nextFile = event.target.files?.[0];
                if (nextFile) onFile(nextFile);
              }}
            />
          </label>
          {file && (
            <div className="liquid-glass mt-4 rounded-[1.2rem] px-4 py-3 text-sm font-semibold text-greenx">
              Selected: {file.name}
            </div>
          )}
          <button className="btn-primary mt-4 w-full" disabled={!file || loading} onClick={onLaunch}>
            {loading ? "Mission Running" : "Launch AI Corporation"}
          </button>
          {error && (
            <div className="liquid-glass mt-4 rounded-[1.2rem] p-4 text-sm text-red-100">
              <div className="flex items-center gap-2 font-black"><AlertCircle className="h-4 w-4" /> Analysis failed</div>
              <p className="mt-2 leading-6 text-red-100/80">{error}</p>
            </div>
          )}
        </InteractiveCard>

        <InteractiveCard className="p-6" intensity={4}>
          <div className="space-y-4">
            <StatusRow icon={<Server />} label="Backend" value={backendOnline ? "Online" : "Offline"} good={backendOnline} />
            <StatusRow icon={<CheckCircle2 />} label="Runtime Mode" value={health?.demo_mode ? "Demo Mode ON" : backendOnline ? "Live LLM Mode" : "Unknown"} good={Boolean(health?.demo_mode)} />
            <StatusRow icon={<FileText />} label="Allowed Types" value={(health?.allowed_extensions || ["pdf", "csv", "txt"]).map((item) => item.toUpperCase()).join(" / ")} good />
          </div>
          <div className="mt-5 grid gap-2">
            {["sample_invoice.txt", "sample_transactions.csv", "sample_expenses.csv"].map((sample) => (
              <InteractiveCard key={sample} className="rounded-[1.1rem] p-3 text-sm text-white/62" intensity={2}>
                <b className="block font-semibold text-white">{sample}</b>
                <span className="text-xs text-white/38">Available in /samples. Upload manually for demo.</span>
              </InteractiveCard>
            ))}
          </div>
        </InteractiveCard>
      </div>
      </div>
    </Reveal>
  );
}

function StatusRow({ icon, label, value, good }: { icon: ReactNode; label: string; value: string; good: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[.14em] text-slate-500">
        <span className={good ? "text-greenx [&_svg]:h-4 [&_svg]:w-4" : "text-amberx [&_svg]:h-4 [&_svg]:w-4"}>{icon}</span>
        {label}
      </div>
      <span className={good ? "font-black text-greenx" : "font-black text-amberx"}>{value}</span>
    </div>
  );
}
