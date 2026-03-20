"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function MobileHeader({ onMenuClick, title = "KINETIC" }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-[60] w-full bg-background/50 backdrop-blur-xl border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-sm font-black tracking-tighter text-white uppercase italic">
        {title}
      </Link>
      <button 
        onClick={onMenuClick}
        className="p-2 -mr-2 text-on-surface-variant hover:text-white transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
