import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">Settings</h1>
        <p className="text-sm text-[var(--color-muted)]">Preferences and application information.</p>
      </div>

      <Card>
        <h3 className="font-display mb-3 text-sm font-semibold">Theme</h3>
        <Button variant="secondary" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>
      </Card>

      <Card>
        <h3 className="font-display mb-3 text-sm font-semibold">Profile</h3>
        <p className="text-sm text-[var(--color-muted)]">
          Name: <span className="text-[var(--color-ink)]">{user?.name || '—'}</span>
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          Role: <span className="text-[var(--color-ink)]">{user?.role || '—'}</span>
        </p>
      </Card>

      <Card>
        <h3 className="font-display mb-3 text-sm font-semibold">Application Info</h3>
        <p className="text-sm text-[var(--color-muted)]">TransitOps — Smart Transport Operations Platform</p>
        <p className="text-sm text-[var(--color-muted)]">Version 1.0.0</p>
      </Card>
    </div>
  );
}
