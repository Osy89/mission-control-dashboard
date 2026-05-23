import { CreditCard, AlertTriangle, TrendingDown, Zap, RefreshCw, Wallet } from 'lucide-react';
import { useApiPoller } from '@/hooks/useApiPoller';
import { fallbackCredits, type CreditsData } from '@/data/apiFallback';
import ConnectionBanner from '@/components/shared/ConnectionBanner';
import QuickActions from '@/components/shared/QuickActions';
import ProgressBar from '@/components/shared/ProgressBar';

const CREDIT_CONFIG: Record<string, { name: string; icon: typeof CreditCard; color: string; warningThreshold: number }> = {
  moonshot: { name: 'Moonshot AI', icon: Zap, color: '#00FFFF', warningThreshold: 20 },
  oxylabs: { name: 'Oxylabs AI', icon: RefreshCw, color: '#4ADE80', warningThreshold: 20 },
  openrouter: { name: 'OpenRouter', icon: Wallet, color: '#A78BFA', warningThreshold: 20 },
};

export default function CreditsPage() {
  const { data, loading, error, retryCount, usingFallback, refresh } = useApiPoller<CreditsData>(
    '/api/credits',
    60000,
    fallbackCredits,
    (raw) => raw as CreditsData
  );

  const credits = data || fallbackCredits;
  const entries = Object.entries(credits);
  const lowCredits = entries.filter(([, v]) => (v.remaining / v.total) * 100 < 20);

  return (
    <div className="p-6 space-y-6">
      <QuickActions />
      <ConnectionBanner error={error} usingFallback={usingFallback} retryCount={retryCount} onRefresh={refresh} />

      {/* Alert Banner */}
      {lowCredits.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-lg animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-xs font-heading font-bold text-red-400">
              LOW CREDIT WARNING
            </p>
            <p className="text-[10px] font-mono text-[#8B95A5]">
              {lowCredits.map(([k]) => CREDIT_CONFIG[k]?.name || k).join(', ')} — below 20% remaining
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {entries.map(([key, info]) => {
          const config = CREDIT_CONFIG[key] || { name: key, icon: CreditCard, color: '#00FFFF', warningThreshold: 20 };
          const Icon = config.icon;
          const pct = (info.remaining / info.total) * 100;
          const isLow = pct < config.warningThreshold;

          return (
            <div key={key} className="glass-card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                {isLow && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
              </div>
              <p className="text-lg font-heading font-bold text-white">{info.remaining.toLocaleString()}</p>
              <p className="text-[9px] font-mono text-[#4A5568] uppercase">{config.name}</p>
              <p className="text-[10px] font-mono mt-1" style={{ color: isLow ? '#F87171' : '#4A5568' }}>
                / {info.total.toLocaleString()} {info.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading && (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-4 bg-white/[0.04] rounded w-1/3 mb-4" />
                <div className="h-3 bg-white/[0.04] rounded w-full mb-2" />
                <div className="h-3 bg-white/[0.04] rounded w-2/3" />
              </div>
            ))}
          </>
        )}

        {!loading && entries.map(([key, info]) => {
          const config = CREDIT_CONFIG[key] || { name: key, icon: CreditCard, color: '#00FFFF', warningThreshold: 20 };
          const Icon = config.icon;
          const pct = (info.remaining / info.total) * 100;
          const isLow = pct < config.warningThreshold;
          const used = info.total - info.remaining;

          return (
            <div key={key} className="glass-card p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-white">{config.name}</p>
                    <p className="text-[10px] font-mono text-[#4A5568]">{info.unit.toUpperCase()}</p>
                  </div>
                </div>
                {isLow && (
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-mono font-bold">
                    LOW
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-mono text-[#4A5568]">REMAINING</span>
                  <span className={`text-[10px] font-mono ${isLow ? 'text-red-400' : 'text-cyan'}`}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar
                  current={info.remaining}
                  target={info.total}
                  color={isLow ? '#F87171' : config.color}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-void-input rounded p-2">
                  <p className="text-xs font-heading font-bold text-white">{info.remaining.toLocaleString()}</p>
                  <p className="text-[9px] font-mono text-[#4A5568]">REMAINING</p>
                </div>
                <div className="bg-void-input rounded p-2">
                  <p className="text-xs font-heading font-bold text-white">{used.toLocaleString()}</p>
                  <p className="text-[9px] font-mono text-[#4A5568]">USED</p>
                </div>
                <div className="bg-void-input rounded p-2">
                  <p className="text-xs font-heading font-bold text-white">{info.total.toLocaleString()}</p>
                  <p className="text-[9px] font-mono text-[#4A5568]">TOTAL</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
