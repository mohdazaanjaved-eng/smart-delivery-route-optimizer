import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Loader2, MapPinned, Printer, Route, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import RouteCard from '../components/RouteCard.jsx';
import RouteMap from '../components/RouteMap.jsx';
import RouteSummary from '../components/RouteSummary.jsx';
import { routeService } from '../services/routeService';

const emptyRoute = { totalDistance: 0, totalStops: 0, route: [] };
const formatDistance = (value) => Number(value || 0).toFixed(2);

function RouteOptimizer() {
  const [optimizedRoute, setOptimizedRoute] = useState(emptyRoute);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasOptimized, setHasOptimized] = useState(false);

  const optimize = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await routeService.optimizeRoute();
      setOptimizedRoute(data);
      setHasOptimized(true);
      toast.success('✅ Route optimized successfully!');
    } catch (requestError) {
      setError(requestError.message);
      toast.error('❌ Unable to optimize route.');
    } finally {
      setLoading(false);
    }
  };

  const totalDistance = Number(optimizedRoute.totalDistance || 0);
  const totalStops = Number(optimizedRoute.totalStops || 0);
  const estimatedMinutes = Math.round(totalDistance * 2.5 + totalStops * 5);
  const fuelConsumption = totalDistance / 15;
  const fuelSaved = fuelConsumption * 0.18;
  const hasRoute = optimizedRoute.route.length > 0;

  return (
    <div className="route-optimizer-page space-y-7">
      <div className="no-print space-y-7">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-2xl sm:px-10 sm:py-10">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><MapPinned size={22} /></div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Intelligent route optimizer</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Turn pending deliveries into the most efficient stop sequence with a single click.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {hasRoute && <button type="button" onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"><Printer size={18} />Print Route</button>}
              <button type="button" onClick={optimize} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-70">
                {loading ? <><Loader2 className="animate-spin" size={18} />Optimizing Route...</> : <><Sparkles size={18} className="text-blue-600" />Optimize Route</>}
              </button>
            </div>
          </div>
        </section>

        {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</motion.div>}

        {hasRoute && <RouteSummary totalStops={totalStops} totalDistance={totalDistance} estimatedMinutes={estimatedMinutes} />}

        {!hasRoute && !loading && (
          <div className="card flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Route size={30} /></div>
            <h3 className="mt-4 font-bold text-slate-950">{hasOptimized ? 'No pending stops found' : 'Ready to optimize'}</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">{hasOptimized ? 'All deliveries are currently handled.' : 'Click Optimize Route to generate the best delivery sequence from the latest backend data.'}</p>
          </div>
        )}

        {hasRoute && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid items-start gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
            <section className="card max-h-[590px] overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Turn-by-turn plan</p>
                <h3 className="mt-1 font-bold text-slate-950">Optimized timeline</h3>
                <p className="mt-1 text-xs text-slate-500">Warehouse plus {Math.max(optimizedRoute.route.length - 1, 0)} delivery stops</p>
              </div>
              <div className="max-h-[510px] overflow-y-auto p-5">
                {optimizedRoute.route.map((stop, index) => (
                  <RouteCard
                    key={`${stop.order}-${stop.customer}`}
                    displayNumber={index + 1}
                    label={index === 0 ? 'Warehouse' : `Stop ${index}`}
                    customer={stop.customer}
                    address={stop.address}
                    distance={formatDistance(stop.distanceFromPrevious)}
                    isLast={index === optimizedRoute.route.length - 1}
                  />
                ))}
              </div>
            </section>
            <RouteMap stops={optimizedRoute.route} />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/55 p-5 backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="w-full max-w-sm rounded-3xl border border-white/15 bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/15" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25"><Loader2 className="animate-spin" size={30} /></div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">Optimizing Route...</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Analyzing delivery points and calculating the most efficient sequence.</p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100"><motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasRoute && (
        <section className="route-print-document print-only" aria-label="Printable optimized route">
          <header className="route-print-header">
            <p>Smart Delivery Route Optimizer</p>
            <h1>Optimized Delivery Route</h1>
            <span>Presentation Route Plan</span>
          </header>
          <div className="route-print-summary">
            <div><span>Total Stops</span><strong>{totalStops}</strong></div>
            <div><span>Total Distance</span><strong>{formatDistance(totalDistance)} km</strong></div>
            <div><span>Estimated Time</span><strong>{estimatedMinutes} min</strong></div>
            <div><span>Average per Stop</span><strong>{formatDistance(totalDistance / Math.max(totalStops, 1))} km</strong></div>
            <div><span>Estimated Fuel</span><strong>{fuelConsumption.toFixed(2)} L</strong></div>
            <div><span>Estimated Fuel Saved</span><strong>{fuelSaved.toFixed(2)} L</strong></div>
          </div>
          <h2>Optimized Stops</h2>
          <ol className="route-print-stops">
            {optimizedRoute.route.map((stop, index) => (
              <li key={`${stop.order}-${stop.customer}-print`}>
                <span>{index + 1}</span>
                <div><strong>{index === 0 ? 'Warehouse' : `Stop ${index}`} — {stop.customer}</strong><p>{stop.address}</p></div>
                <b>{formatDistance(stop.distanceFromPrevious)} km</b>
              </li>
            ))}
          </ol>
          <footer>Fuel estimates assume 15 km/L mileage and 18% projected savings compared with a conventional route.</footer>
        </section>
      )}
    </div>
  );
}

export default RouteOptimizer;
