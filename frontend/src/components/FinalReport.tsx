import { Copy, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AnalysisModal from "./AnalysisModal";
import InteractiveCard from "./InteractiveCard";
import Reveal from "./Reveal";

const sectionOrder = ["Executive Summary", "Key Findings", "Risk Signals", "Recommended Actions", "Disclaimer"];

export default function FinalReport({ report, onCopy, onDownload }: { report?: string; onCopy: () => void; onDownload: () => void }) {
  const sections = buildReportSections(report || "Run an analysis to generate a CFO-style report.");
  const [modalOpen, setModalOpen] = useState(false);
  const previewSections = sections.filter((section) => section.title !== "Disclaimer").slice(0, 4);

  return (
    <Reveal>
      <div id="report-section" className="scroll-mt-8">
      <InteractiveCard className="liquid-glass-strong p-6 sm:p-8" intensity={2} enableTilt={false}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Final CFO-Style Report</p>
            <h2 className="section-title">Executive finance output.</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="report-badge"><Sparkles className="h-3.5 w-3.5" /> Synthesized Output</span>
              <span className="report-badge">AI Generated</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => setModalOpen(true)}>Open Full CFO Report</button>
            <button className="btn-secondary" onClick={onCopy}><Copy className="h-4 w-4" /> Copy Final Report</button>
            <button className="btn-secondary" onClick={onDownload}><Download className="h-4 w-4" /> Download Full Report</button>
          </div>
        </div>

        <div className="mt-7 grid gap-4">
          {previewSections.map((section, index) => (
            <motion.section
              key={section.title}
              className={`report-section ${section.title === "Disclaimer" ? "muted" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="field-label">{String(index + 1).padStart(2, "0")} · {section.label}</div>
              <h3>{section.title}</h3>
              <ReportBody title={section.title} lines={section.lines.slice(0, section.title === "Executive Summary" ? 2 : 3)} />
            </motion.section>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-white/45">Preview only. Open the full CFO report for complete synthesis, risks, recommendations, and disclaimer.</p>
      </InteractiveCard>
      </div>
      <AnalysisModal
        open={modalOpen}
        title="Full CFO-Style Report"
        subtitle="Complete synthesized output from the FinFlow AI Corporation workflow."
        badge="Synthesized Output"
        content={report || "Run an analysis to generate a CFO-style report."}
        onClose={() => setModalOpen(false)}
      />
    </Reveal>
  );
}

function ReportBody({ title, lines }: { title: string; lines: string[] }) {
  if (title === "Recommended Actions") {
    return (
      <ol className="mt-4 grid gap-3">
        {normalizeItems(lines).map((line, index) => (
          <li key={`${line}-${index}`} className="action-item">
            <span>{index + 1}</span>
            <p>{line}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (title === "Risk Signals" || title === "Key Findings") {
    return (
      <div className="mt-4 grid gap-2">
        {normalizeItems(lines).map((line, index) => (
          <div key={`${line}-${index}`} className={title === "Risk Signals" ? "risk-item" : "finding-item"}>
            <span />
            <p>{line}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3">
      {lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
    </div>
  );
}

function buildReportSections(report: string) {
  const cleanLines = report
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const buckets = new Map(sectionOrder.map((title) => [title, [] as string[]]));
  let active = "Executive Summary";

  cleanLines.forEach((line) => {
    const normalized = line.replace(/^#{1,4}\s*/, "").replace(/:$/, "");
    const matched = matchHeading(normalized);
    if (matched) {
      active = matched;
      return;
    }
    buckets.get(active)?.push(line.replace(/^[-*]\s*/, ""));
  });

  if ([...buckets.values()].every((items) => items.length === 0)) {
    buckets.set("Executive Summary", chunkFallback(report).slice(0, 2));
    buckets.set("Key Findings", chunkFallback(report).slice(2, 5));
  }

  const fallback = chunkFallback(report);
  return sectionOrder.map((title, index) => ({
    title,
    label: title === "Risk Signals" ? "Risk Review" : title === "Recommended Actions" ? "Action Plan" : title,
    lines: buckets.get(title)?.length ? buckets.get(title)! : fallbackFor(title, fallback, index)
  }));
}

function matchHeading(line: string) {
  const lower = line.toLowerCase();
  if (lower.includes("executive summary")) return "Executive Summary";
  if (lower.includes("key finding") || lower.includes("financial snapshot") || lower.includes("opportunit")) return "Key Findings";
  if (lower.includes("risk")) return "Risk Signals";
  if (lower.includes("recommended action") || lower.includes("action")) return "Recommended Actions";
  if (lower.includes("disclaimer") || lower.includes("not financial advice")) return "Disclaimer";
  return "";
}

function chunkFallback(text: string) {
  return text
    .replace(/\r/g, "")
    .split(/\n+|(?<=\.)\s+(?=[A-Z])/)
    .map((item) => item.trim().replace(/^[-*]\s*/, ""))
    .filter(Boolean)
    .slice(0, 12);
}

function fallbackFor(title: string, fallback: string[], index: number) {
  if (title === "Disclaimer") return ["AI-generated output for demo and informational purposes only. Not financial, tax, legal, or investment advice."];
  return fallback.slice(index, index + 2).length ? fallback.slice(index, index + 2) : ["No dedicated section was returned for this report area."];
}

function normalizeItems(lines: string[]) {
  return lines
    .flatMap((line) => line.split(/(?:^|\s)(?:\d+\.|[-*])\s+/).map((item) => item.trim()).filter(Boolean))
    .filter(Boolean);
}
