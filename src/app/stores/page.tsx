"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Compass, 
  Info, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STORES = [
  {
    id: "mumbai-flagship",
    name: "Mumbai Flagship Store",
    city: "Mumbai",
    address: "Colaba Causeway, Near Gateway of India, Mumbai, MH 400001",
    phone: "+91 22 2284 8899",
    hours: "11:00 AM - 9:30 PM (Daily)",
    features: ["Full Collection", "Custom Lab", "Styling Lounge", "Express Pickup"],
    isFlagship: true,
    coordinates: { lat: 18.9220, lng: 72.8347 }
  },
  {
    id: "delhi-select",
    name: "Delhi Concept Store",
    city: "Delhi",
    address: "Connaught Place, Inner Circle, New Delhi, DL 110001",
    phone: "+91 11 4152 4433",
    hours: "11:00 AM - 9:00 PM (Daily)",
    features: ["Latest Drops", "Heavyweights Collection", "Fitting Rooms"],
    isFlagship: false,
    coordinates: { lat: 28.6304, lng: 77.2177 }
  },
  {
    id: "bangalore-experience",
    name: "Bangalore Experience Centre",
    city: "Bangalore",
    address: "100 Feet Road, Indiranagar, Bengaluru, KA 560038",
    phone: "+91 80 4115 1122",
    hours: "11:00 AM - 10:00 PM (Daily)",
    features: ["Full Collection", "Rider Lounge", "Custom Lab", "Tailor Station"],
    isFlagship: true,
    coordinates: { lat: 12.9719, lng: 77.5946 }
  },
  {
    id: "ahmedabad-retail",
    name: "Ahmedabad Outlet",
    city: "Ahmedabad",
    address: "CG Road, Navrangpura, Ahmedabad, GJ 380009",
    phone: "+91 79 2640 5566",
    hours: "11:00 AM - 9:00 PM (Daily)",
    features: ["Core Collection", "Fitting Rooms", "Express Pickup"],
    isFlagship: false,
    coordinates: { lat: 23.0225, lng: 72.5714 }
  }
];

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState(STORES[0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      if (query) {
        const decodedQuery = decodeURIComponent(query);
        setSearchQuery(decodedQuery);
        // Autoselect the first matching store if found
        const queryLower = decodedQuery.toLowerCase().trim();
        const firstMatch = STORES.find((store) => 
          store.name.toLowerCase().includes(queryLower) ||
          store.city.toLowerCase().includes(queryLower) ||
          store.address.toLowerCase().includes(queryLower)
        );
        if (firstMatch) {
          setSelectedStore(firstMatch);
        }
      }
    }
  }, []);

  const filteredStores = STORES.filter((store) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      store.name.toLowerCase().includes(query) ||
      store.city.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container px-6 mx-auto pt-36 pb-24 bg-background text-foreground">
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.22em]">Explore Physical Outlets</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">STORE LOCATOR</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Visit a Fox Falcon physical retail experience center to try premium fabrics, test custom design fits, or access the rider lounge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* Store search and list */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <Input
              placeholder="Search by city or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-muted/30 border-border focus-visible:ring-primary/40 rounded-xl"
            />
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredStores.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Compass className="w-12 h-12 mx-auto stroke-1 animate-pulse text-muted-foreground/60 mb-2" />
                <p className="font-bold text-xs uppercase tracking-wider">No retail outlets match your search.</p>
              </div>
            ) : (
              filteredStores.map((store) => {
                const isSelected = selectedStore.id === store.id;
                return (
                  <Card 
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={cn(
                      "p-5 border cursor-pointer transition-all duration-300 rounded-2xl flex flex-col gap-3 group active-scale-98 select-none",
                      isSelected 
                        ? "border-primary bg-card ring-1 ring-primary/25 shadow-md" 
                        : "border-border/40 bg-card/40 hover:border-primary/30"
                    )}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <h3 className={cn("text-sm font-black uppercase tracking-tight transition-colors", isSelected ? "text-primary" : "group-hover:text-primary")}>
                          {store.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{store.city}</p>
                      </div>
                      {store.isFlagship && (
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-wider px-2 py-0.5 shrink-0 flex items-center gap-1 font-sans">
                          <Award className="w-2.5 h-2.5" /> Flagship
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5 font-sans text-xs text-muted-foreground">
                      <p className="flex items-start gap-2 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{store.phone}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border/20 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>Open: {store.hours.split(" (")[0]}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform text-muted-foreground", isSelected ? "text-primary translate-x-1" : "group-hover:translate-x-0.5")} />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic map preview and selected store details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Mock premium map display card */}
          <Card className="relative overflow-hidden aspect-video w-full border border-border/40 rounded-2xl shadow-xl bg-slate-900 group">
            {/* Styled grid and graphic background representing digital map */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-slate-950/40" />
            
            {/* Mock map pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 z-10 w-12 h-12 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute -top-3 -left-3 z-20 w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center shadow-lg border border-primary/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
              </div>
            </div>

            {/* Top map controls mock */}
            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-[9px] text-white font-black tracking-widest uppercase">
              <Compass className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: "8s" }} />
              <span>DIGITAL RADAR: SYNCED</span>
            </div>

            {/* Bottom map metadata mock */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl flex justify-between items-center gap-4 text-white">
              <div className="space-y-0.5">
                <span className="text-[8px] text-primary font-black uppercase tracking-widest">Selected Location Coordinates</span>
                <p className="text-xs font-bold font-mono">LAT: {selectedStore.coordinates.lat.toFixed(4)}° N / LNG: {selectedStore.coordinates.lng.toFixed(4)}° E</p>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-wider h-8 rounded-lg flex items-center gap-1.5">
                <span>View Map</span> <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </Card>

          {/* Selected Store Detailed Info Card */}
          <Card className="p-6 border border-border/40 bg-card rounded-2xl shadow-premium space-y-5">
            <div className="flex justify-between items-start border-b border-border/40 pb-4">
              <div>
                <span className="text-primary text-[9px] font-black uppercase tracking-widest">Active Store Details</span>
                <h2 className="text-2xl font-black uppercase tracking-tight">{selectedStore.name}</h2>
              </div>
              <Badge className="bg-muted border border-border/60 text-foreground text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                {selectedStore.city}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider"><MapPin className="w-3.5 h-3.5 text-primary" /> Retail Address</p>
                  <p className="font-bold text-foreground leading-relaxed pl-5">{selectedStore.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider"><Phone className="w-3.5 h-3.5 text-primary" /> Store Hotline</p>
                  <p className="font-bold text-foreground pl-5">{selectedStore.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider"><Clock className="w-3.5 h-3.5 text-primary" /> Working Hours</p>
                  <p className="font-bold text-foreground pl-5">{selectedStore.hours}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider"><Sparkles className="w-3.5 h-3.5 text-primary" /> Store Features</p>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {selectedStore.features.map((feat) => (
                      <span key={feat} className="text-[9px] font-black uppercase tracking-wider bg-muted/60 border border-border px-2 py-0.5 rounded-full select-none text-muted-foreground">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Call store hotline for custom design slots & appointment bookings.</span>
              </span>
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs uppercase tracking-wider px-6 h-11 rounded-xl shadow-lg shadow-primary/20">
                Get Directions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
