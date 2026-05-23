// DXS AIOS Mission Control - Data Store
// Simulated real-time data for all 10 agents

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'warning';
  tasksProcessed: number;
  queueLength: number;
  lastActive: string;
  uptime: string;
  description: string;
  icon: string;
  commands: string[];
  metrics: Record<string, string | number>;
}

export interface Lead {
  id: number;
  name: string;
  details: string;
  score: number | null;
  status: 'new' | 'scored' | 'nurturing' | 'qualified' | 'closed' | 'lost';
  date: string;
  bant: {
    budget: number;
    authority: number;
    need: number;
    timing: number;
  } | null;
  tier: 'presence' | 'growth' | 'command' | 'enterprise' | null;
  estimatedValue: number;
}

export interface Invoice {
  id: number;
  client: string;
  amount: number;
  recurring: boolean;
  status: 'pending' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
}

export interface Client {
  id: string;
  name: string;
  status: 'onboarding' | 'active' | 'paused' | 'churned';
  since: string;
  tier: string;
  mrr: number;
  health: number;
  lastContact: string;
}

export interface Task {
  id: number;
  title: string;
  agent: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  dueDate: string | null;
  progress: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'ok' | 'warn' | 'alert';
  history: number[];
}

export interface Note {
  id: number;
  text: string;
  time: string;
  category: string;
}

export interface Reminder {
  id: number;
  time: string;
  text: string;
  date: string;
  active: boolean;
}

// 10 Agents
export const agents: Agent[] = [
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    role: 'System Init',
    status: 'online',
    tasksProcessed: 342,
    queueLength: 0,
    lastActive: '2 min ago',
    uptime: '99.9%',
    description: 'VPS setup, config files, PM2 services, folder structure',
    icon: 'Rocket',
    commands: ['/status', '/bootstrap_script', '/bootstrap_migrate', '/bootstrap_ask'],
    metrics: { diskUsed: '42%', memoryUsed: '38%', loadAvg: '0.45', uptime: '14d 6h' },
  },
  {
    id: 'healer',
    name: 'Healer',
    role: 'Auto-Repair',
    status: 'online',
    tasksProcessed: 1289,
    queueLength: 0,
    lastActive: '30 sec ago',
    uptime: '99.9%',
    description: 'Log monitor, error detect, pattern match, patch gen, auto-restore',
    icon: 'HeartPulse',
    commands: ['/healer_scan', '/healer_fix', '/healer_report'],
    metrics: { errorsFixed: '47', scansRun: '892', patchesApplied: '12', healthScore: '98%' },
  },
  {
    id: 'ceo',
    name: 'CEO',
    role: 'Strategy',
    status: 'online',
    tasksProcessed: 567,
    queueLength: 1,
    lastActive: '5 min ago',
    uptime: '99.5%',
    description: 'Strategic oversight, daily briefs, goal tracking, decision support',
    icon: 'Crown',
    commands: ['/ask', '/brief'],
    metrics: { decisions: '156', briefs: '89', goalsMet: '72%', revenueGap: '£17.5K' },
  },
  {
    id: 'sales',
    name: 'Sales',
    role: 'Lead Gen',
    status: 'busy',
    tasksProcessed: 2156,
    queueLength: 3,
    lastActive: '1 min ago',
    uptime: '99.8%',
    description: 'Lead capture, BANT scoring, proposal generation, CRM sync',
    icon: 'TrendingUp',
    commands: ['/lead_add', '/lead_score', '/lead_list', '/proposal'],
    metrics: { leadsCaptured: '234', proposalsSent: '18', conversionRate: '7.7%', pipelineValue: '£84K' },
  },
  {
    id: 'finance',
    name: 'Finance',
    role: 'Accounting',
    status: 'online',
    tasksProcessed: 890,
    queueLength: 0,
    lastActive: '15 min ago',
    uptime: '99.9%',
    description: 'Invoicing, revenue tracking, MRR forecasting, cost analysis',
    icon: 'Wallet',
    commands: ['/invoice', '/revenue', '/forecast'],
    metrics: { mrr: '£12,500', pending: '£8,200', forecast: '£18,200', burnRate: '£1,850/mo' },
  },
  {
    id: 'customer',
    name: 'Customer',
    role: 'Onboarding',
    status: 'online',
    tasksProcessed: 456,
    queueLength: 1,
    lastActive: '8 min ago',
    uptime: '99.7%',
    description: 'Client onboarding, folder management, handoff docs, health checks',
    icon: 'Users',
    commands: ['/onboard', '/clients', '/handoff'],
    metrics: { clientsActive: '12', onboardedThisMonth: '3', nps: '87', churnRate: '2.1%' },
  },
  {
    id: 'dev',
    name: 'Dev',
    role: 'Code Gen',
    status: 'busy',
    tasksProcessed: 723,
    queueLength: 2,
    lastActive: '3 min ago',
    uptime: '99.6%',
    description: 'Website generation, agent code creation, template management',
    icon: 'Code2',
    commands: ['/build_site', '/build_agent'],
    metrics: { sitesBuilt: '34', agentsGenerated: '12', codeQuality: '94%', deploySuccess: '98%' },
  },
  {
    id: 'ops',
    name: 'Ops',
    role: 'DevOps',
    status: 'online',
    tasksProcessed: 1123,
    queueLength: 0,
    lastActive: '10 min ago',
    uptime: '99.9%',
    description: 'GitHub deploy, backup creation, infrastructure management',
    icon: 'Server',
    commands: ['/deploy', '/backup'],
    metrics: { deployments: '156', backups: '42', successRate: '99.4%', lastDeploy: '2h ago' },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    role: 'Content',
    status: 'online',
    tasksProcessed: 1567,
    queueLength: 0,
    lastActive: '20 min ago',
    uptime: '99.4%',
    description: 'Cold emails, LinkedIn posts, content ideas, campaign management',
    icon: 'Megaphone',
    commands: ['/email', '/post', '/ideas'],
    metrics: { emailsSent: '234', postsCreated: '67', engagement: '4.2%', leadsGenerated: '45' },
  },
  {
    id: 'personal',
    name: 'Assistant',
    role: 'Personal PA',
    status: 'online',
    tasksProcessed: 2345,
    queueLength: 0,
    lastActive: 'Just now',
    uptime: '99.9%',
    description: 'Notes, reminders, scheduling, daily digest, personal queries',
    icon: 'Bot',
    commands: ['/note', '/reminder', '/schedule', '/digest', '/me'],
    metrics: { notesSaved: '342', remindersSet: '89', tasksCompleted: '567', streak: '14 days' },
  },
];

