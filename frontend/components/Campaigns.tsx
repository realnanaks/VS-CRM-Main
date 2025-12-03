
import React, { useState, useEffect } from 'react';
import { Plus, Wand2, Eye, Trash2, Users, Mail, Globe, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Campaign, CountryCode } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { generateMarketingCopy } from '../services/gemini';
import { retrieveDashboardData, addCampaign, deleteCampaign, subscribeToStateChanges, getSegments, createSegment } from '../services/data';
import { cn } from '../utils/cn';
import { useFeatureFlags } from '../context/FeatureFlagContext';

interface CampaignsProps {
  country: CountryCode;
}

export const Campaigns: React.FC<CampaignsProps> = ({ country }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // New Campaign Form State
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [channel, setChannel] = useState<'Email' | 'Social' | 'Ad' | 'SMS'>('Email');

  // Audience State
  const [availableSegments, setAvailableSegments] = useState<string[]>([]);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');

  const { isFeatureEnabled } = useFeatureFlags();
  const showSMS = isFeatureEnabled('ff_sms_campaigns', country);

  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');

  useEffect(() => {
    const update = () => setCampaigns(retrieveDashboardData(country).campaigns);
    update();

    // Fetch segments
    getSegments().then(segments => {
      setAvailableSegments(segments.map((s: any) => s.name));
    });

    return subscribeToStateChanges(update);
  }, [country]);

  const handleGenerateAI = async () => {
    if (!topic || !audience) return;
    setIsGenerating(true);
    try {
      const result = await generateMarketingCopy(topic, tone, audience);
      setGeneratedSubject(result.subject);
      setGeneratedBody(result.body);
    } catch (error) {
      console.error("Failed to generate content", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCampaign = () => {
    if (!name || !audience) return;

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name,
      audience,
      channel,
      status: 'Draft',
      content: generatedSubject ? `Subject: ${generatedSubject}\n\n${generatedBody}` : '',
      country: country === 'Global' ? 'US' : country,
      startDate: new Date().toISOString().split('T')[0]
    };

    // Add new segment to list if created
    if (isCreatingSegment && newSegmentName && !availableSegments.includes(newSegmentName)) {
      createSegment(newSegmentName).then(() => {
        setAvailableSegments(prev => [...prev, newSegmentName]);
      });
    }

    addCampaign(newCampaign);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAudience('');
    setIsCreatingSegment(false);
    setNewSegmentName('');
    setTopic('');
    setTone('Professional');
    setChannel('Email');
    setGeneratedSubject('');
    setGeneratedBody('');
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    if (selectedCampaign?.id === id) setIsDetailsModalOpen(false);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to generate mock regional data based on campaign stats
  const getMockRegionalData = (baseOpen: number = 0, baseClick: number = 0) => {
    return [
      { name: 'US', Open: Math.min(100, Math.round(baseOpen * 1.1)), Click: Math.min(100, Math.round(baseClick * 1.1)) },
      { name: 'UK', Open: Math.min(100, Math.round(baseOpen * 0.9)), Click: Math.min(100, Math.round(baseClick * 0.95)) },
      { name: 'DE', Open: Math.min(100, Math.round(baseOpen * 1.05)), Click: Math.min(100, Math.round(baseClick * 1.02)) },
      { name: 'FR', Open: Math.min(100, Math.round(baseOpen * 0.85)), Click: Math.min(100, Math.round(baseClick * 0.8)) },
      { name: 'JP', Open: Math.min(100, Math.round(baseOpen * 0.92)), Click: Math.min(100, Math.round(baseClick * 0.88)) },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns {country !== 'Global' && `(${country})`}</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="group flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  getStatusColor(campaign.status)
                )}>
                  {campaign.status}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleViewDetails(campaign)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleDelete(campaign.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{campaign.name}</h3>

              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span>{campaign.audience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{campaign.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-400" />
                  <span>{campaign.country}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              {campaign.status !== 'Draft' ? (
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400">Open Rate</span>
                    <span className="font-semibold text-gray-900">{campaign.openRate}%</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">Click Rate</span>
                    <span className="font-semibold text-gray-900">{campaign.clickRate}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">No stats available</div>
              )}
              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(campaign)}>
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Campaign">
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Newsletter"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience Segment</label>
                {!isCreatingSegment ? (
                  <div className="flex gap-2">
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                      value={audience}
                      onChange={(e) => {
                        if (e.target.value === 'new') {
                          setIsCreatingSegment(true);
                          setAudience('');
                        } else {
                          setAudience(e.target.value);
                        }
                      }}
                    >
                      <option value="">Select Audience...</option>
                      {availableSegments.map(seg => (
                        <option key={seg} value={seg}>{seg}</option>
                      ))}
                      <option value="new" className="font-semibold text-indigo-600">+ Create New Segment</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={newSegmentName}
                      onChange={e => {
                        setNewSegmentName(e.target.value);
                        setAudience(e.target.value);
                      }}
                      placeholder="Enter new segment name"
                      autoFocus
                    />
                    <Button variant="secondary" size="sm" onClick={() => {
                      setIsCreatingSegment(false);
                      setNewSegmentName('');
                      setAudience('');
                    }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                  value={channel} onChange={e => setChannel(e.target.value as any)}
                >
                  <option value="Email">Email</option>
                  <option value="Social">Social Media</option>
                  <option value="Ad">Advertisement</option>
                  {showSMS && <option value="SMS">SMS Blast 📱</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                  value={tone} onChange={e => setTone(e.target.value)}
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Urgent</option>
                  <option>Persuasive</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <Wand2 size={16} /> AI Content Generator
                </h4>
              </div>

              <div className="space-y-3">
                <input
                  className="w-full rounded-lg border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="What is this campaign about?"
                  value={topic} onChange={e => setTopic(e.target.value)}
                />
                <Button
                  onClick={handleGenerateAI}
                  isLoading={isGenerating}
                  disabled={!topic || !audience}
                  className="w-full"
                  size="sm"
                >
                  Generate Draft
                </Button>
              </div>
            </div>

            {(generatedSubject || generatedBody) && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subject Line</label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50"
                    value={generatedSubject} onChange={e => setGeneratedSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email Body</label>
                  <textarea
                    className="w-full h-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-gray-50 resize-none"
                    value={generatedBody} onChange={e => setGeneratedBody(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} disabled={!name || !audience}>Create Campaign</Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Campaign Details">
        {selectedCampaign && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCampaign.name}</h3>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedCampaign.status)}`}>
                    {selectedCampaign.status}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {selectedCampaign.country}
                  </span>
                </div>
              </div>
              {selectedCampaign.status !== 'Draft' && (
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCampaign.openRate}%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCampaign.clickRate}%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Click Rate</div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Users size={16} />
                  <span className="text-xs font-medium uppercase">Audience</span>
                </div>
                <div className="font-medium text-gray-900">{selectedCampaign.audience}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Globe size={16} />
                  <span className="text-xs font-medium uppercase">Channel</span>
                </div>
                <div className="font-medium text-gray-900">{selectedCampaign.channel}</div>
              </div>
            </div>

            {/* Regional Breakdown - Show if data available or if Global */}
            {selectedCampaign.status !== 'Draft' && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-indigo-600" /> Regional Performance (Estimated)
                </h4>
                <div className="h-64 w-full bg-white rounded-lg border border-gray-100 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMockRegionalData(selectedCampaign.openRate, selectedCampaign.clickRate)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="Open" name="Open Rate %" fill="#818cf8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Click" name="Click Rate %" fill="#34d399" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail size={16} /> Content Preview
              </h4>
              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed shadow-sm">
                {selectedCampaign.content || "No content generated yet."}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
