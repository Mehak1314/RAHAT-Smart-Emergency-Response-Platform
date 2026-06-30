import { useState, useEffect } from 'react';
import { Search, MapPin, Layers } from 'lucide-react';
import { pharmacyAPI } from '../services/api';
import { useLocation } from '../context/LocationContext';
import MapView from '../components/common/MapView';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

export default function Pharmacies() {
  const { location, isLocating } = useLocation();
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('both');

  const [search, setSearch] = useState('');
  const [open24, setOpen24] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  useEffect(() => {
    if (isLocating || !location) return;
    
    const fetchPharmacies = async () => {
      setIsLoading(true);
      try {
        const { data } = await pharmacyAPI.getAll({
          lat: location.lat,
          lng: location.lng,
          open24: open24 ? 'true' : undefined,
          search: search || undefined,
          radius: 10000,
          limit: 50
        });
        setPharmacies(data.pharmacies || []);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPharmacies();
  }, [location, isLocating, search, open24]);

  const mapMarkers = pharmacies.map(p => ({
    id: p._id,
    lat: p.location.coordinates[1],
    lng: p.location.coordinates[0],
    color: p.isOpen24x7 ? 'green' : 'blue',
    title: p.name,
    subtitle: p.address.city,
    pharmacy: p
  }));

  const handleDirections = (pharmacy) => {
    const dest = `${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}`;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    if (location && location.lat) url += `&origin=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      <div className="bg-white border-b border-border z-10 shrink-0">
        <div className="page-container py-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-xl font-bold flex items-center gap-2 m-0">
              <span className="bg-safe-100 text-safe-700 p-1.5 rounded-lg"><Layers size={20} /></span>
              Pharmacy Finder
            </h1>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <div className="relative flex-grow sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search pharmacies..."
                  className="form-input pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-border cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  checked={open24}
                  onChange={(e) => setOpen24(e.target.checked)}
                  className="w-4 h-4 accent-safe-600"
                />
                <span className="text-sm font-medium">24/7 Open</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        {/* List View */}
        <div className={`w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-surface border-r border-border flex flex-col h-full overflow-hidden ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border bg-white flex justify-between items-center shrink-0">
            <span className="font-semibold text-sm">{isLoading ? 'Searching...' : `${pharmacies.length} pharmacies`}</span>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setViewMode('map')}>Map</Button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
            {isLoading ? <Loader /> : pharmacies.length === 0 ? (
              <p className="text-center text-subtle py-8">No pharmacies found.</p>
            ) : (
              pharmacies.map(pharmacy => (
                <Card 
                  key={pharmacy._id} 
                  hover 
                  className={`cursor-pointer ${selectedPharmacy?._id === pharmacy._id ? 'ring-2 ring-safe-500' : ''}`}
                >
                  <div onMouseEnter={() => setSelectedPharmacy(pharmacy)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-ink">{pharmacy.name}</h3>
                      {pharmacy.isOpen24x7 && <span className="badge badge-green shrink-0">24/7</span>}
                    </div>
                    <p className="text-sm text-subtle mb-3 flex items-start gap-1">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{pharmacy.address.street}, {pharmacy.address.city}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => window.location.href=`tel:${pharmacy.phone}`}>Call</Button>
                      <Button variant="success" size="sm" className="flex-1" onClick={() => handleDirections(pharmacy)}>Directions</Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Map View */}
        <div className={`flex-grow h-full relative ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
          <div className="md:hidden absolute top-4 left-4 z-[1000]">
            <Button variant="secondary" size="sm" className="bg-white shadow-md" onClick={() => setViewMode('list')}>List</Button>
          </div>
          <MapView 
            center={location} 
            markers={mapMarkers} 
            userLocation={location}
            onMarkerClick={(marker) => setSelectedPharmacy(marker.pharmacy)}
          />
        </div>
      </div>
    </div>
  );
}
