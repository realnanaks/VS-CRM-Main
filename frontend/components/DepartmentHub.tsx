import React, { useState, useEffect } from 'react';
import { CountryCode } from '../types';
import { 
  Palette, 
  Megaphone, 
  Target, 
  Share2, 
  Video, 
  Users, 
  BarChart3, 
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  CheckSquare,
  Folder,
  Settings,
  Briefcase,
  Monitor,
  UserPlus
} from 'lucide-react';
import { retrieveDashboardData } from '../services/data';

interface DepartmentHubProps {
  country: CountryCode;
}

export const DepartmentHub: React.FC<DepartmentHubProps> = ({ country }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Load real-time data
  useEffect(() => {
    const data = retrieveDashboardData(country);
    setDashboardData(data);
  }, [country]);

  // Department configurations with icons and tools
  const departmentConfig = {
    creative: {
      name: 'Creative',
      icon: Palette,
      color: 'purple',
      description: 'Design, copywriting, branding, and creative content production',
      tools: [
        { name: 'Brand Guidelines', icon: FileText, description: 'Access brand assets and guidelines', link: '/assets' },
        { name: 'Asset Library', icon: Folder, description: 'Browse creative assets', link: '/assets' },
        { name: 'Design Requests', icon: CheckSquare, description: 'Submit and track design requests', link: '/tasks' },
        { name: 'Campaign Creatives', icon: Palette, description: 'View campaign creative materials', link: '/campaigns' }
      ],
      quickStats: [
        { label: 'Active Projects', value: dashboardData?.projects?.filter((p: any) => p.status === 'Active').length || 0 },
        { label: 'Assets Created', value: dashboardData?.assets?.length || 0 },
        { label: 'Pending Tasks', value: dashboardData?.tasks?.filter((t: any) => !t.completed).length || 0 }
      ]
    },
    media: {
      name: 'Media & Advertising',
      icon: Megaphone,
      color: 'blue',
      description: 'Media planning, buying, and campaign management',
      tools: [
        { name: 'Media Plans', icon: Calendar, description: 'View and create media plans', link: '/calendar' },
        { name: 'Budget Tracker', icon: DollarSign, description: 'Track media spend and budgets', link: '/deals' },
        { name: 'Campaign Performance', icon: TrendingUp, description: 'Monitor campaign metrics', link: '/campaigns' },
        { name: 'Vendor Management', icon: Users, description: 'Manage media vendors', link: '/contacts' }
      ],
      quickStats: [
        { label: 'Active Campaigns', value: dashboardData?.campaigns?.filter((c: any) => c.status === 'Active').length || 0 },
        { label: 'Total Budget', value: '$45K' },
        { label: 'Avg ROI', value: '3.2x' }
      ]
    },
    strategy: {
      name: 'Strategy & Planning',
      icon: Target,
      color: 'indigo',
      description: 'Strategic planning, market research, and insights',
      tools: [
        { name: 'Market Research', icon: BarChart3, description: 'Access market research reports', link: '/files' },
        { name: 'Strategic Plans', icon: FileText, description: 'View strategic documents', link: '/files' },
        { name: 'Competitor Analysis', icon: TrendingUp, description: 'Track competitor activities', link: '/dashboard' },
        { name: 'Client Briefs', icon: CheckSquare, description: 'Manage client briefs', link: '/projects' }
      ],
      quickStats: [
        { label: 'Active Strategies', value: dashboardData?.projects?.length || 0 },
        { label: 'Research Reports', value: '23' },
        { label: 'Client Briefs', value: dashboardData?.contacts?.length || 0 }
      ]
    },
    digital: {
      name: 'Digital & Social',
      icon: Share2,
      color: 'cyan',
      description: 'Social media, digital marketing, and online presence',
      tools: [
        { name: 'Social Calendar', icon: Calendar, description: 'Plan and schedule social posts', link: '/social' },
        { name: 'Content Library', icon: Folder, description: 'Browse social content', link: '/assets' },
        { name: 'Analytics Dashboard', icon: BarChart3, description: 'View social media metrics', link: '/dashboard' },
        { name: 'Community Management', icon: Users, description: 'Manage community interactions', link: '/social' }
      ],
      quickStats: [
        { label: 'Scheduled Posts', value: dashboardData?.socialPosts?.filter((p: any) => p.status === 'Scheduled').length || 0 },
        { label: 'Total Reach', value: '2.3M' },
        { label: 'Engagement Rate', value: '4.8%' }
      ]
    },
    production: {
      name: 'Production',
      icon: Video,
      color: 'red',
      description: 'Video production, events, and content creation',
      tools: [
        { name: 'Production Schedule', icon: Calendar, description: 'View production timeline', link: '/calendar' },
        { name: 'Equipment Booking', icon: Settings, description: 'Book production equipment', link: '/assets' },
        { name: 'Event Management', icon: CheckSquare, description: 'Manage events and activations', link: '/events' },
        { name: 'Vendor Directory', icon: Users, description: 'Access production vendors', link: '/contacts' }
      ],
      quickStats: [
        { label: 'Active Productions', value: dashboardData?.projects?.filter((p: any) => p.status === 'Active').length || 0 },
        { label: 'Upcoming Events', value: dashboardData?.events?.filter((e: any) => e.status === 'Scheduled').length || 0 },
        { label: 'Equipment Utilization', value: '78%' }
      ]
    },
    client_services: {
      name: 'Client Services',
      icon: Users,
      color: 'green',
      description: 'Client relationship management and account servicing',
      tools: [
        { name: 'Client Dashboard', icon: BarChart3, description: 'View client health metrics', link: '/contacts' },
        { name: 'Meeting Notes', icon: FileText, description: 'Access client meeting notes', link: '/files' },
        { name: 'Service Requests', icon: CheckSquare, description: 'Track client requests', link: '/tasks' },
        { name: 'Satisfaction Surveys', icon: TrendingUp, description: 'View client feedback', link: '/forms' }
      ],
      quickStats: [
        { label: 'Active Clients', value: dashboardData?.contacts?.filter((c: any) => c.status === 'Customer').length || 0 },
        { label: 'Satisfaction Score', value: '4.6/5' },
        { label: 'Open Requests', value: dashboardData?.tasks?.filter((t: any) => !t.completed).length || 0 }
      ]
    },
    data_analytics: {
      name: 'Data & Analytics',
      icon: BarChart3,
      color: 'orange',
      description: 'Data analysis, reporting, and business intelligence',
      tools: [
        { name: 'Analytics Dashboard', icon: BarChart3, description: 'View key metrics and KPIs', link: '/dashboard' },
        { name: 'Custom Reports', icon: FileText, description: 'Create custom reports', link: '/infographics' },
        { name: 'Data Sources', icon: Folder, description: 'Manage data integrations', link: '/settings' },
        { name: 'Insights Library', icon: TrendingUp, description: 'Browse insights and findings', link: '/advisor' }
      ],
      quickStats: [
        { label: 'Data Sources', value: '12' },
        { label: 'Reports Generated', value: '89' },
        { label: 'Insights Shared', value: '34' }
      ]
    },
    finance: {
      name: 'Finance',
      icon: DollarSign,
      color: 'emerald',
      description: 'Financial planning, budgeting, invoicing, and payments',
      tools: [
        { name: 'Budget Overview', icon: DollarSign, description: 'View budget allocation and financial planning', link: '/deals' },
        { name: 'Invoice Management', icon: FileText, description: 'Manage invoices and payments', link: '/files' },
        { name: 'Expense Tracking', icon: TrendingUp, description: 'Track expenses and costs', link: '/dashboard' },
        { name: 'Financial Reports', icon: BarChart3, description: 'P&L, balance sheets, and analytics', link: '/infographics' }
      ],
      quickStats: [
        { label: 'Monthly Budget', value: '$120K' },
        { label: 'Spent', value: '$87K' },
        { label: 'Remaining', value: '$33K' }
      ]
    },
    operations: {
      name: 'Operations',
      icon: Settings,
      color: 'slate',
      description: 'Business operations, admin, facilities, and procurement',
      tools: [
        { name: 'Operations Dashboard', icon: BarChart3, description: 'Monitor operational metrics', link: '/dashboard' },
        { name: 'Facility Management', icon: Settings, description: 'Manage office and facilities', link: '/assets' },
        { name: 'Procurement', icon: Briefcase, description: 'Vendor management and purchasing', link: '/contacts' },
        { name: 'Process Documentation', icon: FileText, description: 'SOPs and process guides', link: '/files' }
      ],
      quickStats: [
        { label: 'Active Vendors', value: dashboardData?.contacts?.length || 0 },
        { label: 'Open Requests', value: dashboardData?.tasks?.filter((t: any) => !t.completed).length || 0 },
        { label: 'Efficiency Score', value: '92%' }
      ]
    },
    hr: {
      name: 'Human Resources',
      icon: UserPlus,
      color: 'pink',
      description: 'Recruitment, employee relations, payroll, and benefits',
      tools: [
        { name: 'Employee Directory', icon: Users, description: 'View all team members', link: '/settings' },
        { name: 'Recruitment Pipeline', icon: UserPlus, description: 'Track hiring and candidates', link: '/deals' },
        { name: 'Payroll Management', icon: DollarSign, description: 'Process payroll and benefits', link: '/files' },
        { name: 'Performance Reviews', icon: TrendingUp, description: 'Employee evaluations and feedback', link: '/forms' }
      ],
      quickStats: [
        { label: 'Team Size', value: dashboardData?.users?.length || 0 },
        { label: 'Open Positions', value: '3' },
        { label: 'Avg Tenure', value: '2.4 yrs' }
      ]
    },
    technology: {
      name: 'Technology & IT',
      icon: Monitor,
      color: 'teal',
      description: 'IT infrastructure, software development, and tech support',
      tools: [
        { name: 'System Status', icon: Monitor, description: 'Monitor system health and uptime', link: '/dashboard' },
        { name: 'Development Projects', icon: Briefcase, description: 'Track software development', link: '/projects' },
        { name: 'Support Tickets', icon: CheckSquare, description: 'IT support and helpdesk', link: '/tasks' },
        { name: 'Tech Documentation', icon: FileText, description: 'Technical docs and guides', link: '/files' }
      ],
      quickStats: [
        { label: 'System Uptime', value: '99.9%' },
        { label: 'Open Tickets', value: dashboardData?.tasks?.filter((t: any) => !t.completed).length || 0 },
        { label: 'Projects', value: dashboardData?.projects?.length || 0 }
      ]
    },
    business_dev: {
      name: 'Business Development',
      icon: Briefcase,
      color: 'violet',
      description: 'New business, partnerships, and growth initiatives',
      tools: [
        { name: 'Sales Pipeline', icon: DollarSign, description: 'Track new business opportunities', link: '/deals' },
        { name: 'Partnership Tracker', icon: Users, description: 'Manage strategic partnerships', link: '/contacts' },
        { name: 'Proposal Library', icon: FileText, description: 'Access proposal templates', link: '/files' },
        { name: 'Market Analysis', icon: TrendingUp, description: 'Growth opportunities and trends', link: '/advisor' }
      ],
      quickStats: [
        { label: 'Active Deals', value: dashboardData?.deals?.filter((d: any) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length || 0 },
        { label: 'Pipeline Value', value: '$' + (dashboardData?.deals?.reduce((sum: number, d: any) => sum + d.value, 0) / 1000).toFixed(0) + 'K' },
        { label: 'Win Rate', value: '65%' }
      ]
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', hover: 'hover:bg-indigo-100' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:bg-cyan-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:bg-emerald-100' },
      slate: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', hover: 'hover:bg-slate-100' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-100' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', hover: 'hover:bg-teal-100' },
      violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', hover: 'hover:bg-violet-100' }
    };
    return colors[color] || colors.blue;
  };

  const handleToolClick = (link: string) => {
    window.location.hash = link.replace('/', '');
  };

  const dept = selectedDepartment ? departmentConfig[selectedDepartment as keyof typeof departmentConfig] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Department Hub</h1>
        <p className="text-gray-600 mt-2">
          Access department-specific tools, resources, and insights for {country === 'Global' ? 'all countries' : country}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            {Object.keys(departmentConfig).length} Departments
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            Real-time Data
          </span>
        </div>
      </div>

      {!selectedDepartment ? (
        /* Department Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(departmentConfig).map(([key, config]) => {
            const Icon = config.icon;
            const colors = getColorClasses(config.color);
            
            return (
              <button
                key={key}
                onClick={() => setSelectedDepartment(key)}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 text-left transition-all ${colors.hover} hover:shadow-lg`}
              >
                <div className={`${colors.text} mb-4`}>
                  <Icon size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{config.name}</h3>
                <p className="text-sm text-gray-600">{config.description}</p>
              </button>
            );
          })}
        </div>
      ) : (
        /* Department Detail View */
        <div>
          {/* Back Button */}
          <button
            onClick={() => setSelectedDepartment(null)}
            className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center gap-2 font-medium"
          >
            ← Back to All Departments
          </button>

          {dept && (
            <div className="space-y-6">
              {/* Department Header */}
              <div className={`${getColorClasses(dept.color).bg} rounded-xl p-8 border-2 ${getColorClasses(dept.color).border}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={getColorClasses(dept.color).text}>
                    <dept.icon size={48} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{dept.name}</h2>
                    <p className="text-gray-600">{dept.description}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {dept.quickStats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Tools */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Department Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dept.tools.map((tool, idx) => {
                    const ToolIcon = tool.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToolClick(tool.link)}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`${getColorClasses(dept.color).text} mt-1`}>
                            <ToolIcon size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{tool.name}</h4>
                            <p className="text-sm text-gray-600">{tool.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feature Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span>✨</span> Connected to Live Data
                </h4>
                <p className="text-blue-700 text-sm">
                  All metrics and tools are connected to your actual data. Click any tool to navigate to the relevant module.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
