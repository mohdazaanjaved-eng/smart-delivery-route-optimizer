import { motion } from 'framer-motion';
import { Clock3, Fuel, Gauge, Leaf, MapPinned, Navigation } from 'lucide-react';

const metrics = [
  { key: 'stops', label: 'Total Stops', icon: MapPinned, tone: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
  { key: 'distance', label: 'Total Distance', icon: Navigation, tone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300' },
  { key: 'time', label: 'Estimated Time', icon: Clock3, tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' },
  { key: 'average', label: 'Average per Stop', icon: Gauge, tone: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' },
  { key: 'fuel', label: 'Estimated Fuel', icon: Fuel, tone: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
  { key: 'saved', label: 'Estimated Fuel Saved', icon: Leaf, tone: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300' },
];

function RouteSummary({ totalStops, totalDistance, estimatedMinutes }) {
  const distance = Number(totalDistance || 0);
  const stops = Number(totalStops || 0);
  const fuelConsumption = distance / 15;
  const fuelSaved = fuelConsumption * 0.18;
  const values = {
    stops: `${stops}`,
    distance: `${distance.toFixed(2)} km`,
    time: `${estimatedMinutes} min`,
    average: `${(distance / Math.max(stops, 1)).toFixed(2)} km`,
    fuel: `${fuelConsumption.toFixed(2)} L`,
    saved: `${fuelSaved.toFixed(2)} L`,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
      aria-labelledby="route-summary-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Route overview</p>
          <h3 id="route-summary-title" className="mt-1 text-lg font-bold text-slate-950">Optimization summary</h3>
        </div>
        <p className="text-xs text-slate-500">Fuel estimates use 15 km/L mileage and 18% projected savings.</p>
      </div>
      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map(({ key, label, icon: Icon, tone }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-5 dark:bg-slate-900/80"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></div>
            <p className="mt-4 text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">{values[key]}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default RouteSummary;
