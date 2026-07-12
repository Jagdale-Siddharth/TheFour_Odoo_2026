import React from 'react';

export function Field({ label, children }) {
  return (
    <div>
      <label className="eyebrow block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = 'w-full bg-ink border border-steeledge rounded-md px-3 py-2 text-sm text-cargo focus-ring focus:border-amber/50';

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="text-alert text-sm bg-alert/10 border border-alert/20 rounded-md px-3 py-2">
      {message}
    </div>
  );
}
