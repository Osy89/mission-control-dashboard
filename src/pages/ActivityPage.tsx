import { useState, useEffect, useRef } from 'react';
import {
  Radio, Bot, Clock, Filter, TrendingUp, Users, Code2, Server, Megaphone, HeartPulse, Wallet, Crown, Zap,
} from 'lucide-react';
import { agentActivityTimeline } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';

type ActivityType = 'all' | 'success' | 'info' | 'warn';

const agentIconMap: Record<string, React.ElementType> = {
  Sales: TrendingUp,
  Healer: HeartPulse,
  Dev: Code2,
  CEO: Crown,
  Ops: Server,
  Finance: Wallet,
  Marketing: Megaphone,
  Customer: Users,
  Bootstrap: Server,
  Personal: Bot,
};

const typeColorMap: Record<string, { border: string; bg: string; icon: string }> = {
  success: { border: 'rgba(74,222,128,0.3)', bg: 'rgba(74,222,128,0.05)', icon: '#4ADE80' },
  info: { border: 'rgba(96,165,250,0.3)', bg: 'rgba(96,165,250,0.05)', icon: '#60A5FA' },
  warn: { border: 'rgba(250,204,21,0.3)', bg: 'rgba(250,204,21,0.05)', icon: '#FACC15' },
};

export default function ActivityPage() {
  const [filter, setFilter] = useState<ActivityType>('all');
  const [activities, setActivities] = useState(agentActivityTimeline);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = filter === 'all'
    ? activities
    : activities.filter(a => a.type === filter);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities]);

  // Simulate new activity
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        agent: ['Sales', 'Healer', 'Dev', 'Ops', 'Marketing'][Math.floor(Math.random() * 5)],
        action: ['Task completed', 'Scan running', 'Build progress', 'Deploy queued', 'Campaign sent'][Math.floor(Math.random() * 5)],
        detail: 'Automated activity detected',
        type: ['success', 'info', 'warn'][Math.floor(Math.random() * 3)] as 'success' | 'info' | 'warn',
      };
      setActivities(prev => [...prev.slice(-19), newActivity]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-cyan" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-white tracking-wide">LIVE ACTIVITY FEED</h3>
            <p className="text-[10px] font-mono text-[#4A5568]">REAL-TIME AGENT TELEMETRY</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#4A5568]" />
          {(['all', 'success', 'info', 'warn'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all ${
                filter === f
                  ? 'bg-cyan/10 text-cyan border border-cyan/20'
                  : 'text-[#4A5568] hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Stream */}
      <div ref={scrollRef} className="flex-1 glass-card overflow-hidden flex flex-col">
        <div className="p-3 border-b border-white/[0.06] flex items-center gap-6 text-[10px] font-mono text-[#4A5568]">
          <span className="w-12">TIME</span>
          <span className="w-20">AGENT</span>
          <span className="w-24">ACTION</span>
          <span className="flex-1">DETAIL</span>
          <span className="w-16">STATUS</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((activity, index) => {
            const Icon = agentIconMap[activity.agent] || Bot;
            const colors = typeColorMap[activity.type] || typeColorMap.info;
            const isNew = index === filtered.length - 1;

            return (
              <div
                key={index}
                className={`flex items-center gap-6 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all ${
                  isNew ? 'animate-fade-in' : ''
                }`}
                style={isNew ? { borderLeft: `2px solid ${colors.icon}` } : { borderLeft: '2px solid transparent' }}
              >
                <span className="w-12 text-[10px] font-mono text-[#4A5568] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
                <span className="w-20 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" style={{ color: colors.icon }} />
                  <span className="text-xs font-medium text-white">{activity.agent}</span>
                </span>
                <span className="w-24">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: colors.bg, color: colors.icon }}
                  >
                    {activity.action}
                  </span>
                </span>
                <span className="flex-1 text-xs text-[#8B95A5]">{activity.detail}</span>
                <span className="w-16">
                  <StatusBadge status={activity.type as 'success' | 'info' | 'warn'} size="sm" />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[
          { label: 'Events (24h)', value: activities.length, icon: Radio, color: '#00FFFF' },
          { label: 'Success', value: activities.filter(a => a.type === 'success').length, icon: Zap, color: '#4ADE80' },
          { label: 'Info', value: activities.filter(a => a.type === 'info').length, icon: Bot, color: '#60A5FA' },
          { label: 'Warnings', value: activities.filter(a => a.type === 'warn').length, icon: HeartPulse, color: '#FACC15' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-3">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                <span className="text-[10px] font-mono text-[#4A5568]">{stat.label}</span>
              </div>
              <p className="text-lg font-heading font-bold text-white mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
