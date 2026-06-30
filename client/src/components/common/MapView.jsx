import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom icons
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export const ICONS = {
  blue: new L.Icon.Default(),
  red: createCustomIcon('red'),
  green: createCustomIcon('green'),
  orange: createCustomIcon('orange'),
  violet: createCustomIcon('violet'),
};

// Component to handle dynamic centering when location changes
function MapCenterController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center, map, zoom]);

  return null;
}

export default function MapView({ 
  center, 
  zoom = 13, 
  markers = [], 
  userLocation, 
  className = "map-container",
  onMarkerClick
}) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  // Default center if none provided (New Delhi)
  const defaultCenter = [28.6139, 77.2090];
  const mapCenter = center && center.lat && center.lng 
    ? [center.lat, center.lng] 
    : defaultCenter;

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        whenReady={() => setMapReady(true)}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenterController center={center} zoom={zoom} />

        {/* User Location Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={ICONS.blue}
            zIndexOffset={1000} // Keep user marker on top
          >
            <Popup>
              <div className="font-medium">📍 Your Location</div>
            </Popup>
          </Marker>
        )}

        {/* Data Markers (Hospitals, Pharmacies, etc.) */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={[marker.lat, marker.lng]}
            icon={ICONS[marker.color || 'red']}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(marker)
            }}
          >
            {marker.popup && (
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold mb-1">{marker.title}</h3>
                  {marker.subtitle && <p className="text-subtle mb-2">{marker.subtitle}</p>}
                  {marker.popup}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
