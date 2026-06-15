"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with Parallax Effect */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-background/40 to-background z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-75"
        />
        {/* Animated Neutral Grey Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zinc-500/10 dark:bg-zinc-500/5 rounded-full blur-[15px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-400/10 dark:bg-zinc-600/5 rounded-full blur-[15px] animate-pulse delay-700" />
      </motion.div>

      {/* Catalog Metadata Overlay */}
      <div className="absolute bottom-12 left-8 z-20 hidden lg:flex flex-col gap-1 text-[10px] font-mono tracking-widest text-foreground/80 border-l border-primary/40 pl-3">
        <span>COLLECTION: VOL. 01 / ARCHIVE</span>
        <span>HEAVYWEIGHT HEAVY-GSM SERIES</span>
        <span>MOTO-LIFESTYLE INFLUENCE [30%]</span>
      </div>

      <div className="container relative z-20 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Brand Logo Typographical Emblem */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center gap-3 border border-primary/30 px-6 py-2.5 rounded-full bg-background/50 backdrop-blur-sm"
            >
              <Navigation className="w-4 h-4 text-primary animate-bounce" />
              <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-foreground">
                FOX FALCON STUDIO
              </span>
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Autumn/Winter Collection 2026
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            ELEVATE DAILY <br />
            <span className="text-primary italic font-serif">STREETWEAR.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-foreground/85 font-medium leading-relaxed">
            Premium streetwear silhouettes engineered with heavyweight loopback cotton fabrics, relaxed drops, and minimalist custom designs. Refined cuts with a subtle motor culture edge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button asChild size="lg" className="h-14 px-8 text-sm font-black tracking-wider uppercase rounded-button bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg group">
              <Link href="/shop" className="flex items-center gap-2">
                Shop Technical Gear
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-sm font-black tracking-wider uppercase rounded-button border-border/60 hover:bg-card hover:text-foreground hover:border-primary transition-all">
              <Link href="/custom-design">
                Custom Blanks
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] font-black text-foreground/80">Scroll Telemetry</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </div>
  );
};
