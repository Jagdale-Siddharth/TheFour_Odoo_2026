import Card from '../common/Card';

export default function KpiCard({ label, value, icon: Icon, accent = 'var(--color-primary)' }) {
  return (
    <Card statusColor={accent} className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
        <p className="mt-1 font-mono-data text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
      </div>
      {Icon && (
        <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--color-surface-sunken)' }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      )}
    </Card>
  );
}
