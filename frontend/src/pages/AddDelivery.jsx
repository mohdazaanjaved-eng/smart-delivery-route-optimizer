import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryService } from '../services/deliveryService';
import { ArrowLeft, CalendarClock, Loader2, Mail, MapPin, Navigation, Phone, Save, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
  { label: 'Customer name', name: 'customerName', type: 'text', icon: UserRound, placeholder: 'e.g. Rahul Sharma' },
  { label: 'Customer phone', name: 'customerPhone', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
  { label: 'Customer email', name: 'customerEmail', type: 'email', icon: Mail, placeholder: 'customer@example.com' },
  { label: 'Delivery address', name: 'deliveryAddress', type: 'text', wide: true, icon: MapPin, placeholder: 'Full delivery address' },
  { label: 'Latitude', name: 'latitude', type: 'number', step: 'any', icon: Navigation, placeholder: '28.6139' },
  { label: 'Longitude', name: 'longitude', type: 'number', step: 'any', icon: Navigation, placeholder: '77.2090' },
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
      toast.success('Delivery created successfully');
      navigate('/deliveries');
    } catch (error) {
      setErrorMessage(error.message);
      setValidationErrors(error.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-4"><Link to="/deliveries" className="btn-secondary h-11 w-11 shrink-0 p-0" aria-label="Back to deliveries"><ArrowLeft size={18}/></Link><div>
        <p className="text-sm font-semibold text-blue-600">New record</p><h2 className="page-title">Add a delivery</h2>
        <p className="page-copy">Enter the customer, destination, and scheduling details.</p>
      </div>
      </div>

      <AnimatePresence>{errorMessage && (
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </motion.div>
      )}</AnimatePresence>

      <form className="card overflow-hidden" onSubmit={handleSubmit}>
        <div className="border-b border-slate-100 px-5 py-5 sm:px-8"><h3 className="font-bold text-slate-950">Delivery information</h3><p className="mt-1 text-xs text-slate-500">Fields are validated by the delivery service.</p></div>
        <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.wide ? 'block lg:col-span-2' : 'block'}>
            <div className="relative"><field.icon className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={18}/>
            <input
              className="peer input pb-2 pl-11 pt-5"
              type={field.type}
              name={field.name}
              step={field.step}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder=" "
            />
            <span className="pointer-events-none absolute left-11 top-2 text-[10px] font-bold uppercase tracking-wide text-blue-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wide peer-focus:text-blue-600">{field.label}</span>
            </div>
            {validationErrors[field.name] && (
              <motion.p initial={{opacity:0,y:-3}} animate={{opacity:1,y:0}} className="mt-1.5 text-xs font-medium text-red-600">{validationErrors[field.name]}</motion.p>
            )}
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select
            className="input mt-2"
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
          <div className="relative mt-2"><CalendarClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input
            type="datetime-local"
            name="estimatedDeliveryTime"
            value={formData.estimatedDeliveryTime}
            onChange={handleChange}
            className="input pl-11"
          /></div>
          {validationErrors.estimatedDeliveryTime && (
            <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.estimatedDeliveryTime}</p>
          )}
        </label>
        </div><div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:flex-row sm:justify-end sm:px-8"><Link to="/deliveries" className="btn-secondary">Cancel</Link><button
          type="submit"
          disabled={loading}
          className="btn-primary min-w-40"
        >
          {loading ? <><Loader2 className="animate-spin" size={17}/>Saving...</> : <><Save size={17}/>Save delivery</>}
        </button></div>
      </form>
    </div>
  );
}

export default AddDelivery;
