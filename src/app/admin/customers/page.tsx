"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Loader2,
  MoreVertical,
  ShoppingBag,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  Eye,
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
  TableRow,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showToast } from "@/lib/toast";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      showToast.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">CUSTOMERS</h1>
          <p className="text-muted-foreground">
            Manage your registered users and their order history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2 border-border flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-black text-lg">{customers.length}</span>
            <span className="text-xs text-muted-foreground font-medium">Total</span>
          </Card>
        </div>
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 bg-muted/30 border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-bold">Loading customers...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-bold">Customer</TableHead>
                  <TableHead className="font-bold">Joined</TableHead>
                  <TableHead className="font-bold">Orders</TableHead>
                  <TableHead className="font-bold">Total Spent</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-border">
                          <AvatarImage src={customer.image || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                            {customer.name?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{customer.name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(customer.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                        <span className="font-bold">{customer._count?.orders ?? 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-primary">
                      ${parseFloat(customer.totalSpent || "0").toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {customer._count?.orders > 0 ? (
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-green-500 text-green-500 flex items-center gap-1 w-fit">
                          <UserCheck className="w-3 h-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-muted text-muted-foreground flex items-center gap-1 w-fit">
                          <UserX className="w-3 h-3" /> No Orders
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="font-bold cursor-pointer"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="font-bold cursor-pointer"
                            onClick={() => window.open(`mailto:${customer.email}`)}
                          >
                            <Mail className="w-4 h-4 mr-2" /> Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background border-border max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">CUSTOMER DETAILS</DialogTitle>
                <DialogDescription>
                  Full profile and order history for this customer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                {/* Profile */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                  <Avatar className="w-16 h-16 border-2 border-border">
                    <AvatarImage src={selectedCustomer.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                      {selectedCustomer.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-black text-lg">{selectedCustomer.name || "Anonymous"}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(selectedCustomer.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-3xl font-black text-primary">{selectedCustomer._count?.orders ?? 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-3xl font-black text-primary">${parseFloat(selectedCustomer.totalSpent || "0").toFixed(2)}</p>
                  </div>
                </div>

                {/* Addresses */}
                {selectedCustomer.addresses?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Saved Addresses</h4>
                    {selectedCustomer.addresses.map((addr: any) => (
                      <div key={addr.id} className="p-3 rounded-lg bg-muted/10 border border-border text-sm text-muted-foreground">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        {addr.isDefault && (
                          <span className="ml-2 text-[10px] text-primary font-black uppercase">Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-border">
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
