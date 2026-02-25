import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Leaf, Users, TrendingUp, Globe, ArrowRight, Shield,
  CheckCircle2, BarChart3, MapPin, Building2, ChevronDown
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Corporate = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const stats = [
    { value: "12,500+", label: "Farmers Enrolled", icon: Users },
    { value: "48,000", label: "tCO₂e Sequestered", icon: Leaf },
    { value: "₹2.4 Cr", label: "Paid to Farmers", icon: TrendingUp },
    { value: "3 States", label: "Project Clusters", icon: Globe },
  ];

  const certifiedBatches = [
    { id: "NB-2025-H1", origin: "Haryana", credits: 8500, methodology: "AMS-III.AU (DSR)", verifiedDate: "15 Nov 2025", buyer: "Available" },
    { id: "NB-2025-P1", origin: "Punjab", credits: 12000, methodology: "AMS-III.BF (Happy Seeder)", verifiedDate: "01 Dec 2025", buyer: "Reserved" },
    { id: "NB-2025-M1", origin: "Maharashtra", credits: 5200, methodology: "AMS-III.AU (Mulching)", verifiedDate: "20 Oct 2025", buyer: "Sold" },
  ];

  // Impact Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [22.5, 78], zoom: 5, scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const clusters = [
      { name: "Haryana", coords: [29.0, 76.0] as [number, number], farmers: 5200, credits: 8500 },
      { name: "Punjab", coords: [30.9, 75.8] as [number, number], farmers: 4800, credits: 12000 },
      { name: "Maharashtra", coords: [19.7, 75.7] as [number, number], farmers: 2500, credits: 5200 },
    ];

    clusters.forEach((c) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:hsl(122 39% 33%);color:white;padding:8px 14px;border-radius:12px;font-size:13px;font-weight:600;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
          ${c.name}<br/><span style="font-size:11px;opacity:0.8">${c.farmers.toLocaleString()} farmers</span>
        </div>`,
        iconSize: [100, 50],
        iconAnchor: [50, 25],
      });
      L.marker(c.coords, { icon }).addTo(map);
      L.circle(c.coords, { radius: 50000, color: "hsl(122,39%,33%)", fillOpacity: 0.15, weight: 2 }).addTo(map);
    });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-forest" />
            <span className="text-xl font-bold text-soil">NamastuBharat</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#impact" className="hover:text-forest transition-colors">Impact</a>
            <a href="#marketplace" className="hover:text-forest transition-colors">Marketplace</a>
            <a href="#transparency" className="hover:text-forest transition-colors">Transparency</a>
            <a href="#contact" className="hover:text-forest transition-colors">Contact</a>
          </div>
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 rounded-xl text-sm font-medium text-forest border border-forest hover:bg-forest/5 transition-colors">
              Farmer App
            </a>
            <a href="/admin" className="px-4 py-2 rounded-xl text-sm font-medium bg-forest text-primary-foreground hover:bg-forest-dark transition-colors">
              Corporate Login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 text-forest text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              High-Integrity Carbon Credits
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-soil leading-tight mb-6">
              Green Income for <span className="text-forest">Farmers</span>.
              <br />
              Clean Credits for <span className="text-forest">Corporates</span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              India's first Digital MRV platform connecting sustainable farming practices
              to verified carbon credits — powered by satellite data and blockchain transparency.
            </p>
            <div className="flex gap-4">
              <a href="/" className="btn-primary inline-flex items-center gap-2 !rounded-xl">
                I'm a Farmer <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#marketplace" className="btn-amber inline-flex items-center gap-2 !rounded-xl !shadow-none">
                <Building2 className="w-4 h-4" /> Buy Credits
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="card-earth text-center">
                <stat.icon className="w-8 h-8 text-forest mx-auto mb-2" />
                <p className="text-2xl font-bold text-soil">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Map */}
      <section id="impact" className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-soil mb-4">Live Impact Map</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time view of our project clusters across India — every dot represents farmers earning from sustainable agriculture.
            </p>
          </div>
          <div ref={mapRef} className="w-full h-[500px] rounded-2xl shadow-lg border border-border overflow-hidden" />
        </div>
      </section>

      {/* Transparency Hub */}
      <section id="transparency" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-soil mb-4">Transparency Hub</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every tonne of CO₂ sequestered. Every rupee paid. Fully verifiable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-forest text-center">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <p className="text-4xl font-bold">48,000</p>
              <p className="text-sm opacity-80 mt-1">Total tCO₂e Sequestered</p>
            </div>
            <div className="card-earth text-center">
              <TrendingUp className="w-10 h-10 text-forest mx-auto mb-3" />
              <p className="text-4xl font-bold text-soil">₹2.4 Cr</p>
              <p className="text-sm text-muted-foreground mt-1">Total Farmer Payments</p>
            </div>
            <div className="card-earth text-center">
              <Users className="w-10 h-10 text-amber mx-auto mb-3" />
              <p className="text-4xl font-bold text-soil">12,500+</p>
              <p className="text-sm text-muted-foreground mt-1">Registered Farmers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-soil mb-4">Certified Batches</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Carbon Credit Certificates verified by Carbon Check (ACVA) under BEE/ISO 14064 standards.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {certifiedBatches.map((batch) => (
              <motion.div key={batch.id} className="card-earth" whileHover={{ y: -4 }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-bold text-forest text-sm">{batch.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    batch.buyer === "Available" ? "bg-forest/10 text-forest" :
                    batch.buyer === "Reserved" ? "bg-amber/20 text-amber-dark" :
                    "bg-muted text-muted-foreground"
                  }`}>{batch.buyer}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="font-medium text-soil">{batch.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits</span>
                    <span className="font-medium text-soil">{batch.credits.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Methodology</span>
                    <span className="font-medium text-soil text-xs">{batch.methodology}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verified</span>
                    <span className="font-medium text-soil">{batch.verifiedDate}</span>
                  </div>
                </div>
                {batch.buyer === "Available" && (
                  <button className="w-full mt-4 btn-primary !py-3 !text-sm flex items-center justify-center gap-2">
                    Request Quote <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6 bg-soil text-primary-foreground">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6" />
              <span className="text-lg font-bold">NamastuBharat (OPC) Pvt Ltd</span>
            </div>
            <p className="text-sm opacity-70">
              India's Digital MRV Platform for High-Integrity Carbon Credits
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="/" className="hover:opacity-100">Farmer App</a></li>
              <li><a href="/admin" className="hover:opacity-100">Admin Portal</a></li>
              <li><a href="#impact" className="hover:opacity-100">Impact Map</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm opacity-70">info@namastubharat.in</p>
            <p className="text-sm opacity-70 mt-1">New Delhi, India</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-50">
          © 2025 NamastuBharat (OPC) Pvt Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Corporate;
