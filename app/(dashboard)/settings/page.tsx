"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Shield, CreditCard, ArrowLeft, LogOut, ChevronRight, Activity, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [history, setHistory] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', currentPassword: '', newPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, historyRes] = await Promise.all([
          api.get("/user/dashboard"),
          api.get("/subscription/history").catch(() => ({ data: [] }))
        ]);
        setUser(userRes.data.profile);
        setFormData(prev => ({ ...prev, name: userRes.data.profile.name || '' }));
        setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        setSubmitting(true);
        const res = await api.put("/user/profile", { profileImage: base64 });
        setUser({ ...user, profileImage: res.data.profileImage });
        toast.success("Identity visual updated.");
      } catch (err) {
        toast.error("Visual upload failed.");
      } finally {
        setSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.put("/user/profile", { name: formData.name });
      setUser({ ...user, name: res.data.name });
      toast.success("Identity data synchronized.");
    } catch (err) {
      toast.error("Sync protocol failure.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecurityReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/user/security/password", { 
        currentPassword: formData.currentPassword, 
        newPassword: formData.newPassword 
      });
      toast.success("Security keys rotated successfully.");
      setFormData({ ...formData, currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error("Security rotation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Session purged. Returning to entry point.");
    router.push("/");
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors mb-12 group uppercase tracking-widest text-[10px] font-bold">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Dashboard
      </Link>

      <header className="mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">Configuration</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline text-white italic">Settings</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
         <div className="md:col-span-4 space-y-4">
            {[
              { id: 'profile', name: 'Identity', icon: User },
              { id: 'billing', name: 'Billing', icon: CreditCard },
              { id: 'security', name: 'Security', icon: Shield },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border border-outline-variant/10 text-left transition-all",
                  activeTab === item.id ? "bg-primary/10 border-primary/40 text-primary" : "hover:bg-white/5 text-on-surface-variant"
                )}
              >
                 <div className="flex items-center gap-3">
                   <item.icon className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                 </div>
                 <ChevronRight className="w-4 h-4" />
              </button>
            ))}
            
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-xl text-error text-[10px] font-black uppercase tracking-widest hover:bg-error/5 transition-all mt-12">
               <LogOut className="w-4 h-4" />
               Purge Session
            </button>
         </div>

         <div className="md:col-span-8 space-y-8">
            {activeTab === 'profile' ? (
              <Card className="p-10 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-10 flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Active Identity
                </h3>
                
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                   <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-outline-variant/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary border-dashed">
                         {user?.profileImage ? (
                           <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           <User className="w-10 h-10 text-on-surface-variant" />
                         )}
                         <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Activity className="w-5 h-5 text-white animate-pulse" />
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                         </label>
                      </div>
                      {user?.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                           <Shield className="w-3 h-3 text-on-primary" />
                        </div>
                      )}
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <p className="text-2xl font-black font-headline text-white uppercase italic tracking-tighter mb-1">{user?.name || 'Incomplete profile'}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em]">{user?.email}</p>
                   </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Legal Identity Name</label>
                      <input 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all text-white italic font-bold"
                        placeholder="Enter full name..."
                      />
                   </div>
                   
                   <Button 
                    disabled={submitting}
                    className="w-full py-5 uppercase font-black tracking-[0.2em] text-[10px]"
                   >
                     {submitting ? 'Propagating...' : 'Synchronize Identity'}
                   </Button>
                </form>
              </Card>
            ) : activeTab === 'billing' ? (
              <div className="space-y-6">
                <Card className="p-8 border-tertiary/20 bg-tertiary/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 blur-3xl rounded-full -mr-16 -mt-16" />
                   <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-8 flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-tertiary" /> Subscription Status
                   </h3>

                   <div className="flex justify-between items-start mb-8">
                     <div>
                        <p className="text-3xl font-black font-headline text-white mb-2 uppercase tracking-tighter italic">
                          {user?.subscriptionStatus === 'ACTIVE' ? 'KINETIC ELITE PRO' : 'GUEST STATUS'}
                        </p>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                           Renewalmanaged by stripe identity terminal
                        </p>
                     </div>
                     <div className="p-3 rounded-2xl bg-tertiary/10 text-tertiary border border-tertiary/20">
                        <Activity className="w-6 h-6 animate-pulse" />
                     </div>
                   </div>

                   <Button className="w-full bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-black uppercase tracking-widest text-[10px] py-4">Manage via Stripe Terminal</Button>
                </Card>

                <Card className="p-8 border-outline-variant/5">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-6">Execution Log: Billing</h3>
                   <div className="space-y-4">
                      {history && history.length > 0 ? history.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-outline-variant/10 rounded-xl group hover:border-primary/20 transition-all">
                           <div>
                              <p className="text-xs font-black uppercase tracking-widest text-white mb-1">{item.planType} - INVOICE #{item.id.slice(-6)}</p>
                              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">{new Date(item.createdAt).toLocaleDateString()} • ₹{item.amount / 100}</p>
                           </div>
                           <div className="text-primary font-black text-[10px] uppercase tracking-widest border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">Success</div>
                        </div>
                      )) : (
                        <div className="text-center py-12 border-2 border-dashed border-outline-variant/10 rounded-2xl">
                           <CreditCard className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-4" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 italic">No historical records found</p>
                        </div>
                      )}
                   </div>
                </Card>
              </div>
            ) : (
              <Card className="p-10 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 blur-3xl rounded-full -mr-16 -mt-16" />
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-10 flex items-center gap-3">
                   <Shield className="w-4 h-4 text-primary" /> Security Protocol
                </h3>
                
                <form onSubmit={handleSecurityReset} className="space-y-8">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Current Password Access</label>
                       <div className="relative">
                         <input 
                           type={showCurrentPassword ? "text" : "password"}
                           value={formData.currentPassword}
                           onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                           className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-6 py-4 pr-12 text-sm focus:outline-none focus:border-primary transition-all text-white"
                           placeholder="••••••••"
                         />
                         <button
                           type="button"
                           onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                         >
                           {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                       </div>
                   </div>

                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">New Security Sequence</label>
                       <div className="relative">
                         <input 
                           type={showNewPassword ? "text" : "password"}
                           value={formData.newPassword}
                           onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                           className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-6 py-4 pr-12 text-sm focus:outline-none focus:border-primary transition-all text-white"
                           placeholder="Min 8 characters..."
                         />
                         <button
                           type="button"
                           onClick={() => setShowNewPassword(!showNewPassword)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                         >
                           {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                       </div>
                   </div>

                   <Button 
                    disabled={submitting}
                    className="w-full py-5 uppercase font-black tracking-[0.2em] text-[10px] bg-primary text-on-primary"
                   >
                     {submitting ? 'Updating Sequence...' : 'Rotate Security Keys'}
                   </Button>
                </form>

                <div className="mt-12 p-6 bg-error/5 border border-error/10 rounded-2xl">
                   <div className="flex items-center gap-3 mb-3">
                      <LogOut className="w-4 h-4 text-error" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-error">Session Management</p>
                   </div>
                   <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-relaxed mb-6 opacity-60">
                     Termination of session will revoke all active security tokens across all linked devices.
                   </p>
                   <Button onClick={handleLogout} variant="outline" className="w-full border-error/20 text-error hover:bg-error/10 hover:text-error text-[10px] font-black uppercase tracking-widest">Execute Logout</Button>
                </div>
              </Card>
            )}
         </div>
      </div>
    </div>
  );
}
