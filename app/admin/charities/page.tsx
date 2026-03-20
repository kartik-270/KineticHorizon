"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Landmark, 
  Search, 
  Settings,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Globe,
  PlusCircle
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function CharitiesManagementPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCharity, setNewCharity] = useState({ name: "", description: "", imageUrl: "", websiteUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCharities = async () => {
    try {
      const res = await api.get("/charities");
      setCharities(res.data);
    } catch (err) {
      toast.error("Failed to retrieve mission assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleAddCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/admin/charities", newCharity);
      toast.success("Mission asset registered successfully.");
      setShowAddModal(false);
      setNewCharity({ name: "", description: "", imageUrl: "", websiteUrl: "" });
      fetchCharities();
    } catch (err) {
      toast.error("Asset registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (charity: any) => {
    try {
      const updated = await api.put(`/admin/charities/${charity.id}`, { isFeatured: !charity.isFeatured });
      setCharities(charities.map(c => c.id === charity.id ? { ...c, isFeatured: updated.data.isFeatured } : c));
      toast.success(`${charity.name} featured status updated.`);
    } catch (err) {
      toast.error("Status adjustment failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to decommission this charity asset?")) return;
    try {
      await api.delete(`/admin/charities/${id}`);
      setCharities(charities.filter(c => c.id !== id));
      toast.info("Charity asset decommissioned.");
    } catch (err) {
      toast.error("Decommission protocol failed.");
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="p-6 md:p-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Asset Registry</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline text-white uppercase italic">Mission Assets</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
           <div className="relative w-full md:w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
             <input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-surface-container-high border border-outline-variant/10 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-all" 
               placeholder="Search missions..." 
             />
           </div>
            <Button onClick={() => setShowAddModal(true)} variant="primary" size="sm" className="h-12 px-6 rounded-full font-black uppercase tracking-widest text-[10px] items-center gap-2 w-full md:w-auto">
               <PlusCircle className="w-4 h-4" /> Add Asset
            </Button>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
         {filteredCharities.map((c) => (
           <Card key={c.id} className={cn("p-6 md:p-8 relative group transition-all", c.isFeatured ? "border-primary/40 bg-primary/5 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]" : "bg-surface-container-low/30")}>
              {c.isFeatured && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary text-on-primary text-[8px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                  <ShieldCheck className="w-3 h-3" /> Featured
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-8">
                 <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-background border border-outline-variant/10 transition-colors overflow-hidden", 
                   c.isFeatured ? "text-primary border-primary/20 bg-primary/10" : "text-on-surface-variant group-hover:text-white"
                 )}>
                   {c.imageUrl ? (
                     <img src={c.imageUrl} className="w-full h-full object-cover" alt={c.name} />
                   ) : (
                     <Landmark className="w-8 h-8" />
                   )}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <h3 className="text-xl font-black font-headline uppercase italic truncate tracking-tighter">{c.name}</h3>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Impact Weight: 1.0</p>
                 </div>
              </div>

              <p className="text-on-surface-variant text-xs leading-relaxed font-bold mb-8 h-12 overflow-hidden italic line-clamp-2">
                {c.description}
              </p>

              <div className="flex items-center gap-2 pt-6 border-t border-outline-variant/10">
                 <Button 
                   onClick={() => handleToggleFeatured(c)}
                   variant="outline" 
                   size="sm" 
                   className={cn("flex-1 text-[9px] font-black tracking-widest uppercase h-10", c.isFeatured ? "border-primary/40 text-primary" : "")}
                 >
                   {c.isFeatured ? "Demote" : "Promote to Featured"}
                 </Button>
                 <Button 
                  onClick={() => handleDelete(c.id)}
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 text-error hover:bg-error/10 hover:text-error"
                 >
                   <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
           </Card>
         ))}
         
         <div 
            onClick={() => setShowAddModal(true)}
            className="p-0 border-dashed border-2 border-outline-variant/20 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all bg-transparent rounded-3xl min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors mb-6">
               <Plus className="w-8 h-8" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Register New Asset</p>
         </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setShowAddModal(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-xl z-10"
          >
            <Card className="p-10 border-white/10 shadow-2xl relative">
               <Button 
                onClick={() => setShowAddModal(false)}
                variant="ghost" 
                size="sm" 
                className="absolute top-8 right-8 text-on-surface-variant hover:text-white"
               >
                 Close
               </Button>
               
               <h2 className="text-3xl font-black font-headline uppercase italic tracking-tighter mb-2">Register Asset</h2>
               <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-10">Add a new mission partner to the registry</p>
               
               <form onSubmit={handleAddCharity} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">Mission Name</label>
                    <input 
                      required
                      value={newCharity.name}
                      onChange={e => setNewCharity({...newCharity, name: e.target.value})}
                      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. Clean Water Alliance"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newCharity.description}
                      onChange={e => setNewCharity({...newCharity, description: e.target.value})}
                      className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all resize-none"
                      placeholder="Mission goals and impact strategy..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">Mission Imagery</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center overflow-hidden relative group">
                        {newCharity.imageUrl ? (
                          <img src={newCharity.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <Landmark className="w-8 h-8 text-on-surface-variant/20" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-[10px] font-black uppercase tracking-widest h-10 w-full mb-2"
                          onClick={() => document.getElementById('charity-image')?.click()}
                        >
                          Upload Direct Asset
                        </Button>
                        <p className="text-[9px] text-on-surface-variant font-bold uppercase opacity-40 text-center">PNG, JPG or SVG (Max 2MB)</p>
                        <input 
                          id="charity-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewCharity({ ...newCharity, imageUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    disabled={submitting}
                    className="w-full py-6 uppercase font-black tracking-[0.2em] text-[10px] mt-4"
                  >
                    {submitting ? "Processing..." : "Register Mission Asset"}
                  </Button>
               </form>
            </Card>
          </motion.div>
        </div>
      )}
      
      {/* <div className="text-center p-12 bg-white/[0.02] rounded-3xl border border-outline-variant/5">
         <Globe className="w-12 h-12 text-primary/20 mx-auto mb-8 animate-spin-slow" />
         <p className="text-on-surface-variant font-bold text-sm uppercase tracking-[0.3em] mb-4">Platform impact verification system online</p>
         <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">Download Full Impact Report (PDF)</Button>
      </div> */}
    </div>
  );
}
