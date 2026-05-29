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
          { label: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 }) ?? "0.00"}`, icon: DollarSign, color: "text-green-500" },
          { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "text-primary" },
          { label: "Total Customers", value: stats?.totalCustomers ?? 0, icon: Users, color: "text-blue-500" },
          { label: "Products Listed", value: stats?.totalProducts ?? 0, icon: Package, color: "text-secondary" },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-6 border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{kpi.label}</p>
            <p className={`text-3xl font-black mt-1 ${kpi.color}`}>{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Orders Chart */}
        <Card className="p-6 border-border">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-primary" /> Orders — Last 6 Months
          </h3>
          <div className="flex items-end gap-3 h-40">
            {Object.entries(monthlyOrders).map(([month, count]) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-black text-primary">{count > 0 ? count : ""}</span>
                <div
                  className="w-full bg-primary/80 rounded-t-md transition-all duration-700 min-h-[4px]"
                  style={{ height: `${(count / maxMonthly) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-bold">{month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Orders by Status */}
        <Card className="p-6 border-border">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-primary" /> Orders by Status
          </h3>
          <div className="space-y-4">
            {Object.entries(revenueByStatus).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No order data yet.</p>
            ) : (
              Object.entries(revenueByStatus).map(([status, revenue]) => {
                const count = orders.filter((o) => o.status === status).length;
                const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                return (
                  <div key={status} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">{status}</span>
                      <span className="text-muted-foreground">{count} orders ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${statusColors[status] || "bg-muted-foreground"} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Revenue by Status */}
      <Card className="p-6 border-border">
        <h3 className="font-bold mb-6">Revenue Breakdown by Order Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
            <div key={status} className="p-4 rounded-xl bg-muted/30 border border-border text-center">
              <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${statusColors[status]}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{status}</p>
              <p className="text-lg font-black">${(revenueByStatus[status] || 0).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
