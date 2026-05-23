import { useState } from 'react';
import {
  Rocket, HeartPulse, Crown, TrendingUp, Wallet, Users, Code2, Server, Megaphone, Bot,
  Play, Pause, RotateCcw, Terminal, ChevronRight, Activity, Zap, BarChart3,
} from 'lucide-react';
import { agents } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';

const iconMap: Record<string, React.ElementType> = {
  Rocket, HeartPulse, Crown, TrendingUp, Wallet, Users, Code2, Server, Megaphone, Bot,
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'busy' | 'offline'>('all');

  const filteredAgents = filter === 'all' ? agents : agents.filter(a => a.status === filter);

  const selected = agents.find(a => a.id === selectedAgent);

  return (
    <div className="p-6 flex gap-6 h-[calc(100vh-4rem)]">
      {/* Agent List */}
      <div className={`${selectedAgent ? 'w-80' : 'w-full'} flex flex-col gap-4 transition-all duration-300`}>
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'online', 'busy', 'offline'] as const).map(f => (
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

        {/* Agent Grid */}
        <div className={`grid gap-3 overflow-y-auto pr-1 ${selectedAgent ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {filteredAgents.map((agent) => {
            const Icon = iconMap[agent.icon] || Bot;
            const isSelected = selectedAgent === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`glass-card p-4 cursor-pointer transition-all group ${
                  isSelected ? 'border-cyan/40 shadow-glow' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: agent.status === 'online'
                          ? 'rgba(74,222,128,0.1)'
                          : agent.status === 'busy'
                          ? 'rgba(250,204,21,0.1)'
                          : 'rgba(248,113,113,0.1)',
                      }}
                    >
                      <Icon className="w-5 h-5" style={{
                        color: agent.status === 'online'
                          ? '#4ADE80'
                          : agent.status === 'busy'
                          ? '#FACC15'
                          : '#F87171',
                      }} />
                    </div>
                    <div>
                      <p className="text-sm font-heading font-bold text-white">{agent.name}</p>
                      <p className="text-[10px] font-mono text-[#4A5568]">{agent.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>

                <p className="text-xs text-[#8B95A5] mb-3 line-clamp-2">{agent.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-void-input rounded p-2">
                    <p className="text-[10px] font-mono text-[#4A5568]">TASKS</p>
                    <p className="text-sm font-heading font-bold text-white">{agent.tasksProcessed.toLocaleString()}</p>
                  </div>
                  <div className="bg-void-input rounded p-2">
                    <p className="text-[10px] font-mono text-[#4A5568]">QUEUE</p>
                    <p className="text-sm font-heading font-bold text-white">{agent.queueLength}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#4A5568]">Uptime: {agent.uptime}</span>
                  <ChevronRight className={`w-3 h-3 text-[#4A5568] transition-transform ${isSelected ? 'rotate-90 text-cyan' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selected && (
        <div className="flex-1 glass-card p-5 overflow-y-auto animate-slide-in-right">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = iconMap[selected.icon] || Bot;
                return (
                  <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan" />
                  </div>
                );
              })()}
              <div>
                <h3 className="text-lg font-heading font-bold text-white">{selected.name} Agent</h3>
                <p className="text-xs font-mono text-[#4A5568]">{selected.role} | {selected.id.toUpperCase()}_AGENT</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Start">
                <Play className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors" title="Pause">
                <Pause className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors" title="Restart">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-2 rounded-lg text-[#4A5568] hover:text-white transition-colors ml-2"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-void-input rounded-lg p-3 border border-white/[0.04]">
              <p className="text-[10px] font-mono text-[#4A5568]">STATUS</p>
              <StatusBadge status={selected.status} />
            </div>
            <div className="bg-void-input rounded-lg p-3 border border-white/[0.04]">
              <p className="text-[10px] font-mono text-[#4A5568]">UPTIME</p>
              <p className="text-sm font-heading font-bold text-white">{selected.uptime}</p>
            </div>
            <div className="bg-void-input rounded-lg p-3 border border-white/[0.04]">
              <p className="text-[10px] font-mono text-[#4A5568]">LAST ACTIVE</p>
              <p className="text-sm font-heading font-bold text-white">{selected.lastActive}</p>
            </div>
            <div className="bg-void-input rounded-lg p-3 border border-white/[0.04]">
              <p className="text-[10px] font-mono text-[#4A5568]">QUEUE</p>
              <p className="text-sm font-heading font-bold text-white">{selected.queueLength}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-5">
            <h4 className="text-xs font-heading font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-cyan" />
              METRICS
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(selected.metrics).map(([key, value]) => (
                <div key={key} className="bg-void-input rounded-lg p-3 border border-white/[0.04]">
                  <p className="text-[10px] font-mono text-[#4A5568] uppercase">{key}</p>
                  <p className="text-lg font-heading font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commands */}
          <div className="mb-5">
            <h4 className="text-xs font-heading font-bold text-white mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan" />
              AVAILABLE COMMANDS
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.commands.map((cmd) => (
                <button
                  key={cmd}
                  className="px-3 py-1.5 rounded-lg bg-void-input border border-white/[0.04] hover:border-cyan/30 text-xs font-mono text-[#8B95A5] hover:text-cyan transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Task Processing */}
          <div>
            <h4 className="text-xs font-heading font-bold text-white mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan" />
              PROCESSING LOAD
            </h4>
            <ProgressBar
              current={selected.tasksProcessed}
              target={selected.tasksProcessed + 500}
              label="Tasks Processed"
              color="#00FFFF"
              size="md"
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan text-void rounded-lg text-xs font-heading font-bold hover:bg-cyan/90 transition-colors">
                <Zap className="w-3.5 h-3.5" />
                EXECUTE TASK
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-void-input border border-white/[0.06] text-white rounded-lg text-xs font-heading font-bold hover:border-cyan/30 transition-colors">
                <Terminal className="w-3.5 h-3.5" />
                VIEW LOGS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
