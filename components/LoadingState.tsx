"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export const LoadingState = ({ fullScreen = false, message, className }: LoadingStateProps) => {
  const [mounted, setMounted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [
    "Synchronizing Protocol...",
    "Calibrating Kinetic Sensors...",
    "Optimizing Draw Mechanics...",
    "Fetching Charity Ledger...",
    "Verifying Operative Identity...",
    "Securing Data Stream...",
    "Handshaking Cloud Registry..."
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center relative overflow-hidden bg-background",
      fullScreen ? "fixed inset-0 z-[200] w-screen h-screen" : "min-h-[60vh] w-full rounded-3xl",
      className
    )}>
      {/* Interactive Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-10"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.3, 0.1],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-[140px] -z-10 top-0 right-0"
      />

      <div className="relative group">
        {/* Kinetic Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="w-40 h-40 rounded-full border-t-[3px] border-r-[3px] border-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)]"
        />
        
        {/* Secondary Oracle Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-40 h-40 rounded-full border-b-[2px] border-l-[2px] border-tertiary/40 scale-[0.85]"
        />

        {/* Pulse Ring */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-40 h-40 rounded-full border border-white/10 scale-110"
        />

        {/* Central Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [0.8, 1.1, 0.8],
              opacity: [0.6, 1, 0.6],
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="relative"
          >
            <Zap className="w-10 h-10 text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* Narrative Progress */}
      <div className="mt-16 text-center max-w-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant italic mb-2 h-4"
          >
            {message || loadingTexts[textIndex]}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex items-center justify-center gap-2.5 mt-6">
           {[0, 1, 2, 3, 4].map((i) => (
             <motion.div 
               key={i}
               animate={{ 
                 height: [6, 18, 6],
                 backgroundColor: ["rgba(255,255,255,0.1)", "rgba(var(--primary-rgb),1)", "rgba(255,255,255,0.1)"]
               }}
               transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
               className="w-1 rounded-full bg-white/10 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
             />
           ))}
        </div>
      </div>

      {/* Interactive Floating Particles (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {mounted && [...Array(5)].map((_, i) => (
           <motion.div
             key={i}
             animate={{
               y: [0, -100, 0],
               x: [0, Math.random() * 50 - 25, 0],
               opacity: [0, 1, 0]
             }}
             transition={{
               duration: 3 + Math.random() * 2,
               repeat: Infinity,
               delay: i * 0.5
             }}
             className="absolute w-1 h-1 bg-white rounded-full"
             style={{
               left: `${20 + i * 15}%`,
               top: `${70 + Math.random() * 20}%`
             }}
           />
         ))}
      </div>

      {/* Security Banner (Optional) */}
      {fullScreen && (
        <div className="absolute bottom-12 left-0 w-full text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">
              End-to-End Encryption Active • Kinetic Security Protocol 4.2
            </p>
        </div>
      )}
    </div>
  );
};
