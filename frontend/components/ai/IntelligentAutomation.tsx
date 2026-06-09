import React, { useState } from 'react';
import { Zap, Play, Pause, Plus, Settings, TrendingUp, CheckCircle } from 'lucide-react';
import { mockAutomationRules } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';

export default function IntelligentAutomation() {
  const [rules, setRules] = useState(mockAutomationRules);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligent Automation</h1>
          <p className="text-slate-500 mt-1">AI-driven workflows and task automation</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Zap className="text-indigo-600" size={24} />
            <span className="text-sm text-emerald-600 font-medium">+23%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">261</h3>
          <p className="text-slate-500 text-sm mt-1">Total Executions</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-emerald-600" size={24} />
            <span className="text-sm text-emerald-600 font-medium">Excellent</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">86%</h3>
          <p className="text-slate-500 text-sm mt-1">Success Rate</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="text-sm text-blue-600 font-medium">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">2/3</h3>
          <p className="text-slate-500 text-sm mt-1">Active Rules</p>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Automation Rules</h2>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                "border rounded-lg p-4 transition-all",
                selectedRule === rule.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      rule.status === 'active' 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-slate-100 text-slate-600"
                    )}>
                      {rule.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-600">
                      <span className="font-medium">Trigger:</span> {rule.trigger}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium">Action:</span> {rule.action}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      rule.status === 'active'
                        ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                    title={rule.status === 'active' ? 'Pause' : 'Activate'}
                  >
                    {rule.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Settings"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Executions</p>
                  <p className="text-lg font-bold text-slate-900">{rule.executions}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Success Rate</p>
                  <p className="text-lg font-bold text-slate-900">{rule.successRate}%</p>
                </div>
              </div>

              {selectedRule === rule.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in">
                  <h4 className="font-medium text-slate-900 mb-3">Automation Details</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>• Created: 2 weeks ago</p>
                    <p>• Last executed: 3 hours ago</p>
                    <p>• Average execution time: 1.2s</p>
                    <p>• Next scheduled run: In 4 hours</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Builder Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Workflow Builder</h2>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
          <Zap size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">Drag-and-drop workflow builder</p>
          <p className="text-sm text-slate-400">Create complex automation workflows visually</p>
          <Button className="mt-4 gap-2">
            <Plus size={18} />
            Start Building
          </Button>
        </div>
      </div>

      {/* Create Automation Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Automation Rule">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rule Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Auto-assign High-Value Leads"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Trigger</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Select a trigger...</option>
              <option>New contact created</option>
              <option>Lead score changes</option>
              <option>Deal stage updated</option>
              <option>No activity in X days</option>
              <option>Campaign launched</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Lead score > 80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Action</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Select an action...</option>
              <option>Assign to team member</option>
              <option>Send notification</option>
              <option>Update field</option>
              <option>Create task</option>
              <option>Send email</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setIsCreateModalOpen(false)} className="flex-1">
              Create Automation
            </Button>
            <Button onClick={() => setIsCreateModalOpen(false)} className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
