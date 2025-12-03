import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, Save, Zap, Mail, Clock, GitBranch } from 'lucide-react';
import { Journey, CountryCode } from '../types';
import { Button } from './ui/Button';
import { retrieveDashboardData, subscribeToStateChanges } from '../services/data';
import { cn } from '../utils/cn';

interface AutomationProps {
  country: CountryCode;
}

export const Automation: React.FC<AutomationProps> = ({ country }) => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

  useEffect(() => {
    const update = () => setJourneys(retrieveDashboardData(country).journeys);
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Zap size={16} className="text-yellow-600" />;
      case 'action': return <Mail size={16} className="text-blue-600" />;
      case 'wait': return <Clock size={16} className="text-gray-600" />;
      case 'condition': return <GitBranch size={16} className="text-purple-600" />;
      default: return <div />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-yellow-50 border-yellow-200';
      case 'action': return 'bg-blue-50 border-blue-200';
      case 'wait': return 'bg-gray-50 border-gray-200';
      case 'condition': return 'bg-purple-50 border-purple-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Journeys</h1>
          <p className="text-sm text-gray-500">Design visual workflows for your customer lifecycle.</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          New Journey
        </Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-64 flex flex-col gap-3 overflow-y-auto pr-2 shrink-0">
          {journeys.map(journey => (
            <div
              key={journey.id}
              onClick={() => setSelectedJourney(journey)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all",
                selectedJourney?.id === journey.id
                  ? "border-indigo-500 bg-indigo-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-indigo-300"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{journey.name}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                  journey.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                )}>
                  {journey.status}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {journey.nodes.length} nodes • {journey.country}
              </div>
            </div>
          ))}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 rounded-xl bg-slate-50 border border-gray-200 relative overflow-hidden shadow-inner group">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          {selectedJourney ? (
            <div className="relative w-full h-full p-10 overflow-auto">
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <Button variant="secondary" size="sm" className="bg-white"><Save size={14} className="mr-2" /> Save</Button>
                <Button
                  size="sm"
                  className={cn(
                    selectedJourney.status === 'Active' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  )}
                >
                  {selectedJourney.status === 'Active' ? <Pause size={14} className="mr-2" /> : <Play size={14} className="mr-2" />}
                  {selectedJourney.status === 'Active' ? 'Pause' : 'Activate'}
                </Button>
              </div>

              {/* Render Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {selectedJourney.connections.map(conn => {
                  const source = selectedJourney.nodes.find(n => n.id === conn.source);
                  const target = selectedJourney.nodes.find(n => n.id === conn.target);
                  if (!source || !target) return null;

                  // Simple coordinates offset for center of card (assuming w=160, h=60 approx)
                  const x1 = source.x + 160;
                  const y1 = source.y + 30;
                  const x2 = target.x;
                  const y2 = target.y + 30;

                  return (
                    <path
                      key={conn.id}
                      d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                  </marker>
                </defs>
              </svg>

              {/* Render Nodes */}
              {selectedJourney.nodes.map(node => (
                <div
                  key={node.id}
                  className={cn(
                    "absolute w-40 p-3 rounded-lg border shadow-sm z-10 flex items-center gap-3",
                    getNodeColor(node.type)
                  )}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">{node.type}</div>
                    <div className="text-xs font-medium text-gray-900 leading-tight">{node.label}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Select a journey to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};