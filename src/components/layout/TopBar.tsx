import { Bell, ChevronLeft, ChevronRight, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export default function TopBar({ title, subtitle, collapsed, onToggleSidebar }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-void/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-[#4A5568] hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
        <div>
          <h2 className="text-lg font-heading font-bold text-white tracking-wide">{title}</h2>
          {subtitle && (
            <p className="text-xs font-mono text-[#4A5568] -mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-64' : 'w-auto'}`}>
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-void-input rounded-lg px-3 py-2 border border-white/[0.06] w-full">
              <Search className="w-4 h-4 text-[#4A5568]" />
              <input
                type="text"
                placeholder="Search agents, commands..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-[#4A5568] w-full font-mono"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-[#4A5568] hover:text-white">
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-[#4A5568] hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation arrows */}
        <div className="hidden md:flex items-center gap-1">
          <button className="p-1.5 rounded-md text-[#4A5568] hover:text-white hover:bg-white/[0.04] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md text-[#4A5568] hover:text-white hover:bg-white/[0.04] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[#4A5568] hover:text-white hover:bg-white/[0.04] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan animate-pulse" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan/30 to-cyan/10 border border-cyan/30 flex items-center justify-center">
            <span className="text-xs font-heading font-bold text-cyan">S</span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-white">Stephen</p>
            <p className="text-[10px] font-mono text-[#4A5568]">ADMIN</p>
          </div>
        </div>
      </div>
    </header>
  );
}
