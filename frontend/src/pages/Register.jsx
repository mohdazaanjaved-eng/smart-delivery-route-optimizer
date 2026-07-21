import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ArrowLeft, Eye, EyeOff, Loader2, MapPinned, UserPlus } from 'lucide-react';
import { useState as useToggleState } from 'react';

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
  const [showPassword, setShowPassword] = useToggleState(false);

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10"><div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"/><div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"/>
      <section className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-9">
        <div className="mb-8">
          <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/>Back to sign in</Link><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20"><MapPinned/></div>
          <p className="mt-5 text-sm font-semibold text-blue-600">Create Account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Join the operations team</h1><p className="mt-2 text-sm text-slate-500">Set up your profile to access delivery intelligence.</p>
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
                className="input mt-2"
                type={field.name === 'password' && showPassword ? 'text' : field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
              {field.name === 'password' && <button type="button" onClick={() => setShowPassword((value) => !value)} className="float-right -mt-9 mr-3 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>}
              {validationErrors[field.name] && (
                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors[field.name]}</p>
              )}
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              className="input mt-2"
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
            className="btn-primary mt-2 py-3 sm:col-span-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={17}/>Creating account...</> : <><UserPlus size={17}/>Create account</>}
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
