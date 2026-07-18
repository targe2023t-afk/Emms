import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Package,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Filter,
  ArrowRight,
  Circle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/primitives/card';
import { Button } from '@/shared/ui/primitives/button';
import { Badge } from '@/shared/ui/primitives/badge';
import { Separator } from '@/shared/ui/primitives/separator';
import { Skeleton } from '@/shared/ui/primitives/skeleton';
import { cn } from '@/shared/lib/utils/cn';

// ─── Types ───
interface KpiData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Technician {
  id: string;
  initials: string;
  name: string;
  status: 'active' | 'idle' | 'offduty';
  currentWo?: string;
  task: string;
  progress: number;
  avatarColor: string;
}

interface InventoryAlert {
  id: string;
  item: string;
  currentStock: number;
  minThreshold: number;
  severity: 'critical' | 'warning';
  unit: string;
}

interface WorkOrder {
  id: string;
  number: string;
  asset: string;
  location: string;
  type: 'preventive' | 'corrective' | 'predictive' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: { initials: string; name: string; color: string };
  dueDate: string;
  status: 'in-progress' | 'pending' | 'overdue';
}

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ───
const kpiData: KpiData[] = [
  { label: 'Completed WO', value: '1,247', change: '+12%', trend: 'up', icon: CheckCircle2, color: 'emerald' },
  { label: 'Open Work Orders', value: '42', change: '+3', trend: 'down', icon: Wrench, color: 'sky' },
  { label: 'Overdue Tasks', value: '15', change: '+8', trend: 'down', icon: AlertTriangle, color: 'amber' },
  { label: 'Tech Utilization', value: '87%', change: '+4%', trend: 'up', icon: Users, color: 'violet' },
  { label: 'Stock Alerts', value: '3', change: '+3', trend: 'down', icon: Package, color: 'rose' },
  { label: 'MTD Revenue', value: '$284K', change: '+8.4%', trend: 'up', icon: DollarSign, color: 'emerald' },
];

const technicians: Technician[] = [
  { id: '1', initials: 'AK', name: 'Ahmed Khalil', status: 'active', currentWo: 'WO-2841', task: 'HVAC Preventive Maintenance — Building A', progress: 72, avatarColor: 'bg-emerald-100 text-emerald-700' },
  { id: '2', initials: 'SM', name: 'Sarah Mansour', status: 'active', currentWo: 'WO-2843', task: 'Electrical Panel Inspection — Warehouse 2', progress: 45, avatarColor: 'bg-sky-100 text-sky-700' },
  { id: '3', initials: 'YO', name: 'Youssef Omar', status: 'idle', task: 'Waiting for next assignment — Zone C', progress: 0, avatarColor: 'bg-amber-100 text-amber-700' },
  { id: '4', initials: 'LN', name: 'Layla Nasser', status: 'offduty', task: 'Shift ends 6:00 PM — Returns tomorrow 8:00 AM', progress: 0, avatarColor: 'bg-slate-200 text-slate-600' },
];

const inventoryAlerts: InventoryAlert[] = [
  { id: '1', item: 'Hydraulic Oil VG 46', currentStock: 2, minThreshold: 10, severity: 'critical', unit: 'units' },
  { id: '2', item: 'Bearing SKF 6205-2RS', currentStock: 5, minThreshold: 8, severity: 'warning', unit: 'units' },
  { id: '3', item: 'Filter Element P-100', currentStock: 4, minThreshold: 6, severity: 'warning', unit: 'units' },
];

const workOrders: WorkOrder[] = [
  { id: '1', number: 'WO-2841', asset: 'HVAC Unit A-12', location: 'Building A, Floor 3', type: 'preventive', priority: 'medium', assignedTo: { initials: 'AK', name: 'Ahmed K.', color: 'bg-emerald-100 text-emerald-700' }, dueDate: 'Today, 4:00 PM', status: 'in-progress' },
  { id: '2', number: 'WO-2843', asset: 'Electrical Panel EP-07', location: 'Warehouse 2', type: 'corrective', priority: 'high', assignedTo: { initials: 'SM', name: 'Sarah M.', color: 'bg-sky-100 text-sky-700' }, dueDate: 'Today, 6:00 PM', status: 'in-progress' },
  { id: '3', number: 'WO-2845', asset: 'Conveyor Belt C-03', location: 'Production Line 1', type: 'emergency', priority: 'critical', assignedTo: { initials: 'YO', name: 'Youssef O.', color: 'bg-amber-100 text-amber-700' }, dueDate: 'Overdue 2h', status: 'overdue' },
  { id: '4', number: 'WO-2846', asset: 'Pump P-201', location: 'Water Treatment', type: 'predictive', priority: 'low', dueDate: 'Tomorrow, 9:00 AM', status: 'pending' },
  { id: '5', number: 'WO-2847', asset: 'Generator G-01', location: 'Backup Power Room', type: 'preventive', priority: 'medium', dueDate: 'Jul 20, 2:00 PM', status: 'pending' },
];