// Leads
export const leads: Lead[] = [
  { id: 1, name: 'Acme Manufacturing', details: '£5K budget, needs automation, 50+ employees', score: 85, status: 'qualified', date: '2026-05-01T10:00:00Z', bant: { budget: 22, authority: 20, need: 23, timing: 20 }, tier: 'command', estimatedValue: 4500 },
  { id: 2, name: 'GreenLeaf Cafe', details: 'Small cafe, needs web presence, £500 budget', score: 45, status: 'scored', date: '2026-05-02T14:30:00Z', bant: { budget: 10, authority: 15, need: 12, timing: 8 }, tier: 'presence', estimatedValue: 650 },
  { id: 3, name: 'TechStart Ltd', details: 'SaaS startup, needs growth automation, £2K/mo', score: 78, status: 'nurturing', date: '2026-05-03T09:15:00Z', bant: { budget: 20, authority: 18, need: 22, timing: 18 }, tier: 'growth', estimatedValue: 1500 },
  { id: 4, name: 'Global Logistics Inc', details: 'Enterprise, needs full AIOS, custom integration', score: null, status: 'new', date: '2026-05-08T16:45:00Z', bant: null, tier: null, estimatedValue: 12000 },
  { id: 5, name: 'Smith & Co Law', details: 'Law firm, needs web + CRM, £1.5K/mo', score: 62, status: 'scored', date: '2026-05-05T11:20:00Z', bant: { budget: 15, authority: 18, need: 16, timing: 13 }, tier: 'growth', estimatedValue: 1500 },
  { id: 6, name: 'FitZone Gym', details: 'Gym chain, 3 locations, needs booking system', score: 71, status: 'nurturing', date: '2026-05-06T08:00:00Z', bant: { budget: 18, authority: 16, need: 20, timing: 17 }, tier: 'growth', estimatedValue: 1800 },
  { id: 7, name: 'Digital Marketing Pro', details: 'Agency, needs white-label solution', score: null, status: 'new', date: '2026-05-08T13:10:00Z', bant: null, tier: null, estimatedValue: 8000 },
  { id: 8, name: 'EduLearn Platform', details: 'EdTech, needs student onboarding automation', score: 55, status: 'scored', date: '2026-05-04T15:30:00Z', bant: { budget: 12, authority: 14, need: 16, timing: 13 }, tier: 'command', estimatedValue: 3500 },
];

