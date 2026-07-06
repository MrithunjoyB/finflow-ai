import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText, Network, Rocket, ShieldCheck, User, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type MissionControlMenuProps = {
  open: boolean;
  onClose: () => void;
};

type MissionRoute = {
  path: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

const missionRoutes: MissionRoute[] = [
  { path: "/project-overview", icon: FileText, title: "Project Overview", subtitle: "Mission brief and core product use cases." },
  { path: "/builder-profile", icon: User, title: "Builder Profile", subtitle: "Who built FinFlow and why." },
  { path: "/system-architecture", icon: Network, title: "System Architecture", subtitle: "Live blueprint of the AI corporation pipeline." },
  { path: "/demo-live-mode", icon: ShieldCheck, title: "Demo / Live Mode", subtitle: "Runtime control panel and safety model." },
  { path: "/why-this-matters", icon: Rocket, title: "Why This Project Matters", subtitle: "Impact, differentiation, and future roadmap." }
];

export default function MissionControlMenu({ open, onClose }: MissionControlMenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  function goTo(path: string) {
    onClose();
    navigate(path);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mission-control-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={onClose}
        >
          <motion.aside
            className="mission-control-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mission-control-title"
            initial={{ opacity: 0, x: 34, scale: 0.96, filter: "blur(14px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 22, scale: 0.97, filter: "blur(12px)" }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mission-control-top">
              <div className="min-w-0">
                <span className="mission-status-pill">Task-routed AI finance system</span>
                <h2 id="mission-control-title">FinFlow Mission Control</h2>
                <p>Explore the AI finance corporation, builder profile, architecture, runtime modes, and project impact.</p>
              </div>
              <button className="mission-control-close" type="button" onClick={onClose} aria-label="Close Mission Control">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mission-control-content">
              <motion.div className="mission-home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="mission-menu-grid">
                  {missionRoutes.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.path}
                        className="mission-menu-card"
                        type="button"
                        onClick={() => goTo(item.path)}
                        whileHover={{ y: -4, scale: 1.012 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mission-card-icon"><Icon className="h-5 w-5" /></span>
                        <span className="min-w-0 flex-1 text-left">
                          <b>{item.title}</b>
                          <small>{item.subtitle}</small>
                        </span>
                        <ArrowRight className="mission-card-arrow h-4 w-4" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
