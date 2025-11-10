import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await apiGet<T>(url);
        if (alive) setData(json);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [url]);

  return { data, isLoading, isError };
}
