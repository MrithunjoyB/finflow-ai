import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

type InteractiveCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  intensity?: number;
  glow?: boolean;
  disabled?: boolean;
  enableTilt?: boolean;
};

export default function InteractiveCard({ children, className = "", as = "div", intensity = 7, glow = true, disabled = false, enableTilt = true }: InteractiveCardProps) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.7 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.7 });
  const scale = useSpring(1, { stiffness: 210, damping: 20, mass: 0.55 });
  const background = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,.11), transparent 38%), radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(81,231,255,.09), transparent 44%)`;
  const Component = as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    if (reduceMotion || !enableTilt) {
      scale.set(1.022);
      return;
    }
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(((centerY - y) / centerY) * intensity);
    rotateY.set(((x - centerX) / centerX) * intensity);
    scale.set(1.035);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  return (
    <Component
      className={`interactive-card ${glow ? "interactive-card-glow" : ""} ${disabled ? "interactive-card-disabled" : ""} ${className}`}
      style={{ "--mouse-x": mouseX, "--mouse-y": mouseY, background: glow ? background : undefined, rotateX, rotateY, scale, transformPerspective: enableTilt ? 900 : undefined, transformStyle: enableTilt ? "preserve-3d" : undefined } as MotionStyle}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 210, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>
  );
}
