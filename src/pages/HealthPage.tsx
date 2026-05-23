import { useState, useEffect } from 'react';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';
import {
  HeartPulse, AlertTriangle, CheckCircle2, XCircle, Terminal, Activity,
  Cpu, HardDrive, Wifi, Database,
} from 'lucide-react';
import { useApiPoller } from '@/hooks/useApiPoller';
import { fallbackSystemStatus, type SystemStatus } from '@/data/apiFallback';
import { logs } from '@/data/store';
import ConnectionBanner from '@/components/shared/ConnectionBanner';
import QuickActions from '@/components/shared/QuickActions';
import CircularProgress from '@/components/shared/CircularProgress';

export default function HealthPage() {
  const [logFilter, setLogFilter] = useState<string>('all');
  const [liveMetrics, setLiveMetrics] = useState([
    { name: 'CPU', value: 42, unit: '%', history: [38, 40, 45, 43, 41, 42, 44, 42, 40, 42] },
    { name: 'Memory', value: 58, unit: '%', history: [55, 57, 60, 58, 56, 59, 57, 58, 60, 58] },
    { name: 'Disk', value: 68, unit: '%', history: [65, 66, 67, 68, 68, 69, 68, 68, 67, 68] },
    { name: 'Network', value: 1.2, unit: 'MB/s', history: [0.8, 1.0, 1.4, 1.2, 1.1, 1.3, 1.2, 1.0, 1.2, 1.2] },
  ]);

  // Poll system status from API
  const { data, loading, error, retryCount, usingFallback, refresh } = useApiPoller<SystemStatus>(
    '/api/status',
    10000,
    fallbackSystemStatus,
    (raw) => raw as SystemStatus
  );

  const status = data || fallbackSystemStatus;

  // Simulate live metric jitter for sparklines
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => prev.map(m => {
        const newVal = Math.max(0, m.value + (Math.random() - 0.5) * 2);
        return {
          ...m,
          value: newVal,
          history: [...m.history.slice(1), Math.max(0, m.value + (Math.random() - 0.5) * 3)],
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update from API data
  useEffect(() => {
    if (data) {
      setLiveMetrics(prev => [
        { ...prev[0], value: data.cpu, history: [...prev[0].history.slice(1), data.cpu] },
        { ...prev[1], value: data.memory, history: [...prev[1].history.slice(1), data.memory] },
        { ...prev[2], value: data.disk, history: [...prev[2].history.slice(1), data.disk] },
      ]);
    }
  }, [data]);

  const filteredLogs = logFilter === 'all'
    ? logs
    : logs.filter(l => l.level === logFilter);

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warnCount = logs.filter(l => l.level === 'warn').length;

  const metricIcons: Record<string, typeof Cpu> = {
    CPU: Cpu,
    Memory: Database,
    Disk: HardDrive,
    Network: Wifi,
  };

  return (
    <div className="p-6 space-y-6">
      <QuickActions />
      <ConnectionBanner error={error} usingFallback={usingFallback} retryCount={retryCount} onRefresh={refresh} />

      {/* Status Banner */}
      <div className="glass-card p-4 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-white">SYSTEM HEALTH</h3>
            <p className="text-[10px] font-mono text-[#4A5568]">ALL SYSTEMS OPERATIONAL</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs font-mono text-green-400">ONLINE</p>
            <p className="text-[9px] font-mono text-[#4A5568]">STATUS</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-mono text-yellow-400">{warnCount}</p>
            <p className="text-[9px] font-mono text-[#4A5568]">WARNINGS</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-mono text-red-400">{errorCount}</p>
            <p className="text-[9px] font-mono text-[#4A5568]">ERRORS</p>
          </div>
        </div>
      </div>

      {/* Circular Progress Indicators */}
      <div className="glass-card p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan" />
          <h3 className="text-sm font-heading font-bold text-white tracking-wide">RESOURCE MONITORING</h3>
          {loading && <span className="text-[10px] font-mono text-[#4A5568] animate-pulse">Loading...</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <CircularProgress value={status.cpu} label="CPU Usage" />
          <CircularProgress value={status.memory} label="Memory" />
          <CircularProgress value={status.disk} label="Disk" />
          <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: 80, height: 80 }}>
              <svg width={80} height={80} className="-rotate-90">
                <circle cx={40} cy={40} r={37} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                <circle cx={40} cy={40} r={37} fill="none" stroke="#00FFFF" strokeWidth={6} strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 37}
                  strokeDashoffset={2 * Math.PI * 37 * 0.3}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.25))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-[#8B95A5]">IN</span>
                <span className="text-xs font-heading font-bold text-white">{status.network_in}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#8B95A5] uppercase tracking-wider">NET IN</span>
          </div>
        </div>
        {/* Color legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-[9px] font-mono text-[#4A5568]">&lt;70%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-[9px] font-mono text-[#4A5568]">70-85%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[9px] font-mono text-[#4A5568]">&gt;85%</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveMetrics.map((metric) => {
          const Icon = metricIcons[metric.name] || Activity;
          const color = metric.value < 70 ? '#4ADE80' : metric.value < 85 ? '#FACC15' : '#F87171';

          return (
            <div key={metric.name} className="glass-card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-4 h-4 text-cyan" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono" style={{ color }}>
                    {metric.value < 70 ? 'OK' : metric.value < 85 ? 'WARN' : 'CRIT'}
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-xl font-heading font-bold text-white">{metric.value.toFixed(1)}</span>
                <span className="text-[10px] font-mono text-[#4A5568] mb-1">{metric.unit}</span>
              </div>
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metric.history.map((v, i) => ({ i, v }))}>
                    <defs>
                      <linearGradient id={`hg-${metric.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#hg-${metric.name})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Stream */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-heading font-bold text-white tracking-wide flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan" />
            LOG STREAM
          </h3>
          <div className="flex items-center gap-1">
            {['all', 'info', 'success', 'warn', 'error'].map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  logFilter === f ? 'bg-cyan/10 text-cyan' : 'text-[#4A5568] hover:text-white'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto font-mono text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 px-4 py-2.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-[#4A5568] shrink-0 w-20">{log.timestamp.split(' ')[1]}</span>
              <span className="text-[#4A5568] shrink-0 w-24">{log.agent}</span>
              {log.level === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />}
              {log.level === 'info' && <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />}
              {log.level === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />}
              {log.level === 'error' && <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
              <span className={`flex-1 ${
                log.level === 'error' ? 'text-red-400' :
                log.level === 'warn' ? 'text-yellow-400' :
                log.level === 'success' ? 'text-green-400' : 'text-[#8B95A5]'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
