import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Route, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('fleet@transitops.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate(location.state?.from || '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-amber/15 border border-amber/30 flex items-center justify-center mb-3">
            <Route size={22} className="text-amber" />
          </div>
          <h1 className="font-display text-2xl tracking-wide text-cargo">TRANSITOPS</h1>
          <p className="eyebrow mt-1">Smart Transport Operations Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
          <div>
            <label className="eyebrow block mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink border border-steeledge rounded-md px-3 py-2.5 text-sm text-cargo focus-ring focus:border-amber/50"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="eyebrow block mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink border border-steeledge rounded-md px-3 py-2.5 text-sm text-cargo focus-ring focus:border-amber/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-alert text-sm bg-alert/10 border border-alert/20 rounded-md px-3 py-2">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors disabled:opacity-60 focus-ring"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="pt-2 border-t border-steeledge text-xs text-fog space-y-1">
            <p className="eyebrow mb-1.5">Demo accounts (password123)</p>
            <p>fleet@transitops.com — Fleet Manager</p>
            <p>driver@transitops.com — Driver</p>
            <p>safety@transitops.com — Safety Officer</p>
            <p>finance@transitops.com — Financial Analyst</p>
          </div>
        </form>
      </div>
    </div>
  );
}
