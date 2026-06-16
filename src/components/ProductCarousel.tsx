"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  products: any[];
  type: "standard" | "new-arrivals";
}

export function ProductCarousel({ products, type }: ProductCarouselProps) {
  const wishlist = useWishlist();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [similarProduct, setSimilarProduct] = useState<any | null>(null);

  // Auto scroll effect
  useEffect(() => {
    if (isHovered || products.length === 0) return;

    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;

      // If we are at the end, scroll back to start
      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll by one card width plus gap
        const firstCard = container.firstElementChild as HTMLElement;
        const cardWidth = firstCard?.clientWidth || 280;
        const gap = type === "new-arrivals" ? 16 : 24;
        container.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      }
    }, 4500); // Shift every 4.5 seconds

    return () => clearInterval(interval);
  }, [isHovered, products, type]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild as HTMLElement;
    const cardWidth = firstCard?.clientWidth || 280;
    const gap = type === "new-arrivals" ? 16 : 24;
    container.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild as HTMLElement;
    const cardWidth = firstCard?.clientWidth || 280;
    const gap = type === "new-arrivals" ? 16 : 24;

    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 15) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  // Similar items query
  const displaySimilar = similarProduct
    ? products
      .filter(p => p.categoryId === similarProduct.categoryId && p.id !== similarProduct.id)
      .slice(0, 4)
    : [];

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className={cn(
          "flex overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar",
          type === "new-arrivals" ? "gap-4" : "gap-6"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => {
          const imageSrc = product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
          const isWishlisted = wishlist.isInWishlist(product.id);
          const price = typeof product.price === "number" ? product.price : parseFloat(product.price || "0");
          const originalPrice = price * 1.35;

          return (
            <div
              key={product.id}
              className={cn(
                "snap-start",
                type === "new-arrivals"
                  ? "min-w-[calc(50%-8px)] md:min-w-[calc(33.33%-12px)] lg:min-w-[calc(25%-12px)]"
                  : "min-w-[75vw] sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[22vw]"
              )}
            >
              <Card className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-500 rounded-2xl flex flex-col gap-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 pt-0 pb-0 active-scale-98">
                <div className="block relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-muted">
                  <Link href={`/shop/${product.id}`} className="block w-full h-full">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                      unoptimized
                    />
                  </Link>

                  {/* Heart Button overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      wishlist.toggleItem({
                        id: product.id,
                        name: product.name,
                        price: price,
                        image: imageSrc
                      });
                    }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm border border-border/40 flex items-center justify-center text-foreground hover:text-red-500 transition-colors shadow-sm active:scale-90"
                  >
                    <Heart className={cn("w-4 h-4 transition-transform", isWishlisted ? "fill-red-500 text-red-500 scale-110" : "")} />
                  </button>

                  {/* SIZES Hover overlay */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-2 text-center text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block select-none pointer-events-none">
                      SIZES: {product.sizes.join("  ")}
                    </div>
                  )}

                  {/* COLORS Hover overlay */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {product.colors.slice(0, 3).map((col: string) => (
                        <span
                          key={col}
                          className="w-2.5 h-2.5 rounded-full border border-white/60 shadow-sm"
                          style={{ backgroundColor: col.toLowerCase() }}
                          title={col}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex justify-between items-baseline gap-3">
                    <Link href={`/shop/${product.id}`} className="block flex-1 min-w-0">
                      <h3 className="text-xs md:text-sm font-bold uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      <span className="text-[10px] text-muted-foreground line-through">₹{originalPrice.toFixed(0)}</span>
                      <span className="text-xs md:text-sm font-black text-primary">₹{price.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      {product.category?.name || "Uncategorized"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSimilarProduct(product);
                      }}
                      className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider active:scale"
                    >
                      Similar
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Prev Button Overlay */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-[40%] -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-md active:scale-95 flex items-center justify-center border border-primary/20"
        aria-label="Previous item"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next Button Overlay */}
      <button
        onClick={handleNext}
        className="absolute right-3 top-[40%] -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-md active:scale-95 flex items-center justify-center border border-primary/20"
        aria-label="Next item"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Similar Products Dialog */}
      <Dialog open={!!similarProduct} onOpenChange={(open) => !open && setSimilarProduct(null)}>
        <DialogContent className="sm:max-w-[550px] bg-background border-border text-foreground rounded-2xl p-6">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> SIMILAR TO {similarProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Check out other styles in {similarProduct?.category?.name || "this category"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {displaySimilar.length === 0 ? (
              <p className="text-center py-8 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                No matching similar items found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {displaySimilar.map((item) => {
                  const itemImg = item.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
                  const itemPrice = typeof item.price === "number" ? item.price : parseFloat(item.price || "0");
                  return (
                    <Card key={item.id} className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-300 rounded-xl flex flex-col p-0">
                      <Link
                        href={`/shop/${item.id}`}
                        onClick={() => setSimilarProduct(null)}
                        className="block relative aspect-[4/5] overflow-hidden rounded-t-xl bg-muted"
                      >
                        <Image
                          src={itemImg}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                          unoptimized
                        />
                      </Link>
                      <div className="p-3 space-y-1">
                        <Link
                          href={`/shop/${item.id}`}
                          onClick={() => setSimilarProduct(null)}
                          className="block text-xs font-bold uppercase tracking-tight group-hover:text-primary transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {item.category?.name || "Clothing"}
                          </span>
                          <span className="text-xs font-black text-primary font-mono">₹{itemPrice.toFixed(0)}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setSimilarProduct(null)}
              className="border-2 font-black uppercase tracking-wider text-xs rounded-xl h-10 px-6"
            >
              Close Window
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
