import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface ConnectionBannerProps {
  error: string | null;
  usingFallback: boolean;
  retryCount: number;
  onRefresh: () => void;
}

export default function ConnectionBanner({ error, usingFallback, retryCount, onRefresh }: ConnectionBannerProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!error || usingFallback) return;
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRefresh();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [error, usingFallback, onRefresh]);

  if (!error) return null;

  if (usingFallback) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-lg mb-4">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
        <div className="flex-1">
          <p className="text-[11px] font-mono text-yellow-400">
            API UNREACHABLE — Displaying simulated data
          </p>
          <p className="text-[10px] font-mono text-[#4A5568] mt-0.5">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/5 border border-red-500/20 rounded-lg mb-4 animate-pulse">
      <WifiOff className="w-4 h-4 text-red-400 shrink-0" />
      <div className="flex-1">
        <p className="text-[11px] font-mono text-red-400">
          CONNECTION LOST — Retrying in {countdown}s... (attempt {retryCount})
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </div>
  );
}
