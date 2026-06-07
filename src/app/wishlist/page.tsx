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
              <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/20 transition-all duration-300 rounded-2xl">
                <div className="relative aspect-[4/5] overflow-hidden bg-black border-b border-border/40">
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
                
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-mono font-black text-primary">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 h-10 text-xs font-black uppercase tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl active-scale"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1.5" /> Add to Cart
                    </Button>
                    <Button asChild variant="outline" size="icon" className="h-10 w-10 border-2 rounded-xl active-scale">
                      <Link href={`/shop/${item.id}`}><ArrowRight className="w-4 h-4" /></Link>
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
