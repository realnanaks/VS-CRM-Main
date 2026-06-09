// Mock data for AI Intelligence features
// This file contains realistic mock data for all AI prototypes

export const mockRevenueForecast = [
  { month: 'Jan', actual: 45000, predicted: 48000, confidence: 85 },
  { month: 'Feb', actual: 52000, predicted: 54000, confidence: 82 },
  { month: 'Mar', actual: 48000, predicted: 51000, confidence: 88 },
  { month: 'Apr', actual: 0, predicted: 56000, confidence: 78 },
  { month: 'May', actual: 0, predicted: 61000, confidence: 75 },
  { month: 'Jun', actual: 0, predicted: 58000, confidence: 72 },
];

export const mockAnomalies = [
  {
    id: '1',
    type: 'warning',
    title: 'Unusual Budget Spike',
    description: 'Ghana Creative department spent 45% more than usual this week',
    severity: 'medium',
    timestamp: '2 hours ago',
    recommendation: 'Review recent campaign expenses and vendor invoices'
  },
  {
    id: '2',
    type: 'critical',
    title: 'Engagement Drop',
    description: 'Social media engagement down 32% across Nigeria channels',
    severity: 'high',
    timestamp: '5 hours ago',
    recommendation: 'Analyze content performance and adjust posting strategy'
  },
  {
    id: '3',
    type: 'info',
    title: 'Positive Trend',
    description: 'Email open rates increased 18% in South Africa',
    severity: 'low',
    timestamp: '1 day ago',
    recommendation: 'Document successful tactics for replication'
  },
];

export const mockCampaignPredictions = [
  {
    id: '1',
    name: 'Summer Sale 2026',
    predictedROI: 3.2,
    predictedReach: 125000,
    predictedEngagement: 8.5,
    confidence: 82,
    recommendation: 'Increase budget by 15% for optimal results'
  },
  {
    id: '2',
    name: 'Back to School',
    predictedROI: 2.8,
    predictedReach: 98000,
    predictedEngagement: 6.2,
    confidence: 75,
    recommendation: 'Consider targeting younger demographics'
  },
];

export const mockContentScores = {
  overall: 78,
  readability: 85,
  engagement: 72,
  seo: 80,
  brandAlignment: 75,
  suggestions: [
    'Add more emotional triggers in the opening paragraph',
    'Include a clear call-to-action in the first 100 words',
    'Optimize for mobile reading with shorter paragraphs',
    'Add 2-3 relevant keywords naturally'
  ]
};

export const mockSubjectLines = [
  { original: 'Newsletter - May 2026', score: 45, improved: '🎉 Your Exclusive May Insights Are Here!', improvedScore: 82 },
  { original: 'Product Update', score: 38, improved: 'You Asked, We Delivered: 3 New Features Inside', improvedScore: 76 },
  { original: 'Special Offer', score: 52, improved: '24 Hours Only: Save 30% on Your Favorite Products', improvedScore: 88 },
];

export const mockSendTimes = [
  { day: 'Monday', times: [{ hour: 9, engagement: 65 }, { hour: 14, engagement: 72 }, { hour: 18, engagement: 58 }] },
  { day: 'Tuesday', times: [{ hour: 9, engagement: 70 }, { hour: 14, engagement: 78 }, { hour: 18, engagement: 62 }] },
  { day: 'Wednesday', times: [{ hour: 9, engagement: 68 }, { hour: 14, engagement: 82 }, { hour: 18, engagement: 60 }] },
  { day: 'Thursday', times: [{ hour: 9, engagement: 72 }, { hour: 14, engagement: 75 }, { hour: 18, engagement: 65 }] },
  { day: 'Friday', times: [{ hour: 9, engagement: 60 }, { hour: 14, engagement: 55 }, { hour: 18, engagement: 48 }] },
];

export const mockAutomationRules = [
  {
    id: '1',
    name: 'Auto-assign High-Value Leads',
    status: 'active',
    trigger: 'Lead score > 80',
    action: 'Assign to senior sales rep',
    executions: 127,
    successRate: 94
  },
  {
    id: '2',
    name: 'Follow-up Reminder',
    status: 'active',
    trigger: 'No contact in 7 days',
    action: 'Send reminder to account manager',
    executions: 89,
    successRate: 88
  },
  {
    id: '3',
    name: 'Campaign Auto-categorization',
    status: 'paused',
    trigger: 'New campaign created',
    action: 'Categorize by keywords',
    executions: 45,
    successRate: 76
  },
];

export const mockNLQueries = [
  'Which campaigns in Nigeria had the best ROI last month?',
  'Show me all high-risk deals in Ghana',
  'Compare social media engagement across all countries',
  'What are the top 5 performing assets this quarter?',
  'List contacts who haven\'t been contacted in 30 days'
];

export const mockQueryResults = {
  query: 'Which campaigns in Nigeria had the best ROI last month?',
  results: [
    { campaign: 'Lagos Tech Summit', roi: 4.2, spend: 15000, revenue: 63000 },
    { campaign: 'Abuja Fashion Week', roi: 3.8, spend: 22000, revenue: 83600 },
    { campaign: 'Port Harcourt Food Festival', roi: 3.1, spend: 18000, revenue: 55800 },
  ],
  insights: 'Tech-focused campaigns show 35% higher ROI than other categories in Nigeria.'
};