// Invoices
export const invoices: Invoice[] = [
  { id: 1, client: 'Acme Manufacturing', amount: 4500, recurring: true, status: 'paid', date: '2026-05-01T00:00:00Z', dueDate: '2026-05-01' },
  { id: 2, client: 'TechStart Ltd', amount: 1500, recurring: true, status: 'paid', date: '2026-05-01T00:00:00Z', dueDate: '2026-05-01' },
  { id: 3, client: 'Smith & Co Law', amount: 1500, recurring: true, status: 'pending', date: '2026-05-08T00:00:00Z', dueDate: '2026-05-15' },
  { id: 4, client: 'FitZone Gym', amount: 1800, recurring: true, status: 'pending', date: '2026-05-08T00:00:00Z', dueDate: '2026-05-15' },
  { id: 5, client: 'GreenLeaf Cafe', amount: 650, recurring: false, status: 'paid', date: '2026-04-15T00:00:00Z', dueDate: '2026-04-15' },
  { id: 6, client: 'EduLearn Platform', amount: 3500, recurring: false, status: 'pending', date: '2026-05-08T00:00:00Z', dueDate: '2026-05-22' },
  { id: 7, client: 'Consulting Project Alpha', amount: 1200, recurring: false, status: 'paid', date: '2026-04-20T00:00:00Z', dueDate: '2026-04-20' },
  { id: 8, client: 'Web Build - RestaurantX', amount: 2500, recurring: false, status: 'pending', date: '2026-05-05T00:00:00Z', dueDate: '2026-05-19' },
];

// Clients
export const clients: Client[] = [
  { id: 'acme-mfg', name: 'Acme Manufacturing', status: 'active', since: '2026-03-01', tier: 'Command', mrr: 4500, health: 95, lastContact: '2026-05-08' },
  { id: 'techstart', name: 'TechStart Ltd', status: 'active', since: '2026-03-15', tier: 'Growth', mrr: 1500, health: 88, lastContact: '2026-05-07' },
  { id: 'smith-law', name: 'Smith & Co Law', status: 'active', since: '2026-04-01', tier: 'Growth', mrr: 1500, health: 92, lastContact: '2026-05-06' },
  { id: 'fitzone', name: 'FitZone Gym', status: 'onboarding', since: '2026-05-01', tier: 'Growth', mrr: 1800, health: 78, lastContact: '2026-05-08' },
  { id: 'greenleaf', name: 'GreenLeaf Cafe', status: 'active', since: '2026-02-15', tier: 'Presence', mrr: 650, health: 85, lastContact: '2026-05-05' },
  { id: 'edulearn', name: 'EduLearn Platform', status: 'active', since: '2026-04-10', tier: 'Command', mrr: 3500, health: 90, lastContact: '2026-05-07' },
];

// Tasks
export const tasks: Task[] = [
  { id: 1, title: 'Score new leads from Kimi Claw', agent: 'sales', status: 'in-progress', priority: 'high', createdAt: '2026-05-08T09:00:00Z', dueDate: '2026-05-09', progress: 65 },
  { id: 2, title: 'Generate proposal for Global Logistics', agent: 'sales', status: 'pending', priority: 'critical', createdAt: '2026-05-08T14:00:00Z', dueDate: '2026-05-10', progress: 0 },
  { id: 3, title: 'Run weekly healer scan', agent: 'healer', status: 'completed', priority: 'medium', createdAt: '2026-05-08T08:00:00Z', dueDate: '2026-05-08', progress: 100 },
  { id: 4, title: 'Deploy website for FitZone Gym', agent: 'dev', status: 'in-progress', priority: 'high', createdAt: '2026-05-07T10:00:00Z', dueDate: '2026-05-09', progress: 80 },
  { id: 5, title: 'Create LinkedIn post for AI week', agent: 'marketing', status: 'pending', priority: 'low', createdAt: '2026-05-08T16:00:00Z', dueDate: '2026-05-11', progress: 0 },
  { id: 6, title: 'Daily CEO brief generation', agent: 'ceo', status: 'completed', priority: 'medium', createdAt: '2026-05-08T07:00:00Z', dueDate: '2026-05-08', progress: 100 },
  { id: 7, title: 'Backup all systems', agent: 'ops', status: 'completed', priority: 'high', createdAt: '2026-05-08T06:00:00Z', dueDate: '2026-05-08', progress: 100 },
  { id: 8, title: 'Onboard Digital Marketing Pro', agent: 'customer', status: 'in-progress', priority: 'medium', createdAt: '2026-05-08T11:00:00Z', dueDate: '2026-05-12', progress: 30 },
];

