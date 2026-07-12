import React from 'react';

const MAP = {
  Available: 'bg-teal/10 text-teal border-teal/30',
  'On Trip': 'bg-amber/10 text-amber border-amber/30',
  'In Shop': 'bg-fog/10 text-fog border-fog/30',
  Retired: 'bg-alert/10 text-alert border-alert/30',
  'Off Duty': 'bg-fog/10 text-fog border-fog/30',
  Suspended: 'bg-alert/10 text-alert border-alert/30',
  Draft: 'bg-fog/10 text-fog border-fog/30',
  Dispatched: 'bg-amber/10 text-amber border-amber/30',
  Completed: 'bg-teal/10 text-teal border-teal/30',
  Cancelled: 'bg-alert/10 text-alert border-alert/30',
  Open: 'bg-amber/10 text-amber border-amber/30',
  Closed: 'bg-teal/10 text-teal border-teal/30',
};

export default function StatusBadge({ status }) {
  const cls = MAP[status] || 'bg-fog/10 text-fog border-fog/30';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[11px] uppercase tracking-wide ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
