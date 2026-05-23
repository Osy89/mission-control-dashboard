interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'warning' | 'ok' | 'warn' | 'alert' | 'pending' | 'paid' | 'overdue' | 'new' | 'scored' | 'nurturing' | 'qualified' | 'closed' | 'lost' | 'in-progress' | 'completed' | 'failed' | 'onboarding' | 'active' | 'paused' | 'churned' | 'info' | 'success' | 'running';
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  online: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'ONLINE' },
  offline: { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)', label: 'OFFLINE' },
  busy: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.15)', label: 'BUSY' },
  warning: { color: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)', label: 'WARNING' },
  ok: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'OK' },
  warn: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.15)', label: 'WARN' },
  alert: { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)', label: 'ALERT' },
  pending: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.15)', label: 'PENDING' },
  paid: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'PAID' },
  overdue: { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)', label: 'OVERDUE' },
  new: { color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)', label: 'NEW' },
  scored: { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', label: 'SCORED' },
  nurturing: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.15)', label: 'NURTURING' },
  qualified: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'QUALIFIED' },
  closed: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'CLOSED' },
  lost: { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)', label: 'LOST' },
  'in-progress': { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', label: 'IN PROGRESS' },
  running: { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', label: 'RUNNING' },
  completed: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'DONE' },
  failed: { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)', label: 'FAILED' },
  onboarding: { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', label: 'ONBOARDING' },
  active: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'ACTIVE' },
  paused: { color: '#FACC15', bg: 'rgba(250, 204, 21, 0.15)', label: 'PAUSED' },
  churned: { color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)', label: 'CHURNED' },
  info: { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', label: 'INFO' },
  success: { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)', label: 'SUCCESS' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}30`,
      }}
    >
      <span
        className="rounded-full animate-pulse-glow"
        style={{
          width: size === 'sm' ? 5 : 6,
          height: size === 'sm' ? 5 : 6,
          backgroundColor: config.color,
          display: 'inline-block',
        }}
      />
      {config.label}
    </span>
  );
}
