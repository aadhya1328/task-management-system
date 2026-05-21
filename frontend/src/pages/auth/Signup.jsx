import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Loader2, RefreshCw, KeyRound, User, Mail, ShieldAlert } from 'lucide-react';

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['employee', 'manager', 'admin'], {
    required_error: 'Please select an operations role'
  }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, 
      'Password must contain at least one uppercase, lowercase, number, and special character'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

const generateCaptchaText = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const [serverError, setServerError] = useState('');
  
  // CAPTCHA States
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaText());
  const [captchaVal, setCaptchaVal] = useState('');
  const [captchaErr, setCaptchaErr] = useState('');
  const canvasRef = useRef(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'employee'
    }
  });

  // Draw Captcha on Mount or Code change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Background gradient in luxury mocha
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#2d1411');
    grad.addColorStop(1, '#1c1412');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid Lines for visual noise (rose tinted)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.12)';
    ctx.lineWidth = 1;
    const gridSize = 10;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Interactive noise lines (luxury rose, gold, and mocha)
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 80 + 175}, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 80}, 0.35)`;
      ctx.lineWidth = 1.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Scatter noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(253, 244, 245, ${Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text configuration
    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < captchaCode.length; i++) {
      const char = captchaCode[i];
      // Warm palette (rose gold / pink tones)
      ctx.fillStyle = `hsl(${Math.random() * 60 + 330}, 85%, 75%)`;
      
      ctx.save();
      const x = 15 + i * 22;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      ctx.translate(x, y);
      const angle = (Math.random() * 30 - 15) * Math.PI / 180;
      ctx.rotate(angle);
      
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, [captchaCode]);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptchaText());
    setCaptchaVal('');
    setCaptchaErr('');
  };

  const onSubmit = async (data) => {
    try {
      setServerError('');
      setCaptchaErr('');

      // CAPTCHA verification
      if (captchaVal.trim().toUpperCase() !== captchaCode) {
        setCaptchaErr('Security verification failed. Please try again.');
        return;
      }

      await signup({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: data.role
      });
      
      alert('Account successfully created! Please log in.');
      navigate('/login');
    } catch (error) {
      setServerError(error.response?.data?.detail || 'An unexpected error occurred during signup.');
      // Refresh captcha on submit failure
      refreshCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#140e0d] via-stone-900 to-[#2d1b19] p-4">
      <div className="w-full max-w-lg bg-[#1c1412]/60 backdrop-blur-xl border border-[#2d211f] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* App branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-mocha-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/20 mx-auto mb-4">
            A
          </div>
          <h1 className="text-3xl font-bold text-stone-100 tracking-tight">Create your workstation account</h1>
          <p className="text-stone-400 mt-2 text-sm">Access security dashboards, workloads, and task delegations.</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-rose-455" />
              Full Name
            </label>
            <input
              type="text"
              {...register('full_name')}
              className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-650 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all"
              placeholder="e.g. John Doe"
            />
            {errors.full_name && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.full_name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-455" />
              Corporate Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-650 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all"
              placeholder="you@company.com"
            />
            {errors.email && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-455 mb-1.5">
              Operations Role
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all cursor-pointer"
            >
              <option value="employee">Employee (General Staff Portal)</option>
              <option value="manager">Manager (Team Operations Portal)</option>
              <option value="admin">System Admin (Full System Console)</option>
            </select>
            {errors.role && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.role.message}</p>}
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-rose-455" />
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-xs text-rose-400 leading-relaxed font-semibold">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-455 mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-rose-455" />
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirm_password')}
                className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all"
                placeholder="••••••••"
              />
              {errors.confirm_password && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.confirm_password.message}</p>}
            </div>
          </div>

          {/* Visual canvas CAPTCHA container */}
          <div className="bg-stone-950/50 border border-[#2d211f] p-4 rounded-2xl mt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-450 mb-2">
              Security Verification
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative rounded-lg overflow-hidden border border-[#2d211f] bg-stone-950 flex-shrink-0 flex items-center">
                <canvas
                  ref={canvasRef}
                  width="160"
                  height="46"
                  className="block"
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="absolute right-1 top-1 p-1 bg-stone-900/80 border border-[#2d211f] hover:bg-stone-850 text-rose-400 hover:text-rose-350 rounded transition-all"
                  title="Generate New Code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                required
                value={captchaVal}
                onChange={(e) => setCaptchaVal(e.target.value)}
                placeholder="Type CAPTCHA..."
                className="w-full px-4 py-3 bg-stone-950/60 border border-[#2d211f] rounded-xl text-stone-200 placeholder-stone-650 focus:outline-none focus:ring-2 focus:ring-rose-500/80 text-sm transition-all uppercase font-mono tracking-widest text-center"
              />
            </div>
            {captchaErr && <p className="mt-2 text-xs text-rose-400 font-semibold">{captchaErr}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-500 to-mocha-600 hover:from-rose-600 hover:to-mocha-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-400">
          Already registered?{' '}
          <Link to="/login" className="text-rose-400 font-bold hover:text-rose-350 hover:underline transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
