import { Phone, Navigation, ShieldPlus, AlertCircle, MapPin, Building2, Star } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function HospitalCard({ hospital, userLocation, onDirectionsClick }) {
  // Format distance
  const formatDistance = (meters) => {
    if (meters === undefined || meters === null) return null;
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const handleCall = () => {
    window.location.href = `tel:${hospital.phone}`;
  };

  const handleDirections = () => {
    if (onDirectionsClick) {
      onDirectionsClick(hospital);
    } else {
      // Default fallback if no handler provided: open Google Maps
      const dest = `${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`;
      let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
      if (userLocation && userLocation.lat && userLocation.lng) {
        url += `&origin=${userLocation.lat},${userLocation.lng}`;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card hover className="flex flex-col h-full border-l-4 border-l-safe-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-ink leading-tight mb-1">{hospital.name}</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className={`badge ${hospital.type === 'government' ? 'badge-blue' : 'badge-gray'}`}>
              <Building2 size={10} className="mr-1" />
              {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
            </span>
            {hospital.rating > 0 && (
              <span className="flex items-center text-warn-600 font-medium">
                <Star size={12} fill="currentColor" className="mr-0.5" />
                {hospital.rating}
              </span>
            )}
          </div>
        </div>
        
        {hospital.emergencyAvailable && (
          <span className="badge badge-red shrink-0" title="Emergency Services Available">
            <AlertCircle size={12} className="mr-1" />
            24/7 ER
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm text-subtle flex-grow">
        <p className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 shrink-0 text-muted" />
          <span className="line-clamp-2">
            {hospital.address.street && `${hospital.address.street}, `}
            {hospital.address.locality && `${hospital.address.locality}, `}
            {hospital.address.city}, {hospital.address.state}
          </span>
        </p>
        
        {hospital.distance !== undefined && (
          <p className="flex items-center gap-2 text-ink font-medium">
            <Navigation size={16} className="text-safe-600" />
            {formatDistance(hospital.distance)} away
          </p>
        )}
        
        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="flex items-start gap-2 pt-1">
            <ShieldPlus size={16} className="mt-0.5 shrink-0 text-muted" />
            <div className="flex flex-wrap gap-1">
              {hospital.specialties.slice(0, 3).map((spec, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {spec}
                </span>
              ))}
              {hospital.specialties.length > 3 && (
                <span className="text-xs text-muted">+{hospital.specialties.length - 3}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-slate-100">
        <Button variant="secondary" size="sm" onClick={handleCall} icon={Phone} className="w-full font-bold">
          Call
        </Button>
        <Button variant="primary" size="sm" onClick={handleDirections} icon={Navigation} className="w-full">
          Directions
        </Button>
      </div>
    </Card>
  );
}
