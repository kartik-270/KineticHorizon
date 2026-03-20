"use client";

import { useEffect, useState, Suspense } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Heart, Search, CheckCircle2, ArrowLeft, Globe, Droplets, GraduationCap, Trees, Landmark } from "lucide-react";
import api from "../../../lib/api";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";

const ICONS: any = { Droplets, GraduationCap, Trees, Heart, Landmark };

function CharityHubContent() {
  const [charities, setCharities] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [donatingId, setDonatingId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const charity = searchParams.get('charity');

    if (success) {
      toast.success(`Contribution confirmed for ${charity}!`, {
        description: "Your direct impact has been recorded in the matrix.",
      });
    }
    if (canceled) {
      toast.error("Donation sequence aborted.");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const [charRes, userRes] = await Promise.all([
          api.get("/charities"),
          api.get("/user/dashboard")
        ]);
        setCharities(charRes.data);
        setSelectedId(userRes.data.profile?.charityId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleSelect = async (id: string) => {
    try {
      await api.post("/charities/select", { charityId: id });
      setSelectedId(id);
      toast.success("Default charity updated", {
        description: "Future platform contributions will be redirected here."
      });
    } catch (err) {
      toast.error("Failed to update charity protocol.");
    }
  };

  const handleDirectDonate = async (id: string) => {
    try {
      setDonatingId(id);
      const res = await api.post(`/charities/${id}/donate`, { amount: 25 }); // Default 25 units
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error("Stripe gateway initialization failed.");
    } finally {
      setDonatingId(null);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors mb-12 group uppercase tracking-widest text-[10px] font-bold">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Dashboard
      </Link>

      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Impact Matrix</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline text-white italic">Charity Hub</h1>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input className="w-full bg-surface-container-high border border-outline-variant/10 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-all" placeholder="Search mission types..." />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map((c: any) => {
          const Icon = ICONS[c.icon] || Heart;
          return (
            <Card key={c.id} className={cn(
              "group relative border-2 transition-all p-0 overflow-hidden flex flex-col",
              selectedId === c.id ? "border-primary bg-primary/5" : "border-transparent hover:border-white/10"
            )}>
              {selectedId === c.id && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-primary text-on-primary text-[10px] font-black px-2 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE
                </div>
              )}
              
              <div className="p-8 flex-1">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-surface-container-highest transition-colors", 
                  selectedId === c.id ? "text-primary bg-primary/20" : "text-on-surface-variant group-hover:text-white"
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-black font-headline mb-4 uppercase italic tracking-tighter">{c.name}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8 h-20 overflow-hidden">
                  {c.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>Impact Velocity</span>
                    <span className="text-white">Accelerated</span>
                  </div>
                  <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                     <div className="h-full bg-kinetic-gradient w-2/3" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/5 border-t border-white/5 mt-auto flex flex-col gap-2">
                 <Button 
                   className="w-full font-black uppercase tracking-widest text-[10px]" 
                   variant={selectedId === c.id ? 'outline' : 'primary'}
                   onClick={() => handleSelect(c.id)}
                   disabled={selectedId === c.id}
                 >
                   {selectedId === c.id ? 'Primary Protocol Active' : 'Select for Platform Share'}
                 </Button>
                 
                 <Button 
                   className="w-full font-black uppercase tracking-widest text-[10px] bg-tertiary h-10 hover:bg-tertiary/80 text-on-tertiary"
                   onClick={() => handleDirectDonate(c.id)}
                   disabled={donatingId === c.id}
                 >
                   {donatingId === c.id ? 'Initializing...' : 'Direct One-Time Donation'}
                 </Button>
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-24 text-center">
         <Globe className="w-12 h-12 text-primary/20 mx-auto mb-8 animate-spin-slow" />
         <p className="text-on-surface-variant font-bold text-sm uppercase tracking-[0.25em]">Global Transparency Protocol Active</p>
      </div>
    </div>
  );
}

export default function CharityHubPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CharityHubContent />
    </Suspense>
  );
}
