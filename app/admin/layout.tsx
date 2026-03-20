"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Users, 
  Activity, 
  ShieldCheck,
  Settings,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import MobileHeader from "@/components/MobileHeader";
import { LoadingState } from "@/components/LoadingState";
import { toast } from "sonner";
import api from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.role !== 'ADMIN') {
          router.push("/dashboard");
        }
      } catch (err) {
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return <LoadingState fullScreen />;

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Admin session terminated.");
    router.push("/auth/signin");
  };

  const navItems = [
    { name: "Control Center", href: "/admin", icon: LayoutDashboard },
    { name: "User Protocol", href: "/admin/users", icon: Users },
    { name: "Mission Assets", href: "/admin/charities", icon: Settings },
    { name: "Draw Engine", href: "/admin/draws", icon: Activity },
  ];

  return (
    <div className="bg-background min-h-screen text-on-surface flex flex-col md:flex-row">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="KINETIC COMMAND" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
