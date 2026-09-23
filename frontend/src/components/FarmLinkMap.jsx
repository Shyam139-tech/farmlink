import { CircleMarker, MapContainer, Popup, TileLayer, Polyline, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const COLORS = { farmer: '#d66a4e', fpo: '#176451', buyer: '#718d35', vehicle: '#5673a0', consumer: '#9a6e38' };

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => { if (points.length > 1) map.fitBounds(points.map(point => [point.lat, point.lng]), { padding: [30, 30] }); }, [map, points]);
  return null;
}

function MapSizeFix() {
  const map = useMap();
  useEffect(() => {
    const refresh = () => map.invalidateSize({ pan: false, debounceMoveend: true });
    const frame = requestAnimationFrame(refresh);
    const timer = setTimeout(refresh, 250);
    const container = map.getContainer();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh);
    observer?.observe(container);
    window.addEventListener('resize', refresh);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); observer?.disconnect(); window.removeEventListener('resize', refresh); };
  }, [map]);
  return null;
}

export default function FarmLinkMap({ points = [], route = [], height = 500, className = '', label = 'Demo Locations' }) {
  const [tilesFailed, setTilesFailed] = useState(false);
  const validPoints = points.filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  const center = validPoints[0] ? [validPoints[0].lat, validPoints[0].lng] : [10.0261, 78.3378];
  const routePoints = route.filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  return <div className={`farmlink-map ${className}`} style={{ height }}>
    <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{ tileerror: () => setTilesFailed(true) }} />
      <MapSizeFix />
      <FitBounds points={routePoints.length > 1 ? routePoints : validPoints} />
      {routePoints.length > 1 && <Polyline positions={routePoints.map(point => [point.lat, point.lng])} pathOptions={{ color: '#176451', weight: 5, dashArray: '10 8' }} />}
      {validPoints.map((point, index) => <CircleMarker key={`${point.name}-${index}`} center={[point.lat, point.lng]} radius={point.type === 'vehicle' ? 10 : 8} pathOptions={{ color: '#fff', weight: 3, fillColor: COLORS[point.type] || COLORS.farmer, fillOpacity: 1 }}><Popup><div className="map-popup"><strong>{point.name}</strong><span>{point.subtitle || point.type}</span>{point.crop && <span>{point.crop} • {point.quantity} kg</span>}{point.detail && <span>{point.detail}</span>}</div></Popup></CircleMarker>)}
    </MapContainer>
    <span className="map-demo-label">{tilesFailed ? 'Demo map tiles unavailable • route still visible' : label}</span>
  </div>;
}

export const DEMO_POINTS = {
  farmers: [
    { name: 'Ravi Kumar', subtitle: 'Ravi Organic Farm', crop: 'Tomato', quantity: 150, type: 'farmer', lat: 10.028, lng: 78.337 },
    { name: 'Kavya Farms', subtitle: 'Kavya Agro', crop: 'Tomato', quantity: 200, type: 'farmer', lat: 10.003, lng: 78.301 },
    { name: 'Arun Selvam', subtitle: 'Vaigai Fields', crop: 'Tomato', quantity: 180, type: 'farmer', lat: 10.058, lng: 78.365 }
  ],
  fpo: { name: 'Melur Farmer Hub', subtitle: 'FPO Micro-Hub • 12 active farmers', type: 'fpo', lat: 10.032, lng: 78.342 },
  buyer: { name: 'Chennai Fresh Foods', subtitle: 'Bulk Buyer • Required: 1,000 kg', type: 'buyer', lat: 10.071, lng: 78.389 },
  vehicle: { name: 'Murugan Logistics', subtitle: 'Capacity: 600 kg • Available', type: 'vehicle', lat: 10.039, lng: 78.347 }
};
