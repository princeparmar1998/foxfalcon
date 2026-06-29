"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, Menu, X, Search, LogOut, ShieldAlert, ShoppingBag, MapPin, HelpCircle, Settings, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isUser = !!session && !isAdmin;
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cart = useCart();
  const wishlist = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.items.length : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showTransparent = pathname === "/" && !isScrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
      {/* Top Utility Bar (Black background) */}
      <div className="bg-black text-white text-[10px] font-black tracking-widest uppercase px-6 py-2 border-b border-white/10 hidden lg:block select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Delivery Location */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>DELIVERING TO: <span className="text-primary underline font-sans">ADD DELIVERY LOCATION</span></span>
          </div>

          {/* Right: Utility Links */}
          <div className="flex items-center gap-6 font-sans">
            <Link href="/stores" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              <span>STORES</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/contact" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>CONTACT US</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link href={session ? "/orders" : "/login"} className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>MY ORDERS</span>
            </Link>
            <span className="text-white/20">|</span>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors uppercase focus:outline-none font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-primary font-black drop-shadow-[0_0_6px_rgba(var(--primary-rgb,200,170,110),0.5)]">{session.user?.name?.split(" ")[0] || "PROFILE"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 text-card-foreground mt-2">
                  {/* Header Email */}
                  <div className="text-center text-xs text-muted-foreground font-medium tracking-tight truncate px-2 font-sans">
                    {session.user?.email}
                  </div>

                  {/* Main Profile Info (Gmail Style) */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Large Avatar */}
                    <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground font-black text-3xl flex items-center justify-center border-4 border-border shadow-lg relative group/avatar select-none uppercase">
                      {session.user?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {/* Name & Role */}
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight text-foreground font-sans">
                        Hi, {session.user?.name?.split(" ")[0] || "User"}!
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase">
                        {session.user?.role === "ADMIN" ? <ShieldAlert className="w-3 h-3" /> : null}
                        {session.user?.role || "USER"}
                      </span>
                    </div>

                    {/* Manage Profile Button */}
                    <Button variant="outline" className="rounded-full border-border hover:bg-muted font-bold px-6 h-10 text-sm mt-2 font-sans" asChild>
                      <Link href="/profile">Manage Your Profile</Link>
                    </Button>
                  </div>

                  {/* Additional Actions Divider */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-muted rounded-xl px-4 py-2.5 text-foreground font-sans">
                      <Link href="/orders" className="flex items-center w-full justify-between">
                        <span className="flex items-center"><ShoppingBag className="w-4 h-4 mr-3 text-primary" /> My Orders</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-muted rounded-xl px-4 py-2.5 text-foreground font-sans">
                      <Link href="/shop" className="flex items-center w-full justify-between">
                        <span className="flex items-center"><Sparkles className="w-4 h-4 mr-3 text-primary" /> Shop</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    </DropdownMenuItem>
                    {session.user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-muted rounded-xl px-4 py-2.5 text-foreground font-sans">
                        <Link href="/admin" className="flex items-center w-full justify-between">
                          <span className="flex items-center"><Settings className="w-4 h-4 mr-3 text-primary" /> Admin Dashboard</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>

                  {/* Sign Out Section */}
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      variant="outline"
                      className="rounded-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold px-8 h-11 text-muted-foreground flex items-center gap-2 font-sans"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <User className="w-3.5 h-3.5" />
                <span>LOG IN</span>
              </Link>
            )}
            <span className="text-white/20">|</span>
            <Link href="/wishlist" className="relative hover:text-primary transition-colors flex items-center">
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/cart" className="relative hover:text-primary transition-colors flex items-center">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black font-sans">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bottom Tier */}
      <nav
        className={cn(
          "w-full transition-all duration-300 px-6 py-3 border-b",
          showTransparent
            ? "bg-transparent border-transparent text-white"
            : "bg-background/90 backdrop-blur-md border-border text-foreground shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Sub-Branding */}
          <Link href="/" className="flex flex-col items-center gap-0 group shrink-0">
            <div className="w-10 h-7 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo-icon.png?v=7"
                width={40}
                height={28}
                alt="Fox Falcon Logo"
                className={cn("object-contain transition-all duration-300", showTransparent ? "brightness-100" : "dark:brightness-100 invert dark:invert-0")}
              />
            </div>
            <span className="hidden lg:block font-sans font-black tracking-[0.18em] text-[11px] uppercase select-none text-center leading-none mt-0.5">
              <span className={cn("transition-colors duration-300", !showTransparent ? "text-foreground" : "text-white")}>FOX </span>
              <span className="text-primary">FALCON</span>
            </span>
          </Link>

          {/* Center Main Nav Links (Modern Editorial Navigation) */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-black tracking-widest uppercase">
            <Link href="/shop" className="hover:text-primary transition-colors">MEN</Link>
            <Link href="/collections" className="hover:text-primary transition-colors">COLLECTIONS</Link>
            <Link href="/shop?sale=true" className="text-red-500 hover:text-red-600 transition-colors">SALE</Link>
            <Link href="/shop" className="hover:text-primary transition-colors">CURATED MOODS</Link>
            <Link href="/shop" className="hover:text-primary transition-colors">THE GENTLEMENS LEAGUE</Link>
            {isAdmin && (
              <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                <ShieldAlert className="w-2.5 h-2.5" /> Admin Mode
              </span>
            )}
          </div>

          {/* Right Main Tier Items: Search Bar, Express Delivery, Mobile Toggle */}
          <div className="flex items-center gap-3 flex-1 lg:flex-none justify-end translate-y-[2px]">
            {/* Sleek Search bar */}
            <div className="relative max-w-[180px] md:max-w-[240px] w-full hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                aria-label="Search products"
                className={cn(
                  "pl-8 pr-4 py-1 w-full text-[11px] rounded-full border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-background transition-all font-sans",
                  showTransparent ? "border-white/20 text-white placeholder-white/40" : "border-border text-foreground placeholder-muted-foreground"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.location.href = `/shop?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                  }
                }}
              />
            </div>

            {/* Express Delivery Button Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-muted/60 dark:bg-card/60 backdrop-blur-sm border border-border/40 py-1 px-2.5 rounded-full text-[8px] font-bold tracking-wider uppercase select-none">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">EXPRESS DELIVERY</span>
            </div>

            {/* Admin link shortcut for mobile/tablet */}
            {isAdmin && (
              <Link href="/admin" className="lg:hidden text-xs font-black uppercase text-primary border border-primary/20 px-2 py-1 rounded-full bg-primary/10 font-sans">
                ADMIN
              </Link>
            )}

            {/* Mobile Menu Action Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden transition-colors duration-300", !showTransparent ? "text-foreground" : "text-white hover:text-white hover:bg-white/10")}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Theme Toggle option */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Clean Fullscreen/Slide overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-background border-t border-border w-full overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-6 text-sm font-black tracking-widest uppercase border-b border-border">
              {/* Mobile Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  aria-label="Search catalog"
                  className="pl-10 pr-4 py-2 w-full text-xs rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground font-sans"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsMobileMenuOpen(false);
                      window.location.href = `/shop?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                    }
                  }}
                />
              </div>

              {/* Utility Links for Mobile */}
              <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground border-b border-border/40 pb-4 font-sans">
                <Link href="/stores" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1.5 hover:text-primary">
                  <MapPin className="w-3.5 h-3.5" /> STORES
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1.5 hover:text-primary">
                  <HelpCircle className="w-3.5 h-3.5" /> CONTACT US
                </Link>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1.5 hover:text-primary">
                  <Heart className="w-3.5 h-3.5" /> WISHLIST ({wishlistCount})
                </Link>
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1.5 hover:text-primary">
                  <ShoppingBag className="w-3.5 h-3.5" /> BAG ({cartCount})
                </Link>
              </div>

              {/* Mobile Main Links */}
              <div className="flex flex-col gap-4">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">MEN</Link>
                <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">COLLECTIONS</Link>
                <Link href="/shop?sale=true" onClick={() => setIsMobileMenuOpen(false)} className="text-red-500 hover:text-red-600">SALE</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">CURATED MOODS</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">THE GENTLEMENS LEAGUE</Link>
              </div>

              {/* Profile action on mobile */}
              <div className="border-t border-border/40 pt-4 flex flex-col gap-3 font-sans">
                {session ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary text-xs font-bold text-center py-2.5 rounded-xl border border-border">
                      MANAGE PROFILE
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary text-xs font-bold text-center py-2.5 rounded-xl border border-primary/20 text-primary bg-primary/10">
                        ADMIN DASHBOARD
                      </Link>
                    )}
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      variant="outline"
                      className="rounded-xl w-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold h-11 text-xs"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs">
                    LOG IN
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