// Logs
export const logs: LogEntry[] = [
  { id: 1, timestamp: '2026-05-08 16:42:18', agent: 'SALES', level: 'success', message: 'Lead #4 (Global Logistics) captured from Apollo scraper' },
  { id: 2, timestamp: '2026-05-08 16:38:05', agent: 'HEALER', level: 'info', message: 'Weekly scan completed. 0 errors found. System healthy.' },
  { id: 3, timestamp: '2026-05-08 16:35:22', agent: 'DEV', level: 'info', message: 'Website build for FitZone 85% complete. Pending final review.' },
  { id: 4, timestamp: '2026-05-08 16:30:00', agent: 'CEO', level: 'success', message: 'Daily brief generated. 3 priorities identified for tomorrow.' },
  { id: 5, timestamp: '2026-05-08 16:25:45', agent: 'OPS', level: 'success', message: 'Backup completed successfully. Size: 2.4GB' },
  { id: 6, timestamp: '2026-05-08 16:20:11', agent: 'FINANCE', level: 'warn', message: 'Invoice #6 (EduLearn) approaching due date in 14 days' },
  { id: 7, timestamp: '2026-05-08 16:15:33', agent: 'MARKETING', level: 'info', message: 'Cold email campaign sent to 23 prospects. Open rate: 34%' },
  { id: 8, timestamp: '2026-05-08 16:10:00', agent: 'CUSTOMER', level: 'success', message: 'FitZone Gym onboarding folder created. Templates applied.' },
  { id: 9, timestamp: '2026-05-08 16:05:18', agent: 'BOOTSTRAP', level: 'info', message: 'System health check. CPU: 42%, MEM: 58%. All nominal.' },
  { id: 10, timestamp: '2026-05-08 16:00:00', agent: 'PERSONAL', level: 'info', message: 'Daily digest delivered. 2 meetings scheduled for tomorrow.' },
  { id: 11, timestamp: '2026-05-08 15:55:42', agent: 'SALES', level: 'success', message: 'BANT score for Smith & Co: 62/100 (WARM)' },
  { id: 12, timestamp: '2026-05-08 15:50:00', agent: 'DEV', level: 'error', message: 'Build failed for RestaurantX. Missing dependency in template.' },
];

// System Metrics
export const systemMetrics: SystemMetric[] = [
  { name: 'CPU', value: 42, unit: '%', status: 'ok', history: [38, 40, 45, 43, 41, 42, 44, 42, 40, 42] },
  { name: 'Memory', value: 58, unit: '%', status: 'ok', history: [55, 57, 60, 58, 56, 59, 57, 58, 60, 58] },
  { name: 'Disk', value: 68, unit: '%', status: 'ok', history: [65, 66, 67, 68, 68, 69, 68, 68, 67, 68] },
  { name: 'Network', value: 1.2, unit: 'Gbps', status: 'ok', history: [0.8, 1.0, 1.4, 1.2, 1.1, 1.3, 1.2, 1.0, 1.2, 1.2] },
];

// Notes
export const notes: Note[] = [
  { id: 1, text: 'Call John about proposal tomorrow - follow up on command tier', time: '2026-05-08T14:30:00Z', category: 'sales' },
  { id: 2, text: 'Review Kimi Claw content output quality for client deliverables', time: '2026-05-08T12:00:00Z', category: 'dev' },
  { id: 3, text: 'Schedule Sovereign OS architecture review for next week', time: '2026-05-08T10:15:00Z', category: 'planning' },
  { id: 4, text: 'Contabo VPS renewal due in 12 days - $6/mo', time: '2026-05-07T16:00:00Z', category: 'finance' },
];

