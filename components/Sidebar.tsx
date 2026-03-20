"use client";

import { 
  LayoutDashboard, 
  Target, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut,
  X 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Score Entry", icon: Target, path: "/score-entry" },
    { name: "My Winnings", icon: Trophy, path: "/winnings" },
    { name: "Charity Hub", icon: Heart, path: "/charity-hub" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col p-6 bg-background border-r border-outline-variant/10 pointer-events-auto">
      <div className="mb-12 flex items-center justify-between">
        <Link href="/">
          <div className="text-lg font-black tracking-tighter text-white uppercase italic">KINETIC HORIZON</div>
        </Link>
        <button onClick={onClose} className="md:hidden p-2 text-on-surface-variant hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all",
                isActive ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={() => { localStorage.clear(); router.push("/"); }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-on-surface-variant hover:text-error transition-colors mt-auto font-bold"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
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
