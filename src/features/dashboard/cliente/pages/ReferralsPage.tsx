import { useState, useEffect } from "react";
import { Share2, Copy, Users, Gift, Check, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { referralService } from "../services/referralService";
import type { ReferralCountResponse } from "../types/referral.types";
import Swal from "sweetalert2";

export const ReferralsPage = () => {
 const [code, setCode] = useState("");
 const [stats, setStats] = useState<ReferralCountResponse | null>(null);
 const [loading, setLoading] = useState(true);
 const [copied, setCopied] = useState(false);

 useEffect(() => {
  loadData();
 }, []);

 const loadData = async () => {
  setLoading(true);
  try {
   const [referralCode, count] = await Promise.all([
    referralService.getMyCode(),
    referralService.getMyCount(),
   ]);
   setCode(referralCode);
   setStats(count);
  } catch (error) {
   console.error("Error:", error);
  } finally {
   setLoading(false);
  }
 };

 const handleCopy = async () => {
  try {
   await navigator.clipboard.writeText(code);
   setCopied(true);
   setTimeout(() => setCopied(false), 2000);
  } catch {
   Swal.fire("Error", "No se pudo copiar", "error");
  }
 };

 const handleShare = async () => {
  if (navigator.share) {
   try {
    await navigator.share({
     title: "Huella360",
     text: "Únete a Huella360 con mi código de referido y obtén beneficios:",
     url: `${window.location.origin}/register?ref=${code}`,
    });
   } catch {}
  } else {
   handleCopy();
  }
 };

 if (loading) {
  return (
   <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
  );
 }

 return (
  <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
   <div className="text-center">
    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
     <Gift className="text-primary" size={32} />
    </div>
    <h1 className="text-2xl font-extrabold text-gray-900">Invita a tus amigos</h1>
    <p className="text-slate-500 mt-2">Comparte tu código y desbloquea beneficios por cada referido.</p>
   </div>

   {/* Referral Code Card */}
   <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
    <p className="text-sm font-medium text-white/70 mb-2">Tu código de referido</p>
    <p className="text-3xl font-mono font-bold tracking-wider mb-6">{code}</p>
    <div className="flex gap-3 justify-center">
     <Button onClick={handleCopy} className="bg-white text-primary hover:bg-slate-50 flex items-center gap-2">
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copiado" : "Copiar"}
     </Button>
     <Button onClick={handleShare} variant="outline" className="border-white/30 text-white hover:bg-white/10 flex items-center gap-2">
      <Share2 size={16} /> Compartir
     </Button>
    </div>
   </div>

   {/* Stats */}
   {stats && (
    <div className="grid grid-cols-2 gap-4">
     <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
      <Users className="mx-auto text-primary mb-2" size={24} />
      <p className="text-3xl font-extrabold text-slate-900">{stats.totalReferidos}</p>
      <p className="text-sm text-slate-500">Amigos referidos</p>
     </div>
     <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
      <Gift className="mx-auto text-amber-500 mb-2" size={24} />
      <p className="text-3xl font-extrabold text-slate-900">{stats.referidosRestantes}</p>
      <p className="text-sm text-slate-500">Para desbloquear 2da mascota</p>
     </div>
    </div>
   )}

   {/* Progress */}
   {stats && (
    <div className="bg-white border border-slate-100 rounded-2xl p-6">
     <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-semibold text-slate-600">Progreso hacia 2da mascota gratis</span>
      <span className="text-sm font-bold text-primary">{stats.totalReferidos}/{stats.referidosNecesarios}</span>
     </div>
     <div className="w-full bg-slate-100 rounded-full h-3">
      <div
       className="bg-primary rounded-full h-3 transition-all duration-500"
       style={{ width: `${Math.min((stats.totalReferidos / stats.referidosNecesarios) * 100, 100)}%` }}
      />
     </div>
     {stats.desbloqueo2daMascota ? (
      <p className="text-sm text-green-600 font-semibold mt-2">¡Desbloqueado! Ya puedes registrar una 2da mascota gratis.</p>
     ) : (
      <p className="text-sm text-slate-400 mt-2">Refiere {stats.referidosRestantes} amigos más para desbloquear una 2da mascota gratis.</p>
     )}
    </div>
   )}
  </div>
 );
};
