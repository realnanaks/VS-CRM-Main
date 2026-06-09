import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Search, 
  Target, 
  Heart, 
  FileText, 
  MessageCircle, 
  Brain, 
  Network, 
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { AppView } from '../../types';

interface AIIntelligenceHubProps {
  onViewChange: (view: AppView) => void;
}

interface AIModule {
  id: AppView;
  name: string;
  description: string;
  category: 'insights' | 'operations' | 'platform';
  icon: React.ComponentType<any>;
  color: string;
  tags: string[];
  status: 'Ready' | 'Beta' | 'New';
}

const AI_MODULES: AIModule[] = [
  {
    id: 'advisor',
    name: 'Visionary Space AI',
    description: 'Conversational marketing strategist for campaign advice, copy reviews, and performance consulting.',
    category: 'platform',
    icon: Bot,
    color: 'from-blue-500 to-indigo-500',
    tags: ['Chatbot', 'Consulting', 'Gemini'],
    status: 'Ready'
  },
  {
    id: 'ai_predictive',
    name: 'Predictive Analytics',
    description: 'Forecast campaign reach, engagement rates, ROI, and run client churn risk modeling.',
    category: 'insights',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    tags: ['Forecasting', 'Churn Risk', 'ROI'],
    status: 'Ready'
  },
  {
    id: 'ai_content',
    name: 'Content Intelligence',
    description: 'Optimize social copies, newsletter drafts, and event announcements using advanced copy scoring.',
    category: 'operations',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    tags: ['Copywriting', 'SEO', 'Generative'],
    status: 'Ready'
  },
  {
    id: 'ai_automation',
    name: 'Smart Automation',
    description: 'Generate flow recommendations, automated workflows, and customer journeys.',
    category: 'operations',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    tags: ['Workflows', 'Triggers', 'Efficiency'],
    status: 'Beta'
  },
  {
    id: 'ai_query',
    name: 'Natural Language Query',
    description: 'Ask complex database questions in plain English and retrieve filtered reports instantly.',
    category: 'insights',
    icon: Search,
    color: 'from-sky-500 to-indigo-500',
    tags: ['Search', 'SQL', 'Data Retrieval'],
    status: 'Ready'
  },
  {
    id: 'ai_competitive',
    name: 'Competitive Intelligence',
    description: 'Monitor competitor share of voice, benchmark campaigns, and identify market opportunities.',
    category: 'insights',
    icon: Target,
    color: 'from-rose-500 to-red-500',
    tags: ['Competitors', 'Market Analysis', 'Insights'],
    status: 'Beta'
  },
  {
    id: 'ai_clients',
    name: 'Client Intelligence',
    description: 'Evaluate client happiness scores, track feedback sentiment, and receive health indicators.',
    category: 'insights',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    tags: ['Client Health', 'Sentiment', 'Feedback'],
    status: 'Ready'
  },
  {
    id: 'ai_documents',
    name: 'Document Processing',
    description: 'Ingest and classify invoice scans, client briefs, and contracts to auto-populate CRM records.',
    category: 'operations',
    icon: FileText,
    color: 'from-violet-500 to-fuchsia-500',
    tags: ['OCR', 'PDF Ingestion', 'Classification'],
    status: 'Ready'
  },
  {
    id: 'ai_reporting',
    name: 'Conversational Reports',
    description: 'Build fully customized executive summaries, country metrics, and campaign reports via dialogue.',
    category: 'operations',
    icon: MessageCircle,
    color: 'from-indigo-500 to-purple-500',
    tags: ['Report Builder', 'PDF Export', 'Executive'],
    status: 'New'
  },
  {
    id: 'ai_training',
    name: 'AI Training Center',
    description: 'Upload local documents and PDFs to specialize your AI assistant on custom client knowledge.',
    category: 'platform',
    icon: Brain,
    color: 'from-cyan-500 to-blue-500',
    tags: ['RAG', 'Knowledge Base', 'Fine-Tuning'],
    status: 'Ready'
  },
  {
    id: 'ai_agents',
    name: 'Multi-Agent System',
    description: 'Orchestrate a swarm of digital workers (e.g., researcher, copywriter, auditor) to execute joint campaigns.',
    category: 'platform',
    icon: Network,
    color: 'from-violet-600 to-indigo-700',
    tags: ['Agent Swarms', 'Automation', 'Complex Tasks'],
    status: 'New'
  }
];

export default function AIIntelligenceHub({ onViewChange }: AIIntelligenceHubProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'insights' | 'operations' | 'platform'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = AI_MODULES.filter(module => {
    const matchesTab = activeTab === 'all' || module.category === activeTab;
    const matchesSearch = 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Modules' },
    { id: 'insights', name: 'Strategic & Analytical Insights' },
    { id: 'operations', name: 'Operations & Content' },
    { id: 'platform', name: 'AI Core & Platform' }
  ] as const;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-xl">
        {/* Background shapes */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 -mb-12 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/30 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkle size={12} className="animate-spin-slow" />
            Empowering Echo House with Agentic Intelligence
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            AI Business Intelligence Hub
          </h1>
          <p className="text-lg text-slate-300">
            Access, configure, and orchestrate all artificial intelligence and analytical models across operations.
          </p>
        </div>
      </div>

      {/* Controls: Category Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === category.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search AI modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredModules.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map(module => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => onViewChange(module.id)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Upper row: Icon & Status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${module.color} text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                      module.status === 'Ready' 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10'
                        : module.status === 'Beta'
                        ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10'
                        : 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10'
                    }`}>
                      {module.status}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Lower row: Tags & Action */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {module.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-200">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <div className="rounded-full bg-slate-100 p-3 text-slate-400 mb-3">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No AI modules found</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            We couldn't find any matching tools. Try adjusting your search query or switching categories.
          </p>
        </div>
      )}
    </div>
  );
}
