import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setValidationErrors({});

    try {
      await authService.login(formData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
      setValidationErrors(error.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Smart Delivery</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Sign in to operations</h1>
            <p className="mt-2 text-sm text-slate-500">Manage deliveries and route planning from one console.</p>
          </div>

          {location.state?.message && (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              {location.state.message}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
              />
              {validationErrors.email && <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.email}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {validationErrors.password && <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.password}</p>}
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            New to the system? <Link className="font-semibold text-brand-600" to="/register">Create account</Link>
          </p>
        </div>
      </section>
      <section className="hidden bg-brand-700 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">Route intelligence</p>
          <h2 className="mt-3 text-4xl font-semibold">Plan delivery operations with clarity and speed.</h2>
          <p className="mt-4 text-brand-100">A clean dashboard for drivers, pending stops, and optimized route previews.</p>
        </div>
      </section>
    </main>
  );
}

export default Login;
