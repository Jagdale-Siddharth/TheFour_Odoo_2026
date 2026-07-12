export default function Card({ children, className = '', statusColor, ...props }) {
  const railStyle = statusColor ? { borderLeftColor: statusColor } : undefined;
  return (
    <div
      className={`rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4
        shadow-[var(--shadow-card)] ${statusColor ? 'status-rail' : ''} ${className}`}
      style={railStyle}
      {...props}
    >
      {children}
    </div>
  );
}
