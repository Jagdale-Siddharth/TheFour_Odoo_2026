import Card from '../common/Card';
import { Construction } from 'lucide-react';

export default function ModulePlaceholder({ title, owner }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">{title}</h1>
        <p className="text-sm text-[var(--color-muted)]">Owned by {owner}. This page will consume their API once ready.</p>
      </div>
      <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Construction size={26} className="text-[var(--color-muted)]" />
        <p className="text-sm text-[var(--color-muted)]">
          {title} module is not wired up yet — routing, layout, and navigation are ready for it.
        </p>
      </Card>
    </div>
  );
}
