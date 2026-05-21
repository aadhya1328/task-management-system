import { useState } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Loader2, KeyRound, Mail, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useRHForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await login(data.email, data.password);
      
      // Fetch user role from updated store and redirect dynamically
      const user = useAuthStore.getState().user;
      if (user && user.role) {
        navigate(`/${user.role}/dashboard`);
      } else {
        navigate('/employee/dashboard'); // Default fallback
      }
    } catch (error) {
      setServerError(error.response?.data?.detail || 'Invalid corporate credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140e0d] via-stone-900 to-[#2d1b19] p-4">
      <div className="w-full max-w-md bg-[#1c1412]/60 backdrop-blur-xl border border-[#2d211f] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header and Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-mocha-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/20 mx-auto mb-4">
            A
          </div>
          <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Workstation Portal</h1>
          <p className="text-stone-400 mt-2 text-sm">Sign in to initialize secure operations terminal</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              Corporate Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all"
              placeholder="you@company.com"
            />
            {errors.email && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Password input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                Security Password
              </label>
              <a href="#" className="text-xs font-semibold text-rose-450 hover:text-rose-350 transition-colors">
                Recover Credential?
              </a>
            </div>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.password.message}</p>}
          </div>

          {/* Keep me logged in */}
          <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              className="h-4 w-4 rounded bg-stone-950/60 border-[#2d211f] text-rose-600 focus:ring-rose-500 focus:ring-offset-[#140e0d]"
            />
            <label htmlFor="remember_me" className="ml-2 block text-xs text-stone-450 font-semibold cursor-pointer select-none">
              Maintain secure session
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-500 to-mocha-600 hover:from-rose-600 hover:to-mocha-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              'Initialize Session'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-stone-400">
          Request new account?{' '}
          <Link to="/signup" className="text-rose-400 font-bold hover:text-rose-350 hover:underline transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
