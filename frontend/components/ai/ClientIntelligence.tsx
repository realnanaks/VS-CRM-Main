import React, { useState } from 'react';
import { Heart, TrendingUp, TrendingDown, Minus, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import { mockClientHealth, mockUpsellOpportunities } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function ClientIntelligence() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  const getHealthColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score >= 75) return 'bg-emerald-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-emerald-500" size={20} />;
      case 'down': return <TrendingDown className="text-red-500" size={20} />;
      case 'stable': return <Minus className="text-slate-500" size={20} />;
      default: return null;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-100 text-emerald-700';
      case 'neutral': return 'bg-slate-100 text-slate-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleGenerateBrief = () => {
    setIsGeneratingBrief(true);
    setTimeout(() => {
      setIsGeneratingBrief(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Client Intelligence</h1>
        <p className="text-slate-500 mt-1">360° AI-powered client insights and health monitoring</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Heart className="text-emerald-600" size={24} />
            <span className="text-sm text-emerald-600 font-medium">Healthy</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">67</h3>
          <p className="text-slate-500 text-sm mt-1">Avg Health Score</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="text-red-600" size={24} />
            <span className="text-sm text-red-600 font-medium">At Risk</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">1</h3>
          <p className="text-slate-500 text-sm mt-1">High Churn Risk</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-indigo-600" size={24} />
            <span className="text-sm text-indigo-600 font-medium">Potential</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">$27K</h3>
          <p className="text-slate-500 text-sm mt-1">Upsell Value</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="text-sm text-blue-600 font-medium">Growing</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">2</h3>
          <p className="text-slate-500 text-sm mt-1">Improving Clients</p>
        </div>
      </div>

      {/* Client Health Dashboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Client Health Dashboard</h2>
        <div className="space-y-3">
          {mockClientHealth.map((client) => (
            <div
              key={client.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                selectedClient === client.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{client.name}</h3>
                    {getTrendIcon(client.trend)}
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getSentimentColor(client.sentiment))}>
                      {client.sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Last interaction: {client.lastInteraction}</p>
                </div>
                <div className="text-right">
                  <div className={cn("text-3xl font-bold mb-1", getHealthColor(client.healthScore))}>
                    {client.healthScore}
                  </div>
                  <p className="text-xs text-slate-500">Health Score</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className={cn("rounded-lg p-3", client.churnRisk > 50 ? "bg-red-50" : "bg-slate-50")}>
                  <p className="text-xs text-slate-500 mb-1">Churn Risk</p>
                  <p className={cn("text-lg font-bold", client.churnRisk > 50 ? "text-red-600" : "text-slate-900")}>
                    {client.churnRisk}%
                  </p>
                </div>
                <div className={cn("rounded-lg p-3", getHealthBg(client.healthScore))}>
                  <p className="text-xs text-slate-500 mb-1">Upsell Potential</p>
                  <p className={cn("text-lg font-bold capitalize", getHealthColor(client.healthScore))}>
                    {client.upsellPotential}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Trend</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(client.trend)}
                    <p className="text-lg font-bold text-slate-900 capitalize">{client.trend}</p>
                  </div>
                </div>
              </div>

              {selectedClient === client.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">AI Recommendations</h4>
                    {client.churnRisk > 50 ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800 mb-2">
                          <strong>⚠️ High Churn Risk Detected</strong>
                        </p>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Schedule immediate check-in call</li>
                          <li>• Review service delivery quality</li>
                          <li>• Offer retention incentive package</li>
                        </ul>
                      </div>
                    ) : client.upsellPotential === 'high' ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-sm text-emerald-800 mb-2">
                          <strong>💰 Upsell Opportunity</strong>
                        </p>
                        <ul className="text-sm text-emerald-700 space-y-1">
                          <li>• Present premium service package</li>
                          <li>• Highlight ROI from current services</li>
                          <li>• Schedule strategy session</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>✓ Maintain Current Engagement</strong> - Client relationship is stable. Continue regular touchpoints.
                        </p>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleGenerateBrief} isLoading={isGeneratingBrief} className="w-full gap-2">
                    <FileText size={18} />
                    Generate Meeting Brief
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upsell Opportunities */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <DollarSign size={24} />
          Upsell Opportunities
        </h2>
        <div className="space-y-4">
          {mockUpsellOpportunities.map((opportunity) => (
            <div key={opportunity.clientId} className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{opportunity.clientName}</h3>
                  <p className="text-lg text-emerald-600 font-medium mt-1">{opportunity.opportunity}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">${opportunity.estimatedValue.toLocaleString()}</p>
                  <span className="text-xs text-slate-500">Est. Value</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${opportunity.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600">{opportunity.confidence}% confidence</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-medium text-slate-700 mb-1">💡 AI Reasoning:</p>
                <p className="text-sm text-slate-600">{opportunity.reasoning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Prep Assistant */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <FileText size={24} />
          Meeting Prep Assistant
        </h2>
        <p className="text-indigo-100 mb-4">
          AI generates comprehensive briefing documents before client meetings, including history, sentiment analysis, and talking points.
        </p>
        <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
          Try It Now
        </Button>
      </div>
    </div>
  );
}
