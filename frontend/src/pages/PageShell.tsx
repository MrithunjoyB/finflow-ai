import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import BackgroundFX from "../components/BackgroundFX";

type PageShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function PageShell({ eyebrow, title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen text-white">
      <BackgroundFX />
      <main className="page-stack route-page-shell">
        <nav className="route-page-nav">
          <Link className="route-home-link" to="/">
            <ArrowLeft className="h-4 w-4" /> Back to FinFlow Home
          </Link>
          <span className="mission-status-pill">FinFlow AI Corporation</span>
        </nav>
        <motion.header
          className="route-hero"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </motion.header>
        {children}
      </main>
    </div>
  );
}

