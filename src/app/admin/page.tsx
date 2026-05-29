"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  ArrowUpRight,
  Clock,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { showToast } from "@/lib/toast";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      showToast.error("Failed to load dashboard stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.slice(0, 6)); // Show last 6
    } catch (err) {
      showToast.error("Failed to load recent orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: DollarSign,
          change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
          trending: stats.revenueChange >= 0 ? "up" : "down",
        },
        {
          label: "Total Orders",
          value: stats.totalOrders.toString(),
          icon: ShoppingBag,
          change: `${stats.ordersChange >= 0 ? "+" : ""}${stats.ordersChange}%`,
          trending: stats.ordersChange >= 0 ? "up" : "down",
        },
        {
          label: "Total Customers",
          value: stats.totalCustomers.toString(),
          icon: Users,
          change: `${stats.customersChange >= 0 ? "+" : ""}${stats.customersChange}%`,
          trending: stats.customersChange >= 0 ? "up" : "down",
        },
        {
          label: "Products in Stock",
          value: `${stats.totalProducts - stats.outOfStock} / ${stats.totalProducts}`,
          icon: Package,
          change: stats.outOfStock > 0 ? `${stats.outOfStock} out of stock` : "All in stock",
          trending: stats.outOfStock === 0 ? "up" : "down",
        },
      ]
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROCESSING": return "border-primary text-primary";
      case "SHIPPED": return "border-blue-500 text-blue-500";
      case "DELIVERED": return "border-green-500 text-green-500";
      case "PENDING": return "border-yellow-500 text-yellow-500";
      case "CANCELLED": return "border-red-500 text-red-500";
      default: return "border-muted text-muted-foreground";
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">DASHBOARD OVERVIEW</h1>
          <p className="text-muted-foreground">Welcome back, admin. Here's what's happening today.</p>
        </div>
        <Button 
          variant="outline" 
          className="border-2 font-bold gap-2"
          onClick={() => { fetchStats(); fetchOrders(); }}
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 border-border animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </Card>
            ))
          : statCards.map((stat) => (
              <Card key={stat.label} className="p-6 bg-card border-border hover:border-primary/50 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${stat.trending === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                    {stat.trending === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                </div>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-6 border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Recent Orders
            </h3>
            <Button variant="ghost" size="sm" className="text-primary text-xs font-bold" asChild>
              <Link href="/admin/orders">View All <ArrowUpRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </div>
          {loadingOrders ? (
            <div className="py-12 flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="font-bold text-sm">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No orders yet. Share your store!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-xs">{order.id.slice(0, 10)}...</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{order.user?.name || "Anonymous"}</span>
                        <span className="text-[10px] text-muted-foreground">{timeAgo(order.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("text-[10px] font-black uppercase tracking-widest", getStatusColor(order.status))}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black">${parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-border">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <ArrowUpRight className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="space-y-3">
            <Button className="w-full justify-start font-bold bg-primary hover:bg-primary/90 h-11" asChild>
              <Link href="/admin/products">
                <Package className="w-4 h-4 mr-2" /> Manage Products
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start font-bold border-2 h-11" asChild>
              <Link href="/admin/orders">
                <ShoppingBag className="w-4 h-4 mr-2" /> Manage Orders
              </Link>
            </Button>
            <div className="pt-4 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Snapshot</p>
              {loadingStats ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}
                </div>
              ) : stats ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Orders</span>
                    <span className="font-bold">{orders.filter(o => o.status === "PENDING").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-bold text-primary">{orders.filter(o => o.status === "PROCESSING").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Out of Stock</span>
                    <span className={`font-bold ${stats.outOfStock > 0 ? "text-red-500" : "text-green-500"}`}>{stats.outOfStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Products</span>
                    <span className="font-bold">{stats.totalProducts}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
