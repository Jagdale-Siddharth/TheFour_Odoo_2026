import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-[var(--color-surface)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3.5">
          <h3 className="font-display text-sm font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--color-muted)] hover:text-[var(--color-ink)]">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-[var(--color-line)] px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}
