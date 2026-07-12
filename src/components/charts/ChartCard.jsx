import Card from '../common/Card';

export default function ChartCard({ title, children, className = '' }) {
  return (
    <Card className={className}>
      <h3 className="font-display mb-3 text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
      {children}
    </Card>
  );
}
