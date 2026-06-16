"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  ChevronLeft, 
  Star, 
  Truck, 
  Plus,
  Minus,
  Loader2,
  Ruler,
  MapPin,
  CheckCircle2,
  XCircle,
  Flame,
  Eye,
  Clock,
  BadgeCheck,
  Package,
  RotateCcw,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { productsApi, reviewsApi } from "@/lib/api";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [galleryHovered, setGalleryHovered] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef<HTMLDivElement>(null);

  // Pincode Checker
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<null | { available: boolean; deliveryDate: string; freeShipping: boolean; cod: boolean }>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // Scarcity indicators (simulated)
  const [scarcityData] = useState(() => ({
    stockLeft: Math.floor(Math.random() * 8) + 2,  // 2-9
    viewersNow: Math.floor(Math.random() * 30) + 10, // 10-39
    sellingFast: Math.random() > 0.4,
  }));

  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await productsApi.getAll();
        setRecommendations(data);
      } catch (err) {
        console.error("Could not fetch recommendations:", err);
      }
    }
    fetchRecommendations();
  }, []);

  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewsApi.getByProductId(params.id);
      setReviews(data);
    } catch (err) {
      console.error("Could not fetch reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingInput < 1 || ratingInput > 5 || !commentInput.trim()) {
      showToast.error("Please provide a valid rating and comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      if (editingReviewId) {
        await reviewsApi.update(product.id, { rating: ratingInput, comment: commentInput });
        showToast.success("Review updated successfully!");
      } else {
        await reviewsApi.create(product.id, { rating: ratingInput, comment: commentInput });
        showToast.success("Review submitted successfully!");
      }
      setCommentInput("");
      setRatingInput(5);
      setEditingReviewId(null);
      setIsReviewFormOpen(false);
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      showToast.error("Failed to submit review", err?.response?.data || err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      setSubmittingReview(true);
      await reviewsApi.delete(product.id);
      showToast.success("Review deleted successfully!");
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast.error("Could not delete review", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await productsApi.getById(params.id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    fetchReviews();
  }, [params.id]);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0 && selectedColor) {
      const idx = product.colors.indexOf(selectedColor);
      const productImages = product.images || [];
      if (idx !== -1 && idx < productImages.length) {
        setSelectedImage(idx);
      }
    }
  }, [selectedColor, product]);

  // Scroll detection for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (addToCartRef.current) {
        const rect = addToCartRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePincodeCheck = () => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      showToast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setCheckingPincode(true);
    setPincodeResult(null);
    // Simulate pincode check
    setTimeout(() => {
      const firstDigit = parseInt(pincode[0]);
      const available = firstDigit >= 1 && firstDigit <= 8;
      const today = new Date();
      const deliveryDays = available ? (firstDigit <= 4 ? 2 : 4) : 0;
      today.setDate(today.getDate() + deliveryDays);
      const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
      setPincodeResult({
        available,
        deliveryDate: available ? today.toLocaleDateString("en-IN", options) : "",
        freeShipping: available && firstDigit <= 4,
        cod: available,
      });
      setCheckingPincode(false);
    }, 1000);
  };

  useEffect(() => {
    if (galleryHovered || !product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 4000); // cycle every 4 seconds

    return () => clearInterval(interval);
  }, [galleryHovered, product]);

  const isAddedToCart = cart.items.some(
    (item) => product && item.id === product.id && item.size === selectedSize && item.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showToast.error("Please select a size first");
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      showToast.error("Please select a color first");
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
      color: selectedColor || undefined,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showToast.error("Please select a size first");
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      showToast.error("Please select a color first");
      return;
    }

    if (!isAddedToCart) {
      cart.addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        quantity: quantity,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
    }

    window.location.href = "/checkout";
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
            onMouseEnter={() => setGalleryHovered(true)}
            onMouseLeave={() => setGalleryHovered(false)}
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border cursor-pointer"
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
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary uppercase tracking-widest font-black text-[10px] px-2.5 py-1">
                {product.category?.name || "Premium streetwear"}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>
                  {reviews.length > 0 
                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                    : "0.0"}
                </span> 
                <span className="text-muted-foreground font-medium font-mono">({reviews.length})</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight uppercase text-foreground">{product.name}</h1>
            <p className="text-3xl font-black text-primary font-mono">₹{parseFloat(product.price).toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Scarcity & Social Proof */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              {scarcityData.stockLeft <= 5 && (
                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-1.5 text-red-500">
                  <Package className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Only {scarcityData.stockLeft} left!</span>
                </div>
              )}
              {scarcityData.sellingFast && (
                <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-1.5 text-orange-500">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black uppercase tracking-wider">Selling Fast</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-muted/50 border border-border/60 rounded-lg px-3 py-1.5 text-muted-foreground">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{scarcityData.viewersNow} people viewing this</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Size</label>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-black uppercase tracking-wider text-primary hover:underline flex items-center gap-1 active-scale"
                >
                  <Ruler className="w-4.5 h-4.5" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-xs transition-all active-scale",
                      selectedSize === size 
                        ? "border-primary bg-primary text-primary-foreground scale-105 shadow-lg shadow-primary/20" 
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Select Color: <span className="text-primary lowercase first-letter:uppercase">{selectedColor}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color: string) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 transition-all active-scale flex items-center justify-center relative shadow-sm hover:scale-105",
                        isSelected ? "border-primary scale-110 ring-2 ring-primary/25" : "border-border/60"
                      )}
                      title={color}
                    >
                      <span
                        className="w-7 h-7 rounded-full border border-black/10"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div ref={addToCartRef} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-border rounded-xl h-14 bg-muted/20">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:text-primary transition-colors active-scale"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 hover:text-primary transition-colors active-scale"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {isAddedToCart ? (
                <Button 
                  asChild
                  className="flex-1 h-14 text-sm font-black uppercase tracking-wider group transition-all duration-300 rounded-xl active-scale bg-green-600 hover:bg-green-700 text-white"
                >
                  <Link href="/cart" className="flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 mr-2" /> View in Cart
                  </Link>
                </Button>
              ) : (
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-14 text-sm font-black uppercase tracking-wider group transition-all duration-300 rounded-xl active-scale bg-primary hover:bg-primary/95 text-primary-foreground"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" /> Add to Bag
                </Button>
              )}
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
                  "h-14 w-14 rounded-xl border-2 transition-colors active-scale",
                  wishlist.isInWishlist(product.id) ? "border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20" : "border-border"
                )}
              >
                <Heart className={cn("w-5 h-5", wishlist.isInWishlist(product.id) ? "fill-red-500 text-red-500" : "")} />
              </Button>
            </div>
            
            <Button 
              onClick={handleBuyNow}
              className="w-full h-14 text-sm font-black uppercase tracking-wider transition-all duration-300 rounded-xl active-scale bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black text-white shadow-xl hover:shadow-2xl border border-black/10 dark:border-white/10"
            >
              Buy Now (Express Checkout)
            </Button>
          </div>

          {/* Pincode Delivery Checker */}
          <div className="rounded-2xl border border-border/70 bg-muted/10 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-foreground">Delivery & COD Checker</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && handlePincodeCheck()}
                placeholder="Enter 6-digit pincode"
                className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono tracking-wider"
                maxLength={6}
              />
              <Button
                onClick={handlePincodeCheck}
                disabled={checkingPincode || pincode.length !== 6}
                className="h-10 px-4 text-xs font-black uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                {checkingPincode ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
              </Button>
            </div>
            <AnimatePresence>
              {pincodeResult && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={cn(
                    "rounded-xl p-3 space-y-2 border",
                    pincodeResult.available 
                      ? "bg-green-500/5 border-green-500/20" 
                      : "bg-red-500/5 border-red-500/20"
                  )}
                >
                  {pincodeResult.available ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <div>
                          <p className="text-xs font-black text-green-600 dark:text-green-400">Delivery Available</p>
                          <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Est. Delivery by <span className="font-black text-foreground">{pincodeResult.deliveryDate}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {pincodeResult.freeShipping && (
                          <span className="flex items-center gap-1 text-[10px] font-black bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg px-2 py-1 uppercase tracking-wider">
                            <Truck className="w-3 h-3" /> Free Shipping
                          </span>
                        )}
                        {pincodeResult.cod && (
                          <span className="flex items-center gap-1 text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg px-2 py-1 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" /> COD Available
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <p className="text-xs font-black text-red-500">Delivery not available for this pincode</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Premium Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-muted/10 p-4 text-center hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-foreground">7-Day Exchange</p>
                <p className="text-[9px] text-muted-foreground font-semibold">Easy & Hassle-free</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-muted/10 p-4 text-center hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-foreground">Free Delivery</p>
                <p className="text-[9px] text-muted-foreground font-semibold">On orders ₹999+</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-muted/10 p-4 text-center hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-foreground">100% Secure</p>
                <p className="text-[9px] text-muted-foreground font-semibold">Encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-xs font-black uppercase tracking-widest bg-transparent border-none">Details</TabsTrigger>
            <TabsTrigger value="material" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-xs font-black uppercase tracking-widest bg-transparent border-none">Material & Care</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-3 text-xs font-black uppercase tracking-widest bg-transparent border-none">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-8 text-muted-foreground leading-relaxed text-sm">
            Designed for the ultimate streetwear enthusiast, the {product.name} offers a premium silhouette that's both comfortable and cutting-edge. The premium composition and extra room in the body create a relaxed look without compromising on quality.
          </TabsContent>
          <TabsContent value="material" className="pt-8 text-muted-foreground leading-relaxed text-sm">
            <ul className="list-disc list-inside space-y-2 uppercase text-[10px] tracking-wider font-bold">
              <li>100% Combed Cotton</li>
              <li>240 GSM Heavyweight Premium Fabric</li>
              <li>Bio-washed and Pre-shrunk</li>
              <li>Wash cold, hang dry for best results</li>
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="pt-8">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Rating Stats Summary */}
              <div className="lg:w-80 space-y-6 shrink-0">
                <Card className="p-6 border border-border bg-card shadow-md dark:shadow-black/40">
                  <div className="text-center space-y-2">
                    <span className="text-5xl font-black text-primary font-mono">
                      {reviews.length > 0 
                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                        : "0.0"}
                    </span>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const avg = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;
                        return (
                          <Star 
                            key={star} 
                            className={cn(
                              "w-5 h-5",
                              star <= Math.round(avg) ? "fill-primary text-primary" : "text-muted-foreground"
                            )} 
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      Based on {reviews.length} customer {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  <div className="mt-6 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter((r) => r.rating === stars).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 text-xs">
                          <span className="w-3 font-bold font-mono">{stars}</span>
                          <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {session ? (
                  !reviews.some((r) => r.userId === session.user?.id) ? (
                    <Button 
                      onClick={() => {
                        setEditingReviewId(null);
                        setRatingInput(5);
                        setCommentInput("");
                        setIsReviewFormOpen(true);
                      }} 
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-12 uppercase tracking-wider text-xs rounded-xl"
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <Card className="p-4 border-border bg-muted/10 flex flex-col gap-3">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider text-center">You have reviewed this garment</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const userReview = reviews.find((r) => r.userId === session.user?.id);
                            if (userReview) {
                              setEditingReviewId(userReview.id);
                              setRatingInput(userReview.rating);
                              setCommentInput(userReview.comment);
                              setIsReviewFormOpen(true);
                            }
                          }} 
                          className="flex-1 border-2 font-bold h-10 text-[10px] uppercase tracking-wider"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={handleReviewDelete}
                          className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/25 font-bold h-10 text-[10px] uppercase tracking-wider"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  )
                ) : (
                  <Card className="p-4 border-border bg-muted/20 text-center space-y-2">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Want to share your feedback?</p>
                    <Button asChild variant="outline" className="w-full border-2 font-bold text-xs uppercase h-10">
                      <Link href="/login">Login to Write Review</Link>
                    </Button>
                  </Card>
                )}
              </div>

              {/* Reviews List */}
              <div className="flex-grow space-y-6">
                {reviews.length === 0 ? (
                  <div className="py-12 text-center bg-muted/10 rounded-3xl border border-border/50">
                    <p className="text-muted-foreground text-sm uppercase tracking-wider font-bold">No reviews yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Be the first to share your streetwear feedback!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="p-6 border-border bg-card/10 hover:border-primary/20 transition-all relative group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0">
                                {(review.user?.name || "C")[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-sm uppercase tracking-tight">{review.user?.name || "Customer"}</span>
                                  <span className="flex items-center gap-0.5 bg-green-500/10 border border-green-500/20 rounded-md px-1.5 py-0.5">
                                    <BadgeCheck className="w-3 h-3 text-green-500" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-green-600 dark:text-green-400">Verified Buyer</span>
                                  </span>
                                  {review.userId === session?.user?.id && (
                                    <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5">My Review</Badge>
                                  )}
                                </div>
                                <div className="flex gap-0.5 mt-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={cn(
                                        "w-3.5 h-3.5",
                                        star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                      )} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold font-mono shrink-0">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap pl-10">
                          {review.comment}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

      {/* Review Dialog */}
      <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
        <DialogContent className="sm:max-w-[450px] bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              {editingReviewId ? "EDIT YOUR REVIEW" : "WRITE A REVIEW"}
            </DialogTitle>
            <DialogDescription>
              {editingReviewId 
                ? "Update your ratings and thoughts for this streetwear garment." 
                : "Share your experience with this garment to help other shoppers."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Garment Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    className="transition-transform active-scale hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8",
                        star <= ratingInput ? "fill-primary text-primary" : "text-muted-foreground/40"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Thoughts *</label>
              <textarea
                className="w-full min-h-[120px] rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none text-foreground focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary"
                placeholder="Write your review here... Is the sizing accurate? How is the fabric quality?"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsReviewFormOpen(false)} 
                className="border-2 font-bold"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submittingReview} className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6">
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Similar Items & Cross-Selling Recommendations */}
      {product && recommendations.filter((p) => p.categoryId === product.categoryId && p.id !== product.id && !p.name?.startsWith("[DELETED]")).length > 0 && (
        <div className="mt-24 border-t border-border/40 pt-16">
          <div className="flex flex-col mb-8">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Complete your look</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Similar Items</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations
              .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && !p.name?.startsWith("[DELETED]"))
              .slice(0, 4)
              .map((item: any) => {
                const itemImg = item.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
                return (
                  <Card key={item.id} className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-300 rounded-2xl flex flex-col p-0 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    <Link href={`/shop/${item.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-muted">
                      <Image
                        src={itemImg}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                        unoptimized
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
                        <span className="text-xs md:text-sm font-black text-primary font-mono">₹{parseFloat(item.price).toFixed(0)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {product && recommendations.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId && !p.name?.startsWith("[DELETED]")).length > 0 && (
        <div className="mt-20 border-t border-border/40 pt-16">
          <div className="flex flex-col mb-8">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Others are checking</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Customers Also Bought</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations
              .filter((p) => p.id !== product.id && p.categoryId !== product.categoryId && !p.name?.startsWith("[DELETED]"))
              .slice(0, 4)
              .map((item: any) => {
                const itemImg = item.images?.[0] || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop";
                return (
                  <Card key={item.id} className="group relative overflow-hidden bg-card border border-border/40 hover:border-primary/50 transition-all duration-300 rounded-2xl flex flex-col p-0 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    <Link href={`/shop/${item.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-muted">
                      <Image
                        src={itemImg}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                        unoptimized
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
                        <span className="text-xs md:text-sm font-black text-primary font-mono">₹{parseFloat(item.price).toFixed(0)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black uppercase tracking-tight truncate">{product?.name}</p>
                  <p className="text-sm font-black text-primary font-mono">₹{product ? parseFloat(product.price).toFixed(0) : ""}</p>
                </div>
                <div className="flex gap-2">
                  {isAddedToCart ? (
                    <Button
                      asChild
                      className="h-11 px-5 text-xs font-black uppercase tracking-wider rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Link href="/cart">View Cart</Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="h-11 px-5 text-xs font-black uppercase tracking-wider rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1.5" /> Add to Bag
                    </Button>
                  )}
                  <Button
                    onClick={handleBuyNow}
                    className="h-11 px-4 text-xs font-black uppercase tracking-wider rounded-xl bg-black hover:bg-black/90 dark:bg-white dark:text-black text-white"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
