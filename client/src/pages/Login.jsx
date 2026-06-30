import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState('');

  // Get the redirect path from location state, or default to dashboard
  const from = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const onSubmit = async (data) => {
    setAuthError('');
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      setAuthError(result.message);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-center py-12 bg-surface">
      <div className="page-container w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emergency-100 text-emergency-600 mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-subtle mt-2">Sign in to access your emergency profile</p>
        </div>

        <Card padding="lg" className="shadow-xl">
          {authError && (
            <div className="alert-strip-red mb-6">
              <span className="flex-1">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
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
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Please enter a valid email'
                    }
                  })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0" htmlFor="password">Password</label>
                <button type="button" className="text-xs font-medium text-emergency-600 hover:text-emergency-700 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  className={`form-input pl-10 ${errors.password ? 'form-input-error' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-2" 
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-subtle">
              Don't have an account?{' '}
              <Link to={`/signup${location.search}`} className="font-semibold text-emergency-600 hover:text-emergency-700">
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
