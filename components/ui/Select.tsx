"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Select({ options, value, onChange, placeholder = "Select...", icon, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-surface-container-high border rounded-xl py-4 pl-12 pr-10 text-sm focus:outline-none transition-all text-left flex items-center justify-between",
          isOpen ? "border-primary/50 ring-1 ring-primary/20 bg-primary/5" : "border-outline-variant/10 hover:border-white/20"
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", isOpen ? "text-primary" : "text-on-surface-variant")}>
              {icon}
            </div>
          )}
          <span className={cn("font-bold", value ? "text-white" : "text-on-surface-variant")}>
            {value || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? -90 : 90 }}
          transition={{ duration: 0.2 }}
          className={cn("transition-colors", isOpen ? "text-primary" : "text-on-surface-variant")}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            <div className="py-2">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-6 py-3 text-left text-sm font-bold transition-colors block",
                    value === option ? "text-primary bg-primary/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
