"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Users, 
  Search, 
  MoreVertical,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Filter,
  UserPlus
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "USER", password: "" });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to retrieve user registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await api.post("/admin/users", newUser);
      toast.success("New operative inducted successfully.");
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Recruitment protocol failed.");
    }
  };

  const handleToggleVerified = async (user: any) => {
    try {
      const updated = await api.put(`/admin/users/${user.id}`, { isVerified: !user.isVerified });
      setUsers(users.map(u => u.id === user.id ? { ...u, isVerified: updated.data.isVerified } : u));
      toast.success(`${user.name || 'User'} status updated.`);
    } catch (err) {
      toast.error("Status adjustment failed.");
    }
  };

  const handleUpdateRole = async (user: any) => {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      try {
        const updated = await api.put(`/admin/users/${user.id}`, { role: newRole });
        setUsers(users.map(u => u.id === user.id ? { ...u, role: updated.data.role } : u));
        toast.success(`Role escalated to ${newRole}`);
      } catch (err) {
        toast.error("Role modification protocol failed.");
      }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    const matchesStatus = filterStatus === "ALL" || 
                         (filterStatus === "ACTIVE" ? u.isVerified : !u.isVerified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) return null;

  return (
    <div className="p-6 md:p-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">System Registry</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-headline text-white uppercase italic">Operative Protocol</h1>
        </div>
        <div className="grid grid-cols-2 md:flex gap-3 md:gap-4">
           <Button variant="outline" size="sm" className="h-10 md:h-12 px-4 md:px-6 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] items-center gap-2" onClick={() => {
             setFilterStatus(filterStatus === "ACTIVE" ? "LOCKED" : filterStatus === "LOCKED" ? "ALL" : "ACTIVE");
           }}>
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> {filterStatus}
           </Button>
           <Button variant="outline" size="sm" className="h-10 md:h-12 px-4 md:px-6 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] items-center gap-2" onClick={() => {
             setFilterRole(filterRole === "USER" ? "ADMIN" : filterRole === "ADMIN" ? "ALL" : "USER");
           }}>
              <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" /> {filterRole}
           </Button>
           <Button variant="primary" size="sm" className="col-span-2 md:col-span-1 h-10 md:h-12 px-4 md:px-6 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[10px] items-center gap-2" onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" /> New Operative
           </Button>
        </div>
      </header>

      <Card className="overflow-hidden border-outline-variant/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-on-surface-variant border-b border-outline-variant/10 bg-white/[0.02]">
                  <th className="p-4 sm:p-6 md:p-8 pb-4">Operative Identity</th>
                  <th className="p-4 sm:p-6 md:p-8 pb-4">Email</th>
                  <th className="p-4 sm:p-6 md:p-8 pb-4 hidden lg:table-cell">Access</th>
                  <th className="p-4 sm:p-6 md:p-8 pb-4 text-center hidden sm:table-cell">Tier</th>
                  <th className="p-4 sm:p-6 md:p-8 pb-4 text-center">Role Status</th>
                  <th className="p-4 sm:p-6 md:p-8 pb-4 text-right hidden md:table-cell">Registry Date</th>
                  <th className="p-4 sm:p-6 md:p-8 pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredUsers.length > 0 ? filteredUsers.map((u, i) => (
                  <tr key={u.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 sm:p-6 md:p-8">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs uppercase shadow-inner", 
                            u.role === 'ADMIN' ? "bg-primary/20 text-primary border border-primary/20" : "bg-surface-container-highest text-on-surface-variant"
                          )}>
                             {u.name?.substring(0, 2) || 'OP'}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white uppercase italic">{u.name || 'Anonymous'}</p>
                             <p className="text-[10px] text-on-surface-variant font-bold tracking-tighter opacity-60 italic">{u.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-4 sm:p-6 md:p-8">
                       <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest", 
                         u.emailVerified ? "text-emerald-500 bg-emerald-500/10" : "text-error bg-error/10"
                       )}>
                          {u.emailVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {u.emailVerified ? "CONFIRMED" : "PENDING"}
                       </div>
                    </td>
                    <td className="p-4 sm:p-6 md:p-8 hidden lg:table-cell">
                       <button 
                        onClick={() => handleToggleVerified(u)}
                        className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all border", 
                         u.isVerified ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10" : "border-error/20 text-error bg-error/5 hover:bg-error/10"
                       )}>
                          {u.isVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {u.isVerified ? "ACTIVE" : "LOCKED"}
                       </button>
                    </td>
                    <td className="p-4 sm:p-6 md:p-8 text-center hidden sm:table-cell">
                       <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border", 
                         u.subscriptionStatus === 'ACTIVE' ? "border-primary/40 text-primary bg-primary/5" : "border-outline-variant/20 text-on-surface-variant"
                       )}>
                          {u.subscriptionStatus === 'ACTIVE' ? "PRO ELITE" : "STANDARD"}
                       </span>
                    </td>
                    <td className="p-4 sm:p-6 md:p-8 text-center">
                       <button 
                        onClick={() => handleUpdateRole(u)}
                        className={cn("text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 decoration-primary", 
                         u.role === 'ADMIN' ? "text-primary" : "text-on-surface-variant hover:text-white"
                       )}>
                          {u.role}
                       </button>
                    </td>
                    <td className="p-4 sm:p-6 md:p-8 text-right font-headline font-bold text-xs opacity-60 hidden md:table-cell">
                       {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 sm:p-6 md:p-8 text-right">
                       <button className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-all">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-20 text-center text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
                      No matching identities found in registry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </Card>
      
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between p-6 bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/20 gap-4">
         <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary w-5 h-5" />
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest text-center md:text-left">
              GDS Sync • Latency 14ms
            </p>
         </div>
         <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Registry Count: {filteredUsers.length}</p>
      </div>

      {/* Add Operative Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-high border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-black font-headline uppercase italic mb-8">Induct Operative</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Name</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Email Address</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Access Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all appearance-none uppercase font-bold tracking-widest"
                  >
                    <option value="USER">USER (Standard Access)</option>
                    <option value="ADMIN">ADMIN (Full Authority)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 block">Temporary Password</label>
                  <input 
                    type="password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all" 
                    placeholder="Leave blank for default: Golfgiver@123"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 py-4 uppercase font-black tracking-widest text-[10px]">Abort</Button>
                <Button onClick={handleCreateUser} className="flex-[2] py-4 uppercase font-black tracking-widest text-[10px]">Induct Operative</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
