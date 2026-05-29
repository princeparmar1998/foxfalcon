"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Clock,
  Loader2,
  Package,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch orders from db
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Could not load orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      showToast.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status in db and trigger Pusher
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const toastId = showToast.loading(`Updating order status to ${newStatus}...`);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      showToast.dismiss(toastId);
      showToast.success(`Order status successfully updated to ${newStatus}!`);
      
      fetchOrders();
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error("Failed to update status", err);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">ORDER MANAGEMENT</h1>
          <p className="text-muted-foreground">Monitor orders and manage shipment statuses in real-time.</p>
        </div>
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders by ID, name or email..." 
              className="pl-10 bg-muted/30 border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-bold">Loading orders from Neon Postgres...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">No orders found in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Date & Time</TableHead>
                  <TableHead className="font-bold">Total</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  
                  return (
                    <TableRow key={order.id} className="border-border hover:bg-muted/50 transition-colors group">
                      <TableCell className="font-black">{order.id}</TableCell>
                      <TableCell>
                        <div className="font-bold">{order.user?.name || "Anonymous"}</div>
                        <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{orderDate}</TableCell>
                      <TableCell className="font-black text-primary">${parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            order.status === 'PROCESSING' && "border-primary text-primary",
                            order.status === 'SHIPPED' && "border-secondary text-secondary",
                            order.status === 'DELIVERED' && "border-green-500 text-green-500",
                            order.status === 'PENDING' && "border-yellow-500 text-yellow-500",
                            order.status === 'CANCELLED' && "border-red-500 text-red-500"
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }} 
                              className="font-bold cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="font-bold cursor-pointer">
                              <Truck className="w-4 h-4 mr-2" /> Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="font-bold cursor-pointer">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} className="font-bold text-destructive cursor-pointer">
                              <XCircle className="w-4 h-4 mr-2" /> Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px] bg-background border-border max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-2">
                  <span>ORDER DETAILS</span>
                  <Badge variant="secondary" className="text-[10px] tracking-wider font-black uppercase">
                    {selectedOrder.id}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Detailed metadata and shipping logistics for this purchase.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Status and Total */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Status</span>
                    <div>
                      <Badge variant="outline" className="text-[10px] font-black tracking-widest border-primary text-primary">
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Paid Amount</span>
                    <div className="text-2xl font-black text-primary">${parseFloat(selectedOrder.totalAmount).toFixed(2)}</div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                  </h4>
                  <div className="p-4 rounded-xl bg-muted/10 border border-border text-sm leading-relaxed">
                    <div className="font-bold text-foreground">{selectedOrder.user?.name || "Anonymous"}</div>
                    <div className="text-muted-foreground">
                      {selectedOrder.address?.street}<br />
                      {selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.postalCode}<br />
                      {selectedOrder.address?.country}
                    </div>
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> Items Purchased
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-muted/10 border border-border text-sm">
                        <div>
                          <span className="font-bold text-foreground">{item.product?.name || "Streetwear Garment"}</span>
                          <span className="text-xs text-muted-foreground ml-2">x{item.quantity}</span>
                          <div className="flex gap-2 mt-1">
                            {item.size && <Badge variant="secondary" className="text-[8px] px-1 py-0 border-none font-bold">Size: {item.size}</Badge>}
                            {item.color && <Badge variant="secondary" className="text-[8px] px-1 py-0 border-none font-bold">Color: {item.color}</Badge>}
                          </div>
                        </div>
                        <span className="font-black text-primary">${parseFloat(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions inside dialog */}
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="border-2 font-bold">
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
