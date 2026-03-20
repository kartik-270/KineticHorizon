"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trophy, Clock, CheckCircle2, AlertCircle, ArrowLeft, Download } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchWinningsData = async () => {
      try {
        const res = await api.get("/user/dashboard");
        setUser(res.data.profile);
        setWinnings(res.data.profile.winnings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWinningsData();
  }, []);

  const handleUploadProof = async (winnerId: string) => {
    const proofUrl = window.prompt("Enter Proof identity URL (Receipt/Screenshot path):");
    if (!proofUrl) return;

    try {
      await api.post(`/user/winners/${winnerId}/proof`, { proofUrl });
      toast.success("Verification evidence transmitted. Payout protocol initiated.");
      setWinnings(winnings.map(w => w.id === winnerId ? { ...w, proofUrl, payoutStatus: 'PENDING' } : w));
    } catch (err) {
      toast.error("Evidence transmission failure.");
    }
  };

  if (loading) return null;

  const totalAccumulated = winnings.reduce((acc, curr) => acc + curr.prizeAmount, 0);
  const validatedCount = winnings.filter(w => w.payoutStatus === 'PAID').length;
  const pendingCount = winnings.filter(w => w.payoutStatus === 'PENDING').length;

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors mb-12 group uppercase tracking-widest text-[10px] font-bold">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Dashboard
      </Link>

      <header className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Rewards Terminal</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline text-white italic">My Winnings</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <Card className="p-8 bg-primary/5 border-primary/20">
            <Trophy className="text-primary w-8 h-8 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Accumulated</p>
            <p className="text-4xl font-black font-headline mt-2">₹{totalAccumulated.toLocaleString()}</p>
         </Card>
         <Card className="p-8">
            <CheckCircle2 className="text-emerald-500 w-8 h-8 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Validated Payouts</p>
            <p className="text-4xl font-black font-headline mt-2">{String(validatedCount).padStart(2, '0')}</p>
         </Card>
         <Card className="p-8">
            <Clock className="text-tertiary w-8 h-8 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pending Verification</p>
            <p className="text-4xl font-black font-headline mt-2">{String(pendingCount).padStart(2, '0')}</p>
         </Card>
      </div>

      <Card className="overflow-hidden">
         <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-bold text-lg uppercase tracking-tight italic">Rewards Registry</h3>
            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest font-black">
               <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-on-surface-variant border-b border-outline-variant/5">
                  <th className="p-8 pb-4">Event Identity</th>
                  <th className="p-8 pb-4">Match Strength</th>
                  <th className="p-8 pb-4">Status</th>
                  <th className="p-8 pb-4">Action</th>
                  <th className="p-8 pb-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {winnings.length > 0 ? winnings.map((w, i) => (
                  <tr key={w.id} className="group hover:bg-white/[0.02]">
                    <td className="p-8">
                       <p className="text-sm font-black text-white uppercase italic">Draw Entry #{w.drawId.slice(-4).toUpperCase()}</p>
                       <p className="text-[10px] text-on-surface-variant font-bold uppercase opacity-60">
                         {new Date(w.createdAt).toLocaleDateString()}
                       </p>
                    </td>
                    <td className="p-8">
                      <span className="text-[10px] font-black tracking-widest uppercase text-primary border border-primary/20 px-2 py-0.5 rounded-full">{w.matchType.replace('_', ' ')}</span>
                    </td>
                    <td className="p-8">
                       <div className={cn("inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded", 
                         w.payoutStatus === 'PAID' ? "bg-emerald-500/10 text-emerald-500" : "bg-tertiary/10 text-tertiary"
                       )}>
                          {w.payoutStatus === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {w.payoutStatus}
                       </div>
                    </td>
                    <td className="p-8">
                       {!w.proofUrl && w.payoutStatus === 'PENDING' ? (
                          <Button 
                            onClick={() => handleUploadProof(w.id)}
                            size="sm" 
                            variant="outline" 
                            className="text-[9px] font-black uppercase tracking-widest h-8 px-4 border-primary/20 text-primary hover:bg-primary/5"
                          >
                             Submit Verification
                          </Button>
                       ) : w.proofUrl ? (
                         <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Evidence Submitted</span>
                       ) : null}
                    </td>
                    <td className="p-8 text-right font-headline font-black text-lg text-white">
                       ₹{w.prizeAmount.toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant text-[10px] font-black uppercase tracking-widest italic opacity-30">
                      No tournament winnings recorded yet. Your journey begins with the next draw.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </Card>
      
      <div className="mt-12 flex items-center gap-4 p-6 bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/20">
         <AlertCircle className="text-on-surface-variant w-5 h-5" />
         <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
           Payouts are processed every Friday. High-value wins ($10k+) require manual KYC verification.
         </p>
      </div>

      {!user?.emailVerified && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-8">
           <div className="max-w-md w-full bg-surface-container-high p-8 rounded-2xl border border-error/20 text-center shadow-2xl">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-headline font-black mb-4 uppercase italic text-white leading-tight">Identity Verification Required</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Winning reports and reward tracking are currently restricted to verified accounts only.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="w-full">
                   <Button variant="outline" className="w-full py-4 uppercase font-black text-[10px] tracking-widest border-outline-variant/20 hover:bg-white/5 transition-all">Back to Dashboard</Button>
                </Link>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
