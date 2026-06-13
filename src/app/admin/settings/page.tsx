"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Settings, ShieldAlert, Database, Globe, Bell, Palette, Save, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{children}</label>
);

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter">SETTINGS</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Store Info */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-wider text-foreground">
              <Globe className="w-4 h-4 text-primary" /> Store Information
            </h3>
            <div className="space-y-5 max-w-md">
              <div className="space-y-1">
                <Label>Store Name</Label>
                <Input defaultValue="Fox Falcon" className="bg-muted/30 border-border" />
              </div>
              <div className="space-y-1">
                <Label>Store URL</Label>
                <Input defaultValue={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} disabled className="bg-muted/50 border-border text-muted-foreground font-mono text-xs cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <Label>Support Email</Label>
                <Input defaultValue="support@foxfalcon.com" className="bg-muted/30 border-border" />
              </div>
              <Button className="bg-primary hover:bg-primary/90 font-bold gap-2 h-11 px-6 active-scale">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-wider text-foreground">
              <Bell className="w-4 h-4 text-primary" /> Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: "New Order Notifications", desc: "Get notified when a new order is placed" },
                { label: "Low Stock Alerts", desc: "Alert when product inventory drops below 10" },
                { label: "Customer Sign-up Alerts", desc: "Notify on new user registrations" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/10 border border-border/80 hover:border-primary/20 transition-all duration-300">
                  <div>
                    <p className="font-bold text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className="relative flex items-center">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-wider text-foreground">
              <Palette className="w-4 h-4 text-primary" /> Appearance
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Theme</Label>
                <div className="flex gap-2 bg-muted/30 p-1 rounded-xl border border-border w-fit">
                  {["dark", "light", "system"].map((t) => {
                    const isActive = mounted && theme === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Admin Profile */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-wider text-foreground">
              <Settings className="w-4 h-4 text-primary" /> Admin Profile
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black">
                  {session?.user?.name?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{session?.user?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest gap-1 px-2.5 py-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Admin Access
              </Badge>
            </div>
          </Card>

          {/* Database Status */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-black flex items-center gap-2 mb-4 text-sm uppercase tracking-wider text-foreground">
              <Database className="w-4 h-4 text-primary" /> Database
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Provider</span>
                <Badge variant="outline" className="text-[10px] font-black border-green-500/20 bg-green-500/5 text-green-500 font-mono">PostgreSQL</Badge>
              </div>
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">ORM</span>
                <span className="font-bold text-xs font-mono">Prisma 7</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold text-green-500 text-xs font-mono uppercase tracking-wider">Connected</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Host</span>
                <span className="font-bold text-xs font-mono">Neon (Serverless)</span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/20 bg-destructive/5 hover:border-destructive/30 transition-all duration-300">
            <h3 className="font-black text-destructive flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">These actions are irreversible and will wipe settings or metadata. Proceed with caution.</p>
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-bold transition-all" disabled>
              Clear All Orders
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
