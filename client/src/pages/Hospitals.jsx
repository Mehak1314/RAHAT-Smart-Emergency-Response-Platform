import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Layers } from 'lucide-react';
import { hospitalAPI } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { HOSPITAL_TYPES } from '../constants';
import MapView from '../components/common/MapView';
import HospitalCard from '../components/common/HospitalCard';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

export default function Hospitals() {
  const { location, isLocating, isDefaultLocation } = useLocation();
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('both'); // map, list, both

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [radius, setRadius] = useState(10000); // 10km

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    // Only fetch when we have a location
    if (isLocating || !location) return;
    
    const fetchHospitals = async () => {
      setIsLoading(true);
      try {
        const params = {
          lat: location.lat,
          lng: location.lng,
          radius,
          type: type || undefined,
          emergency: emergencyOnly ? 'true' : undefined,
          search: search || undefined,
          limit: 50 // Load more for map
        };
        
        const { data } = await hospitalAPI.getAll(params);
        setHospitals(data.hospitals || []);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, [location, isLocating, type, emergencyOnly, search, radius]);

  // Convert hospitals to markers for map
  const mapMarkers = hospitals.map(h => ({
    id: h._id,
    lat: h.location.coordinates[1],
    lng: h.location.coordinates[0],
    color: h.emergencyAvailable ? 'red' : h.type === 'government' ? 'blue' : 'green',
    title: h.name,
    subtitle: h.address.city,
    hospital: h // attach full object
  }));

  const handleMarkerClick = (marker) => {
    setSelectedHospital(marker.hospital);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* Header & Controls */}
      <div className="bg-white border-b border-border z-10 shrink-0">
        <div className="page-container py-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <h1 className="text-xl font-bold flex items-center gap-2 m-0">
              <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg"><Layers size={20} /></span>
              Hospital Finder
            </h1>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-grow sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  className="form-input pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="secondary" icon={Filter} onClick={() => setIsFilterModalOpen(true)}>
                Filters
              </Button>
            </div>
          </div>
          
          {isDefaultLocation && (
            <div className="mt-2 text-xs text-warn-600 bg-warn-50 px-2 py-1 rounded border border-warn-100 flex items-center gap-1 inline-flex">
              <MapPin size={12} /> Location access denied. Showing defaults in New Delhi.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        
        {/* List View - Hidden on mobile if map is active */}
        <div className={`w-full md:w-[400px] lg:w-[450px] flex-shrink-0 bg-surface border-r border-border flex flex-col h-full overflow-hidden ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border bg-white flex justify-between items-center shrink-0">
            <span className="font-semibold text-sm">
              {isLoading ? 'Searching...' : `${hospitals.length} hospitals found`}
            </span>
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setViewMode('map')}>Map View</Button>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
            {isLoading ? (
              <Loader text="Finding nearby hospitals..." />
            ) : hospitals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-subtle mb-4">No hospitals found matching your criteria.</p>
                <Button variant="secondary" onClick={() => {setSearch(''); setType(''); setEmergencyOnly(false); setRadius(20000);}}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              hospitals.map(hospital => (
                <div 
                  key={hospital._id} 
                  onMouseEnter={() => setSelectedHospital(hospital)}
                  className={`transition-transform duration-200 ${selectedHospital?._id === hospital._id ? 'transform scale-[1.02]' : ''}`}
                >
                  <HospitalCard hospital={hospital} userLocation={location} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map View */}
        <div className={`flex-grow h-full relative ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
          <div className="md:hidden absolute top-4 left-4 z-[1000]">
            <Button variant="secondary" size="sm" className="bg-white shadow-md" onClick={() => setViewMode('list')}>
              List View
            </Button>
          </div>
          
          <MapView 
            center={location} 
            markers={mapMarkers} 
            userLocation={location}
            className="w-full h-full"
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      {/* Filters Modal */}
      <Modal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        title="Filter Hospitals"
      >
        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label">Hospital Type</label>
            <select 
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {HOSPITAL_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Search Radius (km)</label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              step="1"
              value={radius / 1000}
              onChange={(e) => setRadius(parseInt(e.target.value) * 1000)}
              className="w-full accent-emergency-600"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 km</span>
              <span className="font-bold text-ink text-sm">{radius / 1000} km</span>
              <span>50 km</span>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-slate-50">
            <input 
              type="checkbox" 
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
              className="w-5 h-5 accent-emergency-600"
            />
            <div>
              <span className="font-medium text-ink block">24/7 Emergency Only</span>
              <span className="text-xs text-subtle">Show only hospitals with active emergency departments</span>
            </div>
          </label>

          <Button 
            variant="primary" 
            className="w-full mt-4"
            onClick={() => setIsFilterModalOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </Modal>
    </div>
  );
}
