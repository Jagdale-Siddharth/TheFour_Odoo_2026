import { useCallback, useEffect, useState } from 'react';

/**
 * Wraps any service function (e.g. getDashboardSummary) and gives back
 * { data, loading, error, refetch }. Every page uses this instead of
 * hand-rolling its own useEffect/try-catch.
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.data);
    } catch (err) {
      setError(err?.message || 'Something went wrong while loading this data.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
