import { motion } from "framer-motion";
import { CheckCircle2, Lock, Network, ShieldCheck, Sparkles } from "lucide-react";
import PageShell from "./PageShell";
import type { HealthResponse } from "../types/api";

type DemoLiveModePageProps = {
  health?: HealthResponse;
};

export default function DemoLiveModePage({ health }: DemoLiveModePageProps) {
  const liveAvailable = Boolean(health?.live_available);
  const provider = providerLabel(health?.llm_provider);

  return (
    <PageShell
      eyebrow="Runtime Control Panel"
      title="Demo / Live Mode"
      subtitle="FinFlow can run as a safe offline demo or as a provider-backed live AI workflow."
    >
      <section className="runtime-page-grid">
        <motion.div className="runtime-card runtime-card-large active" whileHover={{ y: -5, scale: 1.01 }}>
          <Sparkles className="h-6 w-6" />
          <h4>Demo Mode</h4>
          <p>Works without API keys, uses deterministic offline responses, supports recruiter-safe demos, and stays stable and repeatable.</p>
          <span className="runtime-light green">Always available</span>
        </motion.div>

        <motion.div className={`runtime-card runtime-card-large ${liveAvailable ? "active" : ""}`} whileHover={{ y: -5, scale: 1.01 }}>
          <Network className="h-6 w-6" />
          <h4>Live Mode</h4>
          <p>Uses Groq-powered LLM reasoning when a valid server-side provider key is configured. Outputs become dynamic and provider-backed.</p>
          <span className={`runtime-light ${liveAvailable ? "green" : "amber"}`}>{liveAvailable ? "Available" : "Needs valid key"}</span>
        </motion.div>

        <div className="runtime-status route-span-2">
          <StatusRow label="Default mode" value={health?.demo_mode ? "Demo Mode" : liveAvailable ? "Live Mode" : "Demo Mode"} />
          <StatusRow label="Provider chip" value={provider} />
          <StatusRow label="Live available" value={liveAvailable ? "Yes" : "No"} tone={liveAvailable ? "green" : "amber"} />
          <StatusRow label="API keys" value="Server-side only" />
        </div>

        <div className="safety-grid route-span-2">
          {["Not financial advice", "Uploaded figures should be verified", "Live output depends on provider availability", "API keys stay server-side only"].map((item) => (
            <div className="route-mini-card" key={item}>
              {item.includes("API") ? <Lock className="h-5 w-5" /> : item.includes("provider") ? <ShieldCheck className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              <b>{item}</b>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function StatusRow({ label, value, tone }: { label: string; value: string; tone?: "green" | "amber" }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <b className={tone || ""}>{value}</b>
    </div>
  );
}

function providerLabel(provider?: string | null) {
  const labels: Record<string, string> = {
    groq: "Groq",
    openai: "OpenAI",
    anthropic: "Anthropic Claude",
    gemini: "Gemini",
    openrouter: "OpenRouter",
    ollama: "Ollama"
  };
  if (!provider || provider === "none") return "Not configured";
  return labels[provider] || provider;
}
