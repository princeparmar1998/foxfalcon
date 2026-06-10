"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useOrderTracking } from "@/hooks/use-order-tracking";
import { cn } from "@/lib/utils";
import { userApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

const statusSteps = [
  { id: "PENDING", label: "Order Placed", icon: Clock },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Hook for live status updates via Pusher
  const { status: liveStatus } = useOrderTracking(searchId);

  // Fetch order details from API
  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getOrderById(id);
      setOrderData(data);
      setSearchId(id);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data || "Failed to fetch order. Check your Order ID and make sure you are logged in.";
      setError(msg);
      showToast.error("Could not fetch order details");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  // Check URL query parameters on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryOrderId = params.get("orderId");
      if (queryOrderId) {
        setOrderId(queryOrderId);
        fetchOrderDetails(queryOrderId);
      }
    }
  }, []);

  // Sync liveStatus if it gets pushed
  useEffect(() => {
    if (liveStatus && orderData) {
      setOrderData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: liveStatus,
        };
      });
      showToast.success(`Order status updated to: ${liveStatus}`);
    }
  }, [liveStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchOrderDetails(orderId.trim());
  };

  const currentStatus = orderData?.status || "PENDING";
  
  // Custom checks for cancellation and rejection
  const isCancelled = currentStatus === "CANCELLED";
  const isRejected = currentStatus === "REJECTED";
  
  // If the status is COMPLETED, map it to DELIVERED step
  const mappedStatus = currentStatus === "COMPLETED" ? "DELIVERED" : currentStatus;
  const currentStepIndex = statusSteps.findIndex(step => step.id === mappedStatus);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const getEstimatedDelivery = (date: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatAddress = (address: any) => {
    if (!address) return "No address provided";
    return `${address.street}, ${address.city}, ${address.state} - ${address.postalCode}, ${address.country}`;
  };

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black tracking-tighter">TRACK YOUR ORDER</h1>
        <p className="text-muted-foreground">Enter your order ID to see real-time updates on your delivery.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-4">
          <Input 
            placeholder="Order ID (e.g. cjx...)" 
            className="h-12 bg-muted/50 border-border font-mono text-sm"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="h-12 px-6 font-bold bg-primary hover:bg-primary/90">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><Search className="w-5 h-5 mr-2" /> Track</>
            )}
          </Button>
        </form>
      </div>

      {error && (
        <Card className="p-6 border-red-500/20 bg-red-500/5 text-center max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </Card>
      )}

      {loading && (
        <div className="py-20 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="font-bold">Fetching order updates...</span>
        </div>
      )}

      {!loading && orderData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Status Alert for Cancelled/Rejected Orders */}
          {(isCancelled || isRejected) && (
            <Card className="p-6 border-red-500/30 bg-red-500/10 text-red-500 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2">
                Order {isCancelled ? "Cancelled" : "Rejected"}
              </h3>
              <p className="text-sm text-red-400 mt-1">
                This order was {isCancelled ? "cancelled" : "rejected by store administrators"}. Please reach out to customer support if this was unexpected.
              </p>
            </Card>
          )}

          {/* Tracking Stepper */}
          {!isCancelled && !isRejected && (
            <Card className="p-8 border-border overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isActive = index === currentStepIndex;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center space-y-4 relative">
                      {/* Line Connector */}
                      {index < statusSteps.length - 1 && (
                        <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-border -z-10">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: index < currentStepIndex ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                      
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                        isCompleted ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted border-border text-muted-foreground",
                        isActive && "scale-115 ring-4 ring-primary/20"
                      )}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className={cn("text-xs font-black uppercase tracking-widest", isCompleted ? "text-primary" : "text-muted-foreground")}>
                          {step.label}
                        </p>
                        {isActive && <p className="text-[10px] font-bold text-primary animate-pulse">Live Update</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card className="p-6 border-border space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-foreground uppercase tracking-wider text-sm">
                <Package className="w-4 h-4 text-primary" /> Order Details
              </h3>
              <div className="space-y-4">
                {orderData.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {item.product?.images?.[0] && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-10 h-10 object-cover rounded bg-muted"
                        />
                      )}
                      <div>
                        <p className="font-bold">{item.product?.name || "Item"}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator className="bg-border" />
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${parseFloat(orderData.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between font-black text-lg pt-2 text-primary">
                    <span>Total Amount</span>
                    <span>${parseFloat(orderData.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {!isCancelled && !isRejected && (
                  <>
                    <Separator className="bg-border" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Estimated Delivery</span>
                      <span className="font-bold text-foreground">{getEstimatedDelivery(orderData.createdAt)}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6 border-border space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-foreground uppercase tracking-wider text-sm">
                <MapPin className="w-4 h-4 text-primary" /> Delivery Address
              </h3>
              <div className="space-y-3">
                <p className="text-sm font-semibold">{orderData.user?.name || "Customer"}</p>
                <p className="text-xs text-muted-foreground">{orderData.user?.email}</p>
                <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
                  {formatAddress(orderData.address)}
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-border", className)} />
);
