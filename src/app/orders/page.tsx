"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { useOrderTracking } from "@/hooks/use-order-tracking";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/lib/toast";
import { userApi } from "@/lib/api";
import { cn } from "@/lib/utils";

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

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const data = await userApi.getOrders(false);
        setOrders(data);
      } catch (err) {
        showToast.error("Could not load orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [session]);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  if (!session) {
    return (
      <div className="container px-6 mx-auto pt-40 pb-20 text-center">
        <h1 className="text-4xl font-black tracking-tighter mb-4">PLEASE LOGIN</h1>
        <p className="text-muted-foreground mb-8">You need to be authenticated to view your orders.</p>
        <Button asChild className="bg-primary px-10 h-12 font-bold">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/shop">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage all your orders in one place</p>
        </div>
      </div>

      {/* Order Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total", count: orders.length, color: "text-foreground" },
          { label: "Pending", count: orders.filter(o => o.status === "PENDING").length, color: "text-yellow-500" },
          { label: "Shipped", count: orders.filter(o => o.status === "SHIPPED" || o.status === "PROCESSING").length, color: "text-blue-500" },
          { label: "Delivered", count: orders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED").length, color: "text-green-500" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border-border text-center">
            <p className={cn("text-2xl font-black", stat.color)}>{stat.count}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {loadingOrders ? (
          <div className="py-20 flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="font-bold">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-black tracking-tight">No Orders Yet</h2>
            <p className="text-muted-foreground">You haven&apos;t placed any orders yet. Start shopping to see them here!</p>
            <Button asChild className="bg-primary font-bold px-8 h-11 mt-4">
              <Link href="/shop">Start Shopping</Link>
            </Button>
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
                        ₹{parseFloat(order.totalAmount).toFixed(2)}
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
                                    <span className="font-bold text-primary">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                                <div className="pt-2 flex justify-between items-center text-xs font-semibold">
                                  <span className="text-muted-foreground">Subtotal:</span>
                                  <span className="text-foreground">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
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
      </div>
    </div>
  );
}
