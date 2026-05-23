import { useState } from 'react';
import { Bot, Activity, MessageSquare, Clock, Wifi, Zap } from 'lucide-react';
import { useApiPoller } from '@/hooks/useApiPoller';
import { fallbackAgents, type FleetAgent } from '@/data/apiFallback';
import ConnectionBanner from '@/components/shared/ConnectionBanner';
import QuickActions from '@/components/shared/QuickActions';

const statusColors: Record<string, { dot: string; bg: string; label: string }> = {
  online: { dot: '#4ADE80', bg: 'rgba(74,222,128,0.1)', label: 'ONLINE' },
  offline: { dot: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'OFFLINE' },
  busy: { dot: '#FACC15', bg: 'rgba(250,204,21,0.1)', label: 'BUSY' },
  idle: { dot: '#60A5FA', bg: 'rgba(96,165,250,0.1)', label: 'IDLE' },
};

const statusFilter = ['all', 'online', 'busy', 'idle', 'offline'] as const;

export default function FleetPage() {
  const [filter, setFilter] = useState<string>('all');

  const { data, loading, error, retryCount, usingFallback, refresh } = useApiPoller<{
    agents: FleetAgent[];
  }>('/api/agents', 30000, fallbackAgents, (raw) => {
    const r = raw as { agents?: FleetAgent[] };
    return { agents: r.agents || [] };
  });

  const agents = data?.agents || [];
  const filtered = filter === 'all' ? agents : agents.filter(a => a.status === filter);
  const onlineCount = agents.filter(a => a.status === 'online').length;
  const busyCount = agents.filter(a => a.status === 'busy').length;

  return (
    <div className="p-6 space-y-6">
      <QuickActions />
      <ConnectionBanner error={error} usingFallback={usingFallback} retryCount={retryCount} onRefresh={refresh} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: agents.length, icon: Bot, color: '#00FFFF' },
          { label: 'Online', value: onlineCount, icon: Wifi, color: '#4ADE80' },
          { label: 'Busy', value: busyCount, icon: Activity, color: '#FACC15' },
          { label: 'Active Chats', value: agents.reduce((s, a) => s + (a.active_chats || 0), 0), icon: MessageSquare, color: '#A78BFA' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 animate-fade-in">
              <Icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
              <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {statusFilter.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filter === f
                ? 'bg-cyan/10 text-cyan border border-cyan/20'
                : 'text-[#4A5568] hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {f.toUpperCase()} ({f === 'all' ? agents.length : agents.filter(a => a.status === f).length})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-white/[0.04] rounded w-1/3 mb-3" />
              <div className="h-3 bg-white/[0.04] rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/[0.04] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Agent Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agent, idx) => {
            const sc = statusColors[agent.status] || statusColors.idle;
            return (
              <div
                key={agent.id}
                className="glass-card p-5 group hover:border-cyan/30 transition-all animate-fade-in"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: sc.bg }}
                    >
                      <Bot className="w-5 h-5" style={{ color: sc.dot }} />
                    </div>
                    <div>
                      <p className="text-sm font-heading font-bold text-white">{agent.name}</p>
                      <p className="text-[10px] font-mono text-[#4A5568]">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />
                    <span className="text-[10px] font-mono" style={{ color: sc.dot }}>{sc.label}</span>
                  </div>
                </div>

                {/* Current Task */}
                <div className="bg-void-input rounded-lg p-3 mb-3 border border-white/[0.04]">
                  <p className="text-[10px] font-mono text-[#4A5568] mb-1">CURRENT TASK</p>
                  <p className="text-xs text-white">
                    {agent.current_task || <span className="text-[#4A5568]">Idle — waiting for assignment</span>}
                  </p>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[#8B95A5]">
                    <Clock className="w-3 h-3" /> {agent.uptime}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-[#8B95A5]">
                    <Zap className="w-3 h-3" />
                    {new Date(agent.last_ping).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {agent.active_chats !== undefined && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-cyan">
                      <MessageSquare className="w-3 h-3" /> {agent.active_chats} chats
                    </span>
                  )}
                </div>

                {/* Activity Sparkline */}
                <div>
                  <p className="text-[9px] font-mono text-[#4A5568] mb-1.5">ACTIVITY (60 MIN)</p>
                  <div className="flex items-end gap-px h-10">
                    {agent.history.map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all duration-500"
                        style={{
                          height: `${(val / Math.max(...agent.history, 1)) * 100}%`,
                          backgroundColor: `${sc.dot}40`,
                          minHeight: 2,
                        }}
                        title={`${i}m ago: ${val}%`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
