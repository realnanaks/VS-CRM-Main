
export type CountryCode = string;

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export type Theme = 'indigo' | 'rose' | 'emerald' | 'amber' | 'violet' | 'sky' | 'slate';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Lead' | 'Customer' | 'Churned';
  lastContact: string;
  avatar: string;
  country: CountryCode;
  department?: string;
  score: number; // 0-100
  scoreReason?: string;
}

export interface Prospect extends Contact {
  attendanceScore?: number;
  attendanceReason?: string;
  selected?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Completed';
  audience: string;
  channel: 'Email' | 'Social' | 'Ad' | 'SMS';
  openRate?: number;
  clickRate?: number;
  content?: string;
  country: CountryCode;
  startDate: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  country: CountryCode;
}

export interface ProjectTask {
  id: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee?: string; // Avatar URL
}

export interface ProjectColumn {
  id: string;
  title: string;
  tasks: ProjectTask[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  progress: number;
  dueDate: string;
  members: string[]; // Array of Avatar URLs
  country: CountryCode;
  columns: ProjectColumn[];
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  qualificationCriteria: string;
  reward: string;
  requiresOptIn: boolean;
  status: 'Draft' | 'Active' | 'Expired';
  startDate?: string;
  endDate?: string;
  country: CountryCode;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  country: CountryCode;
}

export interface JourneyNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'wait';
  label: string;
  x: number;
  y: number;
  data?: any;
}

export interface JourneyConnection {
  id: string;
  source: string;
  target: string;
}

export interface Journey {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Paused';
  nodes: JourneyNode[];
  connections: JourneyConnection[];
  country: CountryCode;
}

export type Role = 'Super Admin' | 'Country Manager' | 'Department Lead' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  assignedCountries: CountryCode[];
  assignedDepartments?: string[];
  hasCompletedOnboarding?: boolean;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  country: CountryCode;
}

export interface EventFeedback {
  id: string;
  attendeeName: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  date: string;
}

export interface TicketTier {
  id: string;
  name: string; // e.g., "VIP", "General Admission"
  price: number;
  capacity: number;
  sold: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  tierId: string;
  attendeeName: string;
  attendeeEmail: string;
  purchaseDate: string;
  status: 'Valid' | 'Used' | 'Cancelled';
  qrCode: string;
}

export interface Performance {
  id: string;
  artistName: string;
  timeSlot: string;
  avgDecibels: number; // 80-120 dB
  peakDecibels: number; // Max recorded noise
  crowdSizeEstimate: number;
  artistImage?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
  capacity: number;
  status: 'Scheduled' | 'Active' | 'Completed';
  description: string;
  banner: string;
  country: CountryCode;
  feedback?: EventFeedback[];
  averageRating?: number;
  ticketTiers?: TicketTier[];
  revenue?: number;
  performances?: Performance[];
}

export type SocialPlatform = 'twitter' | 'linkedin' | 'instagram' | 'facebook';

export interface SocialConnection {
  platform: SocialPlatform;
  connected: boolean;
  username?: string;
  avatar?: string;
  lastSync?: string;
}

export interface SocialPost {
  id: string;
  content: string;
  platforms: SocialPlatform[];
  mediaUrl?: string;
  scheduledDate: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  likes?: number;
  shares?: number;
  comments?: number;
  reach?: number;
  country: CountryCode;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select inputs
}

export interface FormSubmission {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, string>;
}

export interface Form {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused';
  fields: FormField[];
  submissions: number;
  views: number;
  conversionRate: number;
  country: CountryCode;
}

export type DealStage = 'Discovery' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number; // 0-100 (Manual or Default)
  expectedCloseDate: string;
  contactId?: string; // Link to contact
  contactName?: string;
  country: CountryCode;
  aiAnalysis?: {
    score: number; // AI Calculated Probability
    reasoning: string;
    lastUpdated: string;
  };
}

export interface ChartData {
  name: string;
  value: number;
  uv?: number;
  pv?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type AppView = 'dashboard' | 'beta_dashboard' | 'projects' | 'contacts' | 'campaigns' | 'advisor' | 'tasks' | 'promotions' | 'automation' | 'calendar' | 'assets' | 'settings' | 'events' | 'social' | 'forms' | 'deals' | 'infographics' | 'files' | 'departments' | 'migration' | 'ai_predictive' | 'ai_content' | 'ai_automation' | 'ai_query' | 'ai_competitive' | 'ai_clients' | 'ai_documents' | 'ai_reporting' | 'ai_training' | 'ai_agents' | 'ai_hub';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabledCountries: CountryCode[];
}

// Google Drive Types
export interface DriveFolder {
  id: string;
  name: string;
  country: CountryCode;
  department: string | null;
  path: string;
  permissions: ('read' | 'write' | 'delete')[];
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

// Legacy Migration Types
export type MigrationStatus = 'not-started' | 'uploading' | 'classifying' | 'reviewing' | 'importing' | 'complete';
export type ClassificationStatus = 'pending' | 'auto-approved' | 'needs-review' | 'approved' | 'rejected';
export type DepartmentId = 'creative' | 'media' | 'strategy' | 'digital' | 'production' | 'client_services' | 'data_analytics' | 'finance' | 'operations' | 'hr' | 'technology' | 'business_dev';

export interface LegacyFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress?: number;
  suggestedCountry?: CountryCode;
  suggestedDepartment?: DepartmentId;
  suggestedType?: string;
  confidenceScore?: number;
  status: ClassificationStatus;
  extractedData?: any;
  uploadedAt?: string;
}

export interface MigrationSession {
  id: string;
  status: MigrationStatus;
  startedAt: string;
  completedAt?: string;
  totalFiles: number;
  processedFiles: number;
  autoApproved: number;
  needsReview: number;
  files: LegacyFile[];
  extractedRecords?: {
    contacts: number;
    campaigns: number;
    projects: number;
    deals: number;
  };
}

export interface CloudStorageConnection {
  connected: boolean;
  email?: string;
  rootFolderId?: string;
  folderName?: string;
  connectedAt?: string;
}
