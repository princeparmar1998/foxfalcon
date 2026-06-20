"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SimilarProductsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  similarProduct: any;
  products: any[];
}

export function SimilarProductsDialog({
  isOpen,
  onClose,
  similarProduct,
  products,
}: SimilarProductsDialogProps) {
  if (!similarProduct) return null;

  const displaySimilar = products
    .filter(p => p.categoryId === similarProduct.categoryId && p.id !== similarProduct.id)
    .slice(0, 4);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-background border-border text-foreground rounded-2xl p-6">
        <DialogHeader className="pb-4 border-b border-border/40">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> SIMILAR TO {similarProduct.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            Check out other styles in {similarProduct.category?.name || "this category"}
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
                      onClick={onClose}
                      className="block relative aspect-[4/5] overflow-hidden rounded-t-xl bg-muted"
                    >
                      <Image
                        src={itemImg}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 250px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                      />
                    </Link>
                    <div className="p-3 space-y-1">
                      <Link
                        href={`/shop/${item.id}`}
                        onClick={onClose}
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
            onClick={onClose}
            className="border-2 font-black uppercase tracking-wider text-xs rounded-xl h-10 px-6"
          >
            Close Window
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
