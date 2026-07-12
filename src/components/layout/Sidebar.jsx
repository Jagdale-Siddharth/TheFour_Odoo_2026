import { NavLink } from 'react-router-dom';
import { Truck, ChevronsLeft, ChevronsRight, User } from 'lucide-react';
import { NAV_GROUPS } from '../../constants/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { user } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-[var(--color-ink)]/30 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 flex h-full flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)]
          transition-all duration-200 md:sticky md:top-0 md:translate-x-0
          ${collapsed ? 'md:w-[76px]' : 'md:w-64'}
          ${open ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'}`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]">
            <Truck size={18} className="text-white" strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display truncate text-[15px] font-semibold text-[var(--color-ink)]">TransitOps</p>
              <p className="truncate text-[11px] text-[var(--color-muted)]">Operations Console</p>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]/70">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                        collapsed ? 'justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                          : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-ink)]'
                      }`
                    }
                  >
                    <Icon size={17} strokeWidth={2} />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden items-center gap-2 border-t border-[var(--color-line)] px-4 py-3 text-xs
            text-[var(--color-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-ink)] md:flex"
        >
          {collapsed ? <ChevronsRight size={15} /> : (
            <>
              <ChevronsLeft size={15} /> Collapse
            </>
          )}
        </button>

        {/* User footer */}
        <div className={`flex items-center gap-2.5 border-t border-[var(--color-line)] px-4 py-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
            <User size={15} className="text-[var(--color-primary)]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-ink)]">{user?.name || 'Guest'}</p>
              <p className="truncate font-mono-data text-[11px] text-[var(--color-muted)]">{user?.role || '—'}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
