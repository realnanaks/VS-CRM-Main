import React, { useState } from 'react';
import { Search, Mic, Download, History, Sparkles, Loader2 } from 'lucide-react';
import { mockNLQueries, mockQueryResults } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function NaturalLanguageQuery() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      setQueryHistory([query, ...queryHistory.slice(0, 4)]);
    }, 1500);
  };

  const handleExampleQuery = (exampleQuery: string) => {
    setQuery(exampleQuery);
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">💬 Echo Ask</h1>
        <p className="text-slate-500 mt-1">Ask questions about your data in plain English - no tech skills needed</p>
        <p className="text-sm text-slate-400 italic mt-1">Talk to your data like a colleague</p>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-white rounded-lg p-2 shadow-xl">
            <Search className="text-slate-400 ml-2" size={24} />
            <input
              type="text"
              className="flex-1 px-2 py-3 text-lg focus:outline-none"
              placeholder="Ask anything about your data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="p-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="Voice input"
            >
              <Mic size={20} />
            </button>
            <Button 
              onClick={handleSearch}
              isLoading={isSearching}
              disabled={!query.trim()}
              className="gap-2"
            >
              <Sparkles size={18} />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Example Queries */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Try these examples:</h2>
        <div className="flex flex-wrap gap-2">
          {mockNLQueries.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleQuery(example)}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Query Results */}
      {showResults && (
        <div className="space-y-6 animate-fade-in">
          {/* Query Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Query Results</h2>
                <p className="text-slate-600 italic">"{mockQueryResults.query}"</p>
              </div>
              <Button className="gap-2">
                <Download size={18} />
                Export
              </Button>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Campaign</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ROI</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Spend</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mockQueryResults.results.map((result, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-900">{result.campaign}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                          {result.roi}x
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">${result.spend.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">${result.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Insights */}
            <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <Sparkles size={18} />
                AI Insight
              </h3>
              <p className="text-indigo-800">{mockQueryResults.insights}</p>
            </div>
          </div>

          {/* Follow-up Questions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3">Suggested follow-up questions:</h3>
            <div className="space-y-2">
              {[
                'What was the average campaign duration?',
                'Show me the budget breakdown by channel',
                'Which demographics performed best?'
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleQuery(question)}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm text-slate-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Query History */}
      {queryHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <History size={20} />
            Recent Queries
          </h2>
          <div className="space-y-2">
            {queryHistory.map((historyQuery, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleQuery(historyQuery)}
                className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm text-slate-700 flex items-center justify-between group"
              >
                <span>{historyQuery}</span>
                <Search size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Search className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Smart Search</h3>
          <p className="text-sm text-slate-600">AI understands context and applies appropriate filters automatically</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Mic className="text-purple-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Voice Commands</h3>
          <p className="text-sm text-slate-600">Ask questions using your voice for hands-free data exploration</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <Download className="text-emerald-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Export Results</h3>
          <p className="text-sm text-slate-600">Download query results in CSV, Excel, or PDF format</p>
        </div>
      </div>
    </div>
  );
}
