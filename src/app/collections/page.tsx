"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Flame, Shield, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const collectionsList = [
  {
    id: "instinct-peak",
    name: "INSTINCT PEAK",
    tagline: "BOLD STREETWEAR & GRAPHIC TEES",
    description: "Express your raw personality with heavy-cotton oversized hoodies, vintage washed tees, and premium graphic drops.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    badge: "Hot Drop",
    badgeIcon: Flame,
    count: "12 Items Available"
  },
  {
    id: "urban-falcon",
    name: "URBAN FALCON",
    tagline: "PREMIUM DENIMS & UTILITY OUTERWEAR",
    description: "Engineered for maximum utility and sleek city aesthetics. Featuring heavy-duty cargo pants, distressed denims, and technical windbreakers.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
    badge: "Trending",
    badgeIcon: Sparkles,
    count: "15 Items Available"
  },
  {
    id: "midnight-cyber",
    name: "MIDNIGHT CYBER",
    tagline: "TECHWEAR ACCESSORIES & CAPS",
    description: "Complete your silhouette with high-tech reflective accessories, modular cross-body bags, and distressed streetwear caps.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    badge: "Limited Release",
    badgeIcon: Shield,
    count: "8 Items Available"
  },
  {
    id: "minimalist-power",
    name: "MINIMALIST POWER",
    tagline: "PREMIUM DAILY ESSENTIALS",
    description: "The foundation of every strong outfit. Neutral colorways, high-density drop-shoulder basics, and comfortable loopback joggers.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    badge: "Essentials",
    badgeIcon: Compass,
    count: "10 Items Available"
  }
];

export default function CollectionsPage() {
  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-6xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          Season 2026 Drops
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          THE <span className="text-primary italic">COLLECTIONS</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Curated streetwear designed for maximum impact. Where raw instinct meets technical power.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collectionsList.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative flex flex-col justify-end aspect-[4/5] rounded-3xl overflow-hidden bg-black border border-border hover:border-primary/60 transition-all duration-500 shadow-2xl shadow-black/80"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={col.image}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-75 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            </div>

            {/* Content */}
            <div className="relative z-20 p-8 md:p-10 space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider">
                <col.badgeIcon className="w-3.5 h-3.5" />
                {col.badge}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <span className="text-primary text-xs font-bold uppercase tracking-widest block">{col.tagline}</span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{col.name}</h2>
              </div>

              {/* Description */}
              <p className="text-zinc-300 text-sm leading-relaxed max-w-md opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                {col.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{col.count}</span>
                <Button asChild size="sm" className="bg-white hover:bg-zinc-200 text-black font-bold group/btn">
                  <Link href="/shop" className="flex items-center gap-1.5">
                    Explore Drop
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
