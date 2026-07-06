function StatsCard({ title, value, subtitle, tone = 'blue' }) {
  const tones = {
    blue: 'bg-brand-50 text-brand-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>Live</span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
    </section>
  );
}

export default StatsCard;
