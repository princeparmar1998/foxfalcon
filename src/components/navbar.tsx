"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Settings, ShieldAlert, ArrowRight, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userNavLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    { name: "Custom Design", href: "/custom-design" },
    { name: "Order Tracking", href: "/track-order" },
  ];

  const adminNavLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  // Which links to show in navbar
  const activeLinks = isAdmin ? adminNavLinks : isUser ? userNavLinks : [];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3 group">
          <div className="w-14 h-14 bg-black rounded-full group-hover:scale-110 transition-transform flex items-center justify-center overflow-hidden border border-border relative">
            <Image src="/logo-icon.png" width={56} height={56} alt="Fox Falcon Logo" className="object-cover" />
          </div>
          <span className="hidden sm:inline-block font-sans uppercase text-3xl font-black">
            FOX <span className="text-primary">FALCON</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {activeLinks.map((link) => {
            const LinkIcon = (link as { icon?: React.ComponentType<{ className?: string }> }).icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium hover:text-primary transition-colors relative group flex items-center gap-1.5",
                  pathname === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {isAdmin && LinkIcon && <LinkIcon className="w-4 h-4" />}
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            );
          })}
          {isAdmin && (
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Admin Mode
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {session && (
            <>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="w-5 h-5" />
              </Button>
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <ThemeToggle />
            </>
          )}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-black text-sm flex items-center justify-center border border-border focus:outline-none transition-colors select-none shrink-0 cursor-pointer">
                  {session.user?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 text-card-foreground">
                {/* Header Email */}
                <div className="text-center text-xs text-muted-foreground font-medium tracking-tight truncate px-2">
                  {session.user?.email}
                </div>

                {/* Main Profile Info (Gmail Style) */}
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Large Avatar */}
                  <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground font-black text-3xl flex items-center justify-center border-4 border-border shadow-lg relative group/avatar select-none">
                    {session.user?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  {/* Name & Role */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      Hi, {session.user?.name?.split(" ")[0] || "User"}!
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase">
                      {session.user?.role === "ADMIN" ? <ShieldAlert className="w-3 h-3" /> : null}
                      {session.user?.role || "USER"}
                    </span>
                  </div>

                  {/* Manage Account Button */}
                  <Button variant="outline" className="rounded-full border-border hover:bg-muted font-bold px-6 h-10 text-sm mt-2" asChild>
                    <Link href="/profile">Manage Your Account</Link>
                  </Button>
                </div>

                {/* Additional Actions Divider */}
                <div className="border-t border-border pt-4 space-y-2">
                  {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-muted rounded-xl px-4 py-2.5 text-foreground">
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
                    className="rounded-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold px-8 h-11 text-foreground flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
          {(isUser || isAdmin) && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {(isUser || isAdmin) && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border mt-4 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {isAdmin && (
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Admin Panel</span>
                </div>
              )}
              {activeLinks.map((link) => {
                const LinkIcon = (link as { icon?: React.ComponentType<{ className?: string }> }).icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-semibold flex items-center gap-2",
                      pathname === link.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {isAdmin && LinkIcon && <LinkIcon className="w-5 h-5 text-primary" />}
                    {link.name}
                  </Link>
                );
              })}
              {isUser && (
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-4" asChild>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop Now</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
