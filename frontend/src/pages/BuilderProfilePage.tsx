import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Bot, Braces, Code2, Database, ExternalLink, FileJson, FileSpreadsheet, FileText, Github, Linkedin, Network, Route, Server, Sparkles, TerminalSquare, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "../lib/projectLinks";

const BUILDER_VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4";

const connectorSteps = ["AI Systems", "Analytics", "Agents", "Reports"];

const toolTickerItems: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Python", icon: TerminalSquare },
  { label: "SQL", icon: Database },
  { label: "TypeScript", icon: Code2 },
  { label: "JavaScript", icon: Braces },
  { label: "React", icon: Sparkles },
  { label: "Vite", icon: Sparkles },
  { label: "Tailwind CSS", icon: Code2 },
  { label: "Framer Motion", icon: Workflow },
  { label: "Flask", icon: Server },
  { label: "REST API", icon: Route },
  { label: "Groq", icon: Bot },
  { label: "OpenAI", icon: Bot },
  { label: "Gemini", icon: Sparkles },
  { label: "OpenRouter", icon: Route },
  { label: "Ollama", icon: Bot },
  { label: "n8n", icon: Workflow },
  { label: "Make", icon: Workflow },
  { label: "Excel", icon: FileSpreadsheet },
  { label: "Power BI", icon: BarChart3 },
  { label: "Git", icon: TerminalSquare },
  { label: "GitHub", icon: Github },
  { label: "VS Code", icon: Code2 },
  { label: "Postman", icon: FileJson },
  { label: "Pandas", icon: FileSpreadsheet },
  { label: "NumPy", icon: Database },
  { label: "LangChain", icon: Workflow },
  { label: "AutoGen", icon: Network }
];

export default function BuilderProfilePage() {
  return (
    <div className="builder-cinema-page text-white">
      <video className="builder-video-bg" src={BUILDER_VIDEO_URL} autoPlay muted loop playsInline aria-hidden="true" />
      <div className="builder-video-overlay" />
      <div className="builder-video-glow" />

      <main className="builder-cinema-content">
        <nav className="builder-cinema-nav">
          <Link className="route-home-link" to="/">
            <ArrowLeft className="h-4 w-4" /> Back to FinFlow Home
          </Link>
          <span className="mission-status-pill">Building AI Workflow Systems</span>
        </nav>

        <section className="builder-cinema-grid">
          <motion.div
            className="builder-identity-copy"
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <p className="eyebrow">About Me</p>
              <h1>Mrithunjoy Basumatary</h1>
              <p className="builder-title-line">AI Systems · Financial Analytics · Multi-Agent Workflows</p>
              <p className="builder-school-line">IIT Kharagpur · B.Tech 2027</p>
              <p className="builder-school-line">Ocean Engineering and Naval Architecture</p>
            </div>

            <div className="builder-inline-links">
              <PortalLink href={GITHUB_URL} icon={Github} label="GitHub Repository" />
              <PortalLink href={LINKEDIN_URL} icon={Linkedin} label="LinkedIn" />
              <PortalLink href={RESUME_URL} icon={FileText} label="Resume / Portfolio" />
            </div>
          </motion.div>
        </section>

        <ToolsTicker />

        <motion.section
          className="builder-constellation-panel"
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="builder-constellation-copy">
            <p className="eyebrow">Builder Core</p>
            <h2>Connected skills, routed into systems.</h2>
            <p>
              FinFlow connects AI systems, analytics, agents, and reports into one practical workflow. The system routes uploaded financial context to the right intelligence layer, traces agent execution, and turns outputs into decision-ready reports.
            </p>

            <div className="connector-strip" aria-label="Builder skill pipeline">
              {connectorSteps.map((step, index) => (
                <span className="connector-item" key={step}>
                  <motion.span className="connector-pill" whileHover={{ y: -3, scale: 1.04 }}>
                    {step === "AI Systems" && <Sparkles className="h-3.5 w-3.5" />}
                    {step === "Analytics" && <BarChart3 className="h-3.5 w-3.5" />}
                    {step === "Agents" && <Route className="h-3.5 w-3.5" />}
                    {step === "Reports" && <FileText className="h-3.5 w-3.5" />}
                    {step}
                  </motion.span>
                  {index < connectorSteps.length - 1 && <span className="connector-arrow">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="builder-network-visual" aria-hidden="true">
            <Network className="network-logo h-8 w-8" />
            <span className="network-line line-a" />
            <span className="network-line line-b" />
            <span className="network-line line-c" />
            {Array.from({ length: 4 }).map((_, index) => <span className={`network-node-dot visual-node-${index + 1}`} key={index} />)}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function ToolsTicker() {
  const rowOne = toolTickerItems.slice(0, 14);
  const rowTwo = toolTickerItems.slice(14);

  return (
    <motion.section
      className="builder-tools-ticker"
      aria-label="Tools, languages, platforms, and frameworks"
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <TickerRow items={rowOne} direction="right" />
      <TickerRow items={rowTwo} direction="left" />
    </motion.section>
  );
}

function TickerRow({ items, direction }: { items: Array<{ label: string; icon: LucideIcon }>; direction: "left" | "right" }) {
  const repeated = [...items, ...items];

  return (
    <div className="builder-ticker-row">
      <div className={`builder-ticker-track ${direction === "right" ? "ticker-to-right" : "ticker-to-left"}`}>
        {repeated.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.span className="builder-tool-pill" key={`${item.label}-${index}`} whileHover={{ y: -3, scale: 1.045 }}>
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function PortalLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <a className="portal-link builder-portal-link" href={href} target="_blank" rel="noreferrer noopener">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
