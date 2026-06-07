"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, ShoppingBag, Users, DollarSign, Package, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getOrders(),
        ]);
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        showToast.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Revenue by status
  const revenueByStatus = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + parseFloat(order.totalAmount);
    return acc;
  }, {});

  // Orders by month (last 6 months)
  const monthlyOrders: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthlyOrders[key] = 0;
  }
  orders.forEach((order) => {
    const d = new Date(order.createdAt);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    if (key in monthlyOrders) monthlyOrders[key]++;
  });

  const maxMonthly = Math.max(...Object.values(monthlyOrders), 1);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500",
    PROCESSING: "bg-primary",
    SHIPPED: "bg-blue-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500",
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-bold">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">ANALYTICS</h1>
        <p className="text-muted-foreground">Store performance overview and insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "0.00"}`, icon: DollarSign, color: "text-green-500", glow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:border-green-500/30" },
          { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "text-primary", glow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:border-primary/30" },
          { label: "Total Customers", value: stats?.totalCustomers ?? 0, icon: Users, color: "text-blue-500", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/30" },
          { label: "Products Listed", value: stats?.totalProducts ?? 0, icon: Package, color: "text-purple-500", glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-purple-500/30" },
        ].map((kpi) => (
          <Card key={kpi.label} className={`p-6 border-border bg-card transition-all duration-300 group ${kpi.glow}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted/60 text-foreground group-hover:text-primary transition-colors">
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{kpi.label}</p>
            <p className="text-3xl font-black mt-1 font-mono text-foreground">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Orders Chart */}
        <Card className="p-6 border-border bg-card hover:shadow-[0_0_30px_rgba(249,115,22,0.03)] transition-all duration-300">
          <h3 className="font-bold flex items-center gap-2 mb-6 text-sm uppercase tracking-wider text-foreground">
            <BarChart3 className="w-4 h-4 text-primary" /> Orders — Last 6 Months
          </h3>
          <div className="relative flex items-end gap-3 h-52 pt-6 px-2">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              <div className="w-full border-t border-dashed border-foreground" />
              <div className="w-full border-t border-dashed border-foreground" />
              <div className="w-full border-t border-dashed border-foreground" />
              <div className="w-full border-t border-dashed border-foreground" />
            </div>
            
            {Object.entries(monthlyOrders).map(([month, count]) => {
              const heightPct = (count / maxMonthly) * 100;
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative z-10">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4 bg-muted/90 text-foreground text-[10px] font-bold px-2 py-0.5 rounded border border-border/80 font-mono shadow-md whitespace-nowrap">
                    {count} orders
                  </div>
                  
                  {/* Bar Container / Track */}
                  <div className="w-full bg-muted/20 rounded-lg h-full flex flex-col justify-end overflow-hidden relative border border-border/10">
                    {/* Animated Fill Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-md transition-all duration-700 min-h-[4px] relative group-hover:to-primary/90"
                      style={{ height: `${heightPct}%` }}
                    >
                      {/* Subtle reflection overlay */}
                      <div className="absolute inset-0 bg-white/[0.08] opacity-50 rounded-t-md" />
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-black tracking-wider uppercase">{month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Orders by Status */}
        <Card className="p-6 border-border bg-card hover:shadow-[0_0_30px_rgba(249,115,22,0.03)] transition-all duration-300">
          <h3 className="font-bold flex items-center gap-2 mb-6 text-sm uppercase tracking-wider text-foreground">
            <TrendingUp className="w-4 h-4 text-primary" /> Orders by Status
          </h3>
          <div className="space-y-5">
            {Object.entries(revenueByStatus).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No order data yet.</p>
            ) : (
              Object.entries(revenueByStatus).map(([status, revenue]) => {
                const count = orders.filter((o) => o.status === status).length;
                const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                return (
                  <div key={status} className="space-y-2 group cursor-pointer">
                    <div className="flex justify-between text-xs">
                      <span className="font-black tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{status}</span>
                      <span className="text-muted-foreground font-mono">{count} orders ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-muted/40 rounded-full border border-border/20 overflow-hidden p-[2px]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700 relative",
                          statusColors[status] || "bg-muted-foreground"
                        )}
                        style={{ width: `${pct}%` }}
                      >
                        {/* Glow and sheen */}
                        <div className="absolute inset-0 bg-white/[0.1] opacity-50" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Revenue by Status */}
      <Card className="p-6 border-border bg-card">
        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground mb-6">Revenue Breakdown by Order Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
            <div key={status} className="p-4 rounded-xl bg-muted/30 border border-border text-center hover:border-primary/20 transition-all duration-300">
              <div className={cn("w-2 h-2 rounded-full mx-auto mb-2", statusColors[status])} />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{status}</p>
              <p className="text-xl font-black text-foreground font-mono">${(revenueByStatus[status] || 0).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
