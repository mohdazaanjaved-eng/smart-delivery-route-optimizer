function RouteCard({ order, customer, address, distance }) {
  return (
    <article className="flex gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
        {order}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-950">{customer}</h3>
            <p className="mt-1 text-sm text-slate-500">{address}</p>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {distance} km
          </span>
        </div>
      </div>
    </article>
  );
}

export default RouteCard;
