import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Truck } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api/auth.service';

export default function Login() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('manager@transitops.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      setAuth(res.data.token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-5 flex flex-col items-center gap-2">
          <Truck size={26} className="text-[var(--color-primary)]" />
          <h1 className="font-display text-lg font-semibold">TransitOps</h1>
          <p className="text-xs text-[var(--color-muted)]">Sign in to the operations console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size={16} /> : 'Sign In'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
          Placeholder screen — Member 1's real auth API replaces the mock login.
        </p>
      </Card>
    </div>
  );
}
