import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { login } from '../lib/api';
import type { UserResponse } from '../types/api';

type LoginProps = {
  onLoggedIn: (token: string) => Promise<UserResponse>;
};

type LoginLocationState = {
 message?: string;
} | null;

export default function Login({ onLoggedIn }: LoginProps) {
 const navigate = useNavigate();
 const location = useLocation();
 const locationState = location.state as LoginLocationState;
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 setSubmitting(true);
 setError(null);

 try {
 const token = await login({ email, password });
 const profile = await onLoggedIn(token.access_token);
      
 if (profile.role === 'admin') {
   navigate('/admin/dashboard', { replace: true });
 } else if (profile.role === 'employer') {
   navigate('/dashboard', { replace: true });
 } else {
   navigate('/', { replace: true });
 }
 } catch (loginError) {
 setError(loginError instanceof Error ? loginError.message : 'Login gagal. Coba lagi.');
 } finally {
 setSubmitting(false);
 }
 };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
            R
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your RemoteIn account</p>
        </div>

        {locationState?.message && (
          <div className="mb-6 rounded-xl border border-emerald-200/50 bg-emerald-50/50 p-4 text-sm font-medium text-emerald-700">
            {locationState.message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200/50 bg-rose-50/50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
