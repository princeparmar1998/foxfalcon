"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  ChevronLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  Plus,
  Minus,
  Loader2,
  Ruler
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { showToast } from "@/lib/toast";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const isAddedToCart = cart.items.some(
    (item) => product && item.id === product.id && item.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showToast.error("Please select a size first");
      return;
    }

    if (isAddedToCart) {
      cart.removeItem(product.id);
      return;
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
      quantity: quantity,
      size: selectedSize || undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-40 flex flex-col items-center justify-center gap-4 text-muted-foreground bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <span className="font-bold uppercase tracking-widest text-xs">Loading Garment Details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-6 mx-auto pt-40 pb-20 text-center space-y-6 bg-background">
        <h1 className="text-4xl font-black tracking-tighter">GARMENT NOT FOUND</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The streetwear product you are looking for does not exist or has been removed from our inventory.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 font-bold px-10 h-14 mt-4">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"];

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 bg-background text-foreground">
      <Link 
        href="/shop" 
        className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border"
          >
            <Image 
              src={images[selectedImage]} 
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </motion.div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                    selectedImage === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${index}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-secondary border-secondary/30 uppercase tracking-widest font-black text-[10px]">
                {product.category?.name || "Premium streetwear"}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star className="w-4 h-4 fill-primary text-primary" />
                4.8 <span className="text-muted-foreground font-medium">(42 Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight uppercase">{product.name}</h1>
            <p className="text-3xl font-black text-primary">${parseFloat(product.price).toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed italic">
            {product.description}
          </p>

          <Separator className="bg-border" />

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Size</label>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-14 h-14 rounded-xl border-2 flex items-center justify-center font-bold transition-all",
                      selectedSize === size 
                        ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border-2 border-border rounded-xl h-14 bg-muted/30">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 hover:text-primary transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button 
              onClick={handleAddToCart}
              className={cn(
                "flex-1 h-14 text-lg font-black group transition-all duration-300",
                isAddedToCart 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" /> 
              {isAddedToCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => wishlist.toggleItem({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: images[0]
              })}
              className={cn(
                "h-14 w-14 rounded-xl border-2 transition-colors",
                wishlist.isInWishlist(product.id) ? "border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20" : ""
              )}
            >
              <Heart className={cn("w-6 h-6", wishlist.isInWishlist(product.id) ? "fill-red-500 text-red-500" : "")} />
            </Button>
          </div>

          {/* Shipping Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-secondary" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold">Free Shipping</p>
                <p className="text-[10px] text-muted-foreground">On orders over $99</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw className="w-5 h-5 text-secondary" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold">30 Days Return</p>
                <p className="text-[10px] text-muted-foreground">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold">Secure Payment</p>
                <p className="text-[10px] text-muted-foreground">100% Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-bold text-base bg-transparent border-none">Details</TabsTrigger>
            <TabsTrigger value="material" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-bold text-base bg-transparent border-none">Material & Care</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-bold text-base bg-transparent border-none">Reviews (42)</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-8 text-muted-foreground leading-relaxed">
            Designed for the ultimate streetwear enthusiast, the {product.name} offers a premium silhouette that's both comfortable and cutting-edge. The premium composition and extra room in the body create a relaxed look without compromising on quality.
          </TabsContent>
          <TabsContent value="material" className="pt-8 text-muted-foreground leading-relaxed">
            <ul className="list-disc list-inside space-y-2">
              <li>100% Combed Cotton</li>
              <li>240 GSM Heavyweight Premium Fabric</li>
              <li>Bio-washed and Pre-shrunk</li>
              <li>Wash cold, hang dry for best results</li>
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="pt-8">
            <p className="text-muted-foreground">Premium customer reviews will appear here soon.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Size Guide Dialog */}
      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Garment Size Guide</DialogTitle>
            <DialogDescription>
              Refer to our measurement table to find your perfect street fit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-black uppercase tracking-widest text-xs">Size</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-xs">Chest (Inches)</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-xs">Length (Inches)</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-xs">Shoulder (Inches)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { size: "XS", chest: "38", length: "26", shoulder: "17" },
                  { size: "S", chest: "40", length: "27", shoulder: "18" },
                  { size: "M", chest: "42", length: "28", shoulder: "19" },
                  { size: "L", chest: "44", length: "29", shoulder: "20" },
                  { size: "XL", chest: "46", length: "30", shoulder: "21" },
                  { size: "XXL", chest: "48", length: "31", shoulder: "22" },
                  { size: "3XL", chest: "50", length: "32", shoulder: "23" },
                ].map((row) => (
                  <TableRow key={row.size} className="border-border hover:bg-muted/30">
                    <TableCell className="font-black text-primary">{row.size}</TableCell>
                    <TableCell className="font-bold">{row.chest}"</TableCell>
                    <TableCell className="font-bold">{row.length}"</TableCell>
                    <TableCell className="font-bold">{row.shoulder}"</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-[10px] text-muted-foreground mt-4 italic">
              * Measurements are approximate. Our garments are pre-shrunk for the optimal oversized boxy fit.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function for class merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
