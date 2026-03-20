"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Trophy, 
  PlusCircle, 
  Activity,
  Heart,
  Clock
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/dashboard");
      setUser(res.data.profile);
      setStats(res.data);
    } catch (err) {
      router.push("/auth/signin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    if (success === 'true') {
      const syncSubscription = async () => {
        try {
          await api.get('/subscription/sync');
          toast.success("Membership automatically synchronized!");
          fetchDashboardData();
        } catch (error) {
          toast.error("Auto-sync failed. Please refresh.");
          console.error('Sync failed:', error);
        }
      };
      syncSubscription();
    }

    // Time update interval
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    // Countdown logic
    const updateCountdown = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ days, hours, minutes });
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 60000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(countdownInterval);
    };
  }, [success, router]);

  if (loading) return <div className="bg-background min-h-screen" />;

  return (
    <>

        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 mt-0 md:mt-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Performance Overview</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline">
              Welcome Back, <span className="text-kinetic">{user?.name?.split(' ')[0] || 'Operative'}</span>.
            </h1>
          </div>
          <div className="flex gap-4">
            <Card className="p-4 py-3 bg-surface-container-high border-none flex items-center gap-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-0.5">Local Time</p>
                <p className="text-lg font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="w-px h-10 bg-outline-variant/20" />
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-0.5">Course Status</p>
                <p className="text-lg font-bold text-primary">Optimal</p>
              </div>
            </Card>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Status Cards */}
          <div className="lg:col-span-4 h-full">
            <Card glow className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">Account Active</span>
                  <Activity className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-4xl font-headline font-extrabold mb-2">Membership</h2>
                <p className="text-on-surface-variant text-sm">Participating since {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-12">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Monthly Participation</span>
                  <span className="text-xl font-headline font-bold">{user?.subscriptionStatus === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden mb-8">
                  <motion.div initial={{ x: "-100%" }} animate={{ x: user?.subscriptionStatus === 'ACTIVE' ? "0%" : "-100%" }} className="h-full bg-kinetic-gradient w-full rounded-full" />
                </div>
                {user?.subscriptionStatus !== 'ACTIVE' && (
                  <div className="space-y-3">
                    <Button className="w-full py-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10" onClick={async () => {
                      const res = await api.post("/subscription/checkout", { planType: "MONTHLY" });
                      window.location.href = res.data.url;
                    }}>Subscribe Monthly (₹499)</Button>
                    <Button variant="outline" className="w-full py-4 text-[10px] font-black uppercase tracking-widest border-tertiary text-tertiary hover:bg-tertiary/10" onClick={async () => {
                      const res = await api.post("/subscription/checkout", { planType: "YEARLY" });
                      window.location.href = res.data.url;
                    }}>Subscribe Yearly (₹4,999 - Early Bird 10% OFF)</Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8 h-full">
            <Card className="h-full bg-surface-container-high/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8">
                <Trophy className="w-16 h-16 text-primary/10" />
              </div>
              <h2 className="text-2xl font-headline font-extrabold mb-1">Winnings Overview</h2>
              <p className="text-on-surface-variant text-sm mb-12">Accumulated rewards & prize history</p>

              <div className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-12">
                ₹{stats?.totalWon?.toLocaleString() || '0'}<span className="text-sm font-bold text-primary ml-4 tracking-normal uppercase">Total Earnings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Last Prize", value: "₹25,000" },
                  { label: "Participation", value: "12 Events" },
                  { label: "Draw Rank", value: "Qualified", color: "text-primary" }
                ].map((s, i) => (
                  <div key={i} className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2">{s.label}</p>
                    <p className={cn("text-xl font-bold font-headline", s.color)}>{s.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Secondary Grid */}
          <div className="lg:col-span-4 lg:row-span-2 h-full">
            <Card className="h-full bg-tertiary-container/10 border-tertiary/20 relative overflow-hidden flex flex-col">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary/20 rounded-full blur-3xl" />
               <h2 className="text-3xl font-headline font-extrabold mb-1 mt-2">Next Major Draw</h2>
               <p className="text-on-surface-variant text-base font-bold mb-12">PRIZE POOL: ₹50,00,000</p>
               
               <div className="flex-1 flex flex-col justify-center gap-12">
                 <div className="grid grid-cols-3 gap-4">
                   {[
                     { label: "DAYS", value: timeLeft.days.toString().padStart(2, '0') },
                     { label: "HRS", value: timeLeft.hours.toString().padStart(2, '0') },
                     { label: "MIN", value: timeLeft.minutes.toString().padStart(2, '0') }
                   ].map((t, i) => (
                     <div key={i} className="bg-surface-container-high p-4 rounded-xl text-center border border-outline-variant/10">
                       <p className="text-3xl font-headline font-black mb-1">{t.value}</p>
                       <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-tighter">{t.label}</p>
                     </div>
                   ))}
                 </div>
                 <Button className="w-full py-4 uppercase tracking-widest text-xs font-black shadow-2xl shadow-primary/10">View Draw Details</Button>
               </div>
            </Card>
          </div>

          <div className="lg:col-span-4 h-full">
             <Card className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-outline-variant/10 flex items-center justify-center">
                      <Heart className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{user?.charity?.name || 'Assigned Charity'}</h3>
                      <p className="text-xs text-on-surface-variant">Active Beneficiary</p>
                    </div>
                  </div>
                  {/* <Button variant="ghost" size="sm" className="text-primary">CHANGE</Button> */}
                </div>
                
                <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Your Total Impact</p>
                  <div className="flex justify-between items-end">
                    <p className="text-3xl font-headline font-extrabold">₹{(stats?.totalContributed || 0).toLocaleString()}</p>
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                </div>
             </Card>
          </div>

          <div className="lg:col-span-4 h-full">
            <Card className="h-full bg-surface-container-low/50">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-headline font-extrabold">Recent Rounds</h2>
                 <Clock className="w-5 h-5 text-on-surface-variant" />
               </div>

               <div className="space-y-4">
                 {user?.scores?.map((score: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/5 bg-surface-container-highest/30">
                     <div className="flex items-center gap-4">
                       <div className="flex flex-col items-center leading-none">
                         <span className="text-[10px] uppercase font-black text-primary">{new Date(score.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                         <span className="text-lg font-headline font-black mt-1">{new Date(score.date).getDate()}</span>
                       </div>
                       <div>
                         <p className="text-sm font-bold">Golf Course Round</p>
                         <p className="text-[10px] text-on-surface-variant uppercase font-bold">Stableford: {score.value}</p>
                       </div>
                     </div>
                     <div className="text-2xl font-headline font-black">{score.value}</div>
                   </div>
                 ))}
                 {(!user?.scores || user.scores.length === 0) && (
                   <p className="text-center text-on-surface-variant py-8 italic text-sm">No rounds recorded yet.</p>
                 )}
               </div>

               {/* <Button variant="ghost" className="w-full mt-6 text-xs text-on-surface-variant uppercase tracking-widest font-black">View All Scores</Button> */}
            </Card>
          </div>
        </div>

        {!user?.emailVerified && (
          <div className="fixed inset-0 bg-background/60 backdrop-blur-md z-[60] flex items-center justify-center p-8">
             <div className="max-w-md w-full bg-surface-container-high p-8 rounded-2xl border border-error/20 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <Activity className="w-16 h-16 text-error mx-auto mb-6 opacity-50" />
               <h2 className="text-2xl font-headline font-black mb-4 uppercase italic">Mission Access Locked</h2>
               <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                 Operative, your account is currently in a restricted state. Full access to draws, score logging, and rewards requires a verified identity.
               </p>
               <div className="flex flex-col gap-3">
                 <Button className="w-full py-4 uppercase font-black text-[10px] tracking-widest shadow-xl">Complete Verification</Button>
                 <p className="text-[10px] text-on-surface-variant uppercase font-bold">Check your inbox for the activation link</p>
               </div>
             </div>
          </div>
        )}

        <Link href="/score-entry" className="fixed bottom-8 right-8 z-40 transform hover:scale-105 active:scale-95 transition-all">
          <Button size="lg" className="rounded-full w-16 h-16 p-0 shadow-2xl shadow-primary/20">
             <PlusCircle className="w-8 h-8" />
          </Button>
        </Link>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  );
}
