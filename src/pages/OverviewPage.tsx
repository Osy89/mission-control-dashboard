import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import {
  Bot, Wallet, TrendingUp, Users, Zap, Activity, Target, Clock,
  ArrowUpRight, ArrowDownRight, Server, ChevronRight, Hexagon,
} from 'lucide-react';
import { agents, invoices, leads, weeklyPipelineData, revenueBreakdown, systemMetrics } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';

const COLORS = ['#00FFFF', '#4ADE80', '#FACC15', '#A78BFA', '#FB923C'];

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Computed stats
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const mrr = invoices.filter(i => i.recurring && i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const activeAgents = agents.filter(a => a.status === 'online').length;
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const targetMRR = 30000;

  const statCards = [
    {
      label: 'MRR (Monthly)',
      value: `£${mrr.toLocaleString()}`,
      change: '+12%',
      trend: 'up' as const,
      icon: Wallet,
      color: '#00FFFF',
    },
    {
      label: 'Total Revenue',
      value: `£${totalRevenue.toLocaleString()}`,
      change: '+8%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: '#4ADE80',
    },
    {
      label: 'Active Agents',
      value: `${activeAgents}/10`,
      change: '100%',
      trend: 'up' as const,
      icon: Bot,
      color: '#A78BFA',
    },
    {
      label: 'Total Leads',
      value: `${totalLeads}`,
      change: `+${qualifiedLeads} qualified`,
      trend: 'up' as const,
      icon: Users,
      color: '#FACC15',
    },
  ];

  if (!mounted) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card p-5 group cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-mono ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#4A5568] mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Target + Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">REVENUE TARGET</h3>
            </div>
            <StatusBadge status="ok" />
          </div>
          <div className="mb-4">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-heading font-bold text-cyan">£{mrr.toLocaleString()}</span>
              <span className="text-sm text-[#4A5568] mb-1">/ £{targetMRR.toLocaleString()}</span>
            </div>
            <ProgressBar current={mrr} target={targetMRR} color="#00FFFF" size="lg" showPercentage />
          </div>
          <div className="h-52 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyPipelineData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" stroke="#4A5568" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#4A5568" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151A21',
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  labelStyle={{ color: '#00FFFF' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00FFFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue (£)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown Pie */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">BREAKDOWN</h3>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151A21',
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`£${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {revenueBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-[#8B95A5]">{item.name}</span>
                </div>
                <span className="text-xs font-mono text-white">£{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Pipeline */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">WEEKLY PIPELINE</h3>
            </div>
            <span className="text-[10px] font-mono text-[#4A5568]">LAST 8 WEEKS</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" stroke="#4A5568" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#4A5568" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151A21',
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="leads" fill="#00FFFF" radius={[2, 2, 0, 0]} name="Leads" />
                <Bar dataKey="replies" fill="#4ADE80" radius={[2, 2, 0, 0]} name="Replies" />
                <Bar dataKey="closes" fill="#FACC15" radius={[2, 2, 0, 0]} name="Closes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">SYSTEM HEALTH</h3>
            </div>
            <StatusBadge status="ok" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {systemMetrics.map((metric) => (
              <div
                key={metric.name}
                className="bg-void-input rounded-lg p-3 border border-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#4A5568]">{metric.name}</span>
                  <StatusBadge status={metric.status} size="sm" />
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-heading font-bold text-white">
                    {metric.value}
                  </span>
                  <span className="text-[10px] font-mono text-[#4A5568] mb-0.5">{metric.unit}</span>
                </div>
                {/* Mini sparkline */}
                <div className="flex items-end gap-px h-6 mt-2">
                  {metric.history.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-500"
                      style={{
                        height: `${(val / Math.max(...metric.history)) * 100}%`,
                        backgroundColor: metric.status === 'ok' ? '#00FFFF40' : '#FACC1540',
                        minHeight: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Status Grid + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Agents */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">AGENT FLEET</h3>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-mono text-cyan hover:text-white transition-colors">
              VIEW ALL <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-void-input rounded-lg p-3 border border-white/[0.04] hover:border-cyan/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: agent.status === 'online' ? 'rgba(74,222,128,0.1)' : agent.status === 'busy' ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.status === 'online' ? '#4ADE80' : agent.status === 'busy' ? '#FACC15' : '#F87171' }} />
                  </div>
                  <Server className="w-3 h-3 text-[#4A5568] group-hover:text-cyan transition-colors" />
                </div>
                <p className="text-xs font-heading font-bold text-white truncate">{agent.name}</p>
                <p className="text-[10px] font-mono text-[#4A5568]">{agent.tasksProcessed.toLocaleString()} tasks</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {agent.queueLength > 0 && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                      {agent.queueLength} queued
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-cyan" />
            <h3 className="text-sm font-heading font-bold text-white tracking-wide">QUICK ACTIONS</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Run Healer Scan', agent: 'healer', icon: 'HeartPulse', color: '#4ADE80' },
              { label: 'Generate CEO Brief', agent: 'ceo', icon: 'Crown', color: '#A78BFA' },
              { label: 'Deploy Latest', agent: 'ops', icon: 'Server', color: '#00FFFF' },
              { label: 'Backup Systems', agent: 'ops', icon: 'Database', color: '#FACC15' },
              { label: 'Score New Leads', agent: 'sales', icon: 'TrendingUp', color: '#FB923C' },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-void-input border border-white/[0.04] hover:border-cyan/20 hover:bg-void-surface-hover transition-all group text-left"
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Activity className="w-3.5 h-3.5" style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{action.label}</p>
                  <p className="text-[9px] font-mono text-[#4A5568]">{action.agent.toUpperCase()}_AGENT</p>
                </div>
                <ChevronRight className="w-3 h-3 text-[#4A5568] group-hover:text-cyan transition-colors" />
              </button>
            ))}
          </div>

          {/* Pending Tasks */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] font-mono text-[#4A5568] mb-2">PENDING REVENUE</p>
            <p className="text-2xl font-heading font-bold text-yellow-400">£{pendingRevenue.toLocaleString()}</p>
            <p className="text-[10px] font-mono text-[#4A5568] mt-1">
              {invoices.filter(i => i.status === 'pending').length} invoices awaiting payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
