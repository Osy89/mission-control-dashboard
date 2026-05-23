import { useState } from 'react';
import {
  Settings, Shield, Bell, Key, Globe, Save,
} from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    errors: true,
    deploys: true,
    leads: true,
    daily: false,
  });

  const [apiKeys] = useState({
    kimi: 'kimi-****- Allegretto',
    telegram: 'bot-****-TOKEN',
    github: 'ghp_****-REPO',
  });

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-cyan" />
        <h2 className="text-lg font-heading font-bold text-white tracking-wide">ADMINISTRATION</h2>
      </div>

      {/* API Keys */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan" />
          API KEYS
        </h3>
        <div className="space-y-3">
          {Object.entries(apiKeys).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-void-input rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#4A5568]" />
                <div>
                  <p className="text-xs font-medium text-white capitalize">{key} API</p>
                  <p className="text-[10px] font-mono text-[#4A5568]">{value}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-void-input border border-white/[0.06] rounded-lg text-[10px] font-mono text-[#8B95A5] hover:border-cyan/30 hover:text-cyan transition-colors">
                EDIT
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan" />
          NOTIFICATIONS
        </h3>
        <div className="space-y-3">
          {[
            { key: 'errors', label: 'Error Alerts', desc: 'Get notified when agents encounter errors' },
            { key: 'deploys', label: 'Deployment Status', desc: 'Notifications for build and deploy events' },
            { key: 'leads', label: 'New Leads', desc: 'Alert when new leads are captured or scored' },
            { key: 'daily', label: 'Daily Digest', desc: 'Receive daily summary from CEO agent' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-void-input rounded-lg border border-white/[0.04]">
              <div>
                <p className="text-xs font-medium text-white">{item.label}</p>
                <p className="text-[10px] text-[#4A5568]">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`w-10 h-5 rounded-full transition-all relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-cyan' : 'bg-[#1E2530]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                    notifications[item.key as keyof typeof notifications] ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-heading font-bold text-white tracking-wide mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan" />
          SYSTEM INFO
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Platform', value: 'DXS AIOS v2.1' },
            { label: 'Node Version', value: 'v20.x' },
            { label: 'Python', value: '3.11' },
            { label: 'PM2', value: '5.3.x' },
            { label: 'OS', value: 'Ubuntu 22.04' },
            { label: 'Architecture', value: '10-Agent System' },
            { label: 'Revenue Target', value: '£30,000/mo' },
            { label: 'Monthly Burn', value: '~$103/mo' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-2.5 bg-void-input rounded-lg">
              <span className="text-[10px] font-mono text-[#4A5568]">{item.label}</span>
              <span className="text-xs font-mono text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan text-void rounded-lg text-sm font-heading font-bold hover:bg-cyan/90 transition-colors">
          <Save className="w-4 h-4" />
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}
