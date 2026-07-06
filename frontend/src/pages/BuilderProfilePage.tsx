import { motion } from "framer-motion";
import { ExternalLink, FileText, Github, Linkedin, User, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageShell from "./PageShell";
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from "../lib/projectLinks";

export default function BuilderProfilePage() {
  return (
    <PageShell
      eyebrow="Digital Builder ID"
      title="Builder Profile"
      subtitle="The engineer and motivation behind FinFlow AI Corporation."
    >
      <section className="builder-page-grid">
        <motion.div className="builder-id-card builder-id-large" whileHover={{ y: -5, scale: 1.006 }}>
          <span className="builder-badge">Founder / Builder</span>
          <div className="builder-orbit" aria-hidden="true">
            <span className="orbit-dot dot-a" />
            <span className="orbit-dot dot-b" />
            <span className="orbit-dot dot-c" />
          </div>
          <div className="builder-avatar"><User className="h-8 w-8" /></div>
          <div>
            <h4>Mrithunjoy Basumatary</h4>
            <p>IIT Kharagpur</p>
            <p>B.Tech 2027</p>
            <p>Ocean Engineering and Naval Architecture</p>
          </div>
        </motion.div>

        <div className="route-feature-card">
          <Zap className="h-6 w-6 text-greenx" />
          <h2>Research Motivation</h2>
          <p>I built FinFlow to explore how multi-agent AI systems can move beyond chatbot-style answers into role-based, traceable, decision-support workflows.</p>
        </div>

        <div className="mission-chip-row route-span-2">
          {["AI Systems", "Financial Analytics", "Multi-Agent Workflows", "Business Intelligence", "Data-driven decision support"].map((chip) => (
            <span className="mission-chip" key={chip}>{chip}</span>
          ))}
        </div>

        <div className="mission-link-row route-span-2">
          <PortalLink href={GITHUB_URL} icon={Github} label="GitHub Repository" />
          <PortalLink href={LINKEDIN_URL} icon={Linkedin} label="LinkedIn" />
          <PortalLink href={RESUME_URL} icon={FileText} label="Resume / Portfolio" />
        </div>
      </section>
    </PageShell>
  );
}

function PortalLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <a className="portal-link" href={href} target="_blank" rel="noreferrer noopener">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
