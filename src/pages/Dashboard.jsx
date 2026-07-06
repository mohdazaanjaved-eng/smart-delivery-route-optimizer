import { useEffect, useMemo, useState } from 'react';
import DeliveryCard from '../components/DeliveryCard.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { deliveryService } from '../services/deliveryService';

function formatEta(value) {
  if (!value) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function toDeliveryCardProps(delivery) {
  return {
    customer: delivery.customerName,
    address: delivery.deliveryAddress,
    priority: delivery.priority,
    status: delivery.status,
    eta: formatEta(delivery.estimatedDeliveryTime),
  };
}

function Dashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDeliveries() {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await deliveryService.getAllDeliveries();
        if (mounted) {
          setDeliveries(data);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDeliveries();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const pendingDeliveries = deliveries.filter((delivery) => delivery.status === 'PENDING').length;
    const highPriority = deliveries.filter((delivery) => delivery.priority === 'HIGH').length;
    const completedToday = deliveries.filter((delivery) => delivery.status === 'DELIVERED').length;

    return {
      pendingDeliveries,
      highPriority,
      completedToday,
      totalDeliveries: deliveries.length,
    };
  }, [deliveries]);

  const recentDeliveries = useMemo(
    () =>
      [...deliveries]
        .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0))
        .slice(0, 5),
    [deliveries],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of delivery operations and route planning status.</p>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Pending Deliveries" value={loading ? '...' : stats.pendingDeliveries} subtitle="Awaiting assignment" tone="blue" />
        <StatsCard title="Total Deliveries" value={loading ? '...' : stats.totalDeliveries} subtitle="All delivery records" tone="green" />
        <StatsCard title="High Priority" value={loading ? '...' : stats.highPriority} subtitle="Needs attention" tone="amber" />
        <StatsCard title="Completed Today" value={loading ? '...' : stats.completedToday} subtitle="Delivered stops" tone="slate" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950">Recent Deliveries</h3>
        </div>

        {loading ? (
          <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
            Loading dashboard deliveries...
          </div>
        ) : recentDeliveries.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
            No deliveries found.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {recentDeliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} {...toDeliveryCardProps(delivery)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
