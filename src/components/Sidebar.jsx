import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '▦' },
  { label: 'Deliveries', path: '/deliveries', icon: '□' },
  { label: 'Add Delivery', path: '/deliveries/new', icon: '+' },
  { label: 'Route Optimizer', path: '/routes/optimize', icon: '↗' },
];

function Sidebar({ open, onClose }) {
  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
      isActive
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700',
    ].join(' ');

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white transition-transform lg:static lg:z-auto lg:block lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 font-bold text-white">
            SD
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Smart Delivery</p>
            <p className="text-xs text-slate-500">Route Operations</p>
          </div>
        </div>
        <nav className="space-y-1 px-4 py-5">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass} onClick={onClose}>
              <span className="flex h-6 w-6 items-center justify-center text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mx-4 mt-4 rounded-md border border-brand-100 bg-brand-50 p-4">
          <p className="text-sm font-semibold text-brand-900">Frontend Preview</p>
          <p className="mt-1 text-xs leading-5 text-brand-700">Navigation and screens are ready for API integration.</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
