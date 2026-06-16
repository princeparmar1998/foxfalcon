"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { userApi, productsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Loader2, ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { showToast } from "@/lib/toast";

interface LoyaltyData {
  ordersCount: number;
  stamps: number;
  isRewardReady: boolean;
}

interface LoyaltyCardProps {
  className?: string;
}

export function LoyaltyCard({ className }: LoyaltyCardProps) {
  const { data: session } = useSession();
  const { items, addItem } = useCart();
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendedProduct, setRecommendedProduct] = useState<any>(null);

  const hasItemsInCart = items.length > 0;

  useEffect(() => {
    if (!session) return;
    const fetchLoyalty = async () => {
      try {
        setLoading(true);
        const res = await userApi.getLoyalty();
        setData(res);
      } catch (err) {
        console.error("Failed to load loyalty card data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, [session]);

  const totalSlots = 7;
  const stamps = data?.stamps || 0;
  const isRewardReady = data?.isRewardReady || false;

  // Calculate rewards cycles
  const currentCycle = Math.floor((data?.ordersCount || 0) / 7) + (isRewardReady ? 0 : 1);
  const completedCycles = currentCycle - 1;

  useEffect(() => {
    if (!session) return;
    const fetchRecommendation = async () => {
      try {
        const products = await productsApi.getAll();
        if (products && products.length > 0) {
          const activeProducts = products.filter((p: any) => !p.name?.startsWith("[DELETED]"));
          if (activeProducts.length > 0) {
            // Select a product deterministically based on stamps count
            const nextProductIndex = stamps % activeProducts.length;
            setRecommendedProduct(activeProducts[nextProductIndex]);
          }
        }
      } catch (err) {
        console.error("Failed to load loyalty recommendation", err);
      }
    };
    fetchRecommendation();
  }, [session, stamps]);

  // Guest Teaser View (Sleek and Subtle)
  if (!session) {
    return (
      <div className={cn("container px-6 mx-auto max-w-4xl py-2", className)}>
        <div className="relative rounded-2xl overflow-hidden bg-muted/20 border border-border/30 py-6 px-8 md:px-10 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

          <div className="space-y-3 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3" /> VIP CIRCLE
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase leading-none">
              THE ARCHIVE CLUB
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              Unlock members-only collections, early drops access, and exclusive discounts. Connect profile to start tracking purchase credentials.
            </p>
          </div>

          <div className="w-full md:w-[350px] shrink-0 relative z-10" style={{ perspective: 1000 }}>
            {/* Minimal loyalty card preview as teaser */}
            <motion.div 
              whileHover={{
                scale: 1.03,
                rotateY: 6,
                rotateX: -4,
                boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full aspect-[1.8/1] rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/80 p-5 flex flex-col justify-between relative overflow-hidden shadow-premium group/card"
            >
              <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 p-4 text-center z-20">
                <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase">Privileged Access</p>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-lg shadow-md px-6 h-8 text-[10px] uppercase tracking-wider transition-all duration-300 hover:scale-105">
                  <Link href="/login">Join VIP Club</Link>
                </Button>
              </div>

              <div className="flex justify-between items-start opacity-20">
                <span className="text-[8px] font-mono text-foreground uppercase tracking-widest">VIP PASS // UNLOCKED STATUS</span>
              </div>
              
              {/* EMV Chip placeholder */}
              <div className="w-7 h-5 rounded-[4px] bg-gradient-to-br from-amber-300/30 to-amber-600/30 p-[1px] opacity-20" />

              <div className="grid grid-cols-7 gap-1.5 opacity-20">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-1 rounded-full bg-foreground" />
                ))}
              </div>
              
              <div className="flex justify-between items-end opacity-20">
                <span className="text-[6px] font-mono text-muted-foreground/60 tracking-wider">REF // 1-0-VIP</span>
                <span className="font-sans font-black tracking-[0.18em] text-[9px] text-foreground uppercase select-none">
                  FOX <span className="text-primary">FALCON</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container px-6 mx-auto max-w-4xl py-2", className)}>
      <div className="relative rounded-2xl overflow-hidden bg-muted/20 border border-border/30 py-6 px-8 md:px-10 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

        {/* Text Details Section */}
        <div className="space-y-4 max-w-md relative z-10 w-full md:w-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black tracking-[0.2em] uppercase">
            <Gift className="w-3.5 h-3.5" /> ARCHIVE CLUB
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground uppercase leading-none">
            {isRewardReady ? "VIP Privileges Unlocked" : "Your Archive Standing"}
          </h2>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-xs py-2 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Syncing credentials...</span>
              </div>
            ) : isRewardReady ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {hasItemsInCart ? (
                  <>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                      Privilege active! You have a <span className="text-primary font-bold">10% Archive Discount</span> waiting in your cart. Complete checkout now to claim rewards.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-10 px-5 text-xs rounded-xl shadow-md uppercase tracking-wider">
                      <Link href="/checkout" className="flex items-center gap-1.5">
                        Claim Privilege <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                      Privilege active! You have unlocked your <span className="text-primary font-bold">10% Archive Discount</span>. The discount will apply automatically to your next order.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-black h-10 px-5 text-xs rounded-xl shadow-md uppercase tracking-wider">
                      <Link href="/shop" className="flex items-center gap-1.5">
                        Shop Catalog <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </>
                )}
                {completedCycles > 0 && (
                  <div className="text-[8px] text-primary font-mono tracking-widest uppercase">
                    Completed Cycles: {completedCycles}
                  </div>
                )}
                
                {/* Next Selection Suggestion for Unlocked State */}
                {recommendedProduct && (
                  <div className="mt-3 p-3 rounded-xl bg-card border border-border/40 flex items-center gap-3">
                    <Link href={`/shop/${recommendedProduct.id}`} className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/60 shrink-0 hover:border-primary/50 transition-colors">
                      <img
                        src={recommendedProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                        alt={recommendedProduct.name}
                        className="object-cover w-full h-full"
                      />
                    </Link>
                    <div className="flex-grow min-w-0">
                      <Link href={`/shop/${recommendedProduct.id}`}>
                        <h4 className="text-[10px] font-bold text-foreground uppercase truncate hover:text-primary transition-colors">{recommendedProduct.name}</h4>
                      </Link>
                      <p className="text-[9px] font-mono text-muted-foreground">₹{parseFloat(recommendedProduct.price).toFixed(0)}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          id: recommendedProduct.id,
                          name: recommendedProduct.name,
                          price: parseFloat(recommendedProduct.price),
                          image: recommendedProduct.images?.[0] || "",
                          size: recommendedProduct.sizes?.[0] || "M",
                          color: recommendedProduct.colors?.[0] || "",
                          quantity: 1,
                        });
                        showToast.success(`Added ${recommendedProduct.name} to cart!`);
                      }}
                      size="sm"
                      className="bg-muted border border-border hover:bg-primary hover:text-primary-foreground text-foreground font-black text-[9px] h-7 rounded-lg px-3 uppercase shrink-0 transition-all duration-300"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                  Support the archive. Secure 7 purchase references to unlock your members-only <span className="text-primary font-bold">10% Privilege Discount</span>.
                </p>
                {completedCycles > 0 && (
                  <div className="text-[8px] text-primary font-mono tracking-widest uppercase">
                    Completed Cycles: {completedCycles}
                  </div>
                )}
                <div className="text-[9px] font-black text-foreground uppercase tracking-wider font-mono">
                  Standing: <span className="text-primary font-bold">{stamps} / 7 References</span>
                </div>
                <div className="w-full h-1 bg-secondary border border-border/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(stamps / totalSlots) * 100}%` }}
                  />
                </div>

                {/* Next Selection Recommendation Card */}
                {recommendedProduct && (
                  <div className="mt-3 p-3 rounded-xl bg-card border border-border/40 flex items-center gap-3">
                    <Link href={`/shop/${recommendedProduct.id}`} className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/60 shrink-0 hover:border-primary/50 transition-colors">
                      <img
                        src={recommendedProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                        alt={recommendedProduct.name}
                        className="object-cover w-full h-full"
                      />
                    </Link>
                    <div className="flex-grow min-w-0">
                      <Link href={`/shop/${recommendedProduct.id}`}>
                        <h4 className="text-[10px] font-bold text-foreground uppercase truncate hover:text-primary transition-colors">{recommendedProduct.name}</h4>
                      </Link>
                      <p className="text-[9px] font-mono text-muted-foreground">₹{parseFloat(recommendedProduct.price).toFixed(0)}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          id: recommendedProduct.id,
                          name: recommendedProduct.name,
                          price: parseFloat(recommendedProduct.price),
                          image: recommendedProduct.images?.[0] || "",
                          size: recommendedProduct.sizes?.[0] || "M",
                          color: recommendedProduct.colors?.[0] || "",
                          quantity: 1,
                        });
                        showToast.success(`Added ${recommendedProduct.name} to cart!`);
                      }}
                      size="sm"
                      className="bg-muted border border-border hover:bg-primary hover:text-primary-foreground text-foreground font-black text-[9px] h-7 rounded-lg px-3 uppercase shrink-0 transition-all duration-300"
                    >
                      Add
                    </Button>
                  </div>
                )}

                {hasItemsInCart && (
                  <div className="pt-1">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-10 px-5 text-xs rounded-xl shadow-md uppercase tracking-wider">
                      <Link href="/checkout" className="flex items-center gap-1.5">
                        Checkout <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimalist Glassmorphic Archive Card Block (Wider Credit Card Aspect) */}
        <div className="w-full md:w-[350px] shrink-0 relative z-10" style={{ perspective: 1000 }}>
          <motion.div 
            whileHover={{
              scale: 1.03,
              rotateY: 6,
              rotateX: -4,
              boxShadow: isRewardReady
                ? "0px 20px 45px rgba(249, 115, 22, 0.25), 0 0 25px rgba(249, 115, 22, 0.15)"
                : "0px 20px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(255, 255, 255, 0.05)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className={cn(
              "w-full aspect-[1.8/1] rounded-2xl backdrop-blur-md border p-5 flex flex-col justify-between relative overflow-hidden shadow-premium transition-all duration-500 group/card",
              isRewardReady 
                ? "bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-950 border-primary/60" 
                : "bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900/95 border-neutral-800/80 hover:border-primary/40"
            )}
          >
            {/* Glossy light-sweep sheen on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            {/* Top header details */}
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-muted-foreground/80 uppercase tracking-widest">VIP PASS // CYCLE 0{currentCycle}</span>
                <span className="text-xs font-black tracking-wide text-foreground uppercase mt-1">{session.user?.name || "FOX MEMBER"}</span>
              </div>
              <Award className={cn("w-4.5 h-4.5 transition-colors", isRewardReady ? "text-primary animate-pulse" : "text-muted-foreground/45")} />
            </div>

            {/* Chip & Contactless wave row */}
            <div className="flex justify-between items-center my-1 z-10">
              {/* Gold EMV Chip */}
              <div className="w-7 h-5 rounded-[4px] bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-[1px] shadow-md relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
                <div className="h-full w-full rounded-[3px] border border-amber-800/10 grid grid-cols-3 grid-rows-2 gap-[1px]">
                  <div className="border-r border-b border-amber-900/20" />
                  <div className="border-r border-b border-amber-900/20" />
                  <div className="border-b border-amber-900/20" />
                  <div className="border-r border-amber-900/20" />
                  <div className="border-r border-amber-900/20" />
                  <div />
                </div>
              </div>

              {/* Contactless waves symbol in gold */}
              <svg className="w-4 h-4 text-amber-500/40 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 0-9.5m-3 12a9 9 0 0 0 0-14.5m-3 17a12 12 0 0 0 0-19.5" />
              </svg>
            </div>

            {/* Timeline slots tracker */}
            <div className="grid grid-cols-7 gap-1.5 py-1.5 px-2 rounded-xl bg-black/40 border border-white/5 shadow-inner z-10">
              {Array.from({ length: totalSlots }).map((_, i) => {
                const isStamped = i < stamps;
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-4 rounded-md flex items-center justify-center text-[8px] font-mono font-black transition-all duration-500",
                      isStamped
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-[0_0_8px_rgba(249,115,22,0.4)] scale-105"
                        : "bg-neutral-900 border border-white/5 text-neutral-600"
                    )}
                  >
                    {isStamped ? "✓" : i + 1}
                  </div>
                );
              })}
            </div>

            {/* Card bottom details */}
            <div className="flex justify-between items-end z-10">
              <div className="flex flex-col">
                <span className="text-[6px] font-mono text-muted-foreground/60 tracking-wider">REF // {currentCycle}-{stamps}-VIP</span>
                <span className="text-[7px] font-black text-primary uppercase tracking-widest mt-0.5">
                  {isRewardReady ? "PRIVILEGE ACTIVE" : "PROGRESSING"}
                </span>
              </div>
              <span className="font-sans font-black tracking-[0.18em] text-[9px] text-foreground uppercase select-none">
                FOX <span className="text-primary">FALCON</span>
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
