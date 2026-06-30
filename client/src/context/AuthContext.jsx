import { createContext, useContext, useReducer, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null); //initially empty

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('rahat_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('rahat_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('rahat_token'),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false, 
      };
    case 'LOGOUT':
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('rahat_token', data.token);
      localStorage.setItem('rahat_user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return { success: true, user: data.user };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('rahat_token', data.token);
      localStorage.setItem('rahat_user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return { success: true, user: data.user };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    localStorage.removeItem('rahat_token');
    localStorage.removeItem('rahat_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((userData) => {
    const updated = { ...state.user, ...userData };
    localStorage.setItem('rahat_user', JSON.stringify(updated));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
