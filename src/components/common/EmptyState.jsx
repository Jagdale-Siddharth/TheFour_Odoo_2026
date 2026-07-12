import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <Inbox size={28} className="text-[var(--color-muted)]" />
      <p className="font-display text-sm font-semibold text-[var(--color-ink)]">{title}</p>
      {description && <p className="max-w-xs text-sm text-[var(--color-muted)]">{description}</p>}
      {action}
    </div>
  );
}
