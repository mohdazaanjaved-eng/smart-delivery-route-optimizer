import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Map, MapPin } from 'lucide-react';

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function isValidCoordinate(stop) {
  return Number.isFinite(Number(stop.latitude)) && Number.isFinite(Number(stop.longitude));
}

function FitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, {
      padding: [32, 32],
      maxZoom: 14,
    });
  }, [map, positions]);

  return null;
}

function RouteMap({ stops }) {
  const [tilesLoading, setTilesLoading] = useState(true);
  const mappedStops = stops.filter(isValidCoordinate);
  const positions = mappedStops.map((stop) => [Number(stop.latitude), Number(stop.longitude)]);

  if (positions.length === 0) {
    return (
      <div className="card flex min-h-80 flex-col items-center justify-center p-8 text-center"><Map className="text-slate-300" size={42}/><p className="mt-3 text-sm font-semibold text-slate-600">No optimized route available</p>
      </div>
    );
  }

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div><h3 className="font-bold text-slate-950">Live route map</h3><p className="mt-1 text-xs text-slate-500">Automatically fitted to all optimized stops.</p></div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600"/>Route</span><span className="flex items-center gap-1.5"><MapPin size={14} className="text-red-500"/>Stop</span></div>
      </div>
      <div className="relative"><MapContainer center={positions[0]} zoom={12} zoomControl={false} className="h-[480px] w-full">
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ loading: () => setTilesLoading(true), load: () => setTilesLoading(false) }}
        />
        <FitBounds positions={positions} />
        <Polyline positions={positions} pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.85 }} />
        {mappedStops.map((stop) => (
          <Marker key={`${stop.order}-${stop.customer}`} position={[Number(stop.latitude), Number(stop.longitude)]} icon={defaultIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{stop.customer}</p>
                <p>{stop.address}</p>
                <p className="text-blue-600">Stop #{stop.order}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>{tilesLoading&&<div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center bg-white/45 backdrop-blur-[2px] dark:bg-slate-950/45" role="status"><div className="rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-slate-700 shadow-xl dark:bg-slate-900/90 dark:text-slate-200"><span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"/>Loading map</div></div>}</div>
    </section>
  );
}

export default RouteMap;
