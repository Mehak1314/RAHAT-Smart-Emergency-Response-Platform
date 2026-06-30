import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, MapPin, Phone, Hospital, Pill, Droplet, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { hospitalAPI, sosAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Skeleton } from '../components/common/Loader';
import HospitalCard from '../components/common/HospitalCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { location, isLocating } = useLocation();
  const navigate = useNavigate();
  
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true);
  const [activeSOS, setActiveSOS] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch active SOS
        const { data: sosData } = await sosAPI.getActive();
        if (sosData.sos) {
          setActiveSOS(sosData.sos);
        }

        // Fetch nearby hospitals based on location
        if (location && location.lat) {
          const { data: hospData } = await hospitalAPI.getAll({
            lat: location.lat,
            lng: location.lng,
            limit: 3,
            radius: 10000 // 10km
          });
          setNearbyHospitals(hospData.hospitals);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoadingHospitals(false);
      }
    };

    fetchDashboardData();
  }, [location]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  };

  return (
    <div className="page-container py-8">
      {/* Welcome & Location */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Good {getTimeOfDay()}, {user?.name?.split(' ')[0]}</h1>
          <div className="flex items-center text-subtle text-sm">
            <MapPin size={14} className="mr-1" />
            {isLocating ? 'Locating you...' : location?.label || 'Location unavailable'}
          </div>
        </div>
        <Link to="/sos" className="no-underline">
          <Button variant="danger" icon={ShieldAlert} className="w-full md:w-auto shadow-md">
            Emergency SOS
          </Button>
        </Link>
      </div>

      {/* Active SOS Alert */}
      {activeSOS && (
        <div className="bg-emergency-50 border border-emergency-200 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-red">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emergency-100 rounded-full flex items-center justify-center text-emergency-600 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-bold text-emergency-800">Active SOS Request</h3>
              <p className="text-sm text-emergency-700">Help is on the way. Keep your phone accessible.</p>
            </div>
          </div>
          <Link to="/sos">
            <Button variant="danger" size="sm">View Details</Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="section-title mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickActionCard to="/hospitals" icon={Hospital} title="Hospitals" color="text-blue-600" bg="bg-blue-50" />
        <QuickActionCard to="/pharmacies" icon={Pill} title="Pharmacies" color="text-safe-600" bg="bg-safe-50" />
        <QuickActionCard to="/blood" icon={Droplet} title="Blood Donors" color="text-emergency-600" bg="bg-emergency-50" />
        <QuickActionCard to="/emergency-contacts" icon={Phone} title="Contacts" color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Nearby Hospitals */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex items-center gap-2">
                <Hospital size={18} className="text-muted" /> Nearby Hospitals
              </h2>
              <Link to="/hospitals" className="text-sm text-emergency-600 font-medium hover:underline flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {isLoadingHospitals ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
              </div>
            ) : nearbyHospitals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyHospitals.map(hospital => (
                  <HospitalCard 
                    key={hospital._id} 
                    hospital={hospital} 
                    userLocation={location}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <p className="text-subtle">No hospitals found within 10km of your location.</p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/hospitals')}>
                  Search Manually
                </Button>
              </Card>
            )}
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Medical Summary Widget */}
          <Card padding="md">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
              <h3 className="font-semibold text-ink">Medical Summary</h3>
              <Link to="/medical-profile" className="text-xs font-medium text-emergency-600">Edit</Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {user?.bloodGroup || '?'}
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-0.5">Blood Group</p>
                  <p className="text-sm font-medium">{user?.bloodGroup ? user.bloodGroup : 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <Link to="/medical-profile">
              <Button variant="secondary" className="w-full mt-5">Complete Your Profile</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ to, icon: Icon, title, color, bg }) {
  return (
    <Link to={to} className="block no-underline group">
      <Card hover className="flex flex-col items-center justify-center p-4 text-center h-full">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${bg} ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <span className="font-medium text-ink text-sm group-hover:text-emergency-600 transition-colors">{title}</span>
      </Card>
    </Link>
  );
}
