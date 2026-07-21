import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const tones = {
  blue: 'from-blue-600 to-blue-500 shadow-blue-500/20', green: 'from-emerald-600 to-green-500 shadow-emerald-500/20', amber: 'from-amber-500 to-orange-500 shadow-amber-500/20', indigo: 'from-indigo-600 to-violet-500 shadow-indigo-500/20', slate: 'from-slate-700 to-slate-600 shadow-slate-500/20',
};
function StatsCard({ title, value, subtitle, tone = 'blue', icon: Icon, trend = 'Live' }) {
  return <motion.section whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 350, damping: 24 }} className="card group overflow-hidden p-5">
    <div className="flex items-start justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${tones[tone]}`}>{Icon && <Icon size={23} />}</div><span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><ArrowUpRight size={12} />{trend}</span></div>
    <p className="mt-5 text-sm font-medium text-slate-500">{title}</p><p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-xs text-slate-500">{subtitle}</p>
  </motion.section>;
}
export default StatsCard;
