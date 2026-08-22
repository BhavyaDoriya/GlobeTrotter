import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { StopActivity } from '../../lib/itinerary/types';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPanelProps {
  activities: StopActivity[];
  centerLat?: number;
  centerLng?: number;
}

export function MapPanel({ activities, centerLat = 51.505, centerLng = -0.09 }: MapPanelProps) {
  // Since Activities don't have individual coordinates, we'll plot the cities
  // But we don't have access to stops here unless we pass them.
  // Instead, let's just pass the stop city lat/lng to the map
  const mapCenter: [number, number] = [centerLat, centerLng];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl relative">
      <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCenter}>
          <Popup>City Center</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
