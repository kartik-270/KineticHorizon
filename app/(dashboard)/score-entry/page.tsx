"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  Target, 
  Plus, 
  Minus, 
  MapPin, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";

export default function ScoreEntryPage() {
  const [value, setValue] = useState(18);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [course, setCourse] = useState("");
  const [user, setUser] = useState<any>(null);
  const [tee, setTee] = useState("Members");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/scores", { value, date });
      toast.success("Mission Accomplished: Round logged successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to transmit data to HQ");
    } finally {
      setSubmitting(false);
    }
  };

  const toParData = () => {
    const diff = 36 - value;
    if (diff === 0) return { val: "E", color: "text-white" };
    if (diff < 0) return { val: `${diff}`, color: "text-primary" };
    return { val: `+${diff}`, color: "text-on-surface-variant" };
  };

  const estDiff = ((36 - value) * 0.9 + 14).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors mb-12 group uppercase tracking-widest text-[10px] font-bold">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Abort Mission / Return to Dashboard
      </Link>

      <header className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Precision Logging</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline">Record Your Round</h1>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col gap-8 h-full">
          <Card className="p-8 h-full flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Course Information</h3>
            
            <div className="space-y-6">
              <div>
                <div className="relative group/field">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within/field:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white font-bold"
                    placeholder="Golf Course Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker 
                  value={date}
                  onChange={setDate}
                  className="w-full"
                />
                <Select 
                  options={["Championship", "Members", "Forward"]}
                  value={tee}
                  onChange={setTee}
                  icon={<TrendingUp className="w-4 h-4" />}
                  placeholder="Select Tees"
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </div>

        <Card glow className="p-8 flex flex-col justify-between items-center text-center">
           <div className="mb-4">
             <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-8">Stableford Points (1-45)</span>
             <div className="flex items-center gap-8">
                <button 
                  type="button"
                  onClick={() => setValue(v => Math.max(1, v - 1))}
                  className="w-12 h-12 rounded-xl border border-outline-variant/20 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="text-4xl md:text-6xl font-headline font-black tracking-tighter">{value}</span>
                <button 
                  type="button"
                  onClick={() => setValue(v => Math.min(45, v + 1))}
                  className="w-12 h-12 rounded-xl border border-outline-variant/20 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
             </div>
           </div>

            <div className="w-full space-y-4 pt-12">
              <div className="flex justify-between items-center p-4 bg-surface-container-high rounded-xl border border-outline-variant/10">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">To Par</span>
                <span className={cn("text-lg font-bold font-headline", toParData().color)}>{toParData().val}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-surface-container-high rounded-xl border border-outline-variant/10">
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Est. Differential</span>
                <span className="text-lg font-bold font-headline text-primary">{estDiff}</span>
              </div>
            </div>
          </Card>

        <div className="lg:col-span-2">
          <Button size="lg" className="w-full py-6 text-xl uppercase tracking-widest font-black" disabled={submitting || !user?.emailVerified}>
            {submitting ? "Transmitting Data..." : "Submit Round Data"}
          </Button>
        </div>
      </form>
      
      <div className="mt-12 p-6 bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/20 text-center">
         <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest leading-relaxed">
           Note: Kinetic Precision Engine automatically retains your last 5 scores. <br/>
           Submitting this round will replace your record.
         </p>
      </div>
    </div>
  );
}
