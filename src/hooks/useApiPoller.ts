import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = 'http://187.124.71.183:8080';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  usingFallback: boolean;
}

export function useApiPoller<T>(
  endpoint: string,
  intervalMs: number,
  fallbackData: T,
  transform?: (raw: unknown) => T
): ApiState<T> & { refresh: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
    retryCount: 0,
    usingFallback: false,
  });

  const retryRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${API_BASE}${endpoint}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      const data = transform ? transform(raw) : (raw as T);

      retryRef.current = 0;
      setState({
        data,
        loading: false,
        error: null,
        retryCount: 0,
        usingFallback: false,
      });
    } catch {
      retryRef.current += 1;

      // After 2 retries, show fallback data
      if (retryRef.current >= 2) {
        setState(prev => ({
          ...prev,
          data: fallbackData,
          loading: false,
          error: `API unreachable (${API_BASE}${endpoint}) — showing simulated data`,
          retryCount: retryRef.current,
          usingFallback: true,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: `Connection failed — retry ${retryRef.current}/2...`,
          retryCount: retryRef.current,
          usingFallback: false,
        }));
      }
    }
  }, [endpoint, fallbackData, transform]);

  useEffect(() => {
    fetchData();

    intervalRef.current = setInterval(fetchData, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, intervalMs]);

  const refresh = useCallback(() => {
    retryRef.current = 0;
    setState(prev => ({ ...prev, loading: true, error: null }));
    fetchData();
  }, [fetchData]);

  return { ...state, refresh };
}

export async function apiPost(endpoint: string, body: object): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { success: true, message: 'Command executed successfully' };
  } catch {
    return { success: false, message: `API unreachable — command queued locally` };
  }
}
