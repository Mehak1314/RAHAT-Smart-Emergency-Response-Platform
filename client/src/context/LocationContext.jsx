import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_LOCATION } from '../constants';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          label: 'Your Location',
        });
        setLocationError(null);
        setIsLocating(false);
      },
      (error) => {
        const messages = {
          1: 'Location access denied. Using New Delhi as default.',
          2: 'Location unavailable. Using New Delhi as default.',
          3: 'Location request timed out. Using New Delhi as default.',
        };
        setLocationError(messages[error.code] || 'Failed to get location');
        setLocation(DEFAULT_LOCATION);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Request on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const effectiveLocation = location || DEFAULT_LOCATION;

  return (
    <LocationContext.Provider value={{
      location: effectiveLocation,
      locationError,
      isLocating,
      requestLocation,
      isDefaultLocation: !location || (location.lat === DEFAULT_LOCATION.lat && location.lng === DEFAULT_LOCATION.lng),
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};
