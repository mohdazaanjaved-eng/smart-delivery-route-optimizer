import { Link } from 'react-router-dom';
import DeliveryCard from '../components/DeliveryCard.jsx';

const deliveries = [
  { customer: 'Rahul Sharma', address: 'Sector 62, Noida', priority: 'HIGH', status: 'PENDING', eta: 'Today, 2:30 PM' },
  { customer: 'Amit Singh', address: 'Sector 18, Noida', priority: 'MEDIUM', status: 'ASSIGNED', eta: 'Today, 4:00 PM' },
  { customer: 'Priya Verma', address: 'Connaught Place, Delhi', priority: 'LOW', status: 'IN_PROGRESS', eta: 'Tomorrow, 11:00 AM' },
];

function Deliveries() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Deliveries</h2>
          <p className="mt-1 text-sm text-slate-500">Review delivery stops before backend integration.</p>
        </div>
        <Link to="/deliveries/new" className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          Add Delivery
        </Link>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {deliveries.map((delivery) => (
          <DeliveryCard key={delivery.customer} {...delivery} />
        ))}
      </div>
    </div>
  );
}

export default Deliveries;
