"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with Parallax Effect */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-background/60 to-background z-10" />
        <div 
          className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-55"
        />
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse delay-700" />
      </motion.div>

      <div className="container relative z-20 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Fox Falcon Floating Logo */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-64 md:w-80 aspect-[770/819] relative overflow-hidden drop-shadow-[0_0_35px_rgba(244,63,94,0.15)] dark:drop-shadow-[0_0_50px_rgba(249,115,22,0.35)] hover:scale-105 transition-all duration-500"
            >
              <img src="/logo.png" alt="Fox Falcon Brand Logo" className="w-full h-full object-contain" />
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            New Collection 2026
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            ELEVATE YOUR <br />
            <span className="text-primary italic">STREETWEAR</span> GAME
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium">
            Discover the fusion of premium comfort and bold aesthetics. 
            From classic essentials to custom-designed masterpieces.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold group bg-primary hover:bg-primary/90">
              <Link href="/shop" className="flex items-center gap-2">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-2 hover:bg-secondary/10 hover:text-secondary hover:border-secondary transition-all">
              <Link href="/custom-design">
                Design Your Own
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </div>
  );
};
