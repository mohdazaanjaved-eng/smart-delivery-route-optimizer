import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryService } from '../services/deliveryService';

const initialFormData = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  deliveryAddress: '',
  latitude: '',
  longitude: '',
  priority: 'LOW',
  estimatedDeliveryTime: '',
};

const fields = [
  { label: 'Customer name', name: 'customerName', type: 'text' },
  { label: 'Customer phone', name: 'customerPhone', type: 'tel' },
  { label: 'Customer email', name: 'customerEmail', type: 'email' },
  { label: 'Delivery address', name: 'deliveryAddress', type: 'text', wide: true },
  { label: 'Latitude', name: 'latitude', type: 'number', step: 'any' },
  { label: 'Longitude', name: 'longitude', type: 'number', step: 'any' },
];

function AddDelivery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => ({ ...current, [name]: undefined }));
  };

  const buildPayload = () => ({
    ...formData,
    latitude: Number(formData.latitude),
    longitude: Number(formData.longitude),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setValidationErrors({});

    try {
      await deliveryService.createDelivery(buildPayload());
      navigate('/deliveries');
    } catch (error) {
      setErrorMessage(error.message);
      setValidationErrors(error.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Add Delivery</h2>
        <p className="mt-1 text-sm text-slate-500">Create a new delivery record in the backend.</p>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-2" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className={field.wide ? 'block lg:col-span-2' : 'block'}>
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              type={field.type}
              name={field.name}
              step={field.step}
              value={formData[field.name]}
              onChange={handleChange}
            />
            {validationErrors[field.name] && (
              <p className="mt-1 text-xs font-medium text-red-600">{validationErrors[field.name]}</p>
            )}
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
          {validationErrors.priority && <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.priority}</p>}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Estimated delivery time</span>
          <input
            type="datetime-local"
            name="estimatedDeliveryTime"
            value={formData.estimatedDeliveryTime}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
          {validationErrors.estimatedDeliveryTime && (
            <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.estimatedDeliveryTime}</p>
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300 lg:col-span-2"
        >
          {loading ? 'Saving Delivery...' : 'Save Delivery'}
        </button>
      </form>
    </div>
  );
}

export default AddDelivery;
