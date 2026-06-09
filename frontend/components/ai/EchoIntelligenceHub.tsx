import React from 'react';
import { TrendingUp, Sparkles, Zap, MessageCircle, Target, Heart, FileText, BarChart3, Brain, Users, ArrowRight, Clock, CheckCircle, Lightbulb } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AIFeature {
  id: string;
  name: string;
  icon: React.ElementType;
  explainer: string;
  subtitle: string;
  color: string;
  bgColor: string;
  stat?: string;
  view: string;
}

const aiFeatures: AIFeature[] = [
  {
    id: 'forecast',
    name: 'Echo Forecast',
    icon: TrendingUp,
    explainer: 'Predict campaign success, event attendance, and revenue before you launch',
    subtitle: 'See the future of your marketing',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    stat: '92% accuracy',
    view: 'ai_predictive'
  },
  {
    id: 'creator',
    name: 'Echo Creator',
    icon: Sparkles,
    explainer: 'Generate event descriptions, social posts, and campaign copy in seconds',
    subtitle: 'Your AI copywriter for events & campaigns',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    stat: '47 pieces created',
    view: 'ai_content'
  },
  {
    id: 'autopilot',
    name: 'Echo Autopilot',
    icon: Zap,
    explainer: 'Automate follow-ups, lead nurturing, and event reminders intelligently',
    subtitle: 'Set it and forget it - AI handles the rest',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    stat: '23 hours saved',
    view: 'ai_automation'
  },
  {
    id: 'chat',
    name: 'Echo Ask',
    icon: MessageCircle,
    explainer: 'Ask questions about your data in plain English - no tech skills needed',
    subtitle: 'Talk to your data like a colleague',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    stat: '156 queries today',
    view: 'ai_query'
  },
  {
    id: 'radar',
    name: 'Echo Radar',
    icon: Target,
    explainer: 'Track competitor events, pricing, and campaigns in real-time',
    subtitle: 'Stay ahead of the competition',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    stat: '5 competitors tracked',
    view: 'ai_competitive'
  },
  {
    id: 'pulse',
    name: 'Echo Pulse',
    icon: Heart,
    explainer: 'Understand attendee behavior, preferences, and lifetime value',
    subtitle: 'Know your audience inside out',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    stat: '8 segments found',
    view: 'ai_clients'
  },
  {
    id: 'scanner',
    name: 'Echo Scanner',
    icon: FileText,
    explainer: 'Extract data from contracts, invoices, and event documents automatically',
    subtitle: 'Turn paperwork into insights instantly',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    stat: '12 docs processed',
    view: 'ai_documents'
  },
  {
    id: 'insights',
    name: 'Echo Insights',
    icon: BarChart3,
    explainer: 'Chat with AI to generate custom reports and visualizations on demand',
    subtitle: 'Reports that answer your questions',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    stat: '34 reports created',
    view: 'ai_reporting'
  },
  {
    id: 'trainer',
    name: 'Echo Trainer',
    icon: Brain,
    explainer: 'Teach Echo AI your brand voice, terminology, and preferences',
    subtitle: 'Make AI smarter about your business',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    stat: '91% trained',
    view: 'ai_training'
  },
  {
    id: 'experts',
    name: 'Echo Experts',
    icon: Users,
    explainer: 'Specialized AI assistants for campaigns, sales, events, and analytics',
    subtitle: 'Your team of AI specialists',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    stat: '5 experts available',
    view: 'ai_agents'
  }
];

const recentActivity = [
  {
    id: 1,
    feature: 'Echo Forecast',
    message: 'Predicted 85% attendance for Summer Music Fest',
    time: '5 min ago',
    icon: TrendingUp,
    color: 'text-indigo-600'
  },
  {
    id: 2,
    feature: 'Echo Creator',
    message: 'Generated 5 social posts for Spring Campaign',
    time: '12 min ago',
    icon: Sparkles,
    color: 'text-purple-600'
  },
  {
    id: 3,
    feature: 'Echo Pulse',
    message: 'Identified 12 high-value customers at risk',
    time: '1 hour ago',
    icon: Heart,
    color: 'text-pink-600'
  },
  {
    id: 4,
    feature: 'Echo Autopilot',
    message: 'Sent 47 personalized follow-up emails',
    time: '2 hours ago',
    icon: Zap,
    color: 'text-yellow-600'
  }
];

export default function EchoIntelligenceHub() {
  const handleFeatureClick = (view: string) => {
    window.location.hash = view;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Compact Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={24} className="animate-pulse" />
              <h1 className="text-2xl font-bold tracking-tight">Echo Intelligence Studio</h1>
            </div>
            <p className="text-sm text-indigo-100 max-w-xl">
              Your AI-powered marketing & events brain. Predict, create, automate, and analyze.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
              <div className="text-xl font-bold">23h</div>
              <div className="text-xs text-indigo-100">Saved</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
              <div className="text-xl font-bold">91%</div>
              <div className="text-xs text-indigo-100">Accuracy</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
              <div className="text-xl font-bold">156</div>
              <div className="text-xs text-indigo-100">Predictions</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* AI Features Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">AI Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.view)}
                className="group relative bg-white rounded-lg border-2 border-slate-200 p-4 text-left transition-all duration-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", feature.bgColor)}>
                  <Icon className={feature.color} size={24} />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 mb-1">{feature.name}</h3>
                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{feature.explainer}</p>

                {/* Stat */}
                {feature.stat && (
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn("text-xs font-semibold", feature.color)}>{feature.stat}</span>
                    <ArrowRight className="text-slate-400 group-hover:text-indigo-600 transition-all" size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Activity Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <Clock className="text-slate-400" size={18} />
        </div>
        <div className="space-y-2">
          {recentActivity.slice(0, 3).map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className={activity.color} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 truncate">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
                <CheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
