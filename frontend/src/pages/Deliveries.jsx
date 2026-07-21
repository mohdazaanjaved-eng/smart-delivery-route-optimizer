import { useEffect, useMemo, useState } from 'react';
import { Check, Filter, Loader2, PackageOpen, Plus, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DeliveryCard, { formatDeliveryStatus, isCompletedDelivery, normalizeDeliveryStatus, priorityClass, statusClass } from '../components/DeliveryCard.jsx';
import { deliveryService } from '../services/deliveryService';

const formatDateTime = (value, fallback = 'Not scheduled') => value
  ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : fallback;

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    deliveryService.getAllDeliveries()
      .then((data) => mounted && setDeliveries(data))
      .catch((requestError) => mounted && setError(requestError.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => deliveries.filter((delivery) => (
    (status === 'ALL' || normalizeDeliveryStatus(delivery.status) === status)
    && `${delivery.customerName} ${delivery.deliveryAddress}`.toLowerCase().includes(query.toLowerCase())
  )), [deliveries, query, status]);

  const markCompleted = async (id) => {
    setCompletingId(id);
    try {
      const updatedDelivery = await deliveryService.completeDelivery(id);
      setDeliveries((current) => current.map((delivery) => delivery.id === id ? updatedDelivery : delivery));
      toast.success('Delivery marked as completed.');
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to mark delivery as completed.');
    } finally {
      setCompletingId(null);
    }
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-600">Operations</p><h2 className="page-title">Delivery management</h2><p className="page-copy">Search, filter and review every delivery in one place.</p></div><Link to="/deliveries/new" className="btn-primary"><Plus size={17} />Add delivery</Link></div>
    <div className="card flex flex-col gap-3 p-3 md:flex-row"><div className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-11" placeholder="Search by customer or address..." aria-label="Search deliveries" /></div><div className="relative md:w-52"><Filter size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><select value={status} onChange={(event) => setStatus(event.target.value)} className="input appearance-none pl-10"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></div><button className="btn-secondary"><SlidersHorizontal size={17} />More filters</button></div>
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
    {loading ? <div className="card overflow-hidden"><div className="space-y-3 p-5">{[1, 2, 3, 4, 5].map((index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100/60" />)}</div></div> : filtered.length ? <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900 md:block"><div className="max-h-[620px] overflow-auto"><table className="w-full border-collapse text-left"><thead className="sticky top-0 z-10 bg-slate-50/95 text-[11px] font-bold uppercase tracking-wider text-slate-500 backdrop-blur dark:bg-slate-900/95"><tr><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Destination</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Priority</th><th className="px-6 py-4">Estimated time</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{filtered.map((delivery, index) => {
          const completed = isCompletedDelivery(delivery.status);
          return <tr key={delivery.id} className={`group transition hover:bg-blue-50/50 dark:hover:bg-blue-950/20 ${index % 2 ? 'bg-slate-50/35 dark:bg-slate-800/20' : ''} ${completed ? 'opacity-80' : ''}`}><td className="px-6 py-4"><p className="text-sm font-semibold text-slate-900">{delivery.customerName}</p><p className="mt-1 text-xs text-slate-500">{delivery.customerEmail || delivery.customerPhone || 'Delivery customer'}</p></td><td className="max-w-xs px-6 py-4 text-sm text-slate-600"><span className="line-clamp-2">{delivery.deliveryAddress}</span></td><td className="px-6 py-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusClass[delivery.status] || statusClass.PENDING}`}>{formatDeliveryStatus(delivery.status)}</span>{completed && delivery.completedAt && <p className="mt-2 whitespace-nowrap text-[11px] font-medium text-emerald-700">{formatDateTime(delivery.completedAt, '')}</p>}</td><td className="px-6 py-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityClass[delivery.priority]}`}>{delivery.priority}</span></td><td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">{formatDateTime(delivery.estimatedDeliveryTime)}</td><td className="px-6 py-4 text-right"><button type="button" onClick={() => markCompleted(delivery.id)} disabled={completed || completingId === delivery.id} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-700">{completingId === delivery.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}{completed ? 'Completed' : completingId === delivery.id ? 'Completing...' : 'Mark Completed'}</button></td></tr>;
        })}</tbody>
      </table></div></div>
      <div className="grid gap-4 md:hidden">{filtered.map((delivery) => <DeliveryCard key={delivery.id} id={delivery.id} customer={delivery.customerName} address={delivery.deliveryAddress} priority={delivery.priority} status={delivery.status} eta={formatDateTime(delivery.estimatedDeliveryTime)} completedAt={formatDateTime(delivery.completedAt, '')} completing={completingId === delivery.id} onComplete={markCompleted} />)}</div>
    </> : <div className="card py-20 text-center"><PackageOpen className="mx-auto text-slate-300" size={44} /><h3 className="mt-4 font-bold text-slate-900">No matching deliveries</h3><p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p></div>}
  </div>;
}

export default Deliveries;