const notifications: Notification[] = [
  { id: '1', type: 'alert', title: 'WO-2845 Overdue', message: 'Conveyor Belt C-03 repair is 2 hours past due. Immediate action required.', time: '15 min ago', read: false },
  { id: '2', type: 'success', title: 'WO-2839 Completed', message: 'HVAC Unit B-05 preventive maintenance completed by Sarah Mansour.', time: '1 hr ago', read: false },
  { id: '3', type: 'info', title: 'New PO Approved', message: 'Purchase Order PO-892 for hydraulic oil approved by procurement.', time: '2 hrs ago', read: true },
  { id: '4', type: 'alert', title: 'Asset Alert', message: 'Vibration sensor on Pump P-201 detected anomaly. Schedule inspection.', time: '3 hrs ago', read: true },
  { id: '5', type: 'info', title: 'Shift Change', message: 'Night shift technicians checked in. 6 personnel on duty.', time: '5 hrs ago', read: true },
];

// ─── Helper Components ───

const StatusDot = ({ status, pulse = false }: { status: 'active' | 'idle' | 'offduty'; pulse?: boolean }) => {
  const colors = {
    active: 'bg-emerald-500',
    idle: 'bg-amber-400',
    offduty: 'bg-slate-300',
  };
  return (
    <span className={cn('h-2.5 w-2.5 rounded-full border-2 border-white', colors[status], pulse && status === 'active' && 'animate-pulse')} />
  );
};

const PriorityBadge = ({ priority }: { priority: WorkOrder['priority'] }) => {
  const config = {
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Low' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Medium' },
    high: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'High' },
    critical: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Critical' },
  };
  const c = config[priority];
  return <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', c.bg, c.text)}>{c.label}</span>;
};

const TypeBadge = ({ type }: { type: WorkOrder['type'] }) => {
  const config = {
    preventive: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Preventive' },
    corrective: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Corrective' },
    predictive: { bg: 'bg-violet-50', text: 'text-violet-700', label: 'Predictive' },
    emergency: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Emergency' },
  };
  const c = config[type];
  return <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', c.bg, c.text)}>{c.label}</span>;
};

const WoStatusBadge = ({ status }: { status: WorkOrder['status'] }) => {
  const config = {
    'in-progress': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'In Progress' },
    pending: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Pending' },
    overdue: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Overdue' },
  };
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium', c.bg, c.text)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot, status === 'in-progress' && 'animate-pulse')} />
      {c.label}
    </span>
  );
};

// ─── Charts (using simple SVG for zero-dependency approach, replace with Recharts/Chart.js in production) ───

const MiniSparkline = ({ data, color = 'emerald' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const colorMap: Record<string, string> = {
    emerald: '#10b981',
    sky: '#0ea5e9',
    amber: '#f59e0b',
    rose: '#f43f5e',
    violet: '#8b5cf6',
  };

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-24">
      <polyline
        fill="none"
        stroke={colorMap[color] || color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const BarChartMini = () => {
  const bars = [35, 52, 45, 60, 48, 72, 55, 68, 80, 62, 75, 58, 70, 85, 65, 78, 90, 72, 88, 95, 70, 82, 76, 68, 85, 92, 78, 88, 82, 90];
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-[2px] h-16 w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          style={{ height: `${(h / max) * 100}%` }}
          title={`Day ${i + 1}: ${h} orders`}
        />
      ))}
    </div>
  );
};

