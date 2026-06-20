import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";
import { HeroParallax } from "./HeroParallax";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Parallax and Glows (Client Optimized) */}
      <HeroParallax />

      {/* Catalog Metadata Overlay */}
      <div className="absolute bottom-12 left-8 z-20 hidden lg:flex flex-col gap-1 text-[10px] font-mono tracking-widest text-foreground/80 border-l border-primary/40 pl-3">
        <span>COLLECTION: VOL. 01 / ARCHIVE</span>
        <span>HEAVYWEIGHT HEAVY-GSM SERIES</span>
        <span>MOTO-LIFESTYLE INFLUENCE [30%]</span>
      </div>

      <div className="container relative z-20 px-6 mx-auto text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Brand Logo Typographical Emblem */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 border border-primary/30 px-6 py-2.5 rounded-full bg-background/50 backdrop-blur-sm">
              <Navigation className="w-4 h-4 text-primary animate-bounce" />
              <span className="font-mono text-xs font-black uppercase tracking-[0.3em] text-foreground">
                FOX FALCON STUDIO
              </span>
            </div>
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
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[9px] uppercase tracking-[0.25em] font-black text-foreground/80">Scroll Telemetry</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </div>
  );
};
