"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/LoadingState";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        if (res.data.role === 'ADMIN') router.push("/admin");
      } catch (err) {
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingState fullScreen />;
  if (user?.role === 'ADMIN') return <LoadingState fullScreen />;

  return (
    <div className="bg-background min-h-screen text-on-surface flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Kinetic Horizon" />
      <main className="flex-1 overflow-y-auto relative">
        {user && (!user.emailVerified || !user.isVerified) && (
          <div className="sticky top-0 z-50 bg-error/10 border-b border-error/20 p-4 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-error animate-pulse" />
              <p className="text-sm font-bold text-error uppercase tracking-tighter">
                {!user.emailVerified 
                  ? "Account Status: Restricted. Please verify your email." 
                  : "Identity Sync Pending: Awaiting final platform verification."}
              </p>
            </div>
            {!user.emailVerified && (
              <Button 
                size="sm" 
                variant="outline" 
                className="border-error text-error hover:bg-error/10"
                disabled={resending}
                onClick={async () => {
                  setResending(true);
                  try {
                    await api.post("/auth/resend-verification", { email: user.email });
                    setResendStatus("Email Sent!");
                    setTimeout(() => setResendStatus(null), 3000);
                  } catch (err) {
                    setResendStatus("Failed to send");
                  } finally {
                    setResending(false);
                  }
                }}
              >
                {resendStatus || (resending ? "Dispatching..." : "RESEND LINK")}
              </Button>
            )}
          </div>
        )}
        <div className="p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
