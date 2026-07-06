import DeliveryCard from '../components/DeliveryCard.jsx';
import StatsCard from '../components/StatsCard.jsx';

const deliveries = [
  { customer: 'Rahul Sharma', address: 'Sector 62, Noida', priority: 'HIGH', status: 'PENDING', eta: 'Today, 2:30 PM' },
  { customer: 'Amit Singh', address: 'Sector 18, Noida', priority: 'MEDIUM', status: 'ASSIGNED', eta: 'Today, 4:00 PM' },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of delivery operations and route planning status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Pending Deliveries" value="18" subtitle="Awaiting assignment" tone="blue" />
        <StatsCard title="Active Drivers" value="7" subtitle="Currently available" tone="green" />
        <StatsCard title="High Priority" value="5" subtitle="Needs attention" tone="amber" />
        <StatsCard title="Completed Today" value="42" subtitle="Delivered stops" tone="slate" />
      </div>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950">Recent Deliveries</h3>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.customer} {...delivery} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
