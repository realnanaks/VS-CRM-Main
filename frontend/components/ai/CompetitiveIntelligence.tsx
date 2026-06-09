import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, Lightbulb, Plus, BarChart3 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { mockCompetitors, mockOpportunities } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function CompetitiveIntelligence() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const benchmarkData = [
    { metric: 'Market Share', us: 20, competitor1: 22, competitor2: 18 },
    { metric: 'Client Satisfaction', us: 85, competitor1: 72, competitor2: 68 },
    { metric: 'Service Quality', us: 88, competitor1: 75, competitor2: 80 },
    { metric: 'Innovation', us: 82, competitor1: 78, competitor2: 65 },
    { metric: 'Pricing', us: 75, competitor1: 85, competitor2: 90 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Competitive Intelligence</h1>
          <p className="text-slate-500 mt-1">AI-powered market and competitor analysis</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Add Competitor
        </Button>
      </div>

      {/* Market Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Our Position</span>
          </div>
          <h3 className="text-2xl font-bold">20%</h3>
          <p className="text-blue-100 text-sm mt-1">Market Share</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+5%</span>
          </div>
          <h3 className="text-2xl font-bold">72/100</h3>
          <p className="text-purple-100 text-sm mt-1">Market Sentiment</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Lightbulb size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-2xl font-bold">2</h3>
          <p className="text-emerald-100 text-sm mt-1">Opportunities</p>
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Competitor Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Competitor</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Market Share</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Sentiment</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Recent Activity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Threat Level</th>
              </tr>
            </thead>
            <tbody>
              {mockCompetitors.map((competitor) => (
                <tr 
                  key={competitor.id}
                  className={cn(
                    "border-b border-slate-100 cursor-pointer transition-colors",
                    selectedCompetitor === competitor.id ? "bg-indigo-50" : "hover:bg-slate-50"
                  )}
                  onClick={() => setSelectedCompetitor(selectedCompetitor === competitor.id ? null : competitor.id)}
                >
                  <td className="py-3 px-4 font-medium text-slate-900">{competitor.name}</td>
                  <td className="py-3 px-4 text-slate-600">{competitor.marketShare}%</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{ width: `${competitor.sentiment}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{competitor.sentiment}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{competitor.recentActivity}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getThreatColor(competitor.threat))}>
                      {competitor.threat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benchmarking Radar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Competitive Benchmarking</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={benchmarkData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
            <Radar name="Us" dataKey="us" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
            <Radar name="MediaMax" dataKey="competitor1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
            <Radar name="Creative Hub" dataKey="competitor2" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Market Opportunities */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lightbulb size={24} />
          Market Opportunities
        </h2>
        <div className="space-y-4">
          {mockOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-1 h-8 rounded-full", getPriorityColor(opportunity.priority))} />
                    <div>
                      <h3 className="font-semibold text-slate-900">{opportunity.title}</h3>
                      <p className="text-sm text-emerald-600 font-medium mt-1">{opportunity.potential}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 ml-7">{opportunity.description}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium capitalize",
                  opportunity.priority === 'high' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                )}>
                  {opportunity.priority} priority
                </span>
              </div>
              <div className="ml-7 mt-3 pt-3 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">💡 Recommended Action:</p>
                <p className="text-sm text-slate-600">{opportunity.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Alerts */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={24} className="text-orange-500" />
          Threat Alerts
        </h2>
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">MediaMax Expansion</h3>
                <p className="text-sm text-orange-800 mb-2">
                  Competitor expanded to 3 new countries, increasing market pressure in our key regions.
                </p>
                <p className="text-xs text-orange-700">Detected 2 days ago</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Price Competition</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  Brand Builders Ltd reduced prices by 15% on core services, potentially affecting our pricing strategy.
                </p>
                <p className="text-xs text-yellow-700">Detected 5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
