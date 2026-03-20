"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  ArrowRight, 
  Trophy, 
  Users, 
  HandHeart, 
  Target, 
  TrendingUp, 
  Droplets, 
  GraduationCap, 
  Trees, 
  Globe2, 
  Share2,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GolfBallLaunch } from "@/components/ui/GolfBallLaunch";
import { useMousePosition } from "@/hooks/useMousePosition";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};


export default function LandingPage() {
  const mousePosition = useMousePosition();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kinetic Horizon',
          text: 'Join the world\'s most purposeful golf community.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary/30 min-h-screen overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-white/5">
        <div className="flex justify-between items-center h-16 md:h-20 px-6 md:px-8 max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm sm:text-lg md:text-xl font-black tracking-tighter text-white uppercase font-headline italic whitespace-nowrap"
          >
            KINETIC HORIZON
          </motion.div>
          <div className="hidden md:flex items-center gap-10 font-headline tracking-tighter text-[11px] font-black uppercase text-on-surface-variant">
            {["Impact", "Prizes", "Charities", "How it Works"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-primary transition-colors tracking-[0.2em]">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/auth/signin" className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors whitespace-nowrap">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button className="rounded-full px-4 sm:px-8 py-2 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Join the Draw</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 md:pt-20 pb-12 md:pb-0 px-6 md:px-8 group/hero">
          {/* Interactive Mouse Light (Subtle) */}
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-opacity group-hover/hero:opacity-40"
            animate={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(90, 255, 169, 0.08), transparent 50%)`
            }}
          />

          {/* Ambient Background Glows */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-[10%] -right-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px]" />
            <div className="absolute bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[140px]" />
          </div>

          <div className="max-w-[1440px] pt-2 mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 items-center min-h-[70vh]">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 flex flex-col justify-center text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-10 self-start backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#5affa9]" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-on-surface-variant">Live Global Impact Event</span>
              </motion.div>
              
              <h1 className="font-headline text-4xl sm:text-5xl md:text-[6.5rem] font-black tracking-tighter leading-[0.95] md:leading-[0.9] mb-8 uppercase italic">
                Elevate Your Game,<br/>
                <span className="inline-block text-kinetic">Amplify Your Impact.</span>
              </h1>
              
              <p className="text-on-surface-variant text-base md:text-xl max-w-xl mb-10 md:mb-12 leading-relaxed font-medium">
                A premium golf platform designed for the modern competitor. Track your metrics, unlock exclusive rewards, and direct your passion toward global change.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <Link href="/auth/signup">
                  <Button size="lg" className="rounded-full px-8 md:px-12 py-5 md:py-7 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 bg-kinetic-gradient text-on-primary-container w-full sm:w-auto">Become a Member</Button>
                </Link>
                <Link href="/charities">
                  <Button size="lg" variant="secondary" className="rounded-full px-8 md:px-12 py-5 md:py-7 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 hover:bg-white/10 w-full sm:w-auto">Explore Charities</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 hidden lg:block"
            >
              <Card className="p-8 glass-panel glow-card relative overflow-hidden group border-white/10 h-[550px] flex flex-col justify-center">
                <div className="absolute top-8 right-8">
                  <Activity className="text-primary w-8 h-8 opacity-40 group-hover:opacity-100 transition-all duration-500" />
                </div>
                
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-12">Real-time Performance Metrics</h3>
                
                <div className="flex-1 flex flex-col justify-end gap-12">
                   {/* Mock Bar Chart */}
                   <div className="flex items-end justify-between h-48 px-4">
                      {[60, 40, 85, 30, 95, 65, 50].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.8 + (i * 0.1), duration: 1, ease: "circOut" }}
                          className={cn(
                            "w-8 rounded-t-lg transition-all duration-500",
                            i === 4 ? "bg-kinetic-gradient shadow-[0_0_20px_#5affa944]" : "bg-white/10 group-hover:bg-white/20"
                          )}
                        />
                      ))}
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Handicap Index</p>
                         <p className="text-3xl font-black font-headline italic">4.2 <span className="text-xs text-primary font-bold not-italic ml-2">-0.4</span></p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Impact Score</p>
                         <p className="text-3xl font-black font-headline italic text-tertiary">1,240 <span className="text-[8px] font-black tracking-widest uppercase ml-1 opacity-40">pts</span></p>
                      </div>
                   </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section id="how-it-works" className="py-20 md:py-32 bg-surface-container-low/30 relative">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { title: "01. Join", desc: "Join the Kinetic community. Your participation directly fuels specific charity funds committed to global change.", icon: Users },
                { title: "02. Play", desc: "Log your rounds through our precision dashboard. Milestones unlock prize entries and impact multipliers.", icon: Target },
                { title: "03. Impact", desc: "Watch your performance translate into real-world change. Receive detailed impact reports quarterly.", icon: HandHeart }
              ].map((step, i) => (
                <motion.div key={i} variants={fadeInUp} className="group relative p-8 md:p-12 bg-background/40 rounded-3xl border border-white/5 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="mb-8 md:mb-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner">
                    <step.icon className="text-primary group-hover:text-on-primary transition-colors w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 font-headline uppercase italic tracking-tighter">{step.title}</h3>
                  <p className="text-sm md:text-on-surface-variant leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Impact Visualizer */}
        <section className="px-8 overflow-hidden">
           <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
              <div className="lg:col-span-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 block">Real-time Metrics</span>
                 <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter mb-8 md:mb-10 leading-[0.95] uppercase italic">Data-Driven<br/>Philanthropy</h2>
                 <p className="text-on-surface-variant text-base md:text-xl mb-12 md:mb-16 leading-relaxed font-medium">
                   We believe in radical transparency. Every contribution is tracked and visualized so you can see the precise ripple effect of your presence in the community.
                 </p>
                 
                 <div className="space-y-12">
                   {[
                     { label: "Clean Water Access", target: 84, color: "bg-kinetic-gradient" },
                     { label: "Youth Development", target: 62, color: "bg-tertiary" }
                   ].map((goal, i) => (
                     <div key={i}>
                       <div className="flex justify-between items-end mb-4">
                         <span className="text-[11px] font-black uppercase tracking-widest text-white">{goal.label}</span>
                         <span className={cn("text-xs font-black tracking-widest", i === 0 ? "text-primary" : "text-tertiary")}>{goal.target}% EFFECTED</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: `${goal.target}%` }}
                           viewport={{ once: true }}
                           transition={{ duration: 2, delay: 0.5, ease: "circOut" }}
                           className={cn("h-full rounded-full", goal.color)}
                         />
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[120px] -z-10 animate-pulse" />
                 <div className="space-y-6">
                    <Card className="p-8 md:p-12 glass-panel border-white/10">
                       <p className="font-headline text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">₹27 Cr+</p>
                       <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Total Impact Raised</p>
                    </Card>
                    <Card className="p-8 md:p-12 glass-panel border-white/10">
                       <p className="font-headline text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">48k</p>
                       <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Lives Impacted</p>
                    </Card>
                 </div>
                 <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                    <Card className="p-8 md:p-12 glass-panel border-white/10">
                       <p className="font-headline text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">12</p>
                       <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Partner Orgs</p>
                    </Card>
                    <Card className="p-8 md:p-12 glass-panel border-white/10">
                       <p className="font-headline text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tighter">156</p>
                       <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Wells Built</p>
                    </Card>
                 </div>
              </div>
           </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32 bg-surface-container-low/20">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8">
            <div className="text-center mb-16 md:mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Membership Access</span>
              <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Choose Your Tier</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  name: "Monthly  Operative", 
                  price: "₹499", 
                  period: "month",
                  features: ["Global Leaderboard Access", "Monthly Prize Draw Entry", "Real-time Impact Tracking", "Standard Support"],
                  cta: "Start Monthly",
                  popular: false
                },
                { 
                  name: "Yearly  Vanguard", 
                  price: "₹4,999", 
                  period: "year",
                  features: ["All Monthly Features", "Early Bird 10% OFF", "Quarterly Luxury Draw Entry", "Exclusive Partner Perks", "Priority Support"],
                  cta: "Go Annual",
                  popular: true
                }
              ].map((plan, i) => (
                <Card key={i} className={cn(
                  "p-8 md:p-12 glass-panel border-white/10 flex flex-col relative overflow-hidden",
                  plan.popular && "border-primary/30 shadow-2xl shadow-primary/5"
                )}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-black px-6 py-2 uppercase tracking-widest rounded-bl-2xl">
                      BEST VALUE
                    </div>
                  )}
                  <h3 className="text-2xl font-black font-headline uppercase italic mb-2 tracking-tighter">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-5xl font-black font-headline italic">{plan.price}</span>
                    <span className="text-on-surface-variant font-bold uppercase text-[10px] tracking-widest">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-12 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={cn(
                    "w-full py-6 uppercase tracking-widest font-black text-xs",
                    !plan.popular && "variant-outline border-white/10"
                  )}>{plan.cta}</Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 md:pb-24 px-6 md:px-8 relative overflow-hidden bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[140px] -z-0 opacity-40 rotate-12" />
          <div className="max-w-4xl pt-12 md:pt-0 mx-auto text-center relative z-10">
            <h2 className="font-headline text-4xl md:text-[5rem] font-black mb-8 md:mb-12 tracking-tighter leading-none uppercase italic">Ready to Redefine<br/>Your Game?</h2>
            <p className="text-on-surface-variant text-base md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto font-medium">Join the world's most purposeful golf community and start your impact journey today.</p>
            <Link href="/auth/signup"><Button size="lg" className="rounded-full px-10 md:px-16 py-6 md:py-8 text-base md:text-xl font-black uppercase tracking-[0.25em] bg-kinetic-gradient text-on-primary-container shadow-2xl shadow-primary/30 transform hover:scale-105 active:scale-95 transition-all mx-auto w-full sm:w-auto">Become a Member</Button></Link>
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
          <div className="flex flex-wrap gap-12 font-headline text-[10px] font-black uppercase tracking-[0.25em] antialiased">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Operations</Link>
            <Link href="#" className="hover:text-primary transition-colors">Partner Global Registry</Link>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleShare}
              className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-primary transition-all cursor-pointer group"
            >
              <Share2 className="w-5 h-5 group-hover:text-primary" />
            </button>
            <Link 
              href="https://kinetic-horizon.vercel.app" 
              target="_blank"
              className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:border-primary transition-all cursor-pointer group"
            >
              <Globe2 className="w-5 h-5 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
