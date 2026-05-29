"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* Admin Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-16 bottom-0 z-30 bg-card border-r border-border transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <span className={cn("font-black tracking-tighter text-lg", !isSidebarOpen && "hidden")}>
              ADMIN <span className="text-primary">PANEL</span>
            </span>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <nav className="space-y-2 flex-grow">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
                  pathname === link.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <link.icon className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium">{link.name}</span>}
                {pathname === link.href && !isSidebarOpen && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-border px-2">
            <Link href="/" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
              {isSidebarOpen && <span>Back to Site</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 p-8",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {children}
      </main>
    </div>
  );
}
