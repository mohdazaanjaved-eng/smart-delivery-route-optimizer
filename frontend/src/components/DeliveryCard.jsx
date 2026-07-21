import { Activity, CalendarCheck2, CalendarClock, Check, Loader2, MapPin, MoreHorizontal, Play, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { deliveryAction, isCompletedStatus, normalizedStatus } from '../services/deliveryWorkflow.js';

export const statusClass = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  ASSIGNED: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  IN_TRANSIT: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  DELIVERED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/15',
};
export const priorityClass = { HIGH: 'bg-red-50 text-red-700', MEDIUM: 'bg-amber-50 text-amber-700', LOW: 'bg-emerald-50 text-emerald-700' };
export const isCompletedDelivery = isCompletedStatus;
export const normalizeDeliveryStatus = normalizedStatus;
export const formatDeliveryStatus = (status) => normalizeDeliveryStatus(status || 'PENDING').replaceAll('_', ' ');

function DeliveryCard({ id, customer, address, priority, status, eta, startedAt, completedAt, starting = false, completing = false, onStart, onComplete }) {
  const completed = isCompletedDelivery(status);
  const action = deliveryAction(status);

  return <motion.article whileHover={completed ? undefined : { y: -3 }} className={`card p-5 transition-shadow hover:shadow-xl hover:shadow-slate-200/60 ${completed ? 'opacity-80 ring-1 ring-emerald-500/10' : ''}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${completed ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{completed ? <Check size={20} /> : <UserRound size={20} />}</div><div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-950">{customer}</h3><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500"><MapPin size={13} />{address}</p></div></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`More actions for ${customer}`}><MoreHorizontal size={18} /></button></div>
    <div className="mt-5 flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusClass[status] || statusClass.PENDING}`}>{status === 'IN_PROGRESS' && <Activity size={12} />}{formatDeliveryStatus(status)}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityClass[priority]}`}>{priority} priority</span></div>
    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500"><CalendarClock size={15} className="text-slate-400" /><span>ETA</span><span className="ml-auto font-semibold text-slate-700">{eta}</span></div>
    {completed && completedAt && <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700"><CalendarCheck2 size={15} /><span>Completed {completedAt}</span></div>}
    {status === 'IN_PROGRESS' && startedAt && <div className="mt-3 flex items-center gap-2 text-xs font-medium text-indigo-700"><Activity size={15} /><span>Started {startedAt}</span></div>}
    {action === 'START' && onStart && <button type="button" onClick={() => onStart(id)} disabled={starting} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{starting ? <><Loader2 className="animate-spin" size={16} />Starting...</> : <><Play size={16} />Start Delivery</>}</button>}
    {action === 'COMPLETE' && onComplete && <button type="button" onClick={() => onComplete(id)} disabled={completing} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">{completing ? <><Loader2 className="animate-spin" size={16} />Completing...</> : <><Check size={16} />Mark Completed</>}</button>}
    {(action === 'COMPLETED' || action === 'DELIVERED') && <button type="button" disabled className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><Check size={16} />{action === 'DELIVERED' ? 'Delivered' : 'Completed'}</button>}
  </motion.article>;
}

export default DeliveryCard;
