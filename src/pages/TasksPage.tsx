import { useState } from 'react';
import {
  Calendar, Clock, CheckCircle2, AlertCircle, Circle, Play, Pause, RotateCcw,
  Zap, Filter,
} from 'lucide-react';
import { tasks, reminders, notes } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';

export default function TasksPage() {
  const [tab, setTab] = useState<'tasks' | 'calendar' | 'notes'>('tasks');
  const [taskFilter, setTaskFilter] = useState<string>('all');

  const filteredTasks = taskFilter === 'all'
    ? tasks
    : tasks.filter(t => t.status === taskFilter);

  const completionRate = Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        {(['tasks', 'calendar', 'notes'] as const).map(t => (
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

      {tab === 'tasks' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: tasks.length, icon: Circle, color: '#00FFFF' },
              { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: Play, color: '#60A5FA' },
              { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: '#4ADE80' },
              { label: 'Completion', value: `${completionRate}%`, icon: Zap, color: '#FACC15' },
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

          {/* Task Progress */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-heading font-bold text-white mb-3">OVERALL PROGRESS</h3>
            <ProgressBar current={tasks.filter(t => t.status === 'completed').length} target={tasks.length} color="#4ADE80" size="md" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#4A5568]" />
            {['all', 'pending', 'in-progress', 'completed', 'failed'].map(f => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all ${
                  taskFilter === f
                    ? 'bg-cyan/10 text-cyan border border-cyan/20'
                    : 'text-[#4A5568] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div key={task.id} className="glass-card p-4 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      task.priority === 'critical' ? 'bg-red-400' :
                      task.priority === 'high' ? 'bg-orange-400' :
                      task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white">{task.title}</p>
                        <StatusBadge status={task.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-[#4A5568] uppercase">{task.agent}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          task.priority === 'critical' ? 'bg-red-500/10 text-red-400' :
                          task.priority === 'high' ? 'bg-orange-500/10 text-orange-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] font-mono text-[#4A5568] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.dueDate}
                          </span>
                        )}
                      </div>
                      {task.status === 'in-progress' && (
                        <div className="mt-2">
                          <ProgressBar current={task.progress} target={100} color="#00FFFF" size="sm" showPercentage />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status !== 'completed' && (
                      <button className="p-1.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button className="p-1.5 rounded bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20">
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {task.status === 'pending' && (
                      <button className="p-1.5 rounded bg-cyan/10 text-cyan hover:bg-cyan/20">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button className="p-1.5 rounded bg-void-input text-[#4A5568] hover:text-white">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-bold text-white tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan" />
                MAY 2026
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded text-[#4A5568] hover:text-white">{'<'}</button>
                <button className="p-1 rounded text-[#4A5568] hover:text-white">{'>'}</button>
              </div>
            </div>
            {/* Simple calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-center text-[10px] font-mono text-[#4A5568] py-2">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const hasReminder = reminders.some(r => new Date(r.date).getDate() === day);
                const isToday = day === 8;
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono cursor-pointer transition-all ${
                      isToday
                        ? 'bg-cyan/20 text-cyan border border-cyan/30'
                        : hasReminder
                        ? 'bg-yellow-500/5 text-yellow-400 border border-yellow-500/20'
                        : 'text-[#8B95A5] hover:bg-white/[0.04]'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reminders */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4">REMINDERS</h3>
            <div className="space-y-3">
              {reminders.map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 bg-void-input rounded-lg border border-white/[0.04]">
                  <div className="w-12 text-center shrink-0">
                    <p className="text-sm font-heading font-bold text-cyan">{r.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white">{r.text}</p>
                    <p className="text-[10px] font-mono text-[#4A5568]">{r.date}</p>
                  </div>
                  {r.active && <div className="w-2 h-2 rounded-full bg-cyan animate-pulse mt-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {notes.map(note => (
            <div key={note.id} className="glass-card p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white">{note.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-void-input text-[#8B95A5] uppercase">{note.category}</span>
                    <span className="text-[10px] font-mono text-[#4A5568]">{new Date(note.time).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
