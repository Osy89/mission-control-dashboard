// Fallback/demo data matching the API contracts exactly
// Used when the live API at 187.124.71.183:8080 is unreachable

export interface FleetAgent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'idle';
  uptime: string;
  current_task: string | null;
  last_ping: string;
  active_chats?: number;
  history: number[]; // 60 min activity history
}

export interface OsTask {
  id: number;
  agent: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created: string;
  duration: string;
}

export interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  network_in: string;
  network_out: string;
}

export interface CreditInfo {
  remaining: number;
  total: number;
  unit: string;
}

export interface CreditsData {
  moonshot: CreditInfo;
  oxylabs: CreditInfo;
  openrouter: CreditInfo;
}

export interface LogEntry {
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export const fallbackAgents: { agents: FleetAgent[] } = {
  agents: [
    {
      id: 'openclaw',
      name: 'Open Claw',
      role: 'Telegram Handler',
      status: 'online',
      uptime: '3d 4h 12m',
      current_task: 'Handling 12 active chats',
      last_ping: new Date().toISOString(),
      active_chats: 12,
      history: Array.from({ length: 60 }, (_, i) => Math.floor(Math.random() * 40) + (i > 50 ? 35 : 10)),
    },
    {
      id: 'research',
      name: 'Research Agent',
      role: 'Web Research',
      status: 'busy',
      uptime: '2d 8h 45m',
      current_task: 'Searching AI automation trends 2026',
      last_ping: new Date(Date.now() - 30000).toISOString(),
      history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 60) + 20),
    },
    {
      id: 'code',
      name: 'Code Agent',
      role: 'Code Generation',
      status: 'idle',
      uptime: '5d 1h 20m',
      current_task: null,
      last_ping: new Date(Date.now() - 120000).toISOString(),
      history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 30)),
    },
    {
      id: 'dashboard',
      name: 'Kimi Dashboard',
      role: 'Monitor',
      status: 'online',
      uptime: '7d 0h 0m',
      current_task: 'Monitoring all agent health',
      last_ping: new Date().toISOString(),
      history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 20) + 5),
    },
    {
      id: 'scraper',
      name: 'Web Scraper',
      role: 'Data Collection',
      status: 'busy',
      uptime: '1d 12h 33m',
      current_task: 'Scraping LinkedIn leads batch #44',
      last_ping: new Date(Date.now() - 15000).toISOString(),
      history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 80) + 10),
    },
    {
      id: 'notifier',
      name: 'Notifier',
      role: 'Alert System',
      status: 'online',
      uptime: '4d 6h 18m',
      current_task: 'Waiting for alerts',
      last_ping: new Date(Date.now() - 45000).toISOString(),
      history: Array.from({ length: 60 }, () => Math.floor(Math.random() * 15)),
    },
  ],
};

export const fallbackTasks: { tasks: OsTask[] } = {
  tasks: [
    { id: 101, agent: 'research', description: 'Search web for AI automation trends', status: 'running', created: new Date(Date.now() - 300000).toISOString(), duration: '5m 12s' },
    { id: 102, agent: 'code', description: 'Generate landing page component for FitZone', status: 'running', created: new Date(Date.now() - 180000).toISOString(), duration: '3m 45s' },
    { id: 103, agent: 'openclaw', description: 'Process Telegram command /status from user #4421', status: 'completed', created: new Date(Date.now() - 600000).toISOString(), duration: '2s' },
    { id: 104, agent: 'scraper', description: 'Apollo.io lead extraction — manufacturing sector', status: 'running', created: new Date(Date.now() - 900000).toISOString(), duration: '15m 30s' },
    { id: 105, agent: 'dashboard', description: 'Run hourly system health check', status: 'completed', created: new Date(Date.now() - 3600000).toISOString(), duration: '8s' },
    { id: 106, agent: 'research', description: 'Enrich lead data for Acme Manufacturing', status: 'completed', created: new Date(Date.now() - 720000).toISOString(), duration: '12m 4s' },
    { id: 107, agent: 'code', description: 'Fix CSS bug in navbar component', status: 'failed', created: new Date(Date.now() - 1200000).toISOString(), duration: '45s' },
    { id: 108, agent: 'openclaw', description: 'Send daily digest to admin', status: 'pending', created: new Date(Date.now() - 60000).toISOString(), duration: '-' },
    { id: 109, agent: 'notifier', description: 'Alert: Moonshot API credits below 20%', status: 'pending', created: new Date(Date.now() - 180000).toISOString(), duration: '-' },
    { id: 110, agent: 'scraper', description: 'LinkedIn profile extraction batch #45', status: 'pending', created: new Date(Date.now() - 30000).toISOString(), duration: '-' },
  ],
};

