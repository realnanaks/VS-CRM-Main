
import React, { useState, useEffect } from 'react';
import { Plus, Twitter, Linkedin, Instagram, Facebook, Image as ImageIcon, Wand2, Calendar, Trash2, Send, ThumbsUp, MessageCircle, Share2, BarChart2, Layout, Link2, CheckCircle, AlertCircle, X, Loader2, ShieldCheck, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { SocialPost, CountryCode, SocialPlatform, SocialConnection } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addSocialPost, deleteSocialPost, subscribeToStateChanges, toggleSocialConnection, publishToPlatform } from '../services/data';
import { generateSocialHashtags } from '../services/gemini';

interface SocialProps {
  country: CountryCode;
}

export const Social: React.FC<SocialProps> = ({ country }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics'>('feed');

  // OAuth Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Create Form State
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Feedback State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
        const data = retrieveDashboardData(country);
        setPosts(data.socialPosts);
        setConnections(data.socialConnections);
    };
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  // --- Actions ---

  const handleConnectClick = (platform: string) => {
      const conn = connections.find(c => c.platform === platform);
      if (conn?.connected) {
          // Disconnect immediately
          toggleSocialConnection(platform);
      } else {
          // Open OAuth Modal
          setTargetPlatform(platform);
          setConnectModalOpen(true);
      }
  };

  const handleOAuthAuthorize = () => {
      if (!targetPlatform) return;
      setIsConnecting(true);
      
      // Simulate API handshake delay
      setTimeout(() => {
          toggleSocialConnection(targetPlatform);
          setIsConnecting(false);
          setConnectModalOpen(false);
          setTargetPlatform(null);
      }, 1500);
  };

  const handlePlatformToggle = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleGenerateHashtags = async () => {
    if (!content) return;
    setIsGenerating(true);
    const tags = await generateSocialHashtags(content);
    setContent(prev => `${prev} ${tags.join(' ')}`);
    setIsGenerating(false);
  };

  const handleCreatePost = async () => {
    if (!content || selectedPlatforms.length === 0) return;

    // Check connections
    const disconnected = selectedPlatforms.filter(p => {
        const conn = connections.find(c => c.platform === p);
        return !conn || !conn.connected;
    });

    if (disconnected.length > 0) {
        alert(`Please connect ${disconnected.join(', ')} first.`);
        return;
    }

    setIsPublishing(true);
    
    // Simulate API calls
    await Promise.all(selectedPlatforms.map(p => publishToPlatform(p)));

    const newPost: SocialPost = {
        id: Date.now().toString(),
        content,
        platforms: selectedPlatforms,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        status: scheduledDate ? 'Scheduled' : 'Published',
        country: country === 'Global' ? 'US' : country,
        likes: 0,
        shares: 0,
        comments: 0,
        reach: 0
    };

    addSocialPost(newPost);
    setIsPublishing(false);
    resetForm();

    // Show Success Toast
    setSuccessMessage(scheduledDate ? 'Post scheduled successfully.' : 'Post published successfully.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const resetForm = () => {
      setContent('');
      setSelectedPlatforms([]);
      setScheduledDate('');
  };

  const getPlatformIcon = (p: string, size = 16) => {
      switch(p) {
          case 'twitter': return <Twitter size={size} className="text-sky-500" />;
          case 'linkedin': return <Linkedin size={size} className="text-blue-700" />;
          case 'instagram': return <Instagram size={size} className="text-pink-600" />;
          case 'facebook': return <Facebook size={size} className="text-blue-600" />;
          default: return null;
      }
  };

  const getPlatformName = (p: string) => {
      return p.charAt(0).toUpperCase() + p.slice(1);
  };

  // --- Analytics Logic ---

  // 1. Platform Performance (Bar Chart)
  const platformPerformanceData = [
      { name: 'Twitter', reach: 0, engagement: 0 },
      { name: 'LinkedIn', reach: 0, engagement: 0 },
      { name: 'Instagram', reach: 0, engagement: 0 },
      { name: 'Facebook', reach: 0, engagement: 0 }
  ];

  let totalReach = 0;
  let totalEngagement = 0;

  // 2. Trend Data (Line Chart)
  // Aggregate post metrics by date
  const trendMap: Record<string, any> = {};

  posts.forEach(post => {
      const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
      totalReach += (post.reach || 0);
      totalEngagement += engagement;

      // Platform breakdown
      post.platforms.forEach(p => {
          const platformData = platformPerformanceData.find(d => d.name.toLowerCase() === p);
          if (platformData) {
              platformData.reach += (post.reach || 0) / post.platforms.length;
              platformData.engagement += engagement / post.platforms.length;
          }
      });

      // Trend aggregation
      const date = post.scheduledDate;
      if (!trendMap[date]) {
          trendMap[date] = { date, reach: 0, engagement: 0 };
      }
      trendMap[date].reach += post.reach || 0;
      trendMap[date].engagement += engagement;
  });

  const trendData = Object.values(trendMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 3. Mock Follower Growth Data (Area Chart)
  const followerGrowthData = [
      { date: 'Jan', twitter: 1200, linkedin: 800, instagram: 1500 },
      { date: 'Feb', twitter: 1350, linkedin: 900, instagram: 1600 },
      { date: 'Mar', twitter: 1400, linkedin: 1100, instagram: 1800 },
      { date: 'Apr', twitter: 1600, linkedin: 1300, instagram: 2100 },
      { date: 'May', twitter: 1850, linkedin: 1500, instagram: 2400 },
      { date: 'Jun', twitter: 2100, linkedin: 1800, instagram: 2800 },
  ];

  const engagementDistribution = [
      { name: 'Likes', value: posts.reduce((acc, p) => acc + (p.likes || 0), 0), color: '#ef4444' },
      { name: 'Comments', value: posts.reduce((acc, p) => acc + (p.comments || 0), 0), color: '#3b82f6' },
      { name: 'Shares', value: posts.reduce((acc, p) => acc + (p.shares || 0), 0), color: '#10b981' },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Social Suite {country !== 'Global' && `(${country})`}</h1>
           <p className="text-sm text-gray-500">Manage, schedule, and analyze social media content.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button 
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Layout size={16} className="inline mr-2"/> Manage Content
            </button>
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <BarChart2 size={16} className="inline mr-2"/> Analytics
            </button>
        </div>
      </div>

      {activeTab === 'feed' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: CREATE & LIST */}
            <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Create New Post</h3>
                    <div className="space-y-4">
                        <textarea
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-none"
                            placeholder="What's happening? Type your post here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex gap-2">
                                <button onClick={() => handlePlatformToggle('twitter')} className={`p-2 rounded-full border transition-all ${selectedPlatforms.includes('twitter') ? 'bg-sky-50 border-sky-200 ring-2 ring-sky-100' : 'bg-white border-gray-200 hover:border-sky-200'}`}>
                                    <Twitter size={18} className={selectedPlatforms.includes('twitter') ? 'text-sky-500' : 'text-gray-400'} />
                                </button>
                                <button onClick={() => handlePlatformToggle('linkedin')} className={`p-2 rounded-full border transition-all ${selectedPlatforms.includes('linkedin') ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-200 hover:border-blue-200'}`}>
                                    <Linkedin size={18} className={selectedPlatforms.includes('linkedin') ? 'text-blue-700' : 'text-gray-400'} />
                                </button>
                                <button onClick={() => handlePlatformToggle('instagram')} className={`p-2 rounded-full border transition-all ${selectedPlatforms.includes('instagram') ? 'bg-pink-50 border-pink-200 ring-2 ring-pink-100' : 'bg-white border-gray-200 hover:border-pink-200'}`}>
                                    <Instagram size={18} className={selectedPlatforms.includes('instagram') ? 'text-pink-600' : 'text-gray-400'} />
                                </button>
                                <button onClick={() => handlePlatformToggle('facebook')} className={`p-2 rounded-full border transition-all ${selectedPlatforms.includes('facebook') ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-200 hover:border-blue-200'}`}>
                                    <Facebook size={18} className={selectedPlatforms.includes('facebook') ? 'text-blue-600' : 'text-gray-400'} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleGenerateHashtags}
                                    disabled={!content || isGenerating}
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {isGenerating ? <Loader2 size={14} className="animate-spin mr-1"/> : <Wand2 size={14} className="mr-1"/>}
                                    AI Hashtags
                                </button>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <input 
                                    type="date" 
                                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button 
                                onClick={handleCreatePost} 
                                disabled={!content || selectedPlatforms.length === 0 || isPublishing}
                                isLoading={isPublishing}
                            >
                                {scheduledDate ? 'Schedule Post' : 'Publish Now'} <Send size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Feed List */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Recent Posts</h3>
                    {posts.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                            No posts yet. Create your first one!
                        </div>
                    ) : (
                        posts.map(post => (
                            <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-indigo-200 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-2">
                                        {post.platforms.map(p => (
                                            <div key={p} className="p-1.5 bg-gray-50 rounded-full border border-gray-100">
                                                {getPlatformIcon(p, 14)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                            ${post.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 
                                              post.status === 'Scheduled' ? 'bg-amber-50 text-amber-700' : 
                                              'bg-gray-100 text-gray-600'}`}>
                                            {post.status}
                                        </span>
                                        <button onClick={() => deleteSocialPost(post.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-800 text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1"><ThumbsUp size={14}/> {post.likes || 0}</span>
                                        <span className="flex items-center gap-1"><MessageCircle size={14}/> {post.comments || 0}</span>
                                        <span className="flex items-center gap-1"><Share2 size={14}/> {post.shares || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12}/> {post.scheduledDate}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW & CHANNELS */}
            <div className="space-y-6">
                {/* Preview Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700 text-sm">
                        Live Preview
                    </div>
                    <div className="p-6 bg-gray-100 min-h-[200px] flex items-center justify-center">
                        <div className="bg-white w-full max-w-[280px] rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
                                <div>
                                    <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-2 w-12 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs text-gray-800 leading-relaxed">
                                    {content || <span className="text-gray-300 italic">Type to preview...</span>}
                                </div>
                                <div className="h-32 bg-gray-100 rounded-md w-full flex items-center justify-center text-gray-300">
                                    <ImageIcon size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Channels Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Connected Channels</h3>
                    <div className="space-y-3">
                        {connections.map(conn => (
                            <div key={conn.platform} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-gray-100 rounded-full shadow-sm">
                                        {getPlatformIcon(conn.platform)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium text-gray-900">{getPlatformName(conn.platform)}</div>
                                            {conn.connected ? (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    Connected
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    Disconnected
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {conn.connected ? (conn.username || 'Authorized') : 'Access required'}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleConnectClick(conn.platform)}
                                    className={`text-xs px-2 py-1 rounded-md font-medium transition-colors border
                                        ${conn.connected 
                                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                            : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'}`}
                                >
                                    {conn.connected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
      )}

      {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Reach</div>
                      <div className="text-2xl font-bold text-gray-900">{totalReach.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Engagement</div>
                      <div className="text-2xl font-bold text-gray-900">{totalEngagement.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Published Posts</div>
                      <div className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'Published').length}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Avg. Engagement Rate</div>
                      <div className="text-2xl font-bold text-gray-900">
                          {totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(1) : 0}%
                      </div>
                  </div>
              </div>

              {/* Time Series Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                  {/* Reach & Engagement Trends */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <TrendingUp size={16} className="text-indigo-600" /> Performance Trends (Reach vs Engagement)
                      </h4>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                  <Legend />
                                  <Line yAxisId="left" type="monotone" dataKey="reach" name="Reach" stroke="#818cf8" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                                  <Line yAxisId="right" type="monotone" dataKey="engagement" name="Engagement" stroke="#34d399" strokeWidth={2} dot={{r: 4}} />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Follower Growth (Mock Data) */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Users size={16} className="text-pink-600" /> Follower Growth by Platform
                      </h4>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={followerGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                  <defs>
                                      <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorLinkedin" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.1}/>
                                          <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#db2777" stopOpacity={0.1}/>
                                          <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                  <Area type="monotone" dataKey="twitter" name="Twitter" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTwitter)" />
                                  <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#1d4ed8" fillOpacity={1} fill="url(#colorLinkedin)" />
                                  <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#db2777" fillOpacity={1} fill="url(#colorInstagram)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* Breakdown Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-900 mb-6">Performance Breakdown</h4>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={platformPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                  <Legend />
                                  <Bar dataKey="reach" name="Reach" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                  <Bar dataKey="engagement" name="Engagement" fill="#34d399" radius={[4, 4, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-900 mb-6">Engagement Mix</h4>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={engagementDistribution}
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {engagementDistribution.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* OAuth Authorization Modal */}
      {targetPlatform && (
        <Modal isOpen={connectModalOpen} onClose={() => setConnectModalOpen(false)} title={`Connect to ${getPlatformName(targetPlatform)}`}>
            <div className="text-center py-6">
                <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                   {getPlatformIcon(targetPlatform, 32)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Authorize Visionary Space</h3>
                <p className="text-sm text-gray-500 px-8 mb-8">
                    Visionary Space is requesting permission to access your {getPlatformName(targetPlatform)} account to:
                </p>

                <div className="max-w-xs mx-auto text-left space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                        <span>Read your profile information</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                        <span>Create and publish posts</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                        <span>Access analytics data</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 px-8">
                    <Button 
                        size="lg" 
                        className="w-full justify-center" 
                        onClick={handleOAuthAuthorize}
                        isLoading={isConnecting}
                    >
                        {isConnecting ? 'Authenticating...' : 'Authorize App'}
                    </Button>
                    <button 
                        onClick={() => setConnectModalOpen(false)}
                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                        disabled={isConnecting}
                    >
                        Cancel
                    </button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-1 text-xs text-gray-400">
                    <ShieldCheck size={12} />
                    <span>Secure Connection via OAuth 2.0</span>
                </div>
            </div>
        </Modal>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
            <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4">
                <div className="h-8 w-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={18} />
                </div>
                <div>
                    <div className="font-semibold text-sm">Success</div>
                    <div className="text-xs text-gray-300">{successMessage}</div>
                </div>
                <button 
                    onClick={() => setSuccessMessage(null)}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
