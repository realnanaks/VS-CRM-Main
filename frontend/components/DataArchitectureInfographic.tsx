import React from 'react';
import { Database, Cloud, BarChart3, Brain, ArrowDown, Folder, FileText, Users, TrendingUp } from 'lucide-react';

export const DataArchitectureInfographic: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Echo House Data Architecture
        </h2>
        <p className="text-gray-600">
          End-to-End Flow: Storage → Structure → Analyze → Insights
        </p>
      </div>

      {/* Data Sources */}
      <div className="mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Cloud size={24} className="text-blue-600" />
            Data Sources
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">📁</div>
              <div className="font-medium text-sm">Google Drive</div>
              <div className="text-xs text-gray-600">Cloud Storage</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">📧</div>
              <div className="font-medium text-sm">Email</div>
              <div className="text-xs text-gray-600">Gmail/Outlook</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">🖥️</div>
              <div className="font-medium text-sm">Personal Devices</div>
              <div className="text-xs text-gray-600">Desktop/Mobile</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl mb-2">☁️</div>
              <div className="font-medium text-sm">Cloud Apps</div>
              <div className="text-xs text-gray-600">Slack/Dropbox</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-3xl mb-2">📱</div>
              <div className="font-medium text-sm">Social Media</div>
              <div className="text-xs text-gray-600">Twitter/LinkedIn</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl mb-2">🌐</div>
              <div className="font-medium text-sm">Web Forms</div>
              <div className="text-xs text-gray-600">Lead Capture</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow Down */}
      <div className="flex justify-center mb-6">
        <div className="bg-indigo-100 rounded-full p-3">
          <ArrowDown className="text-indigo-600" size={24} />
        </div>
      </div>

      {/* Tier 1: Raw Files */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Folder size={24} />
              TIER 1: RAW FILES (Google Drive)
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Source of Truth</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-white/10 rounded p-3 text-center">
              <div className="text-2xl mb-1">📄</div>
              <div className="text-xs">Excel</div>
            </div>
            <div className="bg-white/10 rounded p-3 text-center">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs">Word</div>
            </div>
            <div className="bg-white/10 rounded p-3 text-center">
              <div className="text-2xl mb-1">📃</div>
              <div className="text-xs">PDF</div>
            </div>
            <div className="bg-white/10 rounded p-3 text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs">CSV</div>
            </div>
            <div className="bg-white/10 rounded p-3 text-center">
              <div className="text-2xl mb-1">🖼️</div>
              <div className="text-xs">Images</div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">📁 Echo House Folder Structure (81 folders)</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div>🇬🇭 Ghana (12 depts)</div>
              <div>🇳🇬 Nigeria (12 depts)</div>
              <div>🇨🇮 Ivory Coast (12 depts)</div>
              <div>🇿🇦 South Africa (12 depts)</div>
              <div>🇧🇯 Benin (12 depts)</div>
              <div>🇹🇬 Togo (12 depts)</div>
              <div>🌍 Global (Shared)</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold">Storage:</div>
              <div className="text-blue-100">Google Drive</div>
            </div>
            <div>
              <div className="font-semibold">Access:</div>
              <div className="text-blue-100">Role-Based</div>
            </div>
            <div>
              <div className="font-semibold">Retention:</div>
              <div className="text-blue-100">Permanent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Arrow */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
          AI Ingestion Pipeline: Parse → Classify → Extract → Validate
        </div>
        <ArrowDown className="text-green-600 mt-2" size={24} />
      </div>

      {/* Tier 2: Structured Data */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Database size={24} />
              TIER 2: STRUCTURED DATA (CRM Database)
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Operational</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold">Contacts</div>
              <div className="text-2xl font-bold">15</div>
              <div className="text-xs text-green-100">users</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">📢</div>
              <div className="font-semibold">Campaigns</div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs text-green-100">active</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold">Projects</div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-green-100">running</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Deals</div>
              <div className="text-2xl font-bold">$45K</div>
              <div className="text-xs text-green-100">pipeline</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold">Storage:</div>
              <div className="text-green-100">PostgreSQL</div>
            </div>
            <div>
              <div className="font-semibold">Access:</div>
              <div className="text-green-100">API + Permissions</div>
            </div>
            <div>
              <div className="font-semibold">Entities:</div>
              <div className="text-green-100">8 core tables</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Arrow */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
          Analytics Processing: Aggregate → Analyze → Visualize
        </div>
        <ArrowDown className="text-purple-600 mt-2" size={24} />
      </div>

      {/* Tier 3: Analytics */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 size={24} />
              TIER 3: ANALYTICS DATA (Data Warehouse)
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Historical</span>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold mb-3">📈 KPI Dashboard</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded p-3">
                <div className="text-xs text-purple-100">Active Clients</div>
                <div className="text-xl font-bold">24</div>
              </div>
              <div className="bg-white/10 rounded p-3">
                <div className="text-xs text-purple-100">Revenue</div>
                <div className="text-xl font-bold">$120K/m</div>
              </div>
              <div className="bg-white/10 rounded p-3">
                <div className="text-xs text-purple-100">Growth</div>
                <div className="text-xl font-bold">15% YoY</div>
              </div>
              <div className="bg-white/10 rounded p-3">
                <div className="text-xs text-purple-100">Churn</div>
                <div className="text-xl font-bold">3.2%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/10 rounded p-3">
              📊 Cross-Country Comparison
            </div>
            <div className="bg-white/10 rounded p-3">
              📈 Trend Analysis
            </div>
            <div className="bg-white/10 rounded p-3">
              🏢 Department Performance
            </div>
            <div className="bg-white/10 rounded p-3">
              🎯 Goal Tracking
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold">Storage:</div>
              <div className="text-purple-100">BigQuery (future)</div>
            </div>
            <div>
              <div className="font-semibold">Access:</div>
              <div className="text-purple-100">BI Tools</div>
            </div>
            <div>
              <div className="font-semibold">Retention:</div>
              <div className="text-purple-100">5+ years</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Arrow */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
          AI Processing: Analyze → Predict → Recommend
        </div>
        <ArrowDown className="text-pink-600 mt-2" size={24} />
      </div>

      {/* Tier 4: AI Insights */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Brain size={24} />
              TIER 4: AI INSIGHTS (Google Gemini)
            </h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Intelligent</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl">🔮</div>
                <div className="font-semibold">Predictions</div>
              </div>
              <ul className="text-sm space-y-1 text-pink-100">
                <li>• Campaign success probability</li>
                <li>• Client churn risk scores</li>
                <li>• Budget optimization</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl">📝</div>
                <div className="font-semibold">Reports</div>
              </div>
              <ul className="text-sm space-y-1 text-pink-100">
                <li>• Executive summaries</li>
                <li>• Department performance</li>
                <li>• Client health reports</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl">💬</div>
                <div className="font-semibold">Queries</div>
              </div>
              <ul className="text-sm space-y-1 text-pink-100">
                <li>• Natural language Q&A</li>
                <li>• Data insights on demand</li>
                <li>• Smart recommendations</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl">📊</div>
                <div className="font-semibold">Analytics</div>
              </div>
              <ul className="text-sm space-y-1 text-pink-100">
                <li>• Trend detection</li>
                <li>• Pattern recognition</li>
                <li>• Anomaly alerts</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold">Engine:</div>
              <div className="text-pink-100">Gemini Pro</div>
            </div>
            <div>
              <div className="font-semibold">Access:</div>
              <div className="text-pink-100">API + Advisor</div>
            </div>
            <div>
              <div className="font-semibold">Confidence:</div>
              <div className="text-pink-100">80-95%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4">📋 Architecture Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-2">📊 Scale:</div>
            <ul className="space-y-1 text-blue-100">
              <li>• 81 folders across 7 countries</li>
              <li>• 12 departments per country</li>
              <li>• 4 data processing tiers</li>
              <li>• Unlimited file storage</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">🚀 Status:</div>
            <ul className="space-y-1 text-blue-100">
              <li>• Infrastructure: ✅ Ready</li>
              <li>• Permissions: ✅ Configured</li>
              <li>• AI Integration: ✅ Active</li>
              <li>• Next: Connect Google Drive</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 Bidirectional Data Flow</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg font-medium">
            Google Drive
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-green-100 text-green-900 px-4 py-2 rounded-lg font-medium">
            Parse
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-lg font-medium">
            Extract
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-pink-100 text-pink-900 px-4 py-2 rounded-lg font-medium">
            Database
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-orange-100 text-orange-900 px-4 py-2 rounded-lg font-medium">
            AI Analyze
          </div>
        </div>
        <div className="flex items-center justify-center mt-4">
          <div className="text-center">
            <div className="text-2xl mb-2">↓</div>
            <div className="bg-gradient-to-r from-orange-100 to-blue-100 text-gray-900 px-4 py-2 rounded-lg font-medium">
              ← Sync Back to Drive (Edit in CRM → Update Files)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
