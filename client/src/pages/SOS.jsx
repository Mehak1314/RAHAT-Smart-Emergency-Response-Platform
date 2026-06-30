import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Phone, ShieldCheck, XCircle, Info, PhoneCall } from 'lucide-react';
import { useSOS } from '../context/SOSContext';
import { useLocation } from '../context/LocationContext';
import { EMERGENCY_TYPES } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import MapView from '../components/common/MapView';

export default function SOS() {
  const navigate = useNavigate();
  const { location, isLocating, requestLocation } = useLocation();
  const { activeSOS, isSOSLoading, triggerSOS, resolveSOS } = useSOS();
  
  const [emergencyType, setEmergencyType] = useState('medical');
  const [countdown, setCountdown] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);

  // Countdown timer for SOS trigger
  useEffect(() => {
    let timer;
    if (isConfirming && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isConfirming && countdown === 0) {
      handleFinalTrigger();
    }
    return () => clearTimeout(timer);
  }, [isConfirming, countdown]);

  const handleInitialTrigger = () => {
    // If location not available, try to get it again
    if (!location) {
      requestLocation();
    }
    setIsConfirming(true);
    setCountdown(5);
  };

  const cancelTrigger = () => {
    setIsConfirming(false);
    setCountdown(0);
  };

  const handleFinalTrigger = async () => {
    setIsConfirming(false);
    
    // Default to Delhi if location completely fails, but SOS controller requires lat/lng
    const sosLocation = location || { lat: 28.6139, lng: 77.2090, label: 'Location Unavailable (Default: New Delhi)' };
    
    await triggerSOS({
      latitude: sosLocation.lat,
      longitude: sosLocation.lng,
      address: sosLocation.label,
    }, emergencyType);
  };

  const handleResolve = async () => {
    if (activeSOS) {
      await resolveSOS(activeSOS._id);
    }
  };

  // If there is an active SOS, show the Active SOS View
  if (activeSOS) {
    const mapMarkers = [
      ...activeSOS.nearbyHospitals.map(h => ({
        id: h.hospital._id,
        lat: h.hospital.location.coordinates[1],
        lng: h.hospital.location.coordinates[0],
        color: 'red',
        title: h.hospital.name,
      }))
    ];

    return (
      <div className="flex-grow flex flex-col bg-emergency-50">
        <div className="page-container py-6">
          <div className="bg-emergency-600 rounded-xl shadow-xl text-white p-6 mb-6 animate-pulse-red text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <AlertTriangle size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-black mb-2 tracking-wide">SOS ACTIVE</h1>
            <p className="text-emergency-100 font-medium text-lg">Help is on the way. Keep your phone with you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-safe-600" /> Notifications Sent
                </h3>
                <div className="space-y-3">
                  {activeSOS.notifiedContacts?.length > 0 ? (
                    activeSOS.notifiedContacts.map((nc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-border">
                        <div>
                          <p className="font-semibold text-sm">{nc.contact?.name}</p>
                          <p className="text-xs text-subtle">{nc.contact?.relationship}</p>
                        </div>
                        <span className={`badge ${nc.success ? 'badge-green' : 'badge-red'}`}>
                          {nc.success ? 'Notified' : 'Failed'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-subtle">No emergency contacts found.</p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="font-bold text-ink">Resolve SOS</h3>
                    <p className="text-sm text-subtle">Only mark as resolved if you are safe.</p>
                  </div>
                  <Button variant="secondary" onClick={handleResolve} className="border-safe-500 text-safe-700 hover:bg-safe-50 shrink-0">
                    Mark as Safe
                  </Button>
                </div>
              </Card>
            </div>

            <Card padding="none" className="overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 bg-white border-b border-border z-10 shrink-0">
                <h3 className="font-bold text-ink flex items-center gap-2">
                  <MapPin className="text-emergency-600" /> Nearby Hospitals Notified
                </h3>
              </div>
              <div className="flex-grow relative">
                <MapView 
                  center={{ lat: activeSOS.location.coordinates[1], lng: activeSOS.location.coordinates[0] }} 
                  markers={mapMarkers}
                  userLocation={{ lat: activeSOS.location.coordinates[1], lng: activeSOS.location.coordinates[0] }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Normal View (Ready to trigger)
  return (
    <div className="flex-grow flex items-center justify-center bg-surface py-8">
      <div className="w-full max-w-lg px-4">
        
        {isConfirming ? (
          <Card padding="lg" className="text-center shadow-2xl border-emergency-500 animate-slide-up">
            <AlertTriangle size={64} className="mx-auto text-emergency-600 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-ink mb-2">Sending SOS in...</h2>
            <div className="text-6xl font-black text-emergency-600 mb-6">{countdown}</div>
            
            <p className="text-sm text-subtle mb-8">
              Your location and medical profile will be sent to emergency contacts and nearby hospitals.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button variant="danger" size="xl" onClick={handleFinalTrigger}>
                Send Immediately
              </Button>
              <Button variant="secondary" size="lg" onClick={cancelTrigger}>
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-black text-ink mb-2">Emergency SOS</h1>
            <p className="text-subtle mb-10">Slide to select emergency type, then tap the red button to alert contacts and nearby hospitals.</p>
            
            <div className="mb-8">
              <select 
                className="w-full max-w-xs mx-auto form-select bg-white border-2 border-slate-200 text-center text-lg font-semibold h-12"
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
              >
                {EMERGENCY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="relative inline-block mb-10">
              {/* Outer pulse */}
              <div className="absolute inset-0 bg-emergency-100 rounded-full scale-150 animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-emergency-200 rounded-full scale-125 animate-ping opacity-40 animation-delay-500"></div>
              
              <button 
                onClick={handleInitialTrigger}
                disabled={isSOSLoading}
                className="relative w-48 h-48 bg-emergency-600 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-8 border-emergency-100"
              >
                <PhoneCall size={48} className="mb-2" />
                <span className="text-2xl font-black tracking-widest">TAP FOR HELP</span>
              </button>
            </div>

            <div className="bg-white border border-border p-4 rounded-lg flex items-start gap-3 text-left">
              <Info className="text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-subtle">
                <p className="mb-1 text-ink font-medium">What happens when I tap?</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Your exact GPS location is captured.</li>
                  <li>An alert is sent to your emergency contacts.</li>
                  <li>Nearby hospitals are identified.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
