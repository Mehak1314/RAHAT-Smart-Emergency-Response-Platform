import { useState } from 'react';
import { User, Mail, Phone, Upload, Key, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { data } = await userAPI.updateProfile(formData);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="page-container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User className="text-blue-600" /> Account Settings
      </h1>

      <div className="space-y-6">
        <Card padding="lg">
          <h2 className="section-title mb-4">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address (Cannot be changed)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="email" 
                  className="form-input pl-9 bg-slate-50 text-subtle cursor-not-allowed" 
                  value={user?.email || ''}
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input 
                  type="tel" 
                  className="form-input pl-9" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  pattern="^[6-9]\d{9}$"
                  title="10 digit Indian mobile number"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Save Changes
            </Button>
          </form>
        </Card>

        <Card padding="lg" className="border-emergency-100">
          <h2 className="section-title mb-4 text-emergency-700">Account Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" icon={LogOut} onClick={() => {
              logout();
              window.location.href = '/login';
            }}>
              Log Out Everywhere
            </Button>
            <Button variant="danger" className="sm:ml-auto">
              Delete Account
            </Button>
          </div>
          <p className="text-xs text-subtle mt-3">Deleting your account will permanently remove all your medical data, emergency contacts, and SOS history.</p>
        </Card>
      </div>
    </div>
  );
}
