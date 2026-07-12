import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Users, Route, Wrench, Fuel, BarChart3, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth, ROLE_LABELS } from '../context/AuthContext';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vehicles', label: 'Vehicle Registry', icon: Truck },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/trips', label: 'Trips & Dispatch', icon: Route },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/fuel-expenses', label: 'Fuel & Expenses', icon: Fuel },
  { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
];

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-asphalt border-r border-steeledge flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-steeledge">
          <div className="w-8 h-8 rounded bg-amber/15 border border-amber/30 flex items-center justify-center">
            <Route size={16} className="text-amber" />
          </div>
          <div>
            <div className="font-display font-semibold tracking-wide text-cargo leading-none">TRANSITOPS</div>
            <div className="eyebrow leading-none mt-1">Fleet Command</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors focus-ring ${
                  isActive
                    ? 'bg-amber/10 text-amber border border-amber/20'
                    : 'text-fog hover:text-cargo hover:bg-steel border border-transparent'
                }`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-steeledge">
          <div className="px-3 py-2.5 mb-1">
            <div className="text-sm font-medium text-cargo truncate">{user?.name}</div>
            <div className="eyebrow mt-0.5">{ROLE_LABELS[user?.role] || user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-fog hover:text-alert hover:bg-alert/10 transition-colors focus-ring"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-steeledge bg-ink/80 backdrop-blur flex items-center justify-between px-5 lg:px-8">
          <button className="lg:hidden text-fog" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block eyebrow">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="eyebrow">Live</span>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