export const mockCompetitors = [
  {
    id: '1',
    name: 'Creative Hub Africa',
    marketShare: 18,
    sentiment: 72,
    recentActivity: 'Launched new digital marketing service',
    threat: 'medium'
  },
  {
    id: '2',
    name: 'MediaMax Solutions',
    marketShare: 22,
    sentiment: 68,
    recentActivity: 'Expanded to 3 new countries',
    threat: 'high'
  },
  {
    id: '3',
    name: 'Brand Builders Ltd',
    marketShare: 15,
    sentiment: 65,
    recentActivity: 'Price reduction on core services',
    threat: 'medium'
  },
];

export const mockOpportunities = [
  {
    id: '1',
    title: 'Untapped Market: Fintech Sector',
    priority: 'high',
    potential: '$250K annual revenue',
    description: 'Only 12% of fintech companies in our markets use professional marketing agencies',
    action: 'Develop fintech-specific service package'
  },
  {
    id: '2',
    title: 'Content Marketing Gap',
    priority: 'medium',
    potential: '$180K annual revenue',
    description: 'Competitors lack strong content marketing offerings',
    action: 'Launch content marketing division'
  },
];

export const mockClientHealth = [
  {
    id: '1',
    name: 'TechNova Solutions',
    healthScore: 85,
    trend: 'up',
    churnRisk: 12,
    upsellPotential: 'high',
    lastInteraction: '2 days ago',
    sentiment: 'positive'
  },
  {
    id: '2',
    name: 'Global Retail Corp',
    healthScore: 45,
    trend: 'down',
    churnRisk: 68,
    upsellPotential: 'low',
    lastInteraction: '21 days ago',
    sentiment: 'negative'
  },
  {
    id: '3',
    name: 'Startup Innovations',
    healthScore: 72,
    trend: 'stable',
    churnRisk: 25,
    upsellPotential: 'medium',
    lastInteraction: '5 days ago',
    sentiment: 'neutral'
  },
];

export const mockUpsellOpportunities = [
  {
    clientId: '1',
    clientName: 'TechNova Solutions',
    opportunity: 'Social Media Management',
    confidence: 82,
    estimatedValue: 15000,
    reasoning: 'Client recently expanded social presence but managing in-house'
  },
  {
    clientId: '3',
    clientName: 'Startup Innovations',
    opportunity: 'Video Production Services',
    confidence: 75,
    estimatedValue: 12000,
    reasoning: 'Increased budget allocation for video content in Q2'
  },
];

export const mockDocumentExtractions = [
  {
    id: '1',
    fileName: 'Q1_Budget_Report.xlsx',
    status: 'completed',
    extractedData: {
      totalBudget: 125000,
      spent: 98500,
      campaigns: 12,
      departments: 5
    },
    confidence: 94
  },
  {
    id: '2',
    fileName: 'Client_Contract_TechNova.pdf',
    status: 'processing',
    extractedData: null,
    confidence: 0
  },
];

export const mockAgents = [
  {
    id: 'campaign',
    name: 'Campaign Specialist',
    icon: '🎯',
    description: 'Expert in campaign optimization and performance analysis',
    specialty: 'Marketing campaigns, ROI optimization, A/B testing',
    activeConversations: 23
  },
  {
    id: 'sales',
    name: 'Sales Advisor',
    icon: '💼',
    description: 'Specializes in deal progression and sales forecasting',
    specialty: 'Pipeline management, deal scoring, sales strategy',
    activeConversations: 18
  },
  {
    id: 'finance',
    name: 'Finance Analyst',
    icon: '💰',
    description: 'Expert in budgets, forecasting, and financial anomalies',
    specialty: 'Budget analysis, expense tracking, financial forecasting',
    activeConversations: 12
  },
  {
    id: 'content',
    name: 'Content Strategist',
    icon: '✍️',
    description: 'Specializes in content creation and optimization',
    specialty: 'Content scoring, SEO, copywriting, engagement',
    activeConversations: 31
  },
  {
    id: 'coordinator',
    name: 'AI Coordinator',
    icon: '🤖',
    description: 'Routes your queries to the right specialist',
    specialty: 'Query routing, multi-agent coordination',
    activeConversations: 156
  },
];

export const mockConversationHistory = [
  {
    role: 'user',
    message: 'Why did our Nigeria campaigns underperform last month?',
    timestamp: '10:23 AM'
  },
  {
    role: 'agent',
    agent: 'campaign',
    message: 'I analyzed your Nigeria campaigns and found 3 key factors: 1) 28% lower engagement on weekends, 2) Budget allocation favored underperforming channels, 3) Creative fatigue - same assets used for 6+ weeks. I recommend refreshing creative assets and reallocating 20% of budget from display to social media.',
    timestamp: '10:24 AM',
    charts: ['engagement-timeline', 'budget-allocation']
  },
];

export const mockFeedbackHistory = [
  {
    id: '1',
    feature: 'Lead Scoring',
    prediction: 'High probability (85%)',
    actualOutcome: 'Converted',
    feedback: 'accurate',
    date: '2 days ago'
  },
  {
    id: '2',
    feature: 'Campaign ROI Prediction',
    prediction: 'ROI: 3.2x',
    actualOutcome: 'ROI: 2.8x',
    feedback: 'slightly_off',
    date: '5 days ago'
  },
  {
    id: '3',
    feature: 'Churn Risk',
    prediction: 'Low risk (15%)',
    actualOutcome: 'Client renewed',
    feedback: 'accurate',
    date: '1 week ago'
  },
];

export const mockModelMetrics = {
  leadScoring: { accuracy: 87, improvement: '+5%' },
  campaignPrediction: { accuracy: 82, improvement: '+3%' },
  churnPrediction: { accuracy: 79, improvement: '+8%' },
  contentScoring: { accuracy: 84, improvement: '+2%' },
};
