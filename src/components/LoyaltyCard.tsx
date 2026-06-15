"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { userApi, productsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, ShoppingBag, Loader2, ArrowRight, Check } from "lucide-react";
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

  // Guest Teaser View
  if (!session) {
    return (
      <div className={cn("container px-6 mx-auto max-w-4xl py-6", className)}>
        <div className="relative rounded-3xl overflow-hidden bg-background border border-border/40 p-8 md:p-12 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

          <div className="space-y-4 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3" /> Exclusive VIP Circle
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase leading-none font-serif">
              THE ARCHIVE CLUB
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Unlock members-only drops, seasonal priority allocations, and exclusive streetwear archives. Collect 7 purchase references to achieve Elite status.
            </p>
          </div>

          <div className="w-full md:w-80 shrink-0 relative z-10">
            {/* Minimal loyalty card preview as teaser */}
            <div className="w-full aspect-[1.6/1] rounded-2xl bg-secondary border border-border/60 p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-sm">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">Members Only Access</p>
                <Button asChild size="sm" className="bg-foreground hover:bg-foreground/90 text-background font-medium rounded-button shadow-sm px-6">
                  <Link href="/login">Join Us</Link>
                </Button>
              </div>

              <div className="flex justify-between items-start opacity-20">
                <span className="text-[9px] font-mono text-foreground uppercase tracking-widest">VIP PASS // LOCK STATUS</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 opacity-20">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-1 rounded-full bg-foreground" />
                ))}
              </div>
              <div className="h-1.5 w-1/3 bg-foreground/20 rounded opacity-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container px-6 mx-auto max-w-4xl py-6", className)}>
      <div className="relative rounded-3xl overflow-hidden bg-background border border-border/40 p-8 md:p-12 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

        {/* Text Details Section */}
        <div className="space-y-5 max-w-md relative z-10 w-full md:w-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium tracking-[0.2em] uppercase">
            <Gift className="w-3.5 h-3.5" /> ARCHIVE MEMBERSHIP
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase leading-none font-serif">
            {isRewardReady ? "VIP Privileges Unlocked" : "Your Archive Status"}
          </h2>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Synchronizing profile status...</span>
              </div>
            ) : isRewardReady ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {hasItemsInCart ? (
                  <>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Congratulations! You have completed your credentials (Cycle {currentCycle}). Your <span className="text-primary font-bold">10% Archive Privilege Discount</span> is ready. Checkout now to apply your benefits.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-6 rounded-button shadow-sm">
                      <Link href="/checkout" className="flex items-center gap-2">
                        Checkout with Privilege <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Congratulations! You have completed your credentials (Cycle {currentCycle}). Your <span className="text-primary font-bold">10% Archive Privilege Discount</span> has been unlocked and will apply automatically at checkout.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium h-11 px-6 rounded-button shadow-sm">
                      <Link href="/shop" className="flex items-center gap-2">
                        Explore Catalog <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </>
                )}
                {completedCycles > 0 && (
                  <div className="text-[10px] text-primary font-mono tracking-wider pt-1 uppercase">
                    🎉 Completed VIP Cycles: {completedCycles}
                  </div>
                )}
                
                {/* Next Selection Suggestion for Unlocked State */}
                {recommendedProduct && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-secondary border border-border/40 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-medium tracking-[0.15em] text-primary uppercase">
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                      <span>Suggested Archive Piece</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/shop/${recommendedProduct.id}`} className="relative w-12 h-12 rounded-xl overflow-hidden border border-border/60 shrink-0 hover:border-primary/50 transition-colors">
                        <img
                          src={recommendedProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                          alt={recommendedProduct.name}
                          className="object-cover w-full h-full"
                        />
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link href={`/shop/${recommendedProduct.id}`}>
                          <h4 className="text-xs font-bold text-foreground uppercase truncate hover:text-primary transition-colors">{recommendedProduct.name}</h4>
                        </Link>
                        <p className="text-[10px] font-mono text-muted-foreground">₹{parseFloat(recommendedProduct.price).toFixed(2)}</p>
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
                        className="bg-background border border-border/60 hover:bg-primary hover:text-primary-foreground text-foreground font-medium text-[10px] h-8 rounded-button px-4 uppercase shrink-0 transition-all duration-300"
                      >
                        Add to Order
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Support the archive and earn standing. Reach 7 purchase references to unlock your exclusive <span className="text-primary font-bold">10% Elite Member Privilege</span> automatically.
                </p>
                {completedCycles > 0 && (
                  <div className="text-[10px] text-primary font-mono tracking-wider uppercase">
                    🎉 Completed VIP Cycles: {completedCycles}
                  </div>
                )}
                <div className="text-[10px] font-medium text-foreground uppercase tracking-[0.15em] font-mono">
                  Cycle {currentCycle} Standing: <span className="text-primary font-bold">{stamps} / 7 References</span>
                </div>
                <div className="w-full h-1.5 bg-secondary border border-border/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(stamps / totalSlots) * 100}%` }}
                  />
                </div>

                {/* Next Selection Recommendation Card */}
                {recommendedProduct && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-secondary border border-border/40 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-medium tracking-[0.15em] text-primary uppercase">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span>Next Suggested Reference</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/shop/${recommendedProduct.id}`} className="relative w-12 h-12 rounded-xl overflow-hidden border border-border/60 shrink-0 hover:border-primary/50 transition-colors">
                        <img
                          src={recommendedProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                          alt={recommendedProduct.name}
                          className="object-cover w-full h-full"
                        />
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link href={`/shop/${recommendedProduct.id}`}>
                          <h4 className="text-xs font-bold text-foreground uppercase truncate hover:text-primary transition-colors">{recommendedProduct.name}</h4>
                        </Link>
                        <p className="text-[10px] font-mono text-muted-foreground">₹{parseFloat(recommendedProduct.price).toFixed(2)}</p>
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
                        className="bg-background border border-border/60 hover:bg-primary hover:text-primary-foreground text-foreground font-medium text-[10px] h-8 rounded-button px-4 uppercase shrink-0 transition-all duration-300"
                      >
                        Add to Order
                      </Button>
                    </div>
                  </div>
                )}

                {hasItemsInCart && (
                  <div className="pt-2">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-6 rounded-button shadow-sm">
                      <Link href="/checkout" className="flex items-center gap-2">
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimalist Archive Card Block */}
        <div className="w-full md:w-80 shrink-0 relative z-10">
          <div className={cn(
            "w-full aspect-[1.6/1] rounded-2xl bg-secondary border p-6 flex flex-col justify-between relative overflow-hidden shadow-sm transition-all duration-500",
            isRewardReady
              ? "border-primary/80"
              : "border-border/60"
          )}>
            {/* Top header details */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-[0.2em]">VIP PASS // CYCLE 0{currentCycle}</span>
                <span className="text-xs font-bold tracking-wider text-foreground uppercase mt-1">{session.user?.name || "FOX MEMBER"}</span>
              </div>
            </div>

            {/* Premium reference timeline tracker */}
            <div className="grid grid-cols-7 gap-2 py-4">
              {Array.from({ length: totalSlots }).map((_, i) => {
                const isStamped = i < stamps;
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      isStamped
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                    )}
                  />
                );
              })}
            </div>

            {/* Card bottom details */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[6px] font-mono text-muted-foreground/60 tracking-wider">SERIAL // {currentCycle}-{stamps}-VIP</span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">
                  {isRewardReady ? "PRIVILEGE ACTIVE" : "PROGRESSING"}
                </span>
              </div>
              <span className="font-sans font-black tracking-[0.18em] text-[10px] text-foreground uppercase select-none">
                FOX <span className="text-primary">FALCON</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
