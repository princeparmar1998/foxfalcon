"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShoppingBag,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Star,
  Save,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useOrderTracking } from "@/hooks/use-order-tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/toast";
import { userApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{children}</label>
);

const statusColor = (status: string) => {
  switch (status) {
    case "PROCESSING": return "border-primary text-primary";
    case "SHIPPED": return "border-blue-500 text-blue-500";
    case "DELIVERED":
    case "COMPLETED": return "border-green-500 text-green-500";
    case "PENDING": return "border-yellow-500 text-yellow-500";
    case "CANCELLED":
    case "REJECTED": return "border-red-500 text-red-500";
    default: return "border-muted text-muted-foreground";
  }
};

const statusSteps = [
  { id: "PENDING", label: "Placed", icon: Clock },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [viewAllOrders, setViewAllOrders] = useState(false);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Hook for live status updates of the expanded order
  const { status: liveStatus } = useOrderTracking(expandedOrderId || "");

  useEffect(() => {
    if (liveStatus && expandedOrderId) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === expandedOrderId ? { ...order, status: liveStatus } : order
        )
      );
      showToast.success(`Order status updated to: ${liveStatus}`);
    }
  }, [liveStatus, expandedOrderId]);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [savingName, setSavingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    if (session?.user?.name) setNameValue(session.user.name);
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const isAdmin = (session.user as any)?.role === "ADMIN";
        const data = await userApi.getOrders(viewAllOrders && isAdmin);
        setOrders(data);
      } catch (err) {
        showToast.error("Could not load orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const data = await userApi.getAddresses();
        setAddresses(data);
      } catch (err) {
        showToast.error("Could not load addresses", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchOrders();
    fetchAddresses();
  }, [session, viewAllOrders]);

  if (!session) {
    return (
      <div className="container px-6 mx-auto pt-40 pb-20 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-4">PLEASE LOGIN</h1>
        <p className="text-muted-foreground mb-8">You need to be authenticated to view your profile.</p>
        <Button asChild className="bg-primary px-10 h-12 font-bold">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSaveName = async () => {
    if (!nameValue.trim() || nameValue === session.user?.name) return;
    try {
      setSavingName(true);
      await userApi.updateProfile({ name: nameValue });
      await updateSession({ name: nameValue });
      showToast.success("Name updated successfully!");
    } catch (err) {
      showToast.error("Failed to save changes", err);
    } finally {
      setSavingName(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      const saved = await userApi.createAddress(newAddress);
      setAddresses((prev) => newAddress.isDefault 
        ? [saved, ...prev.map(a => ({ ...a, isDefault: false }))]
        : [...prev, saved]
      );
      setIsAddressDialogOpen(false);
      setNewAddress({ street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false });
      showToast.success("Address saved successfully!");
    } catch (err) {
      showToast.error("Failed to save address", err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await userApi.deleteAddress(id);
      setAddresses((prev) => prev.filter(a => a.id !== id));
      showToast.success("Address deleted");
    } catch (err) {
      showToast.error("Could not delete address", err);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Profile Card */}
        <div className="md:w-80 space-y-6">
          <Card className="p-8 text-center border-border overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-xl">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">
                {session.user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-black tracking-tight">{session.user?.name}</h2>
            <p className="text-sm text-muted-foreground">{session.user?.email}</p>

            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/40 text-primary">
                {(session.user as any)?.role || "USER"}
              </Badge>
            </div>

            <div className="mt-8 pt-8 border-t border-border space-y-2">
              {(session.user as any)?.role === "ADMIN" && (
                <Button variant="outline" className="w-full h-11 font-bold border-2 p-0" asChild>
                  <Link href="/admin" className="flex items-center justify-start gap-3 px-4 w-full h-full text-foreground hover:text-foreground">
                    <Settings className="w-4 h-4 shrink-0 text-primary" />
                    <span>Admin Dashboard</span>
                  </Link>
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start font-bold text-destructive hover:bg-destructive/10"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </Card>

          {/* Order stats mini card */}
          <Card className="p-6 border-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {viewAllOrders ? "Store Order Summary" : "My Order Summary"}
            </p>
            <div className="space-y-3 text-sm">
              {["PENDING", "COMPLETED", "REJECTED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => {
                const count = orders.filter(o => o.status === status).length;
                if (count === 0 && ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) return null;

                const label = status === "COMPLETED"
                  ? "Complete"
                  : status === "REJECTED"
                  ? "Rejected"
                  : status.charAt(0) + status.slice(1).toLowerCase();

                return (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{label}</span>
                    <Badge variant="outline" className={cn("text-[10px] font-black", statusColor(status))}>
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8 mb-8" variant="line">
              <TabsTrigger value="orders" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-black text-lg bg-transparent border-none">My Orders</TabsTrigger>
              <TabsTrigger value="addresses" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-black text-lg bg-transparent border-none">Addresses</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-black text-lg bg-transparent border-none">Settings</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6 outline-none">
              {(session.user as any)?.role === "ADMIN" && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/20 p-4 rounded-xl border border-border gap-4">
                  <div>
                    <h3 className="font-bold text-sm">Store Administration</h3>
                    <p className="text-xs text-muted-foreground">Monitor all customer transactions and order fulfillment statuses.</p>
                  </div>
                  <Button 
                    onClick={() => setViewAllOrders(!viewAllOrders)} 
                    variant={viewAllOrders ? "default" : "outline"} 
                    className="font-bold text-xs h-9 px-4 shrink-0"
                  >
                    {viewAllOrders ? "Viewing All Store Orders" : "Viewing My Personal Orders"}
                  </Button>
                </div>
              )}

              {loadingOrders ? (
                <div className="py-20 flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="font-bold">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    {viewAllOrders ? "No store orders found in the database." : "You haven't placed any orders yet."}
                  </p>
                  {!viewAllOrders && (
                    <Button asChild variant="link" className="text-primary font-bold">
                      <Link href="/shop">Start Shopping</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card className="p-6 border-border hover:border-primary/30 transition-all group">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-black text-lg font-mono text-sm">{order.id.slice(0, 16)}...</span>
                              <Badge 
                                variant="outline" 
                                className={cn("text-[10px] font-black uppercase tracking-widest", statusColor(order.status))}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.createdAt)} &bull; {order.items?.length} item(s)
                              {viewAllOrders && order.user && (
                                <span className="text-primary font-bold ml-1.5">
                                  &bull; Placed by: {order.user.name || "Anonymous"} ({order.user.email})
                                </span>
                              )}
                            </p>
                            {order.items?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.items.slice(0, 3).map((item: any) => (
                                  <span key={item.id} className="text-[10px] bg-muted px-2 py-0.5 rounded font-medium">
                                    {item.product?.name || "Item"} x{item.quantity}
                                  </span>
                                ))}
                                {order.items.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground">+{order.items.length - 3} more</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                            <span className="text-xl font-black text-primary">
                              ${parseFloat(order.totalAmount).toFixed(2)}
                            </span>
                            <Button 
                              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              variant="outline" 
                              size="sm" 
                              className="border-2 font-bold flex items-center gap-1.5"
                            >
                              <span>Track Order</span>
                              {expandedOrderId === order.id ? (
                                <ChevronUp className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded inline tracking panel */}
                        <AnimatePresence>
                          {expandedOrderId === order.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 mt-6 border-t border-border space-y-6">
                                {/* Status banner if cancelled/rejected */}
                                {(order.status === "CANCELLED" || order.status === "REJECTED") ? (
                                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                                    <p className="font-bold uppercase tracking-wider text-xs">Order {order.status === "CANCELLED" ? "Cancelled" : "Rejected"}</p>
                                    <p className="text-red-400 mt-1">This order was {order.status === "CANCELLED" ? "cancelled" : "rejected by store administrators"}. Please contact support for more details.</p>
                                  </div>
                                ) : (
                                  /* Stepper */
                                  <div className="bg-muted/10 p-5 rounded-xl border border-border/50 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 relative z-10">
                                      {statusSteps.map((step, index) => {
                                        const mappedStatus = order.status === "COMPLETED" ? "DELIVERED" : order.status;
                                        const currentStepIndex = statusSteps.findIndex(s => s.id === mappedStatus);
                                        const isCompleted = index <= currentStepIndex;
                                        const isActive = index === currentStepIndex;

                                        return (
                                          <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 text-center md:flex-1 relative w-full md:w-auto">
                                            {/* Line Connector for Desktop */}
                                            {index < statusSteps.length - 1 && (
                                              <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-border -z-10">
                                                <div 
                                                  className="h-full bg-primary transition-all duration-500" 
                                                  style={{ width: isCompleted && index < currentStepIndex ? "100%" : "0%" }}
                                                />
                                              </div>
                                            )}
                                            
                                            <div className={cn(
                                              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                                              isCompleted ? "bg-primary border-primary text-primary-foreground shadow-md" : "bg-muted border-border text-muted-foreground",
                                              isActive && "ring-4 ring-primary/20 scale-110"
                                            )}>
                                              <step.icon className="w-4 h-4" />
                                            </div>
                                            <div className="text-left md:text-center">
                                              <p className={cn("text-[10px] font-black uppercase tracking-widest", isCompleted ? "text-primary" : "text-muted-foreground")}>
                                                {step.label}
                                              </p>
                                              {isActive && <p className="text-[8px] font-bold text-primary animate-pulse">Live Updates Active</p>}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Detailed Grid: Products & Delivery Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                  {/* Order Items */}
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                      <Package className="w-3.5 h-3.5 text-primary" /> Products Ordered
                                    </h4>
                                    <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border">
                                      {order.items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between text-xs pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                          <div className="flex items-center gap-2.5">
                                            {item.product?.images?.[0] && (
                                              <img 
                                                src={item.product.images[0]} 
                                                alt={item.product.name} 
                                                className="w-9 h-9 object-cover rounded bg-muted border border-border"
                                              />
                                            )}
                                            <div>
                                              <p className="font-bold text-foreground">{item.product?.name || "Product"}</p>
                                              <p className="text-[10px] text-muted-foreground">
                                                Qty: {item.quantity} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                                              </p>
                                            </div>
                                          </div>
                                          <span className="font-bold text-primary">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                      ))}
                                      <div className="pt-2 flex justify-between items-center text-xs font-semibold">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="text-foreground">${parseFloat(order.totalAmount).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Delivery & Actions */}
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-primary" /> Shipping Address
                                    </h4>
                                    <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-3 flex flex-col justify-between h-[calc(100%-28px)]">
                                      <div className="text-xs text-muted-foreground leading-relaxed">
                                        <p className="font-bold text-foreground mb-1">{order.user?.name || "Recipient"}</p>
                                        {order.address ? (
                                          <>
                                            {order.address.street}<br />
                                            {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                                            {order.address.country}
                                          </>
                                        ) : (
                                          "Address details unavailable"
                                        )}
                                      </div>
                                      <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row gap-2">
                                        <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-[10px] uppercase tracking-wider flex-1 h-9">
                                          <Link href={`/track-order?orderId=${order.id}`}>
                                            Live Tracking Page
                                          </Link>
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => setExpandedOrderId(null)}
                                          className="border-2 font-bold text-[10px] uppercase tracking-wider h-9"
                                        >
                                          Collapse
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="outline-none">
              {loadingAddresses ? (
                <div className="py-10 flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-bold">Loading addresses...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {addresses.map((address) => (
                      <motion.div
                        key={address.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card className="p-6 border-border relative group overflow-hidden">
                          <div className={`absolute top-0 left-0 w-1 h-full ${address.isDefault ? "bg-primary" : "bg-muted"}`} />
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              {address.isDefault && (
                                <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black tracking-widest">
                                  <Star className="w-2.5 h-2.5 mr-1" />Default
                                </Badge>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {address.street}<br />
                            {address.city}, {address.state} {address.postalCode}<br />
                            {address.country}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-8 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col gap-2"
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-bold">Add New Address</span>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="outline-none">
              <Card className="p-8 border-border">
                <h3 className="text-lg font-bold mb-6">Account Settings</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="bg-muted/30"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input defaultValue={session.user?.email || ""} disabled className="bg-muted/30 opacity-50" />
                    <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Role</Label>
                    <Input defaultValue={(session.user as any)?.role || "USER"} disabled className="bg-muted/30 opacity-50" />
                  </div>
                  <Button 
                    onClick={handleSaveName} 
                    disabled={savingName || nameValue === session.user?.name}
                    className="bg-primary hover:bg-primary/90 font-bold px-8 mt-4 gap-2"
                  >
                    {savingName ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">ADD ADDRESS</DialogTitle>
            <DialogDescription>Add a new delivery address to your account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Street Address *</Label>
              <Input 
                required
                placeholder="123 Main Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress(p => ({ ...p, street: e.target.value }))}
                className="bg-muted/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input 
                  required
                  placeholder="Mumbai"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(p => ({ ...p, city: e.target.value }))}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input 
                  required
                  placeholder="Maharashtra"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(p => ({ ...p, state: e.target.value }))}
                  className="bg-muted/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Postal Code *</Label>
                <Input 
                  required
                  placeholder="400001"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress(p => ({ ...p, postalCode: e.target.value }))}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Input 
                  required
                  placeholder="India"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress(p => ({ ...p, country: e.target.value }))}
                  className="bg-muted/30"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress(p => ({ ...p, isDefault: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="isDefault" className="text-sm font-bold cursor-pointer">Set as default address</label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsAddressDialogOpen(false)} className="border-2 font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={savingAddress} className="bg-primary hover:bg-primary/90 font-bold gap-2">
                {savingAddress ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Save Address</>}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
