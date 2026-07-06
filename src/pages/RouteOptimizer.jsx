import { useState } from 'react';
import RouteCard from '../components/RouteCard.jsx';
import RouteMap from '../components/RouteMap.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { routeService } from '../services/routeService';

const emptyRoute = {
  totalDistance: 0,
  totalStops: 0,
  route: [],
};

function formatDistance(value) {
  return Number(value || 0).toFixed(2);
}

function RouteOptimizer() {
  const [optimizedRoute, setOptimizedRoute] = useState(emptyRoute);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasOptimized, setHasOptimized] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await routeService.optimizeRoute();
      setOptimizedRoute(data);
      setHasOptimized(true);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Route Optimizer</h2>
          <p className="mt-1 text-sm text-slate-500">Preview optimized stop sequencing for pending deliveries.</p>
        </div>
        <button
          type="button"
          onClick={handleOptimize}
          disabled={loading}
          className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {loading ? 'Optimizing...' : 'Optimize Route'}
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Distance" value={`${formatDistance(optimizedRoute.totalDistance)} km`} subtitle="Projected travel distance" tone="blue" />
        <StatsCard title="Total Stops" value={optimizedRoute.totalStops} subtitle="Pending route stops" tone="green" />
        <StatsCard title="Route Status" value={hasOptimized ? 'Ready' : 'Idle'} subtitle="Optimization result" tone="amber" />
      </div>

      {loading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
          Optimizing route...
        </div>
      ) : optimizedRoute.route.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
          {hasOptimized ? 'No pending route stops found.' : 'Click Optimize Route to fetch the latest route from the backend.'}
        </div>
      ) : (
        <>
          <section className="space-y-3">
            {optimizedRoute.route.map((step) => (
              <RouteCard
                key={`${step.order}-${step.customer}`}
                order={step.order}
                customer={step.customer}
                address={step.address}
                distance={formatDistance(step.distanceFromPrevious)}
              />
            ))}
          </section>
          <RouteMap stops={optimizedRoute.route} />
        </>
      )}
    </div>
  );
}

export default RouteOptimizer;
