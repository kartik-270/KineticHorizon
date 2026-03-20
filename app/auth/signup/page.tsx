"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password });
      toast.success("Enlistment successful: Verification dispatched!");
      setIsSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors mb-8 group uppercase tracking-widest text-[10px] font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort / Return to Surface
        </Link>

        <Card glow className="p-10 border-primary/10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-primary w-8 h-8" />
            </div>
            <h2 className="font-headline text-3xl font-extrabold mb-2 text-white">
              {isSent ? "Mission Dispatched" : "Initialize Operative"}
            </h2>
            <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-bold">
              {isSent ? "Check your secure terminal for verification" : "Enlist in the Kinetic Horizon Community"}
            </p>
          </div>

          {isSent ? (
            <div className="space-y-8 text-center py-4">
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                <p className="text-sm text-on-surface leading-relaxed mb-6">
                  A verification link has been sent to <span className="text-primary font-bold">{email}</span>. 
                  Access your terminal and verify your identity to proceed to the dashboard.
                </p>
                <div className="h-px w-12 bg-primary/20 mx-auto" />
              </div>
              <Button onClick={() => router.push("/auth/signin")} className="w-full py-5 uppercase tracking-widest text-xs font-black">
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Legal Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/10 rounded-md py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Email Terminal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/10 rounded-md py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="name@kinetic.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/10 rounded-md py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
               <input type="checkbox" className="w-4 h-4 bg-surface-container-high border-outline-variant/20 rounded accent-primary" required />
               <p className="text-[10px] text-on-surface-variant font-bold uppercase leading-tight tracking-wider">
                 I agree to the Kinetic Protocols and Transparency Terms
               </p>
            </div>

            <Button disabled={loading} className="w-full py-5 text-lg mt-6 shadow-2xl shadow-primary/10">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Operative"}
            </Button>
          </form>
          )}

          <p className="text-center mt-8 text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            Already enlisted? <Link href="/auth/signin" className="text-primary hover:underline">Access Terminal</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
