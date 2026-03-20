"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/api";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Authenticating your clearance...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid mission token. Access denied.");
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify?token=${token}`);
        setStatus("success");
        setMessage("Identity verified. Mission clearance granted.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification protocols failed.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <Card glow className={status === 'error' ? 'border-error/20' : 'border-primary/10'}>
          <div className="p-10 text-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 ${
              status === 'loading' ? 'bg-primary/5' : 
              status === 'success' ? 'bg-primary/10' : 'bg-error/10'
            }`}>
              {status === 'loading' && <Loader2 className="text-primary w-10 h-10 animate-spin" />}
              {status === 'success' && <CheckCircle2 className="text-primary w-10 h-10" />}
              {status === 'error' && <XCircle className="text-error w-10 h-10" />}
            </div>

            <h2 className="font-headline text-3xl font-extrabold mb-4 text-white uppercase italic tracking-tighter">
              {status === 'loading' ? 'Verifying...' : 
               status === 'success' ? 'Verified' : 'Access Denied'}
            </h2>
            
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-10">
              {message}
            </p>

            {status !== 'loading' && (
              <Button 
                onClick={() => router.push(status === 'success' ? "/auth/signin" : "/auth/signup")}
                className="w-full py-5 uppercase tracking-widest text-xs font-black shadow-2xl shadow-primary/10"
              >
                {status === 'success' ? 'Proceed to Login' : 'Register Again'}
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingState fullScreen />}>
      <VerifyContent />
    </Suspense>
  );
}
