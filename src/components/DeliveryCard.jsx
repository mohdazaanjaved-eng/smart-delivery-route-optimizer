function DeliveryCard({ customer, address, priority, status, eta }) {
  const priorityClass = {
    HIGH: 'bg-red-50 text-red-700',
    MEDIUM: 'bg-amber-50 text-amber-700',
    LOW: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <article className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{customer}</h3>
          <p className="mt-1 text-sm text-slate-500">{address}</p>
        </div>
        <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${priorityClass[priority]}`}>
          {priority}
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-slate-500">Status</p>
          <p className="font-medium text-slate-900">{status}</p>
        </div>
        <div>
          <p className="text-slate-500">ETA</p>
          <p className="font-medium text-slate-900">{eta}</p>
        </div>
      </div>
    </article>
  );
}

export default DeliveryCard;
