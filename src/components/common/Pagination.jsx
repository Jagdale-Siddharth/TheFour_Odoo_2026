import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 pt-3 text-sm text-[var(--color-muted)]">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md border border-[var(--color-line)] p-1.5 disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="font-mono-data">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-md border border-[var(--color-line)] p-1.5 disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
