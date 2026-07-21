import { Bell, LogOut, Menu, Moon, Search, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const titles = { '/dashboard': 'Dashboard', '/deliveries': 'Deliveries', '/deliveries/new': 'Add delivery', '/routes/optimize': 'Route optimizer' };

function Navbar({ onMenuClick, theme, onThemeToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getAuthenticatedUser();
  const name = user?.fullName || user?.name || 'Operations Admin';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const logout = () => { authService.logout(); navigate('/login', { replace: true }); };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 shadow-[0_1px_20px_rgba(15,23,42,.04)] backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-black/20">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuClick} className="btn-secondary h-10 w-10 p-0 lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
          <div className="min-w-0"><p className="truncate text-xs font-semibold uppercase tracking-[.14em] text-blue-600">Operations workspace</p><h1 className="truncate text-lg font-bold text-slate-950">{titles[location.pathname] || 'Smart Delivery'}</h1></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden xl:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="Search workspace..." aria-label="Search workspace" /></div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" /></button>
          <button onClick={onThemeToggle} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="flex items-center gap-2.5"><div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-500/20">{initials}<span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950"/></div><div className="hidden text-left md:block"><p className="max-w-32 truncate text-sm font-semibold text-slate-900">{name}</p><p className="flex items-center gap-1 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Online</p></div></div>
          <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Log out"><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
