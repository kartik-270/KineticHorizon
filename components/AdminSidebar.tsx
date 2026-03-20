"use client";

import { 
  Users, 
  Activity, 
  ShieldCheck,
  Settings,
  LayoutDashboard,
  LogOut,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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

  const sidebarContent = (
    <div className="h-full flex flex-col p-6 bg-background border-r border-outline-variant/10 pointer-events-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-lg font-black tracking-tighter text-white uppercase italic hover:text-primary transition-colors">
            KINETIC COMMAND
          </Link>
          <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mt-1">Global System Oversight</p>
        </div>
        <button onClick={onClose} className="md:hidden p-2 text-on-surface-variant hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="px-4 py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2 opacity-50">System Control</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" 
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "group-hover:text-primary")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 mt-8 border-t border-outline-variant/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-error hover:bg-error/10 transition-all font-bold"
          >
            <LogOut className="w-4 h-4" />
            Secure Log-Off
          </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 sticky top-0 h-screen hidden md:flex z-50 bg-background/50 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 h-full z-10"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
