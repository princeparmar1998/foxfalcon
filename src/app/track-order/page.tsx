"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useOrderTracking } from "@/hooks/use-order-tracking";
import { cn } from "@/lib/utils";

const statusSteps = [
  { id: "PENDING", label: "Order Placed", icon: Clock },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searchId, setSearchId] = useState("");
  const { status: liveStatus } = useOrderTracking(searchId);

  // Mock order data for initial search
  const [orderData, setOrderData] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    // In a real app, fetch from API
    setSearchId(orderId);
    setOrderData({
      id: orderId,
      status: "PROCESSING", // Initial status
      items: [
        { name: "Premium Oversized Tee", quantity: 2, price: 29.99 },
      ],
      address: "123 Street, City, State, 123456",
      estimatedDelivery: "May 5, 2026"
    });
  };

  const currentStatus = liveStatus || orderData?.status || "PENDING";
  const currentStepIndex = statusSteps.findIndex(step => step.id === currentStatus);

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black tracking-tighter">TRACK YOUR ORDER</h1>
        <p className="text-muted-foreground">Enter your order ID to see real-time updates on your delivery.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-4">
          <Input 
            placeholder="Order ID (e.g. #ORD-123)" 
            className="h-12 bg-muted/50 border-border"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <Button type="submit" className="h-12 px-6 font-bold bg-primary hover:bg-primary/90">
            <Search className="w-5 h-5 mr-2" /> Track
          </Button>
        </form>
      </div>

      {orderData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Tracking Stepper */}
          <Card className="p-8 border-border overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
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
                      isActive && "scale-125 ring-4 ring-primary/20"
                    )}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className={cn("text-xs font-black uppercase tracking-widest", isCompleted ? "text-primary" : "text-muted-foreground")}>
                        {step.label}
                      </p>
                      {isActive && <p className="text-[10px] font-medium text-secondary animate-pulse">Live Update</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card className="p-6 border-border space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Order Details
              </h3>
              <div className="space-y-3">
                {orderData.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                    <span className="font-bold">${item.price}</span>
                  </div>
                ))}
                <Separator className="bg-border" />
                <div className="flex justify-between font-bold">
                  <span>Estimated Delivery</span>
                  <span className="text-primary">{orderData.estimatedDelivery}</span>
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6 border-border space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Delivery Address
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {orderData.address}
              </p>
              <Button variant="outline" size="sm" className="w-full border-2 font-bold">
                Change Address
              </Button>
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
