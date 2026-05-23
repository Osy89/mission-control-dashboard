import { useState, useCallback } from 'react';
import './App.css';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AgentWave from '@/components/effects/AgentWave';
import TelemetryMarquee from '@/components/effects/TelemetryMarquee';
import OverviewPage from '@/pages/OverviewPage';
import FleetPage from '@/pages/FleetPage';
import TaskQueuePage from '@/pages/TaskQueuePage';
import AgentsPage from '@/pages/AgentsPage';
import FinancePage from '@/pages/FinancePage';
import SalesPage from '@/pages/SalesPage';
import TasksPage from '@/pages/TasksPage';
import HealthPage from '@/pages/HealthPage';
import TerminalPage from '@/pages/TerminalPage';
import ActivityPage from '@/pages/ActivityPage';
import CreditsPage from '@/pages/CreditsPage';
import DeployPage from '@/pages/DeployPage';
import SettingsPage from '@/pages/SettingsPage';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  overview: { title: 'OVERVIEW', subtitle: 'Mission Control Dashboard' },
  fleet: { title: 'LIVE FLEET', subtitle: 'Agentic OS — Real-Time Agent Status' },
  queue: { title: 'TASK QUEUE', subtitle: 'Orchestration & Task Management' },
  agents: { title: 'AGENT CONTROL', subtitle: 'Manage 10 AI Agents' },
  finance: { title: 'FINANCE', subtitle: 'Revenue, Costs & Forecasts' },
  sales: { title: 'SALES PIPELINE', subtitle: 'Leads, BANT Scoring & Proposals' },
  tasks: { title: 'TASK CALENDAR', subtitle: 'Tasks, Reminders & Schedule' },
  health: { title: 'SYSTEM HEALTH', subtitle: 'Live Monitoring & Diagnostics' },
  terminal: { title: 'TERMINAL', subtitle: 'Activity Log Stream' },
  activity: { title: 'ACTIVITY FEED', subtitle: 'Real-Time Agent Telemetry' },
  credits: { title: 'API CREDITS', subtitle: 'Balance & Usage Tracking' },
  deploy: { title: 'DEPLOYMENT', subtitle: 'DevOps & Infrastructure' },
  settings: { title: 'ADMINISTRATION', subtitle: 'System Configuration' },
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'overview': return <OverviewPage />;
      case 'fleet': return <FleetPage />;
      case 'queue': return <TaskQueuePage />;
      case 'agents': return <AgentsPage />;
      case 'finance': return <FinancePage />;
      case 'sales': return <SalesPage />;
      case 'tasks': return <TasksPage />;
      case 'health': return <HealthPage />;
      case 'terminal': return <TerminalPage />;
      case 'activity': return <ActivityPage />;
      case 'credits': return <CreditsPage />;
      case 'deploy': return <DeployPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  };

  const pageInfo = pageTitles[activeTab] || pageTitles.overview;

  return (
    <div className="h-screen w-screen bg-void text-white overflow-hidden flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collapsed={sidebarCollapsed}
      />

      <div
        className="flex-1 flex flex-col h-full transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '4rem' : '15rem' }}
      >
        <TopBar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          collapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <div className="flex-1 relative overflow-hidden">
          <AgentWave />

          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none hidden lg:block"
            style={{
              background: 'linear-gradient(to left, rgba(11,13,16,0.9) 0%, transparent 100%)',
            }}
          >
            <TelemetryMarquee />
          </div>

          <div className="relative z-20 h-full overflow-y-auto">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