const DonutChart = () => {
  const segments = [
    { label: 'Preventive', value: 45, color: '#10b981' },
    { label: 'Corrective', value: 32, color: '#0ea5e9' },
    { label: 'Predictive', value: 15, color: '#f59e0b' },
    { label: 'Emergency', value: 8, color: '#f43f5e' },
  ];

  let cumulative = 0;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-40 w-40 mx-auto">
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
        {segments.map((seg) => {
          const strokeDasharray = `${(seg.value / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -cumulative * circumference;
          cumulative += seg.value / 100;
          return (
            <circle
              key={seg.label}
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="5"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">1,304</span>
        <span className="text-[10px] text-slate-500">Total WO</span>
      </div>
    </div>
  );
};

// ─── Main Dashboard Component ───

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'pending'>('all');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [techProgress, setTechProgress] = useState<Record<string, number>>({ '1': 72, '2': 45 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate live data updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTechProgress((prev) => ({
        ...prev,
        '1': Math.min(100, (prev['1'] || 0) + Math.random() * 2),
        '2': Math.min(100, (prev['2'] || 0) + Math.random() * 1.5),
      }));
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const filteredWO = workOrders.filter((wo) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return wo.status === 'in-progress';
    if (activeTab === 'pending') return wo.status === 'pending';
    return true;
  });

  const sparklineData = [30, 45, 38, 52, 48, 60, 55, 70, 65, 78, 72, 85];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-14 items-center px-4 lg:px-6 gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">EMMS</span>
            <span className="text-xs text-slate-400 font-medium hidden md:block">Operations Command Center</span>
          </div>
          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search work orders, assets, technicians..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-100 border-0 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">OM</div>
              <span className="text-sm font-medium hidden md:block">Operations Manager</span>
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col pt-14 lg:pt-0">
            <nav className="flex-1 space-y-0.5 p-3">
              <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-slate-900 text-white">
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <Wrench className="h-5 w-5 shrink-0" />
                <span>Work Orders</span>
                <Badge variant="secondary" className="ml-auto bg-rose-100 text-rose-700 hover:bg-rose-100">12</Badge>
              </Link>
              <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <Users className="h-5 w-5 shrink-0" />
                <span>Technicians</span>
              </Link>
              <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <Package className="h-5 w-5 shrink-0" />
                <span>Inventory</span>
                <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-100">3</Badge>
              </Link>
              <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <BarChart3 className="h-5 w-5 shrink-0" />
                <span>Analytics</span>
              </Link>
              <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <Settings className="h-5 w-5 shrink-0" />
                <span>Settings</span>
              </Link>
            </nav>
            <div className="border-t border-slate-200 p-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-slate-600">System Status</span>
                </div>
                <div className="text-xs text-slate-500">All services operational</div>
                <div className="mt-2 h-1 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full w-[97%] rounded-full bg-emerald-500" />
                </div>
                <div className="mt-1 text-[10px] text-slate-400">Uptime 97.3%</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operations Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Real-time overview of maintenance operations</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Last updated: {lastUpdated}</span>
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <Button size="sm" className="gap-1.5 bg-slate-900 hover:bg-slate-800">
                <Plus className="h-3.5 w-3.5" />
                New Work Order
              </Button>
            </div>
          </div>

          {/* ─── KPI CARDS ─── */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
            {kpiData.map((kpi, i) => {
              const Icon = kpi.icon;
              const colorMap: Record<string, string> = {
                emerald: 'bg-emerald-50 text-emerald-600',
                sky: 'bg-sky-50 text-sky-600',
                amber: 'bg-amber-50 text-amber-600',
                violet: 'bg-violet-50 text-violet-600',
                rose: 'bg-rose-50 text-rose-600',
              };
              const trendColor = kpi.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : kpi.trend === 'down' ? 'text-rose-700 bg-rose-50' : 'text-slate-600 bg-slate-100';
              const TrendIcon = kpi.trend === 'up' ? ChevronUp : ChevronDown;

              return (
                <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={cn('rounded-lg p-2', colorMap[kpi.color])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium', trendColor)}>
                        <TrendIcon className="h-3 w-3" />
                        {kpi.change}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                      <div className="text-xs text-slate-500">{kpi.label}</div>
                    </div>
                    <div className="mt-2">
                      <MiniSparkline data={sparklineData} color={kpi.color} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ─── CHARTS ROW ─── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Work Order Trends */}
            <Card className="xl:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Work Order Trends</CardTitle>
                    <CardDescription>Completed vs Open vs Overdue — Last 30 Days</CardDescription>
                  </div>
                  <select className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>This Quarter</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-48 w-full">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const completed = 30 + Math.random() * 50;
                    const open = 10 + Math.random() * 20;
                    const overdue = Math.random() * 8;
                    const max = 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end gap-[1px] group relative">
                        <div
                          className="w-full rounded-t-sm bg-emerald-400 hover:bg-emerald-500 transition-colors"
                          style={{ height: `${(completed / max) * 100}%` }}
                        />
                        <div
                          className="w-full bg-sky-400 hover:bg-sky-500 transition-colors"
                          style={{ height: `${(open / max) * 100}%` }}
                        />
                        <div
                          className="w-full rounded-b-sm bg-rose-400 hover:bg-rose-500 transition-colors"
                          style={{ height: `${(overdue / max) * 100}%` }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                          Day {i + 1}: {Math.round(completed)} completed
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />Completed</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sky-400" />Open</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-rose-400" />Overdue</span>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Type Breakdown */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Maintenance Breakdown</CardTitle>
                <CardDescription>By work order type</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: 'Preventive', value: '45%', color: 'bg-emerald-500' },
                    { label: 'Corrective', value: '32%', color: 'bg-sky-500' },
                    { label: 'Predictive', value: '15%', color: 'bg-amber-500' },
                    { label: 'Emergency', value: '8%', color: 'bg-rose-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                      <span className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
                      <span className="text-slate-600">{item.label}</span>
                      <span className="ml-auto font-semibold text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── MIDDLE ROW: TECH STATUS + INVENTORY ALERTS ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Technician Status */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Technician Status</CardTitle>
                    <CardDescription>Live field activity</CardDescription>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />Active</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />Idle</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" />Off Duty</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {technicians.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <div className="relative shrink-0">
                      <div className={cn('h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm', tech.avatarColor)}>
                        {tech.initials}
                      </div>
                      <StatusDot status={tech.status} pulse={tech.status === 'active'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 truncate">{tech.name}</p>
                        {tech.currentWo ? (
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {tech.currentWo}
                          </Badge>
                        ) : tech.status === 'idle' ? (
                          <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 hover:bg-amber-50 shrink-0">Available</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 hover:bg-slate-100 shrink-0">Off Duty</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{tech.task}</p>
                      {tech.status === 'active' && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                              style={{ width: `${techProgress[tech.id] || tech.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 w-8 text-right">
                            {Math.round(techProgress[tech.id] || tech.progress)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs h-8">View All 14 Technicians</Button>
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Inventory Alerts</CardTitle>
                    <CardDescription>Critical stock levels requiring action</CardDescription>
                  </div>
                  <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">3 Critical</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {inventoryAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'rounded-lg border p-3',
                      alert.severity === 'critical'
                        ? 'border-rose-200 bg-rose-50/50'
                        : 'border-amber-200 bg-amber-50/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'mt-0.5 rounded-full p-1.5 shrink-0',
                        alert.severity === 'critical' ? 'bg-rose-100' : 'bg-amber-100'
                      )}>
                        <AlertTriangle className={cn(
                          'h-4 w-4',
                          alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            'text-sm font-semibold',
                            alert.severity === 'critical' ? 'text-rose-800' : 'text-amber-800'
                          )}>
                            {alert.item}
                          </p>
                          <span className={cn(
                            'text-xs font-bold',
                            alert.severity === 'critical' ? 'text-rose-700' : 'text-amber-700'
                          )}>
                            {alert.currentStock} {alert.unit}
                          </span>
                        </div>
                        <p className={cn(
                          'text-xs mt-0.5',
                          alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-700'
                        )}>
                          {alert.severity === 'critical'
                            ? `Below minimum threshold (${alert.minThreshold} ${alert.unit}). Reorder immediately.`
                            : `Approaching minimum threshold (${alert.minThreshold} ${alert.unit}). Reorder soon.`}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className={cn(
                            'flex-1 h-1.5 rounded-full overflow-hidden',
                            alert.severity === 'critical' ? 'bg-rose-200' : 'bg-amber-200'
                          )}>
                            <div
                              className={cn(
                                'h-full rounded-full',
                                alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                              )}
                              style={{ width: `${(alert.currentStock / alert.minThreshold) * 100}%` }}
                            />
                          </div>
                          <span className={cn(
                            'text-[10px] font-medium',
                            alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-700'
                          )}>
                            {Math.round((alert.currentStock / alert.minThreshold) * 100)}%
                          </span>
                        </div>
                        {alert.severity === 'critical' && (
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700">Create PO</Button>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] border-rose-300 text-rose-700 hover:bg-rose-50">Snooze</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-xs h-8">View Full Inventory</Button>
              </CardContent>
            </Card>
          </div>

          {/* ─── BOTTOM ROW: ACTIVE WORK ORDERS + NOTIFICATIONS + REVENUE ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Active Work Orders */}
            <Card className="lg:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Active Work Orders</CardTitle>
                    <CardDescription>Currently in progress or pending assignment</CardDescription>
                  </div>
                  <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
                    {(['all', 'in-progress', 'pending'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                          activeTab === tab
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        {tab === 'in-progress' ? 'In Progress' : tab}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-5 px-5">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">WO #</th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Asset</th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Priority</th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Assigned</th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Due</th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredWO.map((wo) => (
                        <tr key={wo.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-mono text-xs font-medium text-slate-700">{wo.number}</td>
                          <td className="py-3">
                            <div className="font-medium text-slate-900">{wo.asset}</div>
                            <div className="text-xs text-slate-500">{wo.location}</div>
                          </td>
                          <td className="py-3"><TypeBadge type={wo.type} /></td>
                          <td className="py-3"><PriorityBadge priority={wo.priority} /></td>
                          <td className="py-3">
                            {wo.assignedTo ? (
                              <div className="flex items-center gap-2">
                                <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold', wo.assignedTo.color)}>
                                  {wo.assignedTo.initials}
                                </div>
                                <span className="text-xs text-slate-600">{wo.assignedTo.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className={cn('py-3 text-xs', wo.status === 'overdue' ? 'font-semibold text-rose-600' : 'text-slate-600')}>
                            {wo.dueDate}
                          </td>
                          <td className="py-3"><WoStatusBadge status={wo.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">Showing {filteredWO.length} of 42 active work orders</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled>Prev</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Notifications */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Notifications</CardTitle>
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-700">Mark all read</button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0 max-h-[280px] overflow-y-auto scrollbar-hide pr-1">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          'flex gap-3 py-3 border-b border-slate-50 last:border-0',
                          !notif.read && 'bg-slate-50/50 -mx-5 px-5'
                        )}
                      >
                        <div className={cn(
                          'mt-0.5 h-2 w-2 rounded-full shrink-0',
                          notif.type === 'alert' ? 'bg-rose-500' : notif.type === 'success' ? 'bg-emerald-500' : 'bg-sky-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium', !notif.read ? 'text-slate-900' : 'text-slate-600')}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Card */}
              <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Month-to-Date Revenue</p>
                      <p className="text-3xl font-bold mt-1">$284,520</p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/20 p-2">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      <ChevronUp className="h-3 w-3" />8.4%
                    </span>
                    <span className="text-xs text-slate-400">vs last month</span>
                  </div>
                  <Separator className="my-4 bg-slate-700" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Labor</p>
                      <p className="text-sm font-semibold mt-0.5">$142,260</p>
                      <div className="mt-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full w-[50%] rounded-full bg-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Parts & Materials</p>
                      <p className="text-sm font-semibold mt-0.5">$98,583</p>
                      <div className="mt-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full w-[35%] rounded-full bg-sky-400" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Overhead</p>
                    <p className="text-sm font-semibold mt-0.5">$43,677</p>
                    <div className="mt-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full w-[15%] rounded-full bg-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Avg. Resolution Time</span>
                    <span className="text-sm font-semibold text-slate-900">4.2 hrs</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">First-Time Fix Rate</span>
                    <span className="text-sm font-semibold text-slate-900">91%</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[91%] rounded-full bg-sky-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Planned vs Unplanned</span>
                    <span className="text-sm font-semibold text-slate-900">72:28</span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-violet-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
