import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { sosAPI } from '../services/api';
import toast from 'react-hot-toast';

const SOSContext = createContext(null);

export const SOSProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [activeSOS, setActiveSOS] = useState(null);
  const [isSOSLoading, setIsSOSLoading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected for SOS');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  // Check for active SOS on mount/auth change
  useEffect(() => {
    const checkActiveSOS = async () => {
      if (!isAuthenticated) {
        setActiveSOS(null);
        return;
      }
      
      try {
        const { data } = await sosAPI.getActive();
        if (data.sos) {
          setActiveSOS(data.sos);
        }
      } catch (error) {
        console.error('Failed to check active SOS:', error);
      }
    };

    checkActiveSOS();
  }, [isAuthenticated]);

  // Listen for SOS status updates via socket
  useEffect(() => {
    if (!socket || !activeSOS) return;

    socket.emit('sos:join', activeSOS._id);

    const handleUpdate = (data) => {
      if (data.sosId === activeSOS._id) {
        setActiveSOS((prev) => prev ? { ...prev, status: data.status } : null);
        if (data.status === 'resolved') {
          toast.success('Your SOS request has been marked as resolved.', { duration: 5000 });
          setActiveSOS(null); // Clear active SOS
        }
      }
    };

    socket.on('sos:update', handleUpdate);

    return () => {
      socket.off('sos:update', handleUpdate);
      socket.emit('sos:leave', activeSOS._id);
    };
  }, [socket, activeSOS]);

  const triggerSOS = useCallback(async (locationData, type = 'medical') => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to trigger an SOS');
      return { success: false };
    }

    setIsSOSLoading(true);
    try {
      const { data } = await sosAPI.create({
        ...locationData,
        emergencyType: type,
      });
      
      setActiveSOS(data.sos);
      
      // If socket exists, start sending live location updates
      if (socket) {
        socket.emit('location:update', {
          sosId: data.sos._id,
          lat: locationData.latitude,
          lng: locationData.longitude,
        });
      }

      toast.success(data.message || 'SOS Triggered Successfully!', {
        icon: '🚨',
        duration: 5000,
      });
      
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to trigger SOS. Please call 112 directly!';
      toast.error(message, { duration: 6000 });
      return { success: false, error: message };
    } finally {
      setIsSOSLoading(false);
    }
  }, [isAuthenticated, socket]);

  const resolveSOS = useCallback(async (id) => {
    try {
      const { data } = await sosAPI.updateStatus(id, 'resolved');
      setActiveSOS(null);
      toast.success('SOS request resolved');
      return { success: true, data };
    } catch (error) {
      toast.error('Failed to resolve SOS');
      return { success: false };
    }
  }, []);

  return (
    <SOSContext.Provider value={{
      socket,
      activeSOS,
      isSOSLoading,
      triggerSOS,
      resolveSOS,
    }}>
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => {
  const ctx = useContext(SOSContext);
  if (!ctx) throw new Error('useSOS must be used within SOSProvider');
  return ctx;
};
