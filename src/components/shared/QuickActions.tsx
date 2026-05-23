import { useState } from 'react';
import { RotateCcw, Trash2, RefreshCw, Database, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { apiPost } from '@/hooks/useApiPoller';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const actions = [
  { id: 'restart-claw', label: 'Restart Open Claw', icon: RotateCcw, endpoint: '/api/agents/openclaw/restart', color: '#00FFFF', confirm: 'Restart the Open Claw Telegram bot?' },
  { id: 'clear-queue', label: 'Clear Task Queue', icon: Trash2, endpoint: '/api/os/clear-queue', color: '#F87171', confirm: 'Clear all pending tasks from the queue?' },
  { id: 'refresh-apis', label: 'Refresh All APIs', icon: RefreshCw, endpoint: '/api/system/refresh', color: '#4ADE80', confirm: 'Refresh all API connections?' },
  { id: 'backup-mem', label: 'Backup Memory', icon: Database, endpoint: '/api/os/backup', color: '#A78BFA', confirm: 'Create a full memory backup?' },
];

export default function QuickActions() {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [executing, setExecuting] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const execute = async (action: typeof actions[0]) => {
    setConfirming(null);
    setExecuting(action.id);
    const res = await apiPost(action.endpoint, {});
    setExecuting(null);
    showToast(res.message, res.success ? 'success' : 'error');
  };

  return (
    <>
      {/* Confirmation Modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setConfirming(null)}>
          <div className="glass-card p-5 max-w-sm w-full mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="text-sm font-heading font-bold text-white">CONFIRM ACTION</h4>
            </div>
            <p className="text-xs text-[#8B95A5] mb-5">
              {actions.find(a => a.id === confirming)?.confirm}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(null)}
                className="flex-1 px-4 py-2 bg-void-input border border-white/[0.06] rounded-lg text-xs font-medium text-[#8B95A5] hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  const action = actions.find(a => a.id === confirming);
                  if (action) execute(action);
                }}
                className="flex-1 px-4 py-2 bg-cyan text-void rounded-lg text-xs font-heading font-bold hover:bg-cyan/90 transition-colors"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[10px] font-mono text-[#4A5568] uppercase tracking-wider shrink-0">Quick Actions</span>
          <div className="h-4 w-px bg-white/[0.06] shrink-0" />
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setConfirming(action.id)}
                disabled={executing === action.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-void-input border border-white/[0.04] hover:border-cyan/20 transition-all text-xs font-mono disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5" style={{ color: action.color }} />
                <span className="text-[#8B95A5] hover:text-white">{action.label}</span>
                {executing === action.id && (
                  <RefreshCw className="w-3 h-3 animate-spin text-cyan" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border animate-slide-in-right ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className={`text-xs font-mono ${toast.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {toast.message}
            </span>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-2 text-[#4A5568] hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
