"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, ChevronDown, Heart, ShoppingBag, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

const CATEGORIES = ["All", "T-Shirts", "Hoodies", "Pants", "Caps", "Accessories", "Jackets"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const { addItem } = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        showToast.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Dynamically extract categories from loaded products to avoid mismatching
  const dynamicCategories = ["All", ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)))];

  // Filter & sort
  const filteredProducts = products
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
      if (sortBy === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleQuickAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || "",
      size: product.sizes?.[0] || "M",
      color: product.colors?.[0] || "",
      quantity: 1,
    });
    showToast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container px-6 mx-auto pt-32 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter">THE SHOP</h1>
          <p className="text-muted-foreground">
            {loading ? "Loading products..." : `${filteredProducts.length} premium items available`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 h-11 bg-muted/50 border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 font-bold border-2 gap-2">
                <Filter className="w-4 h-4" /> {selectedCategory} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-60 overflow-y-auto">
              {dynamicCategories.map((cat: any) => (
                <DropdownMenuItem 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-medium capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "text-primary font-bold" : ""}`}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 font-bold border-2 gap-2">
                {SORT_OPTIONS.find(s => s.value === sortBy)?.label} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem 
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`font-medium ${sortBy === opt.value ? "text-primary font-bold" : ""}`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-32 flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-bold">Loading products from database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-32 text-center space-y-4">
          <Package className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground text-lg font-medium">No products found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="text-primary mt-2 font-bold">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const imageSrc = product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
              const isNew = new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
              const isOutOfStock = product.inventory <= 0;

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group relative overflow-hidden bg-transparent border-none shadow-none rounded-2xl">
                    <Link href={`/shop/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
                      <Image 
                        src={imageSrc} 
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      {isNew && !isOutOfStock && (
                        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-black px-2.5 py-0.5 uppercase tracking-widest text-[9px]">
                          New
                        </Badge>
                      )}
                      {isOutOfStock && (
                        <Badge className="absolute top-3 left-3 bg-red-500/90 text-white font-black px-2.5 py-0.5 uppercase tracking-widest text-[9px]">
                          Sold Out
                        </Badge>
                      )}
                      {product.isFeatured && !isOutOfStock && !isNew && (
                        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground font-black px-2.5 py-0.5 uppercase tracking-widest text-[9px]">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className={cn(
                            "rounded-full w-10 h-10 shadow-xl hover:scale-110 transition-transform",
                            wishlist.isInWishlist(product.id) ? "bg-red-500 text-white hover:bg-red-600 border-none" : ""
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            wishlist.toggleItem({
                              id: product.id,
                              name: product.name,
                              price: parseFloat(product.price),
                              image: imageSrc
                            });
                          }}
                        >
                          <Heart className={cn("w-4.5 h-4.5", wishlist.isInWishlist(product.id) ? "fill-white text-white" : "")} />
                        </Button>
                        <Button 
                          size="icon" 
                          className="rounded-full w-10 h-10 shadow-xl hover:scale-110 transition-transform bg-primary"
                          disabled={isOutOfStock}
                        >
                          <ShoppingBag className="w-4.5 h-4.5" />
                        </Button>
                      </div>
                    </Link>
                    
                    <div className="pt-3 space-y-0.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <Link href={`/shop/${product.id}`} className="block flex-1 min-w-0">
                          <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="text-sm font-black text-primary shrink-0">${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
