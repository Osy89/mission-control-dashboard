import {
  LayoutDashboard,
  Bot,
  Wallet,
  TrendingUp,
  CalendarCheck,
  HeartPulse,
  Radio,
  Server,
  Settings,
  Hexagon,
  Rocket,
  ListTodo,
  CreditCard,
  Terminal,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'fleet', label: 'Live Fleet', icon: Rocket },
  { id: 'queue', label: 'Task Queue', icon: ListTodo },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'sales', label: 'Sales Pipeline', icon: TrendingUp },
  { id: 'tasks', label: 'Task Calendar', icon: CalendarCheck },
  { id: 'health', label: 'System Health', icon: HeartPulse },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'activity', label: 'Activity Feed', icon: Radio },
  { id: 'credits', label: 'API Credits', icon: CreditCard },
  { id: 'deploy', label: 'Deployment', icon: Server },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange, collapsed }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-void-surface/90 backdrop-blur-xl border-r border-white/[0.06] flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-cyan-dim shrink-0">
          <Hexagon className="w-5 h-5 text-void" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-heading font-bold text-white tracking-wider whitespace-nowrap">
              DXS AIOS
            </h1>
            <p className="text-[10px] font-mono text-cyan-dim tracking-widest whitespace-nowrap">
              MISSION CONTROL
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {/* Section Label */}
        {!collapsed && (
          <p className="px-3 py-1 text-[9px] font-mono text-[#4A5568] uppercase tracking-widest">
            Command
          </p>
        )}
        {navItems.slice(0, 1).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${collapsed ? 'justify-center' : ''} ${
                isActive ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-[#8B95A5] hover:bg-white/[0.04] hover:text-white border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-cyan' : 'text-[#4A5568] group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 1.5} />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />}
            </button>
          );
        })}

        {/* Section Label */}
        {!collapsed && (
          <p className="px-3 py-1 mt-3 text-[9px] font-mono text-[#4A5568] uppercase tracking-widest">
            Agentic OS
          </p>
        )}
        {navItems.slice(1, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${collapsed ? 'justify-center' : ''} ${
                isActive ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-[#8B95A5] hover:bg-white/[0.04] hover:text-white border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-cyan' : 'text-[#4A5568] group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 1.5} />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />}
            </button>
          );
        })}

        {/* Section Label */}
        {!collapsed && (
          <p className="px-3 py-1 mt-3 text-[9px] font-mono text-[#4A5568] uppercase tracking-widest">
            Operations
          </p>
        )}
        {navItems.slice(4, 11).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${collapsed ? 'justify-center' : ''} ${
                isActive ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-[#8B95A5] hover:bg-white/[0.04] hover:text-white border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-cyan' : 'text-[#4A5568] group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 1.5} />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />}
            </button>
          );
        })}

        {/* Section Label */}
        {!collapsed && (
          <p className="px-3 py-1 mt-3 text-[9px] font-mono text-[#4A5568] uppercase tracking-widest">
            Infrastructure
          </p>
        )}
        {navItems.slice(11).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${collapsed ? 'justify-center' : ''} ${
                isActive ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-[#8B95A5] hover:bg-white/[0.04] hover:text-white border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-cyan' : 'text-[#4A5568] group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 1.5} />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {!collapsed && (
            <div>
              <p className="text-[10px] font-mono text-[#8B95A5]">SYSTEM ONLINE</p>
              <p className="text-[10px] font-mono text-green-400">API READY</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
