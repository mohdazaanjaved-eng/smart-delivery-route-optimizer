import RouteCard from '../components/RouteCard.jsx';
import StatsCard from '../components/StatsCard.jsx';

const route = [
  { order: 1, customer: 'Rahul Sharma', address: 'Sector 62, Noida', distance: '0.00' },
  { order: 2, customer: 'Amit Singh', address: 'Sector 18, Noida', distance: '5.42' },
  { order: 3, customer: 'Priya Verma', address: 'Connaught Place, Delhi', distance: '8.73' },
];

function RouteOptimizer() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Route Optimizer</h2>
          <p className="mt-1 text-sm text-slate-500">Preview optimized stop sequencing for pending deliveries.</p>
        </div>
        <button type="button" className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Optimize Route
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Distance" value="18.72 km" subtitle="Projected travel distance" tone="blue" />
        <StatsCard title="Total Stops" value="3" subtitle="Pending route stops" tone="green" />
        <StatsCard title="Priority Stops" value="1" subtitle="High priority delivery" tone="amber" />
      </div>
      <section className="space-y-3">
        {route.map((step) => (
          <RouteCard key={step.order} {...step} />
        ))}
      </section>
    </div>
  );
}

export default RouteOptimizer;
