"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (item: any) => {
    addItem({ ...item, quantity: 1 });
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="container px-6 mx-auto pt-40 pb-20 text-center space-y-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter">WISHLIST IS EMPTY</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Save your favorite items here to keep an eye on them. Explore our shop and start adding!
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 font-bold px-10 h-14 mt-4">
          <Link href="/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto pt-32 pb-20">
      <h1 className="text-5xl font-black tracking-tighter mb-12">MY WISHLIST</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/30 transition-all duration-500 rounded-2xl">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 right-4">
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      onClick={() => removeItem(item.id)}
                      className="rounded-full w-10 h-10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-primary font-black">${item.price}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 bg-primary hover:bg-primary/90 font-bold"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                    <Button asChild variant="outline" size="icon" className="border-2">
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
