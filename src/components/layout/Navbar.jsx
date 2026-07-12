import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_ITEMS } from '../../constants/navigation';

const ROLE_LABELS = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pageTitle = NAV_ITEMS.find((item) => item.to === pathname)?.label || 'TransitOps';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'G')
    .split(/[\s._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[var(--color-surface)]/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-[var(--color-muted)] md:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h2 className="font-display text-base font-semibold text-[var(--color-ink)]">{pageTitle}</h2>
      </div>

      <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface-sunken)] px-3 py-2 lg:flex">
        <Search size={15} className="text-[var(--color-muted)]" />
        <input
          placeholder="Search vehicles, drivers, trips..."
          className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-ink)]"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </button>

        <div className="mx-1 h-6 w-px bg-[var(--color-line)]" />

        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-[var(--color-ink)]">{user?.name || 'Guest'}</p>
            <p className="text-[11px] text-[var(--color-muted)]">{ROLE_LABELS[user?.role] || '—'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)]"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