export const fallbackSystemStatus: SystemStatus = {
  cpu: 34.2,
  memory: 67.5,
  disk: 45.0,
  network_in: '1.2 MB/s',
  network_out: '0.8 MB/s',
};

export const fallbackCredits: CreditsData = {
  moonshot: { remaining: 4500, total: 5000, unit: 'credits' },
  oxylabs: { remaining: 0, total: 100, unit: 'credits' },
  openrouter: { remaining: 892, total: 1000, unit: 'credits' },
};

export const fallbackLogs: { logs: LogEntry[] } = {
  logs: [
    { timestamp: new Date(Date.now() - 5000).toISOString(), agent: 'openclaw', level: 'info', message: 'Message processed from user #4421 — /help command' },
    { timestamp: new Date(Date.now() - 15000).toISOString(), agent: 'research', level: 'info', message: 'Web search completed — 23 results for "AI automation trends 2026"' },
    { timestamp: new Date(Date.now() - 30000).toISOString(), agent: 'dashboard', level: 'success', message: 'All 6 agents reporting healthy status' },
    { timestamp: new Date(Date.now() - 45000).toISOString(), agent: 'code', level: 'warn', message: 'Build warning: unused import in utils/kimi.py' },
    { timestamp: new Date(Date.now() - 60000).toISOString(), agent: 'scraper', level: 'info', message: 'Apollo.io session refreshed successfully' },
    { timestamp: new Date(Date.now() - 90000).toISOString(), agent: 'openclaw', level: 'info', message: 'Webhook received from Kimi Claw — new analysis ready' },
    { timestamp: new Date(Date.now() - 120000).toISOString(), agent: 'notifier', level: 'warn', message: 'Oxylabs API credits exhausted — switching to fallback' },
    { timestamp: new Date(Date.now() - 150000).toISOString(), agent: 'research', level: 'error', message: 'Connection timeout to oxylabs.io (retry 2/3)' },
    { timestamp: new Date(Date.now() - 180000).toISOString(), agent: 'dashboard', level: 'success', message: 'Hourly backup completed — 2.1GB archive' },
    { timestamp: new Date(Date.now() - 240000).toISOString(), agent: 'code', level: 'info', message: 'Generated agent boilerplate for new client onboarding' },
    { timestamp: new Date(Date.now() - 300000).toISOString(), agent: 'openclaw', level: 'info', message: 'New lead captured from Telegram — Global Logistics Inc' },
    { timestamp: new Date(Date.now() - 360000).toISOString(), agent: 'scraper', level: 'success', message: 'Batch #43 completed — 47 leads extracted from LinkedIn' },
    { timestamp: new Date(Date.now() - 420000).toISOString(), agent: 'dashboard', level: 'info', message: 'Memory usage at 67% — within normal parameters' },
    { timestamp: new Date(Date.now() - 480000).toISOString(), agent: 'research', level: 'info', message: 'BANT scoring complete for lead #4 — Score: 85/100' },
    { timestamp: new Date(Date.now() - 540000).toISOString(), agent: 'code', level: 'success', message: 'Website build deployed for FitZone Gym' },
  ],
};
