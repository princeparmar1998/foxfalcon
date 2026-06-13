"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: any) => {
    addItem({ ...item, quantity: 1, size: "M" });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="container px-6 mx-auto pt-40 pb-20 text-center space-y-6 bg-background">
        <div className="w-20 h-20 bg-muted/30 border border-border rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase">YOUR WISHLIST IS EMPTY</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto uppercase tracking-wide leading-relaxed font-bold">
          Save your favorite items here to keep an eye on them. Explore our shop and start adding items you love.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 font-bold px-10 h-14 mt-4 rounded-xl active-scale">
          <Link href="/shop">Start Exploring</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 bg-background text-foreground">
      <h1 className="text-5xl font-black tracking-tighter mb-12 uppercase">MY WISHLIST</h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/60 transition-all duration-300 p-3 pb-4 rounded-2xl flex flex-col gap-0 shadow-md hover:shadow-lg dark:shadow-black/40 ring-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted border border-border/40 rounded-xl">
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      onClick={() => removeItem(item.id)}
                      className="rounded-full w-9 h-9 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity active-scale"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 px-1 space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs md:text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-mono font-black text-primary">₹{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 h-9 text-[10px] font-black uppercase tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg active-scale"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </Button>
                    <Button asChild variant="outline" size="icon" className="h-9 w-9 border-2 rounded-lg active-scale">
                      <Link href={`/shop/${item.id}`}><ArrowRight className="w-3.5 h-3.5" /></Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
