export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value ?? 0);
}

export function formatPercent(value) {
  return `${value ?? 0}%`;
}
