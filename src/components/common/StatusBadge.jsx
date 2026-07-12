import { STATUS_COLOR_MAP } from '../../constants/status';

export default function StatusBadge({ status }) {
  const meta = STATUS_COLOR_MAP[status] || { color: 'var(--color-muted)', soft: 'var(--color-line)', label: status };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-mono-data"
      style={{ color: meta.color, backgroundColor: meta.soft }}
    >
      {meta.label}
    </span>
  );
}
