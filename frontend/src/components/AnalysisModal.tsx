import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, X } from "lucide-react";

type AnalysisModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  badge?: string;
  content: string;
  onClose: () => void;
};

export default function AnalysisModal({ open, title, subtitle, badge, content, onClose }: AnalysisModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function copyContent() {
    await navigator.clipboard.writeText(content);
  }

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="analysis-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.article
            className="analysis-modal liquid-glass-strong"
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, y: 24, filter: "blur(12px)" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {badge && <span className="report-badge">{badge}</span>}
                <h2 className="mt-4 text-2xl font-medium tracking-[-.04em] text-white sm:text-3xl">{title}</h2>
                {subtitle && <p className="mt-2 text-sm leading-6 text-white/55">{subtitle}</p>}
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={copyContent}><Copy className="h-4 w-4" /> Copy</button>
                <button className="hero-menu" onClick={onClose} aria-label="Close modal"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="modal-content no-scrollbar mt-6">
              {formatAnalysis(content).map((item, index) => item.kind === "bullet" ? (
                <div className="modal-bullet" key={`${item.text}-${index}`}><span /> <p>{item.text}</p></div>
              ) : item.kind === "heading" ? (
                <h3 key={`${item.text}-${index}`}>{item.text}</h3>
              ) : (
                <p key={`${item.text}-${index}`}>{item.text}</p>
              ))}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}

function formatAnalysis(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const stripped = line.replace(/^#{1,4}\s*/, "").replace(/:$/, "");
      if (/^#{1,4}\s+/.test(line) || /^(Executive Summary|Key Findings|Risks?|Risk Signals|Recommended Actions|Disclaimer|Financial Snapshot|Opportunities)/i.test(stripped)) {
        return { kind: "heading", text: stripped };
      }
      if (/^[-*]\s+/.test(line)) return { kind: "bullet", text: line.replace(/^[-*]\s+/, "") };
      if (/^\d+\.\s+/.test(line)) return { kind: "bullet", text: line.replace(/^\d+\.\s+/, "") };
      return { kind: "paragraph", text: line };
    });
}
