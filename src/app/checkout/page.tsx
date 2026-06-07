"use client";

import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Truck, ShieldCheck, ArrowRight, Loader2, MapPin, ChevronDown, Plus, BadgePercent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { showToast } from "@/lib/toast";
import { userApi, checkoutApi } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-border", className)} />
);

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Saved addresses
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // New address form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [saveAddress, setSaveAddress] = useState(true);

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "COD">("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  // Load user's saved addresses
  useEffect(() => {
    if (!session) return;
    const load = async () => {
      try {
        setLoadingAddresses(true);
        const data = await userApi.getAddresses();
        setAddresses(data);
        const def = data.find((a: any) => a.isDefault) || data[0];
        if (def) {
          setSelectedAddressId(def.id);
          setUseNewAddress(false);
        } else {
          setUseNewAddress(true);
        }
      } catch (_) {
        setUseNewAddress(true);
      } finally {
        setLoadingAddresses(false);
      }
    };
    load();
  }, [session]);

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      showToast.error("Please log in to checkout.");
      router.push("/login");
      return;
    }

    // Validate Dummy Card details if Credit Card option selected
    if (paymentMethod === "CARD") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        showToast.error("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || !cardExpiry.includes("/")) {
        showToast.error("Please enter a valid expiry (MM/YY).");
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        showToast.error("Please enter a valid CVC code.");
        return;
      }
      if (!cardName) {
        showToast.error("Please enter the cardholder name.");
        return;
      }
    }

    setLoading(true);

    try {
      let addressId = selectedAddressId;

      // If using a new address form, create address first
      if (useNewAddress || !addressId) {
        if (!street || !city || !state || !postalCode) {
          showToast.error("Please fill in all address fields.");
          setLoading(false);
          return;
        }

        const fullName = `${firstName} ${lastName}`.trim();
        const saved = await userApi.createAddress({
          street: `${fullName ? fullName + ", " : ""}${street}`,
          city,
          state,
          postalCode,
          country,
          isDefault: addresses.length === 0 || saveAddress,
        });
        addressId = saved.id;
      }

      const data = await checkoutApi.createSession({ 
        items, 
        addressId,
        paymentMethod,
        cardDetails: paymentMethod === "CARD" ? { cardNumber, cardExpiry, cardCvc, cardName } : null
      });

      if (data.success) {
        showToast.success(
          paymentMethod === "CARD" 
            ? "Dummy Card Payment Successful! Order Placed." 
            : "Cash on Delivery selected! Order Placed Successfully."
        );
        clearCart();
        router.push("/profile");
      } else {
        throw new Error("Checkout session failed");
      }
    } catch (error) {
      showToast.error("Something went wrong with checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="container px-6 mx-auto pt-32 pb-20 max-w-6xl text-foreground bg-background">
      <h1 className="text-5xl font-black tracking-tighter mb-12 uppercase">CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping & Payment Form */}
        <form onSubmit={onCheckout} className="lg:col-span-7 space-y-8">
          
          {/* Shipping Address Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping Address
            </h3>

            {!session ? (
              <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground mb-3">You need to be logged in to checkout.</p>
                <Button asChild className="bg-primary font-bold">
                  <Link href="/login">Login to Continue</Link>
                </Button>
              </div>
            ) : loadingAddresses ? (
              <div className="flex items-center gap-3 text-muted-foreground p-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="font-bold text-sm">Loading saved addresses...</span>
              </div>
            ) : addresses.length > 0 && !useNewAddress ? (
              <div className="space-y-4">
                {/* Saved Address Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-auto py-4 px-4 justify-between border border-border bg-muted/20 font-medium text-left rounded-xl active-scale">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4.5 h-4.5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-sm text-foreground">{selectedAddress?.street}</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postalCode}, {selectedAddress?.country}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[320px] bg-card border-border">
                    {addresses.map(addr => (
                      <DropdownMenuItem
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className="font-medium py-3 cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-sm text-foreground">{addr.street}</p>
                          <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.postalCode}</p>
                        </div>
                        {addr.isDefault && <span className="ml-auto text-[10px] text-primary font-black uppercase tracking-wider px-2 py-0.5 border border-primary/20 bg-primary/5 rounded">Default</span>}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary hover:text-primary/90 hover:bg-primary/5 font-bold text-sm gap-2"
                  onClick={() => setUseNewAddress(true)}
                >
                  <Plus className="w-4.5 h-4.5" /> Use a different address
                </Button>
              </div>
            ) : (
              /* New Address Form */
              <div className="space-y-4">
                {addresses.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-primary font-bold text-sm gap-2 -mt-2 hover:bg-primary/5"
                    onClick={() => setUseNewAddress(false)}
                  >
                    ← Use saved address
                  </Button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">First Name</Label>
                    <Input id="firstName" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-muted/30 border-border rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} className="bg-muted/30 border-border rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Street Address</Label>
                  <Input id="address" placeholder="123 Street Name" value={street} onChange={e => setStreet(e.target.value)} required className="bg-muted/30 border-border rounded-xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs font-black uppercase tracking-widest text-muted-foreground">City</Label>
                    <Input id="city" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required className="bg-muted/30 border-border rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-xs font-black uppercase tracking-widest text-muted-foreground">State</Label>
                    <Input id="state" placeholder="State" value={state} onChange={e => setState(e.target.value)} required className="bg-muted/30 border-border rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Postal Code</Label>
                    <Input id="postalCode" placeholder="000000" value={postalCode} onChange={e => setPostalCode(e.target.value)} required className="bg-muted/30 border-border rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Country</Label>
                  <Input id="country" placeholder="India" value={country} onChange={e => setCountry(e.target.value)} required className="bg-muted/30 border-border rounded-xl" />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={e => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <label htmlFor="saveAddress" className="text-xs font-bold cursor-pointer text-muted-foreground select-none">Save this address for future orders</label>
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Payment Method Selector */}
          <div className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={cn(
                  "p-5 rounded-2xl border-2 flex flex-col items-start text-left gap-2 transition-all duration-300 active-scale",
                  paymentMethod === "CARD" 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-foreground">Credit / Debit Card</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Pay securely with dummy card details</p>
                </div>
              </button>

              {/* Option 2: COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={cn(
                  "p-5 rounded-2xl border-2 flex flex-col items-start text-left gap-2 transition-all duration-300 active-scale",
                  paymentMethod === "COD" 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-foreground">Cash on Delivery (COD)</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Pay in cash when order is delivered</p>
                </div>
              </button>
            </div>

            {/* Dummy Credit Card Mockup & Inputs */}
            {paymentMethod === "CARD" && (
              <div className="space-y-6">
                
                {/* Physical Card Mockup */}
                <div className="w-full flex justify-center py-4 perspective-1000">
                  <div 
                    className={cn(
                      "relative w-full max-w-[340px] h-[200px] transition-transform duration-700 transform-style-3d shadow-[0_15px_35px_rgba(249,115,22,0.1)] rounded-2xl border border-white/10",
                      isFlipped && "rotate-y-180"
                    )}
                  >
                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 backface-hidden flex flex-col justify-between overflow-hidden border border-white/5">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent opacity-60 pointer-events-none" />
                      
                      {/* Metal chip and network logo */}
                      <div className="flex justify-between items-start z-10">
                        <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border border-yellow-200/20 relative overflow-hidden">
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/10" />
                          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary/70 font-mono">FOX FALCON METAL</span>
                      </div>
                      
                      {/* Card Number */}
                      <div className="text-xl font-black font-mono tracking-widest text-white/95 mt-4 drop-shadow-md z-10">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      
                      {/* Holder & Expiry */}
                      <div className="flex justify-between items-end mt-2 text-white/80 z-10">
                        <div className="space-y-1 max-w-[70%]">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block">Card Holder</span>
                          <span className="text-xs font-black uppercase tracking-wider truncate block">{cardName || "YOUR NAME"}</span>
                        </div>
                        <div className="space-y-1 text-right shrink-0">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block">Expires</span>
                          <span className="text-xs font-mono font-bold block">{cardExpiry || "MM/YY"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 backface-hidden rotate-y-180 flex flex-col justify-between py-6 overflow-hidden border border-white/5">
                      {/* Black magnetic strip */}
                      <div className="w-full h-9 bg-black mt-1" />
                      
                      {/* Signature strip and CVC */}
                      <div className="px-6 space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          <span>Authorized Signature</span>
                          <span>CVC</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-8 bg-zinc-800/80 rounded border border-white/5 flex items-center px-3 text-zinc-500 font-serif italic text-xs select-none">
                            Fox Falcon Exclusive Client
                          </div>
                          <div className="w-14 h-8 bg-white text-black font-mono font-bold text-sm flex items-center justify-center rounded shadow-inner tracking-widest">
                            {cardCvc || "•••"}
                          </div>
                        </div>
                      </div>
                      
                      {/* Disclosures */}
                      <div className="px-6 text-[7px] text-zinc-600 text-center uppercase tracking-wider leading-relaxed font-bold">
                        For testing purposes only. Sandbox transaction system simulated.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <BadgePercent className="w-3.5 h-3.5" /> SECURE SANDBOX SIMULATOR
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const matches = val.match(/\d{4,16}/g);
                        const match = (matches && matches[0]) || "";
                        const parts = [];
                        for (let i = 0, len = match.length; i < len; i += 4) {
                          parts.push(match.substring(i, i + 4));
                        }
                        if (parts.length > 0) {
                          setCardNumber(parts.join(" "));
                        } else {
                          setCardNumber(val);
                        }
                      }}
                      required
                      className="bg-background border-border text-foreground font-mono font-bold rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length >= 2) {
                            setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                          } else {
                            setCardExpiry(val);
                          }
                        }}
                        required
                        className="bg-background border-border font-mono font-bold rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc" className="text-xs font-black uppercase tracking-widest text-muted-foreground">CVC / CVV</Label>
                      <Input
                        id="cardCvc"
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        onFocus={() => setIsFlipped(true)}
                        onBlur={() => setIsFlipped(false)}
                        required
                        className="bg-background border-border font-mono font-bold rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="JOHN DOE"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      required
                      className="bg-background border-border uppercase font-bold rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "COD" && (
              <div className="p-5 rounded-2xl border border-border/80 bg-muted/20 text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-relaxed">
                📢 Cash on delivery order confirmation notice. Please ensure someone is available at your physical shipping address with exact change when our courier executive arrives.
              </div>
            )}
          </div>

          <Button 
            type="submit"
            disabled={loading || !session}
            className="w-full h-14 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/95 group rounded-xl active-scale"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary-foreground" />
            ) : (
              <>
                Complete Order (${total.toFixed(2)}) <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-4.5 h-4.5 text-green-500" />
            100% SECURE DUMMY SANDBOX CHECKOUT
          </div>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border border-border bg-card/60 rounded-2xl sticky top-32">
            <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase">ORDER SUMMARY</h2>
            
            <div className="space-y-5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black border border-border shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover animate-fade-in" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-black text-sm uppercase tracking-tight text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Qty: <span className="font-mono text-primary">{item.quantity}</span>{item.size ? ` | Size: ${item.size}` : ""}{item.color ? ` | Color: ${item.color}` : ""}
                    </p>
                    <p className="text-sm font-black text-primary font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 space-y-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono text-foreground">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-[9px] text-green-500 font-black uppercase tracking-widest">🎉 Free shipping applied to order!</p>
              )}
              <Separator className="bg-border/60" />
              <div className="flex justify-between text-lg font-black text-foreground">
                <span>Total</span>
                <span className="text-primary font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
