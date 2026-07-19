import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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
  const mappedStops = stops.filter(isValidCoordinate);
  const positions = mappedStops.map((stop) => [Number(stop.latitude), Number(stop.longitude)]);

  if (positions.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-soft">
        No optimized route available.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-950">Route Map</h3>
        <p className="mt-1 text-sm text-slate-500">Optimized delivery stops plotted in visit order.</p>
      </div>
      <MapContainer center={positions[0]} zoom={12} className="h-[420px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        <Polyline positions={positions} pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.85 }} />
        {mappedStops.map((stop) => (
          <Marker key={`${stop.order}-${stop.customer}`} position={[Number(stop.latitude), Number(stop.longitude)]} icon={defaultIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{stop.customer}</p>
                <p>{stop.address}</p>
                <p>Stop #{stop.order}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}

export default RouteMap;
