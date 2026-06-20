"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Loader2, Package, Heart, Sparkles, X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { showToast } from "@/lib/toast";
import dynamic from "next/dynamic";

// Dynamic imports to save bundle size
const SimilarProductsDialog = dynamic(
  () => import("./SimilarProductsDialog").then((m) => m.SimilarProductsDialog),
  { ssr: false }
);

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

interface ShopListingProps {
  initialProducts: any[];
}

export function ShopListing({ initialProducts }: ShopListingProps) {
  const wishlist = useWishlist();
  const cart = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(30);
  const [similarProduct, setSimilarProduct] = useState<any | null>(null);
  
  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [qvImageIdx, setQvImageIdx] = useState(0);

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Synchronize category query parameters if loaded initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      const searchParam = params.get("search");
      if (catParam) {
        setSelectedCategory(catParam.charAt(0).toUpperCase() + catParam.slice(1));
      }
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes?.[0] || "");
      setSelectedColor(quickViewProduct.colors?.[0] || "");
      setQuantity(1);
      setQvImageIdx(0);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (typeof window !== "undefined" && initialProducts.length > 0) {
      try {
        const stored = localStorage.getItem("recently_viewed");
        if (stored) {
          const ids: string[] = JSON.parse(stored);
          const matched = ids
            .map(id => initialProducts.find(p => p.id === id))
            .filter(Boolean)
            .filter(p => !p.name?.startsWith("[DELETED]"));
          setRecentlyViewed(matched);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [initialProducts]);

  // Reset pagination on filter or sort change
  useEffect(() => {
    setVisibleCount(30);
  }, [selectedCategory, searchQuery, sortBy]);

  // Dynamically extract categories from loaded products to avoid mismatching
  const dynamicCategories = ["All", ...Array.from(new Set(initialProducts.map(p => p.category?.name).filter(Boolean)))];

  // Filter & sort
  const filteredProducts = initialProducts
    .filter((p) => {
      const matchCategory = selectedCategory === "All" ||
        p.category?.name?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query ||
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.name?.toLowerCase().includes(query);

      // hide soft-deleted products
      const notDeleted = !p.name?.startsWith("[DELETED]");
      return matchCategory && matchSearch && notDeleted;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 bg-background text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase">THE SHOP</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            {`${filteredProducts.length} premium pieces in collection`}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search catalog..."
              className="pl-10 h-11 bg-muted/30 border-border focus-visible:ring-primary/40 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 font-black uppercase tracking-wider text-xs border-2 gap-2 rounded-xl active-scale">
                Sort: {SORT_OPTIONS.find(s => s.value === sortBy)?.label} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-card border-border">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`font-bold uppercase tracking-wider text-xs cursor-pointer ${sortBy === opt.value ? "text-primary font-black" : ""}`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Horizontal Pill Strip */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-10 border-b border-border/40 scrollbar-none">
        {dynamicCategories.map((cat: any) => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap active-scale",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-muted/30 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-32 text-center space-y-4">
          <Package className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-lg font-medium">No products found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="text-primary mt-2 font-bold">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const imageSrc = product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
                const isNew = new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
                const isOutOfStock = product.inventory <= 0;
                const isWishlisted = wishlist.isInWishlist(product.id);

                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-500 rounded-2xl flex flex-col gap-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 active-scale-98 pt-0 pb-0">
                      <div className="block relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-muted">
                        <Link href={`/shop/${product.id}`}>
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                          />
                        </Link>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                          {isNew && !isOutOfStock && (
                            <Badge className="bg-secondary text-secondary-foreground font-black px-2 py-0.5 uppercase tracking-widest text-[8px] border-none shadow-sm">
                              New
                            </Badge>
                          )}
                          {isOutOfStock && (
                            <Badge className="bg-red-500/90 text-white font-black px-2 py-0.5 uppercase tracking-widest text-[8px] border-none shadow-sm">
                              Sold Out
                            </Badge>
                          )}
                          {product.isFeatured && !isOutOfStock && !isNew && (
                            <Badge className="bg-primary/95 text-primary-foreground font-black px-2 py-0.5 uppercase tracking-widest text-[8px] border-none shadow-sm">
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Heart Wishlist Button Overlay */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            wishlist.toggleItem({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: imageSrc
                            });
                          }}
                          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm border border-border/40 flex items-center justify-center text-foreground hover:text-red-500 transition-colors shadow-sm active:scale-90"
                        >
                          <Heart className={cn("w-4 h-4 transition-transform", isWishlisted ? "fill-red-500 text-red-500 scale-110" : "")} />
                        </button>

                        {/* Quick View Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="bg-background text-foreground font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg active-scale"
                          >
                            Quick View
                          </button>
                        </div>

                        {/* SIZES Hover overlay */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-2 text-center text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block select-none pointer-events-none">
                            SIZES: {product.sizes.join("  ")}
                          </div>
                        )}

                        {/* COLORS Hover overlay */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="absolute top-12 left-3 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                            <span className="text-[10px] text-muted-foreground line-through">₹{(product.price * 1.35).toFixed(0)}</span>
                            <span className="text-xs md:text-sm font-black text-primary">₹{product.price.toFixed(0)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            {product.category?.name || "Uncategorized"}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSimilarProduct(product);
                            }}
                            className="text-[9px] font-black text-primary hover:underline uppercase tracking-wider active:scale"
                          >
                            Similar
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-12">
              <Button
                onClick={() => setVisibleCount((prev) => prev + 30)}
                variant="outline"
                className="border-2 font-black uppercase tracking-wider text-xs px-8 h-12 rounded-xl transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary active-scale"
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Similar Products Overlay Dialog - Dynamically Loaded */}
      {similarProduct && (
        <SimilarProductsDialog
          isOpen={!!similarProduct}
          onClose={() => setSimilarProduct(null)}
          similarProduct={similarProduct}
          products={initialProducts}
        />
      )}

      {/* Quick View Modal */}
      <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
        <DialogContent className="sm:max-w-[700px] bg-background border-border text-foreground rounded-3xl p-6">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">
              Quick View
            </DialogTitle>
          </DialogHeader>

          {quickViewProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Product Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border">
                  <Image
                    src={quickViewProduct.images?.[qvImageIdx] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"}
                    alt={quickViewProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover"
                  />
                </div>
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {quickViewProduct.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setQvImageIdx(idx)}
                        className={cn(
                          "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                          qvImageIdx === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                      {quickViewProduct.category?.name || "Premium streetwear"}
                    </Badge>
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{quickViewProduct.name}</h2>
                    <p className="text-xl font-black text-primary font-mono mt-1 font-semibold">₹{quickViewProduct.price.toFixed(2)}</p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {quickViewProduct.description}
                  </p>

                  <div className="border-t border-border/40 pt-4 space-y-4">
                    {/* Sizes Selection */}
                    {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Size</label>
                        <div className="flex flex-wrap gap-2">
                          {quickViewProduct.sizes.map((size: string) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "w-9 h-9 rounded-xl border-2 flex items-center justify-center font-black text-[10px] transition-all active-scale",
                                selectedSize === size
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-muted-foreground hover:border-primary/50"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors Selection */}
                    {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Select Color: <span className="text-primary font-bold lowercase">{selectedColor}</span></label>
                        <div className="flex flex-wrap gap-2">
                          {quickViewProduct.colors.map((color: string) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={cn(
                                "w-7 h-7 rounded-full border-2 transition-all active-scale flex items-center justify-center relative shadow-sm hover:scale-105",
                                selectedColor === color ? "border-primary scale-110" : "border-border/60"
                              )}
                              title={color}
                            >
                              <span
                                className="w-5.5 h-5.5 rounded-full border border-black/10"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity & CTAs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-xl h-11 bg-muted/20 shrink-0">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 hover:text-primary transition-colors active-scale"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs font-mono">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 hover:text-primary transition-colors active-scale"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <Button
                      onClick={() => {
                        const inCart = cart.items.some(
                          (item) => item.id === quickViewProduct.id && item.size === selectedSize && item.color === selectedColor
                        );
                        if (inCart) {
                          cart.removeItem(quickViewProduct.id);
                          showToast.success("Removed from bag");
                        } else {
                          cart.addItem({
                            id: quickViewProduct.id,
                            name: quickViewProduct.name,
                            price: quickViewProduct.price,
                            image: quickViewProduct.images?.[0] || "",
                            quantity: quantity,
                            size: selectedSize || undefined,
                            color: selectedColor || undefined,
                          });
                          showToast.success("Added to bag!");
                        }
                      }}
                      className="flex-1 h-11 text-xs font-black uppercase tracking-wider rounded-xl active-scale bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {cart.items.some((item) => item.id === quickViewProduct.id && item.size === selectedSize && item.color === selectedColor)
                        ? "Remove From Bag"
                        : "Add To Bag"}
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      const inCart = cart.items.some(
                        (item) => item.id === quickViewProduct.id && item.size === selectedSize && item.color === selectedColor
                      );
                      if (!inCart) {
                        cart.addItem({
                          id: quickViewProduct.id,
                          name: quickViewProduct.name,
                          price: quickViewProduct.price,
                          image: quickViewProduct.images?.[0] || "",
                          quantity: quantity,
                          size: selectedSize || undefined,
                          color: selectedColor || undefined,
                        });
                      }
                      window.location.href = "/checkout";
                    }}
                    className="w-full h-11 text-xs font-black uppercase tracking-wider rounded-xl active-scale bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border border-black/10 dark:border-white/10"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <div className="mt-24 border-t border-border/40 pt-16">
          <div className="flex flex-col mb-8">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1 font-sans">Based on your browsing</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((item) => {
              const itemImg = item.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
              return (
                <Card key={item.id} className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-300 rounded-2xl flex flex-col p-0 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <Link href={`/shop/${item.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-muted">
                    <Image
                      src={itemImg}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 250px"
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </Link>
                  <div className="p-4 space-y-1">
                    <Link href={`/shop/${item.id}`} className="block text-xs md:text-sm font-bold uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        {item.category?.name || "Clothing"}
                      </span>
                      <span className="text-xs md:text-sm font-black text-primary font-mono font-semibold">₹{item.price.toFixed(0)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
