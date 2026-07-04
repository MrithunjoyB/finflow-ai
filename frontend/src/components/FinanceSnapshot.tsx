import { motion } from "framer-motion";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";
import type { AnalyzeResponse } from "../types/api";

type FinanceSnapshotProps = {
  response?: AnalyzeResponse | null;
  fileText: string;
};

export default function FinanceSnapshot({ response, fileText }: FinanceSnapshotProps) {
  const stats = parseFinanceText(fileText);
  const hasNumbers = stats.revenue > 0 || stats.expenses > 0;
  const revenue = hasNumbers ? stats.revenue : 24500;
  const expenses = hasNumbers ? stats.expenses : 8930;
  const net = hasNumbers ? stats.net : 15570;
  const risk = response?.routing?.task_type === "risk_assessment" || (response?.evaluation?.score ?? 100) < 70 ? "High" : response?.routing?.task_type === "invoice_analysis" ? "Medium" : "Low";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Reveal delay={0}><Metric label="Revenue" value={formatMoney(revenue)} tone="green" note={hasNumbers ? "Parsed from upload" : "Demo Snapshot"} /></Reveal>
      <Reveal delay={0.08}><Metric label="Expenses" value={formatMoney(expenses)} tone="amber" note={hasNumbers ? "Parsed from upload" : "Demo Snapshot"} /></Reveal>
      <Reveal delay={0.16}><Metric label="Net Cash Flow" value={formatMoney(net)} tone={net < 0 ? "red" : "cyan"} note={hasNumbers ? "Calculated client-side" : "Estimated"} /></Reveal>
      <Reveal delay={0.24}><Metric label="Risk Level" value={risk} tone={risk === "High" ? "red" : risk === "Medium" ? "amber" : "green"} note="Based on routing/evaluation" /></Reveal>
    </div>
  );
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: "green" | "amber" | "red" | "cyan" }) {
  return (
    <InteractiveCard className="metric-card p-5" intensity={5}>
      <div className="field-label">{label}</div>
      <motion.div className={`mt-3 text-3xl font-black tracking-[-.04em] metric-${tone}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {value}
      </motion.div>
      <div className="mt-2 text-sm text-slate-500">{note}</div>
      <div className="sparkline" />
    </InteractiveCard>
  );
}

function parseFinanceText(text: string) {
  let revenue = 0;
  let expenses = 0;
  text.split(/\r?\n/).slice(1).forEach((line) => {
    const cols = line.split(",").map((col) => col.trim());
    const amount = Number([...cols].reverse().find((col) => /^-?\d+(\.\d+)?$/.test(col)) || 0);
    const lowered = line.toLowerCase();
    if (!Number.isFinite(amount)) return;
    if (amount < 0 || /expense|cost|spend|subscription|vendor|contractor/.test(lowered)) expenses += Math.abs(amount);
    if (amount > 0 && /revenue|income|sales|client payment|enterprise/.test(lowered)) revenue += amount;
  });
  return { revenue, expenses, net: revenue - expenses };
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}
