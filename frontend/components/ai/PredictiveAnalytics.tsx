import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb, Loader2, BarChart3, Target, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockRevenueForecast, mockAnomalies, mockCampaignPredictions } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function PredictiveAnalytics() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowForecast(true);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="text-red-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'info': return <Lightbulb className="text-blue-500" size={20} />;
      default: return <Lightbulb className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">🎯 Echo Forecast</h1>
          <p className="text-slate-500 mt-1">Predict campaign success, event attendance, and revenue before you launch</p>
          <p className="text-sm text-slate-400 italic mt-1">See the future of your marketing</p>
        </div>
        <Button onClick={handleGenerateForecast} isLoading={isGenerating} className="gap-2">
          <Zap size={18} />
          Generate Forecast
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-bold">$61K</h3>
          <p className="text-indigo-100 text-sm mt-1">Predicted Revenue (June)</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">82%</span>
          </div>
          <h3 className="text-2xl font-bold">3.2x ROI</h3>
          <p className="text-emerald-100 text-sm mt-1">Summer Sale Prediction</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">2 Active</span>
          </div>
          <h3 className="text-2xl font-bold">Anomalies</h3>
          <p className="text-orange-100 text-sm mt-1">Require Attention</p>
        </div>
      </div>

      {/* Revenue Forecast Chart */}
      {showForecast && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Revenue Forecast</h2>
              <p className="text-slate-500 text-sm mt-1">6-month prediction with confidence intervals</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Predicted</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} name="Actual Revenue" />
              <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} name="Predicted Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Campaign Predictions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Campaign Performance Predictions</h2>
        <div className="space-y-4">
          {mockCampaignPredictions.map((campaign) => (
            <div key={campaign.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{campaign.recommendation}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  campaign.confidence >= 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}>
                  {campaign.confidence}% confidence
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Predicted ROI</p>
                  <p className="text-lg font-bold text-slate-900">{campaign.predictedROI}x</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Predicted Reach</p>
                  <p className="text-lg font-bold text-slate-900">{campaign.predictedReach.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Engagement Rate</p>
                  <p className="text-lg font-bold text-slate-900">{campaign.predictedEngagement}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Anomaly Detection</h2>
        <div className="space-y-3">
          {mockAnomalies.map((anomaly) => (
            <div 
              key={anomaly.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                selectedAnomaly === anomaly.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedAnomaly(selectedAnomaly === anomaly.id ? null : anomaly.id)}
            >
              <div className="flex items-start gap-3">
                {getTypeIcon(anomaly.type)}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{anomaly.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{anomaly.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium border", getSeverityColor(anomaly.severity))}>
                        {anomaly.severity}
                      </span>
                      <span className="text-xs text-slate-400">{anomaly.timestamp}</span>
                    </div>
                  </div>
                  {selectedAnomaly === anomaly.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 animate-fade-in">
                      <p className="text-sm font-medium text-slate-700 mb-2">💡 AI Recommendation:</p>
                      <p className="text-sm text-slate-600">{anomaly.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