// Reminders
export const reminders: Reminder[] = [
  { id: 1, time: '09:00', text: 'Morning CEO brief review', date: '2026-05-09', active: true },
  { id: 2, time: '11:00', text: 'Discovery call - Global Logistics Inc', date: '2026-05-09', active: true },
  { id: 3, time: '14:00', text: 'Deploy FitZone website', date: '2026-05-09', active: true },
  { id: 4, time: '16:30', text: 'Weekly team sync (Sovereign OS review)', date: '2026-05-09', active: true },
  { id: 5, time: '09:00', text: 'Follow up with EduLearn on payment', date: '2026-05-10', active: true },
];

// Monthly cost breakdown
export const monthlyCosts = [
  { name: 'Kimi Allegretto (Claw)', cost: 39, category: 'AI' },
  { name: 'Contabo VPS', cost: 6, category: 'infra' },
  { name: 'Kimi API', cost: 3, category: 'AI' },
  { name: 'MiniMax API', cost: 8, category: 'AI' },
  { name: 'Instantly / Email', cost: 37, category: 'tools' },
  { name: 'Domain / Zoho', cost: 10, category: 'infra' },
];

// Revenue breakdown
export const revenueBreakdown = [
  { name: 'AIOS Setup', value: 15000, color: '#00FFFF' },
  { name: 'Licenses', value: 6000, color: '#4ADE80' },
  { name: 'Web Builds', value: 5000, color: '#FACC15' },
  { name: 'Retainers', value: 3000, color: '#A78BFA' },
  { name: 'Consulting', value: 1000, color: '#FB923C' },
];

// Weekly pipeline data for charts
export const weeklyPipelineData = [
  { week: 'W1', leads: 80, replies: 12, calls: 2, closes: 0, revenue: 0 },
  { week: 'W2', leads: 95, replies: 16, calls: 3, closes: 1, revenue: 3500 },
  { week: 'W3', leads: 110, replies: 22, calls: 5, closes: 1, revenue: 4500 },
  { week: 'W4', leads: 100, replies: 20, calls: 5, closes: 2, revenue: 8500 },
  { week: 'W5', leads: 120, replies: 24, calls: 6, closes: 2, revenue: 9000 },
  { week: 'W6', leads: 105, replies: 21, calls: 5, closes: 1, revenue: 2500 },
  { week: 'W7', leads: 115, replies: 23, calls: 6, closes: 2, revenue: 7800 },
  { week: 'W8', leads: 100, replies: 20, calls: 5, closes: 2, revenue: 8200 },
];

// Agent activity timeline
export const agentActivityTimeline = [
  { time: '16:42', agent: 'Sales', action: 'Lead captured', detail: 'Global Logistics Inc from Apollo', type: 'success' },
  { time: '16:38', agent: 'Healer', action: 'Scan complete', detail: '0 errors, system healthy', type: 'info' },
  { time: '16:35', agent: 'Dev', action: 'Build progress', detail: 'FitZone website 85% complete', type: 'info' },
  { time: '16:30', agent: 'CEO', action: 'Brief generated', detail: '3 priorities for tomorrow', type: 'success' },
  { time: '16:25', agent: 'Ops', action: 'Backup complete', detail: '2.4GB backup created', type: 'success' },
  { time: '16:20', agent: 'Finance', action: 'Alert', detail: 'EduLearn invoice due in 14 days', type: 'warn' },
  { time: '16:15', agent: 'Marketing', action: 'Campaign sent', detail: '23 emails, 34% open rate', type: 'info' },
  { time: '16:10', agent: 'Customer', action: 'Onboarded', detail: 'FitZone Gym folder created', type: 'success' },
  { time: '16:05', agent: 'Bootstrap', action: 'Health check', detail: 'CPU 42%, MEM 58%', type: 'info' },
  { time: '16:00', agent: 'Personal', action: 'Digest sent', detail: '2 meetings tomorrow', type: 'info' },
];
