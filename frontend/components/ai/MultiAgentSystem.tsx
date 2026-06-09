import React, { useState } from 'react';
import { Bot, Send, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { mockAgents } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function MultiAgentSystem() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>('coordinator');
  const [messages, setMessages] = useState<Array<{ role: string; agent?: string; message: string; timestamp: string }>>([
    {
      role: 'agent',
      agent: 'coordinator',
      message: "Hello! I'm the AI Coordinator. I can route your questions to specialized agents. What would you like help with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [handoffAnimation, setHandoffAnimation] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate agent routing
    setTimeout(() => {
      if (input.toLowerCase().includes('campaign') || input.toLowerCase().includes('roi')) {
        setHandoffAnimation(true);
        setTimeout(() => {
          setSelectedAgent('campaign');
          setHandoffAnimation(false);
          const agentResponse = {
            role: 'agent',
            agent: 'campaign',
            message: "I'm the Campaign Specialist. I've analyzed your campaigns and found that your Q1 campaigns had an average ROI of 3.2x. The 'Summer Sale' campaign is projected to perform 15% better based on historical data.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, agentResponse]);
          setIsTyping(false);
        }, 1500);
      } else if (input.toLowerCase().includes('deal') || input.toLowerCase().includes('sales')) {
        setHandoffAnimation(true);
        setTimeout(() => {
          setSelectedAgent('sales');
          setHandoffAnimation(false);
          const agentResponse = {
            role: 'agent',
            agent: 'sales',
            message: "I'm the Sales Advisor. Your pipeline shows 12 active deals worth $450K. I recommend prioritizing the 'TechNova Enterprise' deal (85% close probability) and scheduling follow-ups for 3 deals that haven't been contacted in 10+ days.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, agentResponse]);
          setIsTyping(false);
        }, 1500);
      } else {
        const agentResponse = {
          role: 'agent',
          agent: 'coordinator',
          message: "I can help you with that! Would you like me to route this to a specialist, or would you prefer a general overview?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, agentResponse]);
        setIsTyping(false);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    const agent = mockAgents.find(a => a.id === agentId);
    if (agent) {
      const greeting = {
        role: 'agent',
        agent: agentId,
        message: `Hello! I'm the ${agent.name}. ${agent.description} How can I assist you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, greeting]);
    }
  };

  const currentAgent = mockAgents.find(a => a.id === selectedAgent);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Multi-Agent AI System</h1>
        <p className="text-slate-500 mt-1">Specialized AI agents for different business needs</p>
      </div>

      {/* Agent Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Available AI Agents</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {mockAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleAgentSelect(agent.id)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                selectedAgent === agent.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div className="text-3xl mb-2">{agent.icon}</div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{agent.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{agent.specialty.split(',')[0]}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Bot size={12} />
                <span>{agent.activeConversations} active</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Agent Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Agent</h2>
          {currentAgent && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-3">{currentAgent.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg">{currentAgent.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{currentAgent.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentAgent.specialty.split(', ').map((spec, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Active Conversations</span>
                  <span className="font-semibold text-slate-900">{currentAgent.activeConversations}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{currentAgent?.icon}</div>
                  <div>
                    <h3 className="font-semibold">{currentAgent?.name}</h3>
                    <p className="text-sm text-indigo-100">Online</p>
                  </div>
                </div>
                {handoffAnimation && (
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full animate-pulse">
                    <ArrowRight size={16} />
                    <span className="text-sm">Routing...</span>
                  </div>
                )}
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
                    {msg.role === 'agent' && msg.agent && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">{mockAgents.find(a => a.id === msg.agent)?.icon}</div>
                        <span className="text-xs font-medium text-indigo-600">
                          {mockAgents.find(a => a.id === msg.agent)?.name}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
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
                      <span className="text-sm text-slate-600">Agent is thinking...</span>
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
                  placeholder={`Ask ${currentAgent?.name}...`}
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
      </div>

      {/* Agent Handoff Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles size={20} />
          How Agent Routing Works
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🤖</span>
            </div>
            <p className="text-sm font-medium text-slate-900">Coordinator</p>
            <p className="text-xs text-slate-500 mt-1">Receives query</p>
          </div>
          <ArrowRight className="text-slate-400" size={24} />
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🧠</span>
            </div>
            <p className="text-sm font-medium text-slate-900">Analysis</p>
            <p className="text-xs text-slate-500 mt-1">Determines intent</p>
          </div>
          <ArrowRight className="text-slate-400" size={24} />
          <div className="flex-1 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-sm font-medium text-slate-900">Specialist</p>
            <p className="text-xs text-slate-500 mt-1">Provides answer</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Bot className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Smart Routing</h3>
          <p className="text-sm text-slate-600">AI automatically routes questions to the most qualified specialist</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="text-purple-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Seamless Handoffs</h3>
          <p className="text-sm text-slate-600">Agents collaborate and hand off conversations smoothly</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <ArrowRight className="text-emerald-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Context Preservation</h3>
          <p className="text-sm text-slate-600">Full conversation history maintained across agent switches</p>
        </div>
      </div>
    </div>
  );
}
