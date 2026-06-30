import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, Lock, User, Phone, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');

  const password = watch('password');
  const from = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const onSubmit = async (data) => {
    setAuthError('');
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...submitData } = data;
    
    const result = await registerUser(submitData);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } else {
      setAuthError(result.message);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-center py-12 bg-surface">
      <div className="page-container w-full max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emergency-100 text-emergency-600 mb-4">
            <UserPlus size={24} />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-subtle mt-2">Join RAHAT to access emergency services</p>
        </div>

        <Card padding="lg" className="shadow-xl">
          {authError && (
            <div className="alert-strip-red mb-6">
              <span className="flex-1">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className={`form-input pl-10 ${errors.name ? 'form-input-error' : ''}`}
                    placeholder="John Doe"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className={`form-input pl-10 ${errors.email ? 'form-input-error' : ''}`}
                    placeholder="you@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' }
                    })}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Phone size={18} />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input pl-10 ${errors.phone ? 'form-input-error' : ''}`}
                    placeholder="9876543210"
                    {...register('phone', { 
                      required: 'Phone is required',
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Valid 10-digit Indian number required' }
                    })}
                  />
                </div>
                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Droplet size={18} />
                  </div>
                  <select
                    id="bloodGroup"
                    className="form-select pl-10"
                    {...register('bloodGroup')}
                  >
                    <option value="">Don't know / Select later</option>
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className={`form-input pl-10 ${errors.password ? 'form-input-error' : ''}`}
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Must be at least 8 characters' }
                    })}
                  />
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`form-input pl-10 ${errors.confirmPassword ? 'form-input-error' : ''}`}
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Please confirm password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-subtle">
              Already have an account?{' '}
              <Link to={`/login${location.search}`} className="font-semibold text-emergency-600 hover:text-emergency-700">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
