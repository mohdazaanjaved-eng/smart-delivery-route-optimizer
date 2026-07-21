import { ChevronLeft, LayoutDashboard, MapPinned, PackagePlus, Truck, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { authService } from '../services/authService';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Deliveries', path: '/deliveries', icon: Truck },
  { label: 'Add Delivery', path: '/deliveries/new', icon: PackagePlus },
  { label: 'Route Optimizer', path: '/routes/optimize', icon: MapPinned },
];

function Sidebar({ open, onClose, collapsed, onCollapse }) {
  const user = authService.getAuthenticatedUser();
  const name = user?.fullName || user?.name || 'Operations Admin';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0,2).toUpperCase();
  return <>
    <button className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} aria-label="Close navigation overlay" />
    <aside className={`fixed inset-y-0 left-0 z-50 flex bg-slate-950 text-white shadow-2xl transition-all duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen ${collapsed ? 'lg:w-[88px]' : 'lg:w-72'} ${open ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}`}>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={`flex h-[72px] items-center border-b border-white/10 ${collapsed ? 'lg:justify-center lg:px-3' : 'justify-between px-5'}`}>
          <div className="flex items-center gap-3 overflow-hidden"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 font-black shadow-lg shadow-blue-500/20">SD</div><div className={collapsed ? 'lg:hidden' : ''}><p className="whitespace-nowrap text-sm font-bold">Smart Delivery</p><p className="whitespace-nowrap text-xs text-slate-400">Route Intelligence</p></div></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1.5 px-3 py-6" aria-label="Primary navigation">
          <p className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500 ${collapsed ? 'lg:hidden' : ''}`}>Workspace</p>
          {navItems.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={onClose} title={collapsed ? label : undefined} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition duration-200 ${collapsed ? 'lg:justify-center' : ''} ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/30' : 'text-slate-400 hover:translate-x-0.5 hover:bg-white/10 hover:text-white'}`}><Icon size={20} className="shrink-0" /><span className={collapsed ? 'lg:hidden' : ''}>{label}</span></NavLink>)}
        </nav>
        <div className={`mx-3 mb-3 rounded-2xl border border-white/10 bg-white/5 p-3 ${collapsed ? 'lg:p-2' : ''}`}><div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold">{initials}</div><div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}><p className="truncate text-xs font-semibold text-white">{name}</p><p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Online</p></div></div></div>
        <button onClick={onCollapse} className="hidden h-14 items-center justify-center border-t border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white lg:flex" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><ChevronLeft size={19} className={`transition ${collapsed ? 'rotate-180' : ''}`} /><span className={`ml-2 text-xs font-semibold ${collapsed ? 'hidden' : ''}`}>Collapse sidebar</span></button>
      </div>
    </aside>
  </>;
}
export default Sidebar;
