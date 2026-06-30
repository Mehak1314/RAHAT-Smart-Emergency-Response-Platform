import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SOSButton() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSOSClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to use the SOS feature', {
        icon: '🔒',
        duration: 4000,
      });
      navigate('/login?redirect=/sos');
      return;
    }
    navigate('/sos');
  };

  return (
    <button
      onClick={handleSOSClick}
      className="sos-button group"
      aria-label="Emergency SOS"
      title="Tap for Emergency SOS"
    >
      <AlertTriangle 
        size={28} 
        strokeWidth={2.5} 
        className="group-hover:scale-110 transition-transform duration-200" 
      />
      <span className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Emergency SOS
      </span>
    </button>
  );
}
