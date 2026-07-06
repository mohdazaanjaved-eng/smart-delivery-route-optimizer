function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-label="Open sidebar"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
          <div>
            <p className="text-sm font-medium text-slate-500">Operations Console</p>
            <h1 className="text-lg font-semibold text-slate-950">Smart Delivery Route Optimizer</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">Route Operations</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
