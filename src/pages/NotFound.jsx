import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-canvas)] text-center">
      <h1 className="font-display text-4xl font-semibold text-[var(--color-ink)]">404</h1>
      <p className="text-sm text-[var(--color-muted)]">This page does not exist.</p>
      <Link to="/dashboard">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
