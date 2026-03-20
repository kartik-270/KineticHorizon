"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // ISO date string or "YYYY-MM-DD"
  onChange: (value: string) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Internal state for calendar navigation
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const days = [];
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (date: Date) => value === formatDate(date);
  const isToday = (date: Date) => formatDate(new Date()) === formatDate(date);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-surface-container-high border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none transition-all text-left flex items-center",
          isOpen ? "border-primary/50 ring-1 ring-primary/20 bg-primary/5" : "border-outline-variant/10 hover:border-white/20"
        )}
      >
        <CalendarIcon className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", isOpen ? "text-primary" : "text-on-surface-variant")} />
        <span className="font-bold text-white">
          {value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Select Date"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] w-72 bg-surface-container-highest border border-outline-variant/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-white italic">
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={handleNextMonth} className="p-1 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-[10px] font-bold text-on-surface-variant/40">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, i) => (
                <div key={i} className="aspect-square flex items-center justify-center">
                  {date ? (
                    <button
                      type="button"
                      onClick={() => {
                        onChange(formatDate(date));
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full h-full rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                        isSelected(date) ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(90,250,169,0.4)]" : 
                        isToday(date) ? "text-primary border border-primary/20 bg-primary/5" :
                        "text-on-surface-variant hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  ) : <div />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
