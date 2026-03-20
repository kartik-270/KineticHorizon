"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Search, 
  MoreVertical,
  Play,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Zap,
  ArrowRight,
  Landmark
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Draw State
  const [simulation, setSimulation] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, analyticsRes, winnersRes, charityRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/analytics"),
          api.get("/admin/winners"),
          api.get("/charities")
        ]);
        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
        setWinners(winnersRes.data);
        setCharities(charityRes.data);
      } catch (err) {
        console.error("Admin fetch failed", err);
        toast.error("Failed to sync with Command Center");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleSimulateDraw = async () => {
    try {
      setIsSimulating(true);
      const res = await api.post("/draws/simulate", { logicType: 'RANDOM' });
      setSimulation(res.data);
      toast.success("Simulation sequence complete", {
        description: `Identified ${res.data.potentialWinners.length} potential matches for current protocol.`
      });
    } catch (err) {
      toast.error("Simulation failure detected.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublishDraw = async () => {
    if (!simulation) return;
    try {
      setIsPublishing(true);
      await api.post("/draws/publish", { 
        simulationId: simulation.draw.id, 
        potentialWinners: simulation.potentialWinners 
      });
      toast.success("Results Published to Mainnet", {
        description: "Notifications sent to all winning operatives."
      });
      setSimulation(null);
      // Refresh winners
      const winnersRes = await api.get("/admin/winners");
      setWinners(winnersRes.data);
    } catch (err) {
      toast.error("Publishing sequence aborted.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) return null;

  return (
    <div className="p-6 md:p-12 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Oversight Command</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter font-headline text-white uppercase italic">Control Center</h1>
        </div>
        <div className="flex w-full md:w-auto">
           <Card className="p-4 py-3 md:py-2 bg-surface-container-high border-none flex flex-row items-center justify-between md:justify-start gap-4 md:gap-6 w-full md:w-auto overflow-x-auto no-scrollbar">
             <div>
                <p className="text-[10px] uppercase font-black text-on-surface-variant mb-0.5">Total Operatives</p>
                <p className="text-xl font-bold font-headline">{analytics?.totalUsers?.toLocaleString() || '0'}</p>
             </div>
             <div className="w-px h-10 bg-outline-variant/20" />
             <div>
                <p className="text-[10px] uppercase font-black text-on-surface-variant mb-0.5">Active Subs</p>
                <p className="text-xl font-bold text-primary font-headline">{analytics?.activeSubscribers?.toLocaleString() || '0'}</p>
             </div>
             <div className="w-px h-10 bg-outline-variant/20" />
             <div>
                <p className="text-[10px] uppercase font-black text-on-surface-variant mb-0.5">Pool Reserve</p>
                <p className="text-xl font-bold text-tertiary font-headline">₹{analytics?.totalPrizePool?.toLocaleString() || '0'}</p>
             </div>
           </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
         {/* Draw Control */}
         <div className="lg:col-span-4 space-y-6 md:space-y-8">
           <Card glow className="p-6 md:p-8 border-primary/20 bg-primary/20">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant font-headline">Draw Engine</h2>
                <Activity className="text-primary w-5 h-5 animate-pulse" />
              </div>
              
              <AnimatePresence mode="wait">
                {!simulation ? (
                  <motion.div 
                    key="trigger"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                     <div className="p-6 bg-background/50 rounded-xl border border-outline-variant/10 text-center">
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2">Protocol Status</p>
                        <p className="text-sm font-black text-white uppercase italic tracking-widest">Awaiting Simulation</p>
                     </div>
                     <Button 
                       disabled={isSimulating}
                       onClick={handleSimulateDraw}
                       className="w-full py-6 uppercase font-black tracking-widest text-xs bg-primary hover:bg-primary/80"
                     >
                       <Zap className="w-4 h-4 fill-current mr-2" />
                       Initialize Simulation
                     </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="simulation"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                     <div className="p-6 bg-primary/10 rounded-xl border border-primary/20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
                        <p className="text-[10px] uppercase font-bold text-primary mb-2">Simulation Ready</p>
                        <p className="text-2xl font-black font-headline text-white mb-1 uppercase italic tracking-tighter">
                          {simulation.potentialWinners.length} Winners
                        </p>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                          MATCHING NUMBERS: {simulation.draw.winningNumbers}
                        </p>
                     </div>
                     
                     <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setSimulation(null)}
                          className="flex-1 text-[10px] font-black uppercase tracking-widest h-12"
                        >
                          Reset
                        </Button>
                        <Button 
                          disabled={isPublishing}
                          onClick={handlePublishDraw}
                          className="flex-[2] py-4 uppercase font-black tracking-widest text-xs bg-kinetic-gradient text-on-primary-container"
                        >
                          {isPublishing ? "Processing..." : "Publish Results"}
                        </Button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </Card>

           <Card className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Global Impact</h3>
                <TrendingUp className="w-4 h-4 text-tertiary" />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Total Charity Allocation</p>
                  <p className="text-3xl font-black font-headline text-white italic">₹{analytics?.totalCharityContributions?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-4 bg-tertiary/5 rounded-lg border border-tertiary/20">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-tertiary opacity-80">Sector Performance</p>
                   <p className="text-sm font-bold mt-1 text-white uppercase italic tracking-widest font-headline">Optimum Efficiency</p>
                </div>
              </div>
           </Card>
         </div>

         {/* Latest Winners Table */}
         <div className="lg:col-span-8">
           <Card className="h-full p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black font-headline uppercase italic">Verified Winners</h2>
                {/* <Link href="/admin/winners">
                  <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black items-center gap-2">
                    Full Ledger <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link> */}
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-black text-on-surface-variant border-b border-outline-variant/10">
                      <th className="pb-4 font-black tracking-wider">Identity</th>
                      <th className="pb-4 font-black tracking-wider">Match</th>
                      <th className="pb-4 font-black tracking-wider text-center">Value</th>
                      <th className="pb-4 font-black tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {winners.length > 0 ? winners.slice(0, 8).map((w, i) => (
                      <tr key={w.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                           <div>
                             <p className="text-sm font-bold text-white">{w.user?.name || 'Operative'}</p>
                             <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter opacity-60">Draw #{w.drawId.slice(-6).toUpperCase()}</p>
                           </div>
                        </td>
                        <td className="py-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                             {w.matchType.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="py-4 text-center font-headline font-black text-white italic">
                           ₹{w.prizeAmount.toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                           <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest", 
                             w.payoutStatus === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : "bg-tertiary/10 text-tertiary"
                           )}>
                             {w.payoutStatus === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                             {w.payoutStatus}
                           </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
                          No winners mapped in current records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </Card>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
         <Card className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black font-headline uppercase italic">User Protocol</h2>
              <Link href="/admin/users">
                 <Button size="sm" variant="ghost" className="text-[10px] font-black uppercase tracking-widest">Manage Registry</Button>
              </Link>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-surface-container-high rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] uppercase font-black text-on-surface-variant mb-1">Standard Users</p>
                    <p className="text-3xl font-black font-headline text-white">{users.filter(u => u.subscriptionStatus !== 'ACTIVE').length}</p>
                 </div>
                 <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
                    <p className="text-[10px] uppercase font-black text-primary mb-1">Pro Operatives</p>
                    <p className="text-3xl font-black font-headline text-white">{users.filter(u => u.subscriptionStatus === 'ACTIVE').length}</p>
                 </div>
              </div>
              <p className="p-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center opacity-40">User growth: {((users.length/10)*100).toFixed(0)}% against target</p>
            </div>
         </Card>

         <Card className="p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black font-headline uppercase italic">Mission Partners</h2>
              <Link href="/admin/charities">
                <Button size="sm" variant="ghost" className="bg-white/5 p-2 px-2">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              {charities.slice(0, 3).map((c, i) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-background/30 rounded-xl border border-outline-variant/10 group cursor-pointer hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase italic tracking-tighter">{c.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-50">Impact Factor: 1.0x</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.isFeatured && <ShieldCheck className="text-primary w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
         </Card>
      </div>
    </div>
  );
}
