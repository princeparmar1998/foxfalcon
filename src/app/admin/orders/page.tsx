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
  MapPin,
  Trash2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ordersToDelete, setOrdersToDelete] = useState<string[]>([]);

  // Fetch orders from db
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getOrders();
      setOrders(data);
      setSelectedOrderIds(prev => prev.filter(id => data.some((o: any) => o.id === id)));
    } catch (err) {
      showToast.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get("search");
      if (searchParam) {
        setSearch(searchParam);
      }
    }
  }, []);

  // Update order status in db and trigger Pusher
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const toastId = showToast.loading(`Updating order status to ${newStatus}...`);
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      showToast.dismiss(toastId);
      showToast.success(`Order status successfully updated to ${newStatus}!`);
      fetchOrders();
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error("Failed to update status", err);
    }
  };

  const handleSelectAll = (checked: any) => {
    if (checked) {
      const visibleIds = filteredOrders.map(o => o.id);
      setSelectedOrderIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      const visibleIds = filteredOrders.map(o => o.id);
      setSelectedOrderIds(prev => prev.filter(id => !visibleIds.includes(id)));
    }
  };

  const handleBulkDelete = async () => {
    if (ordersToDelete.length === 0) return;
    const toastId = showToast.loading(`Deleting ${ordersToDelete.length} order(s)...`);
    setDeleting(true);
    try {
      await adminApi.deleteOrders(ordersToDelete);
      showToast.dismiss(toastId);
      showToast.success(`Successfully deleted ${ordersToDelete.length} order(s)!`);
      setSelectedOrderIds(prev => prev.filter(id => !ordersToDelete.includes(id)));
      fetchOrders();
    } catch (err) {
      showToast.dismiss(toastId);
      showToast.error("Failed to delete orders", err);
    } finally {
      setDeleting(false);
      setIsConfirmDeleteOpen(false);
      setOrdersToDelete([]);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID, name or email..."
              className="pl-10 bg-muted/30 border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {selectedOrderIds.length > 0 && (
              <Button
                variant="destructive"
                className="font-bold flex items-center gap-2 border-2 border-red-500/20"
                onClick={() => {
                  setOrdersToDelete(selectedOrderIds);
                  setIsConfirmDeleteOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedOrderIds.length})
              </Button>
            )}

            <Button
              variant="outline"
              className="font-bold border-2 border-border hover:bg-muted"
              onClick={() => {
                const endedIds = orders
                  .filter((o) => ["COMPLETED", "CANCELLED", "REJECTED"].includes(o.status))
                  .map((o) => o.id);
                if (endedIds.length === 0) {
                  showToast.error("No completed, cancelled, or rejected orders to clean up.");
                  return;
                }
                setOrdersToDelete(endedIds);
                setIsConfirmDeleteOpen(true);
              }}
            >
              Clean Up Ended Orders
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-bold">Loading store orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">No orders found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="w-[50px] font-bold">
                    <Checkbox
                      checked={
                        filteredOrders.length > 0 &&
                        filteredOrders.every((o) => selectedOrderIds.includes(o.id))
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                  </TableHead>
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
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={selectedOrderIds.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrderIds((prev) => [...prev, order.id]);
                            } else {
                              setSelectedOrderIds((prev) => prev.filter((id) => id !== order.id));
                            }
                          }}
                          aria-label={`Select order ${order.id}`}
                        />
                      </TableCell>
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
                            order.status === 'SHIPPED' && "border-blue-500 text-blue-500",
                            order.status === 'DELIVERED' && "border-green-500 text-green-500",
                            order.status === 'COMPLETED' && "border-green-500 text-green-500",
                            order.status === 'PENDING' && "border-yellow-500 text-yellow-500",
                            order.status === 'CANCELLED' && "border-red-500 text-red-500",
                            order.status === 'REJECTED' && "border-red-500 text-red-500"
                          )}
                        >
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 z-[9999]">
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedOrder(order);
                                setTimeout(() => {
                                  setIsDetailsOpen(true);
                                }, 100);
                              }}
                              className="font-bold cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <div className="h-px bg-muted my-1" />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'PENDING')} className="font-bold cursor-pointer">
                              <Clock className="w-4 h-4 mr-2 text-yellow-500" /> Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'PROCESSING')} className="font-bold cursor-pointer">
                              <Package className="w-4 h-4 mr-2 text-primary" /> Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'COMPLETED')} className="font-bold cursor-pointer">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Mark as Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'REJECTED')} className="font-bold text-destructive cursor-pointer">
                              <XCircle className="w-4 h-4 mr-2 text-red-500" /> Mark as Rejected
                            </DropdownMenuItem>
                            <div className="h-px bg-muted my-1" />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="font-bold cursor-pointer text-xs opacity-70">
                              <Truck className="w-3.5 h-3.5 mr-2" /> (Legacy) Ship Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'DELIVERED')} className="font-bold cursor-pointer text-xs opacity-70">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> (Legacy) Deliver Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} className="font-bold cursor-pointer text-xs text-destructive opacity-70">
                              <XCircle className="w-3.5 h-3.5 mr-2" /> (Legacy) Cancel Order
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
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-black tracking-widest uppercase",
                          selectedOrder.status === 'PROCESSING' && "border-primary text-primary",
                          selectedOrder.status === 'SHIPPED' && "border-blue-500 text-blue-500",
                          selectedOrder.status === 'DELIVERED' && "border-green-500 text-green-500",
                          selectedOrder.status === 'COMPLETED' && "border-green-500 text-green-500",
                          selectedOrder.status === 'PENDING' && "border-yellow-500 text-yellow-500",
                          selectedOrder.status === 'CANCELLED' && "border-red-500 text-red-500",
                          selectedOrder.status === 'REJECTED' && "border-red-500 text-red-500"
                        )}
                      >
                        {selectedOrder.status.replace('_', ' ')}
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

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={(open) => {
        setIsConfirmDeleteOpen(open);
        if (!open) setOrdersToDelete([]);
      }}>
        <DialogContent className="sm:max-w-[450px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              CONFIRM DELETE
            </DialogTitle>
            <DialogDescription className="text-sm mt-2">
              Are you sure you want to permanently delete <strong className="text-foreground">{ordersToDelete.length}</strong> selected order(s)?
              <br /><br />
              <span className="text-red-500 font-bold block bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                This action is permanent and will delete the selected order records along with their purchased item histories. This cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={deleting}
              onClick={() => {
                setIsConfirmDeleteOpen(false);
                setOrdersToDelete([]);
              }}
              className="border-2 font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleBulkDelete}
              className="font-bold bg-red-600 hover:bg-red-700 text-white border-none px-4"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Forever"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
