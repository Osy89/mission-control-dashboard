import { useState, useEffect, useRef } from 'react';
import { Terminal, Pause, Play, Filter, Trash2, Download, Circle } from 'lucide-react';
import { useApiPoller } from '@/hooks/useApiPoller';
import { fallbackLogs, type LogEntry } from '@/data/apiFallback';
import ConnectionBanner from '@/components/shared/ConnectionBanner';
import QuickActions from '@/components/shared/QuickActions';

const LEVEL_STYLES: Record<string, { color: string; bg: string; prefix: string }> = {
  info: { color: '#60A5FA', bg: 'rgba(96,165,250,0.08)', prefix: '[INFO]' },
  success: { color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', prefix: '[OK]' },
  warn: { color: '#FACC15', bg: 'rgba(250,204,21,0.08)', prefix: '[WARN]' },
  error: { color: '#F87171', bg: 'rgba(248,113,113,0.08)', prefix: '[ERR]' },
};

const agentColors: Record<string, string> = {
  openclaw: '#00FFFF',
  research: '#4ADE80',
  code: '#A78BFA',
  dashboard: '#FACC15',
  scraper: '#FB923C',
  notifier: '#F472B6',
};

export default function TerminalPage() {
  const [paused, setPaused] = useState(false);
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLen = useRef(0);

  const { data, loading, error, retryCount, usingFallback, refresh } = useApiPoller<{
    logs: LogEntry[];
  }>('/api/logs', 5000, fallbackLogs, (raw) => {
    const r = raw as { logs?: LogEntry[] };
    return { logs: r.logs || [] };
  });

  const logs = data?.logs || [];

  const agentsList = Array.from(new Set(logs.map(l => l.agent)));

  const filtered = logs.filter(l => {
    const matchAgent = filterAgent === 'all' || l.agent === filterAgent;
    const matchLevel = filterLevel === 'all' || l.level === filterLevel;
    return matchAgent && matchLevel;
  });

  // Auto-scroll
  useEffect(() => {
    if (paused) return;
    if (scrollRef.current && logs.length !== prevLen.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      prevLen.current = logs.length;
    }
  }, [logs, paused]);

  const exportLogs = () => {
    const text = filtered.map(l =>
      `[${new Date(l.timestamp).toLocaleTimeString('en-GB')}] ${l.agent.toUpperCase()} ${LEVEL_STYLES[l.level]?.prefix || '[INFO]'} ${l.message}`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dxs-aios-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-4">
      <QuickActions />
      <ConnectionBanner error={error} usingFallback={usingFallback} retryCount={retryCount} onRefresh={refresh} />

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan" />
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">ACTIVITY LOG / TERMINAL STREAM</h2>
            <p className="text-[10px] font-mono text-[#4A5568]">{filtered.length} entries | Auto-refresh 5s</p>
          </div>
          {paused && (
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-[9px] font-mono font-bold animate-pulse">
              PAUSED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Agent Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#4A5568]" />
            <select
              value={filterAgent}
              onChange={e => setFilterAgent(e.target.value)}
              className="bg-void-input border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-cyan/30 font-mono"
            >
              <option value="all">ALL AGENTS</option>
              {agentsList.map(a => (
                <option key={a} value={a}>{a.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="bg-void-input border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-cyan/30 font-mono"
          >
            <option value="all">ALL LEVELS</option>
            <option value="info">INFO</option>
            <option value="success">SUCCESS</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
          </select>

          <button
            onClick={() => setPaused(!paused)}
            className="p-1.5 rounded-lg bg-void-input border border-white/[0.06] text-[#4A5568] hover:text-white transition-colors"
            title={paused ? 'Resume' : 'Pause'}
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={exportLogs}
            className="p-1.5 rounded-lg bg-void-input border border-white/[0.06] text-[#4A5568] hover:text-white transition-colors"
            title="Export logs"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { setFilterAgent('all'); setFilterLevel('all'); }}
            className="p-1.5 rounded-lg bg-void-input border border-white/[0.06] text-[#4A5568] hover:text-white transition-colors"
            title="Clear filters"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col border border-green-500/10">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-void-input border-b border-white/[0.06]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[10px] font-mono text-[#4A5568]">root@dxs-aios:~# tail -f /var/log/agents.log</span>
        </div>

        {/* Log Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-0 font-mono text-[11px] leading-relaxed"
          style={{ background: '#0a0a0c' }}
        >
          {loading && (
            <div className="p-4 text-[#4A5568] animate-pulse">
              {'>'} Initializing log stream...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-4 text-[#4A5568]">{'>'} No log entries match the current filters.</div>
          )}

          {filtered.map((log, idx) => {
            const style = LEVEL_STYLES[log.level] || LEVEL_STYLES.info;
            const agentColor = agentColors[log.agent] || '#8B95A5';
            const time = new Date(log.timestamp).toLocaleTimeString('en-GB', {
              hour: '2-digit', minute: '2-digit', second: '2-digit',
            });

            return (
              <div
                key={idx}
                className="flex items-start gap-2 px-3 py-1.5 hover:bg-white/[0.02] transition-colors border-l-2 border-transparent hover:border-l-cyan/20"
                style={idx === filtered.length - 1 ? { backgroundColor: style.bg } : {}}
              >
                <span className="text-[#4A5568] shrink-0 w-16">{time}</span>
                <span className="shrink-0 w-20 flex items-center gap-1">
                  <Circle className="w-2 h-2" style={{ color: agentColor, fill: agentColor }} />
                  <span style={{ color: agentColor }}>{log.agent}</span>
                </span>
                <span className="shrink-0 w-12" style={{ color: style.color }}>{style.prefix}</span>
                <span className="text-[#8B95A5] flex-1 break-all">{log.message}</span>
              </div>
            );
          })}

          {/* Blinking cursor */}
          {!paused && (
            <div className="px-3 py-1 text-green-400 animate-pulse">
              {'>'} _
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: logs.length, color: '#00FFFF' },
          { label: 'Info', value: logs.filter(l => l.level === 'info').length, color: '#60A5FA' },
          { label: 'Success', value: logs.filter(l => l.level === 'success').length, color: '#4ADE80' },
          { label: 'Warn', value: logs.filter(l => l.level === 'warn').length, color: '#FACC15' },
          { label: 'Error', value: logs.filter(l => l.level === 'error').length, color: '#F87171' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-2.5 text-center">
            <p className="text-lg font-heading font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[9px] font-mono text-[#4A5568] uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
