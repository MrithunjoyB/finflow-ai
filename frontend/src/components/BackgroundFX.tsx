import { motion, useReducedMotion } from "framer-motion";

export default function BackgroundFX() {
  const reduceMotion = useReducedMotion();
  const particles = Array.from({ length: 34 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    top: `${(index * 19) % 100}%`,
    delay: (index % 8) * 0.35
  }));

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-command">
      <motion.div
        className="absolute inset-[-12%] bg-[radial-gradient(circle_at_18%_12%,rgba(74,141,255,.12),transparent_28%),radial-gradient(circle_at_82%_4%,rgba(81,231,255,.08),transparent_22%),radial-gradient(circle_at_58%_88%,rgba(255,255,255,.05),transparent_28%)]"
        animate={reduceMotion ? undefined : { x: ["0%", "1.8%", "0%"], y: ["0%", "-1.4%", "0%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.032)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(circle_at_50%_35%,rgba(0,0,0,.95),rgba(0,0,0,.38)_52%,transparent_82%)]" />
      <div className="absolute inset-0 opacity-[.18] [background-image:linear-gradient(115deg,transparent_0%,transparent_44%,rgba(81,231,255,.18)_48%,transparent_52%,transparent_100%)] [background-size:260%_260%] motion-safe:animate-[scan_9s_ease-in-out_infinite]" />
      <div className="absolute left-[56%] top-[12%] h-[72vw] max-h-[920px] w-[72vw] max-w-[920px] rounded-full border border-white/[.045]" />
      <div className="absolute left-[62%] top-[24%] h-[42vw] max-h-[560px] w-[42vw] max-w-[560px] rounded-full border border-cyanx/[.07]" />
      {!reduceMotion &&
        particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-white/25 shadow-[0_0_18px_rgba(81,231,255,.28)]"
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [-10, 10, -10], x: [-4, 4, -4], opacity: [0.12, 0.48, 0.12] }}
            transition={{ duration: 6 + (particle.id % 5), repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
}
