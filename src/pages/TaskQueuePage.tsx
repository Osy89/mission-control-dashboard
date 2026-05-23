import { useState } from 'react';
import { ListTodo, Play, Pause, CheckCircle2, XCircle, Clock, Send, Plus, Filter } from 'lucide-react';
import { useApiPoller, apiPost } from '@/hooks/useApiPoller';
import { fallbackTasks, type OsTask } from '@/data/apiFallback';
import ConnectionBanner from '@/components/shared/ConnectionBanner';
import StatusBadge from '@/components/shared/StatusBadge';

const statusFilters = ['all', 'pending', 'running', 'completed', 'failed'] as const;

export default function TaskQueuePage() {
  const [filter, setFilter] = useState<string>('all');
  const [showSubmit, setShowSubmit] = useState(false);
  const [newTask, setNewTask] = useState({ agent: 'research', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, retryCount, usingFallback, refresh } = useApiPoller<{
    tasks: OsTask[];
  }>('/api/os/tasks', 10000, fallbackTasks, (raw) => {
    const r = raw as { tasks?: OsTask[] };
    return { tasks: r.tasks || [] };
  });

  const tasks = data?.tasks || [];
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  const handleSubmit = async () => {
    if (!newTask.description.trim()) return;
    setSubmitting(true);
    await apiPost('/api/os/task', { agent_id: newTask.agent, task: newTask.description });
    setSubmitting(false);
    setShowSubmit(false);
    setNewTask({ agent: 'research', description: '' });
    refresh();
  };

  return (
    <div className="p-6 space-y-6">
      <ConnectionBanner error={error} usingFallback={usingFallback} retryCount={retryCount} onRefresh={refresh} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListTodo className="w-5 h-5 text-cyan" />
          <div>
            <h2 className="text-sm font-heading font-bold text-white tracking-wide">TASK QUEUE & ORCHESTRATION</h2>
            <p className="text-[10px] font-mono text-[#4A5568]">{counts.running} running | {counts.pending} pending | {counts.completed} completed</p>
          </div>
        </div>
        <button
          onClick={() => setShowSubmit(!showSubmit)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan text-void rounded-lg text-xs font-heading font-bold hover:bg-cyan/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          SUBMIT TASK
        </button>
      </div>

      {/* Submit Form */}
      {showSubmit && (
        <div className="glass-card p-4 animate-fade-in border-cyan/20">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-mono text-[#4A5568] uppercase mb-1 block">Agent</label>
              <select
                value={newTask.agent}
                onChange={e => setNewTask(prev => ({ ...prev, agent: e.target.value }))}
                className="w-full bg-void-input border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan/30"
              >
                <option value="research">Research Agent</option>
                <option value="code">Code Agent</option>
                <option value="openclaw">Open Claw</option>
                <option value="scraper">Web Scraper</option>
                <option value="notifier">Notifier</option>
              </select>
            </div>
            <div className="flex-[2]">
              <label className="text-[10px] font-mono text-[#4A5568] uppercase mb-1 block">Task Description</label>
              <input
                type="text"
                value={newTask.description}
                onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the task..."
                className="w-full bg-void-input border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white placeholder-[#4A5568] outline-none focus:border-cyan/30 font-mono"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !newTask.description.trim()}
              className="px-4 py-2 bg-cyan text-void rounded-lg text-xs font-heading font-bold hover:bg-cyan/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {submitting ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              SEND
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-[#4A5568]" />
        {statusFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filter === f
                ? 'bg-cyan/10 text-cyan border border-cyan/20'
                : 'text-[#4A5568] hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {f.toUpperCase()} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Task Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">ID</th>
                <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Agent</th>
                <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Description</th>
                <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Status</th>
                <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Created</th>
                <th className="text-left p-3 text-[10px] font-mono text-[#4A5568] uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#4A5568]">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-mono">Loading tasks...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs font-mono text-[#4A5568]">
                    No tasks found
                  </td>
                </tr>
              )}
              {!loading && filtered.map((task, idx) => {
                const statusIcon = {
                  pending: <Pause className="w-3.5 h-3.5 text-yellow-400" />,
                  running: <Play className="w-3.5 h-3.5 text-blue-400" />,
                  completed: <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />,
                  failed: <XCircle className="w-3.5 h-3.5 text-red-400" />,
                }[task.status];

                return (
                  <tr
                    key={task.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="p-3 text-xs font-mono text-cyan">#{task.id}</td>
                    <td className="p-3">
                      <span className="text-xs font-medium text-white capitalize">{task.agent}</span>
                    </td>
                    <td className="p-3 text-xs text-[#8B95A5] max-w-xs truncate">{task.description}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {statusIcon}
                        <StatusBadge status={task.status} size="sm" />
                      </div>
                    </td>
                    <td className="p-3 text-[10px] font-mono text-[#4A5568]">
                      {new Date(task.created).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-[10px] font-mono text-[#8B95A5]">{task.duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
