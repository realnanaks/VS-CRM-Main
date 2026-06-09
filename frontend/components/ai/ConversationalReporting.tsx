import React, { useState } from 'react';
import { MessageCircle, Send, BarChart3, Download, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockConversationHistory } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function ConversationalReporting() {
  const [messages, setMessages] = useState(mockConversationHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chartData = [
    { day: 'Mon', engagement: 45 },
    { day: 'Tue', engagement: 52 },
    { day: 'Wed', engagement: 38 },
    { day: 'Thu', engagement: 65 },
    { day: 'Fri', engagement: 58 },
    { day: 'Sat', engagement: 42 },
    { day: 'Sun', engagement: 35 },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user' as const,
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        role: 'agent' as const,
        agent: 'campaign' as const,
        message: 'Based on the data, I recommend focusing on mid-week campaigns (Tuesday-Thursday) when engagement is highest. Consider reallocating 15% of your weekend budget to these peak days for better ROI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        charts: ['engagement-timeline']
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Conversational Reporting</h1>
          <p className="text-slate-500 mt-1">Chat with your data and get instant insights</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Download size={18} />
            Export Report
          </Button>
          <Button className="gap-2 bg-slate-200 text-slate-700 hover:bg-slate-300">
            <Calendar size={18} />
            Schedule
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '600px' }}>
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-semibold">AI Report Assistant</h3>
                <p className="text-sm text-indigo-100">Ask questions about your data</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  "max-w-[80%] rounded-lg p-4",
                  msg.role === 'user'
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-900"
                )}>
                  {msg.role === 'agent' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <BarChart3 size={14} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-medium text-indigo-600">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  
                  {msg.role === 'agent' && msg.charts && (
                    <div className="mt-4 bg-slate-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                          />
                          <Line type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  <p className={cn("text-xs mt-2", msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400')}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-600" />
                    <span className="text-sm text-slate-600">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ask a question about your data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping} className="gap-2">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Questions</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Show me revenue trends for the last quarter',
            'Which campaigns had the best ROI?',
            'Compare performance across all countries',
            'What are the top 5 performing assets?',
            'Analyze client satisfaction trends',
            'Show budget utilization by department'
          ].map((question, idx) => (
            <button
              key={idx}
              onClick={() => setInput(question)}
              className="text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-lg transition-colors text-sm text-slate-700"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Interactive Drill-Down</h3>
          <p className="text-sm text-slate-600">Ask follow-up questions to dive deeper into any metric or insight</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="text-purple-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Visual Explanations</h3>
          <p className="text-sm text-slate-600">AI generates charts and graphs to illustrate insights clearly</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <Download className="text-emerald-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Export Anywhere</h3>
          <p className="text-sm text-slate-600">Download conversations as PDF, PowerPoint, or Excel reports</p>
        </div>
      </div>

      {/* Scheduled Insights */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Calendar size={24} />
          Scheduled Insights
        </h2>
        <p className="text-emerald-100 mb-4">
          Receive AI-generated insights delivered to your inbox daily, weekly, or monthly. Never miss important trends.
        </p>
        <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
          Set Up Schedule
        </Button>
      </div>
    </div>
  );
}
