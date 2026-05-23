import { useState } from 'react';
import {
  Server, GitBranch, GitCommit, GitPullRequest, RotateCcw, Cloud, HardDrive,
  ChevronRight, Activity, CheckCircle2, AlertTriangle, Database,
} from 'lucide-react';
import { agents } from '@/data/store';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';

interface Deployment {
  id: string;
  client: string;
  branch: string;
  commit: string;
  status: 'deployed' | 'building' | 'failed' | 'queued';
  time: string;
  duration: string;
}

const deployments: Deployment[] = [
  { id: 'd1', client: 'FitZone Gym', branch: 'main', commit: 'a3f2c1d', status: 'deployed', time: '2h ago', duration: '3m 24s' },
  { id: 'd2', client: 'EduLearn Platform', branch: 'main', commit: 'b7e9a2f', status: 'deployed', time: '5h ago', duration: '2m 18s' },
  { id: 'd3', client: 'GreenLeaf Cafe', branch: 'develop', commit: 'c1d4e5f', status: 'building', time: 'Just now', duration: '1m 12s' },
  { id: 'd4', client: 'RestaurantX', branch: 'feature/menu', commit: 'd2e5f6a', status: 'failed', time: '8h ago', duration: '45s' },
  { id: 'd5', client: 'Acme Manufacturing', branch: 'main', commit: 'e3f6a7b', status: 'deployed', time: '1d ago', duration: '4m 02s' },
];

export default function DeployPage() {
  const [activeDeploy, setActiveDeploy] = useState<string | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const startBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Infrastructure Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            name: 'Kimi Claw',
            desc: 'Cloud Agent @ kimi.com',
            status: 'online' as const,
            icon: Cloud,
            metrics: '24/7 | 40GB Storage',
          },
          {
            name: 'Contabo VPS',
            desc: 'Server @ 187.124.71.183',
            status: 'online' as const,
            icon: Server,
            metrics: '$6/mo | PM2 | 24/7',
          },
          {
            name: 'Local Dev',
            desc: 'Development Environment',
            status: 'online' as const,
            icon: HardDrive,
            metrics: 'VS Code + Testing',
          },
        ].map(infra => {
          const Icon = infra.icon;
          return (
            <div key={infra.name} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-cyan" />
                <StatusBadge status={infra.status} size="sm" />
              </div>
              <p className="text-sm font-heading font-bold text-white">{infra.name}</p>
              <p className="text-[10px] font-mono text-[#4A5568]">{infra.desc}</p>
              <p className="text-[10px] font-mono text-cyan mt-1">{infra.metrics}</p>
            </div>
          );
        })}
      </div>

      {/* Deployments + Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment List */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-heading font-bold text-white tracking-wide flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan" />
              DEPLOYMENT HISTORY
            </h3>
            <span className="text-[10px] font-mono text-[#4A5568]">{deployments.length} DEPLOYS</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {deployments.map(deploy => (
              <div
                key={deploy.id}
                onClick={() => setActiveDeploy(activeDeploy === deploy.id ? null : deploy.id)}
                className={`p-4 cursor-pointer hover:bg-white/[0.02] transition-all ${activeDeploy === deploy.id ? 'bg-white/[0.03]' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      deploy.status === 'deployed' ? 'bg-green-500/10' :
                      deploy.status === 'building' ? 'bg-yellow-500/10' :
                      'bg-red-500/10'
                    }`}>
                      {deploy.status === 'deployed' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                       deploy.status === 'building' ? <Activity className="w-4 h-4 text-yellow-400 animate-spin" /> :
                       <AlertTriangle className="w-4 h-4 text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{deploy.client}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#4A5568] flex items-center gap-1">
                          <GitCommit className="w-3 h-3" /> {deploy.commit}
                        </span>
                        <span className="text-[10px] font-mono text-cyan">{deploy.branch}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={deploy.status === 'deployed' ? 'success' : deploy.status === 'building' ? 'warn' : 'alert'} size="sm" />
                    <p className="text-[10px] font-mono text-[#4A5568] mt-1">{deploy.time} | {deploy.duration}</p>
                  </div>
                </div>
                {activeDeploy === deploy.id && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06] animate-fade-in">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan text-void rounded-lg text-[10px] font-heading font-bold hover:bg-cyan/90">
                        <RotateCcw className="w-3 h-3" /> REDEPLOY
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-void-input border border-white/[0.06] text-white rounded-lg text-[10px] font-heading font-bold hover:border-cyan/30">
                        <GitPullRequest className="w-3 h-3" /> VIEW DIFF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Backup + Quick Actions */}
        <div className="space-y-4">
          {/* Backup Panel */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan" />
              BACKUP SYSTEM
            </h3>
            <div className="bg-void-input rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#8B95A5]">Last Backup</span>
                <span className="text-[10px] font-mono text-green-400">2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8B95A5]">Size</span>
                <span className="text-[10px] font-mono text-white">2.4 GB</span>
              </div>
            </div>
            {isBackingUp && (
              <div className="mb-3">
                <ProgressBar current={backupProgress} target={100} color="#00FFFF" size="sm" label="Creating backup..." />
              </div>
            )}
            <button
              onClick={startBackup}
              disabled={isBackingUp}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan text-void rounded-lg text-xs font-heading font-bold hover:bg-cyan/90 disabled:opacity-50 transition-colors"
            >
              <Database className="w-4 h-4" />
              {isBackingUp ? 'BACKING UP...' : 'CREATE BACKUP'}
            </button>
          </div>

          {/* Quick Deploy */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-3">QUICK DEPLOY</h3>
            <div className="space-y-2">
              {agents.slice(0, 5).map(agent => (
                <button
                  key={agent.id}
                  className="w-full flex items-center justify-between p-2.5 bg-void-input rounded-lg border border-white/[0.04] hover:border-cyan/20 transition-all group text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="text-xs text-white">{agent.name}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-[#4A5568] group-hover:text-cyan transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Git Status */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-3">GIT STATUS</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4A5568]">Branch</span>
                <span className="text-cyan font-mono">main</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5568]">Commits</span>
                <span className="text-white font-mono">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5568]">Uncommitted</span>
                <span className="text-yellow-400 font-mono">3 files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5568]">Remote</span>
                <span className="text-green-400 font-mono">github.com/Osy89/dxs-ai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
