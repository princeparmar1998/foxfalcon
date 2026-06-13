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
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

          <div className="space-y-4 max-w-lg relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Exclusive VIP Club
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
              DIGITAL LOYALTY CARD
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Earn <span className="text-primary font-bold">₹100 Cashback</span> on your shopping! Every order places one stamp on your VIP card. Collect 7 stamps to unlock your reward instantly.
            </p>
          </div>

          <div className="w-full md:w-80 shrink-0 relative z-10">
            {/* Blurred loyalty card preview as teaser */}
            <div className="w-full aspect-[1.6/1] rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] flex flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-xs font-black tracking-widest text-zinc-300 uppercase">Members Only Area</p>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg active-scale">
                  <Link href="/login">Join Us</Link>
                </Button>
              </div>

              <div className="flex justify-between items-start opacity-20">
                <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">VIP MEMBER //</span>
                <div className="w-10 h-7 rounded-sm bg-zinc-800" />
              </div>
              <div className="grid grid-cols-7 gap-1.5 opacity-20">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded border border-zinc-700 flex items-center justify-center text-[8px] font-bold text-zinc-600">0{i + 1}</div>
                ))}
              </div>
              <div className="h-2 w-1/2 bg-zinc-800 rounded opacity-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("container px-6 mx-auto max-w-4xl py-6", className)}>
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800/80 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

        {/* Text Details Section */}
        <div className="space-y-5 max-w-md relative z-10 w-full md:w-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" /> Falcon Stamp Club
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
            {isRewardReady ? "Cashback Reward Unlocked!" : "Your Loyalty Progress"}
          </h2>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center gap-2 text-zinc-400 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Loading stamp details...</span>
              </div>
            ) : isRewardReady ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {hasItemsInCart ? (
                  <>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Congratulations! You've completed your stamp card (Cycle {currentCycle}). A <span className="text-primary font-black">₹100 Cashback Discount</span> is ready. You have products in your cart! Proceed to checkout now to apply your cashback.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg active-scale">
                      <Link href="/checkout" className="flex items-center gap-2">
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Congratulations! You've completed your stamp card (Cycle {currentCycle}). A <span className="text-primary font-black">₹100 Cashback Discount</span> has been unlocked and will be applied automatically at checkout on your next shopping trip.
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/95 text-white font-bold h-11 px-6 rounded-xl shadow-lg active-scale">
                      <Link href="/shop" className="flex items-center gap-2">
                        Shop Now to Redeem <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </>
                )}
                {completedCycles > 0 && (
                  <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest font-mono pt-1">
                    🎉 Completed Reward Cycles: {completedCycles} (₹{completedCycles * 100} Cashback claimed)
                  </div>
                )}
                
                {/* Next Selection Suggestion for Unlocked State */}
                {recommendedProduct && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-primary uppercase">
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                      <span>Redeem Cashback On This Featured Selection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/shop/${recommendedProduct.id}`} className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 shrink-0 hover:border-primary/50 transition-colors">
                        <img
                          src={recommendedProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                          alt={recommendedProduct.name}
                          className="object-cover w-full h-full animate-fade-in"
                        />
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link href={`/shop/${recommendedProduct.id}`}>
                          <h4 className="text-xs font-black text-white uppercase truncate hover:text-primary transition-colors">{recommendedProduct.name}</h4>
                        </Link>
                        <p className="text-[10px] font-mono text-primary font-bold">₹{parseFloat(recommendedProduct.price).toFixed(2)}</p>
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
                        className="bg-zinc-900 border border-zinc-800 hover:bg-primary hover:text-white text-zinc-300 font-bold text-[10px] h-8 rounded-lg px-3 uppercase shrink-0 transition-all duration-300 active-scale"
                      >
                        Add Selection
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
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Shop and earn stamps! Each order adds 1 stamp. Collect 7 stamps to unlock <span className="text-primary font-black">₹100 Cashback</span> automatically on your next checkout.
                </p>
                {completedCycles > 0 && (
                  <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest font-mono">
                    🎉 Completed Reward Cycles: {completedCycles} (₹{completedCycles * 100} Cashback claimed)
                  </div>
                )}
                <div className="text-xs font-black text-zinc-300 uppercase tracking-widest font-mono">
                  Cycle {currentCycle} Progress: <span className="text-primary">{stamps} / 7 Stamps</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 shadow-glow"
                    style={{ width: `${(stamps / totalSlots) * 100}%` }}
                  />
                </div>

                {/* Next Selection Recommendation Card */}
                {recommendedProduct && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-primary uppercase">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span>Next Suggested Target (Stamp #{stamps + 1})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/shop/${recommendedProduct.id}`} className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 shrink-0 hover:border-primary/50 transition-colors">
                        <img
                          src={recommendedProduct.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                          alt={recommendedProduct.name}
                          className="object-cover w-full h-full animate-fade-in"
                        />
                      </Link>
                      <div className="flex-grow min-w-0">
                        <Link href={`/shop/${recommendedProduct.id}`}>
                          <h4 className="text-xs font-black text-white uppercase truncate hover:text-primary transition-colors">{recommendedProduct.name}</h4>
                        </Link>
                        <p className="text-[10px] font-mono text-primary font-bold">₹{parseFloat(recommendedProduct.price).toFixed(2)}</p>
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
                        className="bg-zinc-900 border border-zinc-800 hover:bg-primary hover:text-white text-zinc-300 font-bold text-[10px] h-8 rounded-lg px-3 uppercase shrink-0 transition-all duration-300 active-scale"
                      >
                        Add Selection
                      </Button>
                    </div>
                  </div>
                )}

                {hasItemsInCart && (
                  <div className="pt-2">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl shadow-lg active-scale">
                      <Link href="/checkout" className="flex items-center gap-2">
                        Proceed to Checkout <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <span className="block text-[10px] text-zinc-500 mt-1.5 uppercase font-mono">Checkout now to lock in stamp #{stamps + 1}!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cyberpunk Loyalty Card Block */}
        <div className="w-full md:w-80 shrink-0 relative z-10">
          <div className={cn(
            "w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-zinc-900/90 via-black/95 to-zinc-950/90 border p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-500",
            isRewardReady
              ? "border-primary/80 shadow-[0_0_30px_rgba(249,115,22,0.25)] animate-pulse"
              : "border-zinc-800/80 group-hover:border-zinc-700"
          )}>

            {/* Glossy Reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

            {/* Top header details */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">VIP PASS // CYCLE-0{currentCycle}</span>
                <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">{session.user?.name || "FOX MEMBER"}</span>
              </div>

              {/* Premium SIM chip micro-emulator */}
              <div className="w-11 h-8 rounded bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-amber-600/20 border border-amber-500/25 relative overflow-hidden flex flex-col justify-between p-1.5 opacity-80 shadow-md">
                <div className="flex justify-between w-full h-1/4">
                  <div className="w-1/4 h-full bg-amber-500/15 rounded-sm" />
                  <div className="w-1/4 h-full bg-amber-500/15 rounded-sm" />
                </div>
                <div className="w-full h-px bg-amber-500/20" />
                <div className="flex justify-between w-full h-1/4">
                  <div className="w-1/4 h-full bg-amber-500/15 rounded-sm" />
                  <div className="w-1/4 h-full bg-amber-500/15 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Grid list of stamps */}
            <div className="grid grid-cols-7 gap-1.5 py-4">
              {Array.from({ length: totalSlots }).map((_, i) => {
                const isStamped = i < stamps;
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square rounded-lg border flex items-center justify-center text-[10px] font-black font-mono transition-all duration-500",
                      isStamped
                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(249,115,22,0.3)] animate-pulse"
                        : "bg-black/40 border-zinc-800/80 text-zinc-600 hover:border-zinc-700/60"
                    )}
                  >
                    {isStamped ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span>0{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Card bottom details */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[6px] font-mono text-zinc-600 tracking-wider">LOYALTY SERIAL // CYCLE-{currentCycle}-STAMP-{stamps}</span>
                <span className="text-[8px] font-black text-primary/80 uppercase tracking-widest flex items-center gap-1">
                  {isRewardReady ? (
                    <>
                      <Sparkles className="w-2.5 h-2.5 animate-spin" />
                      <span>₹100 Cashback Active</span>
                    </>
                  ) : (
                    <span>Stamp Card Active</span>
                  )}
                </span>
              </div>
              <span className="text-[12px] font-bold tracking-tighter text-zinc-500 uppercase">
                FOX<span className="text-primary font-black">FALCON</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
