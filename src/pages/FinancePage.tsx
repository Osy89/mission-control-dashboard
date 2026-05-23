import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Wallet, TrendingUp, Clock, AlertTriangle, FileText, Repeat, Zap } from 'lucide-react';
import { invoices, monthlyCosts } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';

const COST_COLORS = ['#00FFFF', '#4ADE80', '#FACC15', '#A78BFA', '#FB923C', '#F87171'];

export default function FinancePage() {
  const [tab, setTab] = useState<'overview' | 'invoices' | 'costs'>('overview');

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const mrr = invoices.filter(i => i.recurring && i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalCosts = monthlyCosts.reduce((s, c) => s + c.cost, 0);
  const netMrr = mrr - totalCosts;

  const forecastData = [
    { month: 'Jan', actual: 8000, projected: 10000 },
    { month: 'Feb', actual: 9500, projected: 12000 },
    { month: 'Mar', actual: 10500, projected: 15000 },
    { month: 'Apr', actual: 11200, projected: 20000 },
    { month: 'May', actual: 12500, projected: 25000 },
    { month: 'Jun', projected: 30000 },
    { month: 'Jul', projected: 35000 },
    { month: 'Aug', projected: 40000 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2">
        {(['overview', 'invoices', 'costs'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              tab === t
                ? 'bg-cyan/10 text-cyan border border-cyan/20'
                : 'text-[#4A5568] hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'MRR', value: `£${mrr.toLocaleString()}`, icon: Wallet, color: '#00FFFF' },
              { label: 'Total Revenue', value: `£${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#4ADE80' },
              { label: 'Pending', value: `£${pendingRevenue.toLocaleString()}`, icon: Clock, color: '#FACC15' },
              { label: 'Net MRR', value: `£${netMrr.toLocaleString()}`, icon: Zap, color: netMrr > 0 ? '#4ADE80' : '#F87171' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="text-xs font-mono text-[#4A5568]">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Target */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-bold text-white tracking-wide">MRR TARGET TRACKING</h3>
              <span className="text-[10px] font-mono text-[#4A5568]">TARGET: £30,000/mo</span>
            </div>
            <ProgressBar current={mrr} target={30000} color="#00FFFF" size="lg" showPercentage />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs font-mono text-[#4A5568]">CURRENT</p>
                <p className="text-lg font-heading font-bold text-cyan">£{mrr.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-mono text-[#4A5568]">GAP</p>
                <p className="text-lg font-heading font-bold text-yellow-400">£{(30000 - mrr).toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-mono text-[#4A5568]">PROGRESS</p>
                <p className="text-lg font-heading font-bold text-green-400">{((mrr / 30000) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Forecast Chart */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4">REVENUE FORECAST</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00FFFF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" stroke="#4A5568" fontSize={11} fontFamily="JetBrains Mono" />
                    <YAxis stroke="#4A5568" fontSize={11} fontFamily="JetBrains Mono" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151A21', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="actual" stroke="#00FFFF" strokeWidth={2} fill="url(#actualGrad)" name="Actual" />
                    <Area type="monotone" dataKey="projected" stroke="#4ADE80" strokeWidth={2} strokeDasharray="5 5" fill="url(#projectedGrad)" name="Projected" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4">MONTHLY COSTS</h3>
              <div className="h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyCosts}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="cost"
                      stroke="none"
                    >
                      {monthlyCosts.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COST_COLORS[index % COST_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151A21', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(value: number) => [`$${value}/mo`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {monthlyCosts.map((cost, i) => (
                  <div key={cost.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COST_COLORS[i] }} />
                      <span className="text-xs text-[#8B95A5]">{cost.name}</span>
                    </div>
                    <span className="text-xs font-mono text-white">${cost.cost}/mo</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between">
                <span className="text-xs font-heading font-bold text-white">TOTAL</span>
                <span className="text-sm font-heading font-bold text-cyan">~${totalCosts}/mo</span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'invoices' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-heading font-bold text-white tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan" />
              ALL INVOICES
            </h3>
            <span className="text-[10px] font-mono text-[#4A5568]">{invoices.length} TOTAL</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Client</th>
                  <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Amount</th>
                  <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Type</th>
                  <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Status</th>
                  <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 text-xs text-white font-medium">{inv.client}</td>
                    <td className="p-3 text-xs font-mono text-cyan">£{inv.amount.toLocaleString()}</td>
                    <td className="p-3">
                      {inv.recurring ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#A78BFA]">
                          <Repeat className="w-3 h-3" /> MRR
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#4A5568]">One-time</span>
                      )}
                    </td>
                    <td className="p-3"><StatusBadge status={inv.status} /></td>
                    <td className="p-3 text-[10px] font-mono text-[#4A5568]">{inv.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'costs' && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            COST OPTIMIZATION
          </h3>
          <div className="space-y-3">
            {monthlyCosts.map((cost, i) => (
              <div key={cost.name} className="flex items-center justify-between p-3 bg-void-input rounded-lg border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COST_COLORS[i]}15` }}>
                    <Wallet className="w-4 h-4" style={{ color: COST_COLORS[i] }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cost.name}</p>
                    <p className="text-[10px] font-mono text-[#4A5568]">{cost.category.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-heading font-bold text-white">${cost.cost}<span className="text-[10px] font-mono text-[#4A5568]">/mo</span></p>
                  <p className="text-[10px] font-mono text-[#4A5568]">${(cost.cost * 12).toLocaleString()}/yr</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-cyan/5 rounded-lg border border-cyan/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[#4A5568]">TOTAL MONTHLY BURN</p>
                <p className="text-2xl font-heading font-bold text-cyan">${totalCosts}/mo</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-[#4A5568]">ANNUAL</p>
                <p className="text-lg font-heading font-bold text-white">${(totalCosts * 12).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
