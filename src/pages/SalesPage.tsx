import { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, Target, TrendingUp, Star, Filter, ChevronRight, Mail, Phone, FileText,
} from 'lucide-react';
import { leads } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';

export default function SalesPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const totalPipeline = leads.reduce((s, l) => s + (l.estimatedValue || 0), 0);
  const avgScore = leads.filter(l => l.score !== null).reduce((s, l) => s + (l.score || 0), 0) / leads.filter(l => l.score !== null).length || 0;

  const pipelineStages = [
    { stage: 'Capture', count: leads.length, color: '#00FFFF' },
    { stage: 'Scored', count: leads.filter(l => l.status === 'scored').length, color: '#60A5FA' },
    { stage: 'Nurturing', count: leads.filter(l => l.status === 'nurturing').length, color: '#FACC15' },
    { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: '#4ADE80' },
    { stage: 'Closed', count: leads.filter(l => l.status === 'closed').length, color: '#A78BFA' },
  ];

  const selected = leads.find(l => l.id === selectedLead);

  return (
    <div className="p-6 flex gap-6 h-[calc(100vh-4rem)]">
      {/* Left Panel */}
      <div className={`${selectedLead ? 'w-96' : 'w-full'} flex flex-col gap-4 transition-all`}>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Leads', value: leads.length, icon: Users, color: '#00FFFF' },
            { label: 'Pipeline Value', value: `£${totalPipeline.toLocaleString()}`, icon: TrendingUp, color: '#4ADE80' },
            { label: 'Avg Score', value: avgScore.toFixed(0), icon: Star, color: '#FACC15' },
            { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, icon: Target, color: '#A78BFA' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-4">
                <Icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                <p className="text-xl font-heading font-bold text-white">{stat.value}</p>
                <p className="text-[10px] font-mono text-[#4A5568]">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Pipeline Visualization */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-heading font-bold text-white mb-3 tracking-wide">PIPELINE FLOW</h3>
          <div className="flex items-center gap-2">
            {pipelineStages.map((stage, i) => (
              <div key={stage.stage} className="flex-1 flex items-center gap-2">
                <div className="flex-1">
                  <div
                    className="rounded-lg p-2 text-center transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: `${stage.color}15`, border: `1px solid ${stage.color}30` }}
                  >
                    <p className="text-lg font-heading font-bold" style={{ color: stage.color }}>{stage.count}</p>
                    <p className="text-[9px] font-mono text-[#4A5568]">{stage.stage}</p>
                  </div>
                </div>
                {i < pipelineStages.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#4A5568] shrink-0" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <ProgressBar current={leads.filter(l => l.status === 'qualified' || l.status === 'closed').length} target={leads.length} label="Conversion Rate" color="#00FFFF" size="sm" />
          </div>
        </div>

        {/* Lead Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#4A5568]" />
          {['all', 'new', 'scored', 'nurturing', 'qualified', 'closed'].map(f => (
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

        {/* Lead List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead.id)}
              className={`glass-card p-4 cursor-pointer transition-all ${selectedLead === lead.id ? 'border-cyan/40 shadow-glow' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white">#{lead.id} {lead.name}</p>
                  <p className="text-[10px] text-[#4A5568] mt-0.5 line-clamp-1">{lead.details}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center gap-3 mt-2">
                {lead.score !== null && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-mono text-yellow-400">{lead.score}/100</span>
                  </div>
                )}
                <span className="text-[10px] font-mono text-cyan">£{(lead.estimatedValue || 0).toLocaleString()}</span>
                {lead.tier && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-void-input text-[#8B95A5] uppercase">{lead.tier}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail */}
      {selected && (
        <div className="flex-1 glass-card p-5 overflow-y-auto animate-slide-in-right">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-heading font-bold text-white">#{selected.id} {selected.name}</h3>
              <p className="text-xs text-[#8B95A5] mt-1">{selected.details}</p>
            </div>
            <button onClick={() => setSelectedLead(null)} className="text-[#4A5568] hover:text-white">✕</button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-void-input rounded-lg p-3">
              <p className="text-[10px] font-mono text-[#4A5568]">EST. VALUE</p>
              <p className="text-lg font-heading font-bold text-cyan">£{selected.estimatedValue?.toLocaleString()}</p>
            </div>
            <div className="bg-void-input rounded-lg p-3">
              <p className="text-[10px] font-mono text-[#4A5568]">STATUS</p>
              <StatusBadge status={selected.status} />
            </div>
            <div className="bg-void-input rounded-lg p-3">
              <p className="text-[10px] font-mono text-[#4A5568]">TIER</p>
              <p className="text-sm font-heading font-bold text-white uppercase">{selected.tier || 'UNASSIGNED'}</p>
            </div>
          </div>

          {/* BANT Score */}
          {selected.bant && (
            <div className="mb-5">
              <h4 className="text-xs font-heading font-bold text-white mb-3">BANT SCORE</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: 'Budget', A: selected.bant.budget, fullMark: 25 },
                    { subject: 'Authority', A: selected.bant.authority, fullMark: 25 },
                    { subject: 'Need', A: selected.bant.need, fullMark: 25 },
                    { subject: 'Timing', A: selected.bant.timing, fullMark: 25 },
                  ]}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="subject" stroke="#8B95A5" fontSize={11} fontFamily="Rajdhani" />
                    <PolarRadiusAxis angle={30} domain={[0, 25]} stroke="#4A5568" fontSize={10} />
                    <Radar name="Score" dataKey="A" stroke="#00FFFF" fill="#00FFFF" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#151A21', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-2">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-cyan">{selected.score}/100</p>
                  <p className="text-[10px] font-mono text-[#4A5568]">
                    {selected.score && selected.score >= 80 ? 'HOT' : selected.score && selected.score >= 60 ? 'WARM' : 'COLD'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan text-void rounded-lg text-xs font-heading font-bold hover:bg-cyan/90">
              <FileText className="w-3.5 h-3.5" />
              PROPOSAL
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-void-input border border-white/[0.06] text-white rounded-lg text-xs font-heading font-bold hover:border-cyan/30">
              <Mail className="w-3.5 h-3.5" />
              EMAIL
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-void-input border border-white/[0.06] text-white rounded-lg text-xs font-heading font-bold hover:border-cyan/30">
              <Phone className="w-3.5 h-3.5" />
              CALL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
