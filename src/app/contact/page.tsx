"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

const SUPPORT_CATEGORIES = [
  { id: "order", title: "Order Support", icon: ShoppingBag, description: "Modify order, item issues, cancellation request" },
  { id: "payment", title: "Payment Support", icon: CreditCard, description: "Failed payments, double charge, checkout errors" },
  { id: "tracking", title: "Order Tracking", icon: Truck, description: "Courier details, delayed shipping, delivery proof" },
  { id: "refunds", title: "Returns & Refunds", icon: RefreshCw, description: "Exchange garment size, return guidelines, refund status" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "order",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate API request submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      showToast.success("Support request submitted successfully!");
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "order",
      message: ""
    });
    setSuccess(false);
  };

  return (
    <div className="container px-6 mx-auto pt-36 pb-24 bg-background text-foreground">
      {/* Title block */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.22em]">Customer Care Hub</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">CONTACT US</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Need support with your custom graphics order or standard garments? Send us a message and our support league will assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
        {/* Direct Categories Help & Brand info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-muted-foreground">Self-Service Portals</h2>
            <div className="grid grid-cols-1 gap-4">
              {SUPPORT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Card key={cat.id} className="p-4 bg-card/40 border-border/40 hover:border-primary/30 transition-all rounded-xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-wider">{cat.title}</h3>
                      <p className="text-[11px] text-muted-foreground leading-normal">{cat.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <h2 className="text-lg font-black uppercase tracking-wider text-muted-foreground">Direct Assistance</h2>
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground font-semibold">Email support:</p>
                  <a href="mailto:support@foxfalcon.com" className="font-bold hover:text-primary transition-colors">support@foxfalcon.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground font-semibold">Contact hotline:</p>
                  <a href="tel:+18005557788" className="font-bold hover:text-primary transition-colors">+1 (800) 555-7788</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-muted-foreground font-semibold">Response timing:</p>
                  <p className="font-bold">Mon - Sat: 9:00 AM - 6:00 PM (EST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Request Form */}
        <div className="lg:col-span-7">
          <Card className="p-8 border border-border/40 bg-card rounded-2xl shadow-xl dark:shadow-black/50">
            {success ? (
              <div className="py-16 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Inquiry Received</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you for contacting Fox Falcon. We have catalogued your support ticket under #{Math.floor(100000 + Math.random() * 900000)}. Our support representatives will get back to you within 12-24 business hours.
                  </p>
                </div>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="border-2 font-black uppercase tracking-wider text-xs px-8 h-12 rounded-xl active-scale"
                >
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> SUBMIT SUPPORT TICKET
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estimated response within 24 hours</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Name *</label>
                    <Input 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-muted/20 border-border h-11 focus-visible:ring-primary/40 rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Email *</label>
                    <Input 
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-muted/20 border-border h-11 focus-visible:ring-primary/40 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Subject</label>
                    <Input 
                      placeholder="e.g. Delivery status"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-muted/20 border-border h-11 focus-visible:ring-primary/40 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Inquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-muted/20 border border-border h-11 text-xs rounded-xl px-3 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 font-bold uppercase tracking-wider"
                    >
                      <option value="order">Order & Garments</option>
                      <option value="payment">Checkout & Transactions</option>
                      <option value="tracking">Shipping & Tracking</option>
                      <option value="refunds">Refunds & Returns</option>
                      <option value="miscellaneous">Miscellaneous Info</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message Details *</label>
                  <textarea
                    placeholder="Provide full description of your inquiry (order ID, item name, sizing details etc.) to help our support team act quickly."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full min-h-[140px] bg-muted/20 border border-border text-sm rounded-xl px-4 py-3 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 font-medium"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-13 text-xs font-black uppercase tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl active-scale shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> REGISTERING SUPPORT TICKET...
                    </span>
                  ) : "SUBMIT TICKET"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
