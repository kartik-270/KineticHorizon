"use client";

import { motion } from "framer-motion";

export const GolfBallLaunch = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Ambient Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />

      {/* Launch 1: The "Vanguard" Shot (Primary Emotion) */}
      <motion.div
        initial={{ x: "-30%", y: "120%", rotate: 0 }}
        animate={{ 
          x: ["-30%", "140%"], 
          y: ["120%", "-40%"],
          rotate: [0, 2160] // High speed spin
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: [0.16, 1, 0.3, 1], // Aggressive launch bezier
          repeatDelay: 2.5
        }}
        className="relative w-24 h-24"
      >
        {/* Speed Blur Wrapper */}
        <motion.div 
          animate={{ skewX: [0, -20, 0], scaleX: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative"
        >
          {/* The Ball: Kinetic Core */}
          <div className="w-10 h-10 rounded-full relative z-10 overflow-hidden shadow-[0_0_60px_#5affa9]">
             <div className="absolute inset-0 bg-white" 
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #fff 0%, #999 100%)' }} />
             <div className="absolute inset-0 opacity-30" 
                  style={{ backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)', backgroundSize: '3px 3px' }} />
             {/* Glowing Pulse */}
             <motion.div 
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-primary/40 blur-md"
             />
          </div>

          {/* High-Intent Trail (Emotion Hub) */}
          <div className="absolute top-1/2 right-[20%] translate-y-[-50%] w-[600px] h-40 origin-right -rotate-[15deg]">
             {/* Neon Core Streak */}
             <motion.div 
               animate={{ opacity: [0, 1, 0.5, 1, 0], scaleY: [0.3, 1, 0.7, 1.2, 0.3] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute top-1/2 right-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-primary shadow-[0_0_30px_#5affa9]"
             />
             
             {/* Energy Ribbons */}
             {[...Array(3)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ 
                   opacity: [0, 0.5, 0],
                   y: [0, (i - 1) * 30, 0],
                   scaleX: [0.8, 1.2, 0.8]
                 }}
                 transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
                 className="absolute top-1/2 right-0 w-full h-[1px] bg-primary/30 blur-[4px]"
               />
             ))}

             {/* Afterburn Particles */}
             {[...Array(10)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, x: 0 }}
                 animate={{ opacity: [0, 1, 0], x: [0, -400] }}
                 transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                 className="absolute top-1/2 right-0 w-3 h-[2px] bg-primary rounded-full blur-[1px]"
                 style={{ top: `${42 + (i * 1.5)}%` }}
               />
             ))}
          </div>
        </motion.div>

        {/* Impact Shockwave (at start) */}
        <motion.div 
          animate={{ scale: [0, 3, 4], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4.9 }}
          className="absolute -inset-20 border-2 border-primary/40 rounded-full blur-sm z-0"
        />
        <motion.div 
          animate={{ scale: [0, 2, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 5.1 }}
          className="absolute -inset-16 bg-primary/20 rounded-full blur-3xl z-0"
        />
      </motion.div>

      {/* Floating Debris / Dust */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -150], 
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, 0.3, 0],
            scale: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            duration: 4 + Math.random() * 6, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${70 + Math.random() * 30}%` 
          }}
        />
      ))}
    </div>
  );
};
