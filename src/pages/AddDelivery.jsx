function AddDelivery() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Add Delivery</h2>
        <p className="mt-1 text-sm text-slate-500">Create a new delivery record once APIs are connected.</p>
      </div>
      <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-2">
        {['Customer name', 'Customer phone', 'Customer email', 'Delivery address', 'Latitude', 'Longitude'].map((label) => (
          <label key={label} className={label === 'Delivery address' ? 'block lg:col-span-2' : 'block'}>
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100" />
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100">
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Estimated delivery time</span>
          <input type="datetime-local" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100" />
        </label>
        <button type="button" className="rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 lg:col-span-2">
          Save Delivery
        </button>
      </form>
    </div>
  );
}

export default AddDelivery;
