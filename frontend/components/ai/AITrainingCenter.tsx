import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, TrendingUp, Brain, Settings, Award } from 'lucide-react';
import { mockFeedbackHistory, mockModelMetrics } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function AITrainingCenter() {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const getFeedbackColor = (feedback: string) => {
    switch (feedback) {
      case 'accurate': return 'bg-emerald-100 text-emerald-700';
      case 'slightly_off': return 'bg-yellow-100 text-yellow-700';
      case 'inaccurate': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getFeedbackIcon = (feedback: string) => {
    switch (feedback) {
      case 'accurate': return <ThumbsUp className="text-emerald-600" size={16} />;
      case 'slightly_off': return <ThumbsDown className="text-yellow-600" size={16} />;
      case 'inaccurate': return <ThumbsDown className="text-red-600" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Training Center</h1>
        <p className="text-slate-500 mt-1">Improve AI accuracy through feedback and personalization</p>
      </div>

      {/* Model Performance Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        {Object.entries(mockModelMetrics).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Brain className="text-indigo-600" size={24} />
              <span className={cn(
                "text-sm font-medium px-2 py-1 rounded-full",
                value.improvement.startsWith('+') ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              )}>
                {value.improvement}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{value.accuracy}%</h3>
            <p className="text-slate-500 text-sm mt-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
        ))}
      </div>

      {/* Feedback History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Feedback History</h2>
        <div className="space-y-3">
          {mockFeedbackHistory.map((item) => (
            <div
              key={item.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                selectedFeedback === item.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedFeedback(selectedFeedback === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{item.feature}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Prediction: </span>
                      <span className="text-slate-900 font-medium">{item.prediction}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Actual: </span>
                      <span className="text-slate-900 font-medium">{item.actualOutcome}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1", getFeedbackColor(item.feedback))}>
                    {getFeedbackIcon(item.feedback)}
                    {item.feedback.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">{item.date}</span>
                </div>
              </div>

              {selectedFeedback === item.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 animate-fade-in">
                  <p className="text-sm text-slate-600 mb-3">
                    This feedback helps improve the <strong>{item.feature}</strong> model accuracy.
                  </p>
                  <div className="flex gap-2">
                    <Button className="text-sm py-2">View Details</Button>
                    <Button className="text-sm py-2 bg-slate-200 text-slate-700 hover:bg-slate-300">
                      Update Feedback
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Personalization Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Settings size={24} />
          Personalization Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Priority Insights</h3>
              <p className="text-sm text-slate-600 mt-1">Focus AI on metrics that matter most to you</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Notification Preferences</h3>
              <p className="text-sm text-slate-600 mt-1">Control when and how AI alerts you</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Industry Terminology</h3>
              <p className="text-sm text-slate-600 mt-1">Teach AI your specific business terms</p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
              Add Terms
            </button>
          </div>
        </div>
      </div>

      {/* Confidence Calibration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Confidence Score Calibration</h2>
        <p className="text-slate-600 mb-6">
          Adjust how conservative or aggressive AI predictions should be based on your risk tolerance.
        </p>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Lead Scoring</span>
              <span className="text-sm text-slate-500">Balanced</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Campaign Predictions</span>
              <span className="text-sm text-slate-500">Conservative</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="30"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Churn Risk</span>
              <span className="text-sm text-slate-500">Aggressive</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explainability Dashboard */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award size={24} />
          Model Explainability
        </h2>
        <p className="text-slate-600 mb-6">
          Understand how AI makes decisions with transparent explanations for every prediction.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">Feature Importance</h3>
            <p className="text-sm text-indigo-700">See which factors influence predictions most</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Decision Trees</h3>
            <p className="text-sm text-purple-700">Visualize the logic behind AI decisions</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 mb-2">Confidence Factors</h3>
            <p className="text-sm text-emerald-700">Understand why AI is confident or uncertain</p>
          </div>
        </div>
      </div>

      {/* Training Progress */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp size={24} />
              Training Progress
            </h2>
            <p className="text-indigo-100">
              Your feedback has improved AI accuracy by <strong>12%</strong> this month
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">156</div>
            <div className="text-sm text-indigo-100">Feedback Items</div>
          </div>
        </div>
        <div className="w-full bg-indigo-400 rounded-full h-3">
          <div className="bg-white h-3 rounded-full" style={{ width: '68%' }} />
        </div>
        <p className="text-sm text-indigo-100 mt-2">68% towards next accuracy milestone</p>
      </div>
    </div>
  );
}
