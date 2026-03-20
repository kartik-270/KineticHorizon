"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Activity, Play, RefreshCw, CheckCircle2, AlertTriangle, ArrowLeft, History, Trophy, ChevronRight, Zap } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminDrawsPage() {
  const [latestDraw, setLatestDraw] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const fetchDraws = async () => {
    try {
      const res = await api.get("/draws/latest");
      setLatestDraw(res.data);
      const histRes = await api.get("/draws/history");
      setHistory(histRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await api.post("/draws/simulate", { logicType: 'RANDOM' });
      setSimulationResult(res.data);
      toast.success("Simulation sequence complete.");
    } catch (err) {
      toast.error("Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulationResult) return;
    setPublishing(true);
    try {
      await api.post("/draws/publish", { 
        simulationId: simulationResult.draw.id,
        potentialWinners: simulationResult.potentialWinners 
      });
      setSimulationResult(null);
      fetchDraws();
      toast.success("Draw protocol published on-chain.");
    } catch (err) {
      toast.error("Publishing sequence aborted.");
    } finally {
      setPublishing(false);
    }
  };

  const parseNumbers = (numStr: string) => {
    if (!numStr) return [];
    return numStr.split(',').map(n => n.trim());
  };

  return (
    <div className="p-8 md:p-12">
      <header className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">System Logic</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline text-white italic truncate">Draw Engine</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
         {/* Control Panel */}
         <div className="lg:col-span-4 flex flex-col gap-8">
           <Card glow className="p-8 border-primary/20 bg-primary/20">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-8">Manual Initiation</h3>
              <div className="space-y-4">
                 <Button 
                  className="w-full py-6 uppercase font-black tracking-widest text-xs bg-primary hover:bg-primary/80" 
                  onClick={handleSimulate}
                  disabled={simulating}
                 >
                   {simulating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 fill-current mr-2" />}
                   Simulate New Draw
                 </Button>
                 <p className="text-[10px] text-center text-on-surface-variant font-black uppercase tracking-widest leading-relaxed">
                   Generates high-entropy numbers and verifies against operative scores
                 </p>
              </div>
           </Card>

           <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Prize distribution</h3>
                <Trophy className="w-4 h-4 text-tertiary" />
              </div>
              <div className="space-y-4">
                 {[
                   { label: "MATCH 5", share: "40%", pool: latestDraw?.prizePool5 || 0 },
                   { label: "MATCH 4", share: "35%", pool: latestDraw?.prizePool4 || 0 },
                   { label: "MATCH 3", share: "25%", pool: latestDraw?.prizePool3 || 0 },
                 ].map((p, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-[10px] font-black uppercase">{p.label} ({p.share})</span>
                     <span className="text-sm font-black font-headline text-white">₹{p.pool.toLocaleString()}</span>
                   </div>
                 ))}
              </div>
           </Card>
         </div>

         {/* Visualizer */}
         <div className="lg:col-span-8">
           <Card className="h-full p-8 border-dashed border-outline-variant/20 bg-background/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
              
              <AnimatePresence mode="wait">
                {!simulationResult && latestDraw ? (
                  <motion.div 
                    key="latest"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-full flex flex-col relative z-10"
                  >
                    <div className="flex justify-between items-start mb-12">
                       <div>
                         <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Latest Active Draw</h2>
                         <p className="text-4xl font-black font-headline text-white uppercase italic tracking-tighter">#{latestDraw.id.substring(0, 8)}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1 opacity-50">Drawn ON</p>
                         <p className="text-sm font-black italic">{new Date(latestDraw.drawDate).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="flex justify-center gap-4 mb-12">
                       {parseNumbers(latestDraw.winningNumbers).map((n, i) => (
                         <div key={i} className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center text-3xl font-black font-headline text-primary shadow-xl shadow-primary/10 transition-transform hover:scale-105">
                           {n}
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-auto">
                       <div className="p-4 bg-surface-container-high rounded-xl border border-white/5 transition-all hover:border-primary/20">
                         <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                         <p className="text-lg font-black font-headline text-emerald-500 uppercase tracking-tighter">PUBLISHED</p>
                       </div>
                       <div className="p-4 bg-surface-container-high rounded-xl border border-white/5">
                         <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Logic Pattern</p>
                         <p className="text-lg font-black font-headline text-white uppercase tracking-tighter">{latestDraw.logicType}</p>
                       </div>
                       <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                         <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Total Stake</p>
                         <p className="text-xl font-black font-headline text-white">₹{(latestDraw.prizePool3 + latestDraw.prizePool4 + latestDraw.prizePool5).toLocaleString()}</p>
                       </div>
                    </div>
                  </motion.div>
                ) : simulationResult ? (
                  <motion.div 
                    key="simulation"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col relative z-10"
                  >
                     <div className="flex justify-between items-start mb-12">
                       <div>
                         <h2 className="text-xs font-black uppercase tracking-widest text-tertiary mb-2">Simulated Result</h2>
                         <p className="text-4xl font-black font-headline text-white uppercase italic tracking-tighter">PREVIEW PROTOCOL</p>
                       </div>
                       <Button variant="ghost" className="text-error font-black uppercase text-[10px] tracking-widest" onClick={() => setSimulationResult(null)}>Abstain</Button>
                    </div>

                    <div className="flex justify-center gap-4 mb-12">
                       {parseNumbers(simulationResult.draw.winningNumbers).map((n, i) => (
                         <motion.div 
                          key={i} 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-16 h-16 rounded-2xl bg-tertiary/20 border border-tertiary/30 flex items-center justify-center text-3xl font-black font-headline text-tertiary shadow-xl shadow-tertiary/10"
                         >
                           {n}
                         </motion.div>
                       ))}
                    </div>

                    <div className="p-8 bg-tertiary/10 rounded-2xl border border-tertiary/20 mb-8 backdrop-blur-sm">
                       <div className="flex items-center gap-3 text-tertiary mb-4">
                         <Zap className="w-5 h-5 fill-current" />
                         <span className="text-xs font-black uppercase tracking-widest">Simulation Analysis Complete</span>
                       </div>
                       <p className="text-sm text-on-surface-variant font-bold leading-relaxed italic opacity-80">
                         The algorithm has detected **{simulationResult.potentialWinners.length} valid matches** within the operative score registry. 
                         Proceeding will finalize rewards and initiate notification dispatch across all secure channels.
                       </p>
                    </div>

                    <Button 
                      className="w-full py-6 bg-tertiary hover:bg-tertiary/80 text-on-tertiary font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-tertiary/20" 
                      onClick={handlePublish}
                      disabled={publishing}
                    >
                      {publishing ? "Encrypting Protocol..." : "Execute & Publish Result"}
                    </Button>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                     <AlertTriangle className="w-16 h-16 mb-6 animate-pulse" />
                     <p className="text-xs font-black uppercase tracking-[0.3em] max-w-xs leading-loose">No active simulation detected. Initialize the engine to verify operative scoring.</p>
                  </div>
                )}
              </AnimatePresence>
           </Card>
         </div>
      </div>

      <Card className="p-8">
         <div className="flex justify-between items-center mb-10">
           <h3 className="font-headline font-black text-2xl italic uppercase tracking-tighter flex items-center gap-3">
             <History className="text-primary w-6 h-6" />
             Historical Ledger
           </h3>
         </div>

         <div className="space-y-4">
            {history.length > 0 ? history.map((h: any) => (
              <div key={h.id} className="flex items-center justify-between p-6 bg-surface-container-high rounded-2xl border border-outline-variant/10 group hover:border-primary/40 transition-all">
                 <div className="flex items-center gap-12">
                    <span className="text-lg font-black font-headline text-white uppercase italic">#{h.id.substring(0, 8)}</span>
                    <div className="flex gap-2">
                      {parseNumbers(h.winningNumbers).map((n, j) => (
                        <span key={j} className="w-8 h-8 flex items-center justify-center text-[11px] font-black bg-background rounded-lg border border-outline-variant/10 text-on-surface-variant">{n}</span>
                      ))}
                    </div>
                 </div>
                 <div className="flex items-center gap-12 text-right">
                    <div className="hidden md:block">
                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Drawn ON</p>
                      <p className="text-sm font-black italic">{new Date(h.drawDate).toLocaleDateString()}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-50">Logic</p>
                      <p className="text-sm font-black text-primary italic uppercase tracking-tighter">{h.logicType}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                 </div>
              </div>
            )) : (
              <p className="p-12 text-center text-on-surface-variant text-xs font-black uppercase tracking-[0.3em] opacity-30 italic">No historical records in archive.</p>
            )}
         </div>
      </Card>
    </div>
  );
}
