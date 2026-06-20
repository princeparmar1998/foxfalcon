"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function HeroParallax() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ y }}
      className="absolute inset-0 z-0"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-background/40 to-background z-10" />
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop"
          alt="Fox Falcon Autumn/Winter Collection 2026 Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-75"
        />
      </div>
      {/* Animated Neutral Grey Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zinc-500/10 dark:bg-zinc-500/5 rounded-full blur-[15px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-400/10 dark:bg-zinc-600/5 rounded-full blur-[15px] animate-pulse delay-700" />
    </motion.div>
  );
}
