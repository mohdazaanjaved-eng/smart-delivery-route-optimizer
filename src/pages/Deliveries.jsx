import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeliveryCard from '../components/DeliveryCard.jsx';
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

function Deliveries() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Deliveries</h2>
          <p className="mt-1 text-sm text-slate-500">Review delivery stops from the backend.</p>
        </div>
        <Link to="/deliveries/new" className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Add Delivery
        </Link>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
          Loading deliveries...
        </div>
      ) : deliveries.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
          No deliveries found.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} {...toDeliveryCardProps(delivery)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Deliveries;
