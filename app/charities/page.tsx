"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Heart, 
  Globe, 
  Target, 
  ArrowRight, 
  Loader2,
  Users,
  Trophy,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function PublicCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get("/charities");
        setCharities(res.data);
      } catch (err) {
        console.error("Failed to fetch charities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  return (
    <div className="bg-background text-on-surface min-h-screen selection:bg-primary/30 scroll-smooth">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto text-white">
          <Link href="/" className="text-xl font-black tracking-tighter uppercase font-headline italic">
            KINETIC HORIZON
          </Link>
          <div className="flex items-center gap-10 font-headline tracking-tighter text-[11px] font-black uppercase text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors tracking-[0.2em]">Home</Link>
            <Link href="#draw-mechanism" className="hover:text-primary transition-colors tracking-[0.2em]">Draw Mechanism</Link>
            <Link href="/auth/signup">
              <Button className="rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Join the Draw</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
        {/* Header Section */}
        <section className="mb-24 text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-black text-on-surface-variant">Global Impact Partners</span>
          </motion.div>
          
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 uppercase italic">
            Our Mission<br/>
            <span className="text-kinetic">Portfolio.</span>
          </h1>
          <p className="text-on-surface-variant text-xl leading-relaxed font-medium">
            Explore the specialized organizations that transform your performance into real-world change. Every shot you take contributes directly to these causes via our 91/9 split model.
          </p>
        </section>

        {/* Charity Grid */}
        <section className="mb-40">
           {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
             </div>
           ) : (
             <motion.div 
               variants={stagger}
               initial="initial"
               animate="animate"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
             >
               {charities.map((charity) => (
                 <motion.div key={charity.id} variants={fadeInUp}>
                   <Card className="p-0 overflow-hidden group h-full flex flex-col border-white/5 hover:border-primary/20 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                         <img 
                            src={charity.imageUrl || `https://source.unsplash.com/featured/?nature,impact&${charity.id}`} 
                            alt={charity.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                         <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary">Active Partner</span>
                         </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                         <h3 className="text-2xl font-black font-headline uppercase italic tracking-tighter mb-4 group-hover:text-primary transition-colors">{charity.name}</h3>
                         <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-10 flex-1">
                            {charity.description}
                         </p>
                         <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Impact Goal</p>
                               <p className="text-lg font-black font-headline italic">₹{charity.totalRaised?.toLocaleString() || '0'}<span className="text-[10px] opacity-40 ml-1">TR</span></p>
                            </div>
                            <Link href="/auth/signup">
                               <Button variant="ghost" size="sm" className="bg-white/5 group-hover:bg-primary group-hover:text-on-primary transition-all rounded-full p-3 h-12 w-12 flex items-center justify-center">
                                  <ArrowRight className="w-5 h-5" />
                               </Button>
                            </Link>
                         </div>
                      </div>
                   </Card>
                 </motion.div>
               ))}
             </motion.div>
           )}
        </section>

        {/* Draw Mechanism Section */}
        <section id="draw-mechanism" className="py-40 border-t border-white/5 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[160px] -z-10 rounded-full" />
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
              <div className="lg:col-span-7">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 block">Transparent Prosperity</span>
                 <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-10 leading-[0.95] uppercase italic">The 91/9<br/>Impact Mechanism.</h2>
                 <p className="text-on-surface-variant text-xl mb-16 leading-relaxed font-medium">
                    At Kinetic Horizon, we operate on a radical redistribution model. We believe that 
                    prosperity should be shared. Of every rupee generated through our draws, 91% is 
                    allocated directly to impact initiatives.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                       { title: "91% Impact Fund", desc: "Directed to our charity partners to provide clean water, education, and healthcare.", icon: Heart },
                       { title: "9% Operations", desc: "Fuels our technology, draw management, and global community expansion.", icon: Globe }
                    ].map((m, i) => (
                       <Card key={i} className="bg-white/5 border-white/10 p-8">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", i === 0 ? "bg-primary/20 text-primary" : "bg-tertiary/20 text-tertiary")}>
                             <m.icon className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-black font-headline uppercase italic tracking-tighter mb-3">{m.title}</h4>
                          <p className="text-sm text-on-surface-variant leading-relaxed">{m.desc}</p>
                       </Card>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-5">
                 <Card glow className="bg-kinetic-gradient p-12 border-none">
                    <Trophy className="w-16 h-16 text-on-primary-container mb-8" />
                    <h3 className="text-3xl font-black font-headline uppercase italic tracking-tighter text-on-primary-container mb-6 italic">Draw Mechanics</h3>
                    <ul className="space-y-6">
                       {[
                          "Participants enter by becoming active Kinetic Members.",
                          "Draws are held on the final day of each calendar month.",
                          "Winners are selected via a cryptographically secure RNG.",
                          "9% allocated to operational costs and prize pool logistics.",
                          "91% goes to the user's selected mission partner."
                       ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start group">
                             <div className="mt-1 w-5 h-5 rounded bg-on-primary-container/20 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-3 h-3 text-on-primary-container" />
                             </div>
                             <span className="text-sm font-bold text-on-primary-container leading-relaxed">{item}</span>
                          </li>
                       ))}
                    </ul>
                    <Link href="/auth/signup">
                       <Button size="lg" className="w-full mt-12 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs py-7 rounded-full">
                          Initiate Membership
                       </Button>
                    </Link>
                 </Card>
              </div>
           </div>
        </section>
      </main>

      <footer className="w-full py-20 px-8 border-t border-white/5 bg-background text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col gap-6">
            <div className="text-2xl font-black text-white uppercase font-headline italic tracking-tighter">KINETIC HORIZON</div>
            <p className="font-headline text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              © 2026 KINETIC HORIZON. PRECISION GOLF. PURPOSEFUL IMPACT.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
