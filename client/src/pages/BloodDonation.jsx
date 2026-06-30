import { useState, useEffect } from 'react';
import { Droplet, Search, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bloodAPI } from '../services/api';
import { BLOOD_GROUPS, INDIAN_STATES } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

export default function BloodDonation() {
  const { user, isAuthenticated } = useAuth();
  
  // Search state
  const [donors, setDonors] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    state: '',
    city: ''
  });

  // Donor profile state
  const [myProfile, setMyProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [isAuthenticated]);

  const fetchMyProfile = async () => {
    try {
      const { data } = await bloodAPI.getMyProfile();
      setMyProfile(data.donor);
    } catch (error) {
      console.log('User is not a donor yet');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.bloodGroup && !searchParams.city) {
      toast.error('Please select at least a blood group or city');
      return;
    }

    setIsLoadingSearch(true);
    try {
      const { data } = await bloodAPI.search({ ...searchParams, limit: 20 });
      setDonors(data.donors);
      if (data.donors.length === 0) toast('No donors found in this area.', { icon: 'ℹ️' });
    } catch (error) {
      toast.error('Failed to search donors');
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const { data } = await bloodAPI.toggleAvailability();
      setMyProfile(data.donor);
      toast.success(`You are now marked as ${data.donor.isAvailable ? 'available' : 'unavailable'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleRegisterDonor = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      bloodGroup: formData.get('bloodGroup'),
      address: {
        state: formData.get('state'),
        district: formData.get('district'),
        city: formData.get('city'),
      }
    };

    try {
      const res = await bloodAPI.register(data);
      setMyProfile(res.data.donor);
      setIsRegisterModalOpen(false);
      toast.success('Successfully registered as a blood donor!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="page-container py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
          <Droplet className="text-emergency-600" /> Blood Donation Network
        </h1>
        <p className="text-subtle">Find blood donors in your area or register yourself to save lives during emergencies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Search */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h2 className="section-title mb-4">Search Donors</h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="form-label">Blood Group</label>
                <select 
                  className="form-select"
                  value={searchParams.bloodGroup}
                  onChange={e => setSearchParams({...searchParams, bloodGroup: e.target.value})}
                >
                  <option value="">Any</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">State</label>
                <select 
                  className="form-select"
                  value={searchParams.state}
                  onChange={e => setSearchParams({...searchParams, state: e.target.value})}
                >
                  <option value="">Any</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mumbai"
                  value={searchParams.city}
                  onChange={e => setSearchParams({...searchParams, city: e.target.value})}
                />
              </div>
              <div className="md:col-span-3">
                <Button type="submit" variant="primary" className="w-full" icon={Search} isLoading={isLoadingSearch}>
                  Search Donors
                </Button>
              </div>
            </form>
          </Card>

          {/* Search Results */}
          {donors.length > 0 && (
            <div>
              <h3 className="font-bold text-ink mb-4">Results ({donors.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {donors.map(donor => (
                  <Card key={donor._id} className={donor.isAvailable ? 'border-l-4 border-l-safe-500' : ''}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar-md bg-emergency-100 text-emergency-700 font-bold">
                          {donor.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-ink">{donor.user?.name || 'Anonymous Donor'}</h4>
                          <span className={`badge ${donor.isAvailable ? 'badge-green' : 'badge-gray'}`}>
                            {donor.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded bg-emergency-50 flex items-center justify-center text-emergency-700 font-black text-lg">
                        {donor.bloodGroup}
                      </div>
                    </div>
                    
                    <div className="text-sm text-subtle space-y-1 mb-4">
                      <p className="flex items-center gap-1.5"><MapPin size={14} /> {donor.address.city}, {donor.address.state}</p>
                    </div>

                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      disabled={!donor.isAvailable}
                      onClick={() => isAuthenticated ? toast('Contact feature coming soon') : toast.error('Please login to contact')}
                    >
                      {donor.isAvailable ? 'Contact Donor' : 'Currently Unavailable'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Donor Profile */}
        <div>
          <Card padding="lg" className="bg-slate-50 border-none shadow-inner h-full">
            <h2 className="section-title mb-6 flex items-center gap-2">
              <User size={18} /> My Donor Profile
            </h2>
            
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <AlertCircle size={40} className="mx-auto text-muted mb-3" />
                <p className="text-subtle mb-4">Login to register as a blood donor and save lives.</p>
                <Button variant="primary" onClick={() => window.location.href='/login?redirect=/blood'}>
                  Login Now
                </Button>
              </div>
            ) : isLoadingProfile ? (
              <Loader />
            ) : myProfile ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-border shadow-sm">
                  <div>
                    <p className="text-xs text-muted font-bold uppercase mb-1">My Blood Group</p>
                    <p className="text-3xl font-black text-emergency-600">{myProfile.bloodGroup}</p>
                  </div>
                  <Droplet size={40} className="text-emergency-100" />
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Availability Status</h4>
                  <label className="flex items-center justify-between p-4 bg-white rounded-lg border border-border cursor-pointer hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="font-medium text-ink flex items-center gap-2">
                        {myProfile.isAvailable ? <CheckCircle size={16} className="text-safe-600" /> : <AlertCircle size={16} className="text-muted" />}
                        {myProfile.isAvailable ? 'Available to Donate' : 'Currently Unavailable'}
                      </span>
                      <span className="text-xs text-subtle block mt-1">Toggle this when you cannot donate.</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${myProfile.isAvailable ? 'bg-safe-500' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${myProfile.isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    {/* Hidden actual checkbox */}
                    <input type="checkbox" className="hidden" checked={myProfile.isAvailable} onChange={toggleAvailability} />
                  </label>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted mb-2 flex items-center gap-1"><MapPin size={12}/> Registered Location</p>
                  <p className="text-sm font-medium">{myProfile.address.city}, {myProfile.address.state}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Droplet size={48} className="mx-auto text-emergency-200 mb-4" />
                <h3 className="font-bold text-ink mb-2">Become a Donor</h3>
                <p className="text-sm text-subtle mb-6">Your blood can save a life during an emergency. Registering takes just 1 minute.</p>
                <Button variant="danger" className="w-full" onClick={() => setIsRegisterModalOpen(true)}>
                  Register as Donor
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Register Modal */}
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Register as Blood Donor">
        <form onSubmit={handleRegisterDonor} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Blood Group *</label>
            <select name="bloodGroup" className="form-select" required defaultValue={user?.bloodGroup || ''}>
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">State *</label>
            <select name="state" className="form-select" required>
              <option value="">Select State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">District *</label>
              <input type="text" name="district" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input type="text" name="city" className="form-input" required />
            </div>
          </div>
          <div className="alert-strip-orange mt-4">
            By registering, you agree to be contacted by people in need of blood in your area. You can turn off your availability at any time.
          </div>
          <Button type="submit" variant="primary" className="w-full mt-2">Complete Registration</Button>
        </form>
      </Modal>
    </div>
  );
}
