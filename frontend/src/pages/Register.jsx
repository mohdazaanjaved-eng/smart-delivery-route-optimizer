import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const fields = [
  { label: 'Full name', name: 'fullName', type: 'text' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Phone number', name: 'phoneNumber', type: 'tel' },
  { label: 'Password', name: 'password', type: 'password' },
];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'ADMIN',
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
      await authService.register(formData);
      navigate('/login', {
        replace: true,
        state: { message: 'Registration successful. Please sign in.' },
      });
    } catch (error) {
      setErrorMessage(error.message);
      setValidationErrors(error.validationErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <section className="w-full max-w-2xl rounded-md border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Create Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Register operations user</h1>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="text-sm font-medium text-slate-700">{field.label}</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
              {validationErrors[field.name] && (
                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors[field.name]}</p>
              )}
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option>ADMIN</option>
              <option>DRIVER</option>
            </select>
            {validationErrors.role && <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.role}</p>}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300 sm:col-span-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link className="font-semibold text-brand-600" to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
