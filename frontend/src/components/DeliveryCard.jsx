import { CalendarClock, MapPin, MoreHorizontal, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const statusClass = { PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/15', IN_TRANSIT: 'bg-blue-50 text-blue-700 ring-blue-600/15', DELIVERED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', CANCELLED: 'bg-red-50 text-red-700 ring-red-600/15' };
export const priorityClass = { HIGH: 'bg-red-50 text-red-700', MEDIUM: 'bg-amber-50 text-amber-700', LOW: 'bg-emerald-50 text-emerald-700' };
function DeliveryCard({ customer, address, priority, status, eta }) {
  return <motion.article whileHover={{ y: -3 }} className="card p-5 transition-shadow hover:shadow-xl hover:shadow-slate-200/60">
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><UserRound size={20} /></div><div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-950">{customer}</h3><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500"><MapPin size={13} />{address}</p></div></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`More actions for ${customer}`}><MoreHorizontal size={18} /></button></div>
    <div className="mt-5 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusClass[status] || statusClass.PENDING}`}>{String(status).replace('_', ' ')}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityClass[priority]}`}>{priority} priority</span></div>
    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><CalendarClock size={15} className="text-slate-400" /><span>ETA</span><span className="ml-auto font-semibold text-slate-700">{eta}</span></div>
  </motion.article>;
}
export default DeliveryCard;
