
import { Contact, Campaign, Promotion, Task, Asset, Journey, Project, Event, AuditLog, CountryCode, User, EventFeedback, Ticket, TicketTier, SocialPost, SocialConnection, Form, FormSubmission, FormField, Deal, Performance, Theme } from '../types';

export let COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [];

// --- INITIAL MOCK DATA ---
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Freeman', email: 'alice@example.com', company: 'TechNova', status: 'Customer', lastContact: '2 days ago', avatar: 'https://picsum.photos/40/40?random=1', country: 'US', score: 85, scoreReason: 'High engagement with recent email campaigns.' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', company: 'LogiCorp', status: 'Lead', lastContact: '5 hours ago', avatar: 'https://picsum.photos/40/40?random=2', country: 'UK', score: 45, scoreReason: 'Visited pricing page but no signup.' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', company: 'BuildIt Inc', status: 'Churned', lastContact: '1 month ago', avatar: 'https://picsum.photos/40/40?random=3', country: 'US', score: 12, scoreReason: 'Unsubscribed from newsletter.' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', company: 'Amazonia', status: 'Customer', lastContact: '1 week ago', avatar: 'https://picsum.photos/40/40?random=4', country: 'DE', score: 92, scoreReason: 'Frequent purchaser and VIP member.' },
  { id: '5', name: 'Evan Wright', email: 'evan@example.com', company: 'WrightDesign', status: 'Lead', lastContact: '3 days ago', avatar: 'https://picsum.photos/40/40?random=5', country: 'FR', score: 65, scoreReason: 'Attended webinar.' },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona@example.com', company: 'Gallagher Ind', status: 'Lead', lastContact: '1 day ago', avatar: 'https://picsum.photos/40/40?random=6', country: 'JP', score: 78, scoreReason: 'Downloaded whitepaper.' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer Sale Launch', status: 'Active', audience: 'All Customers', channel: 'Email', openRate: 45.2, clickRate: 12.5, content: "Subject: ☀️ Summer Sale...", country: 'US', startDate: '2023-06-15' },
  { id: '2', name: 'New Feature Announcement', status: 'Draft', audience: 'Beta Users', channel: 'Email', content: "Subject: Introducing...", country: 'Global', startDate: '2023-10-01' },
  { id: '3', name: 'Re-engagement Q3', status: 'Completed', audience: 'Inactive > 90 days', channel: 'Email', openRate: 22.1, clickRate: 3.4, content: "Subject: We miss you...", country: 'UK', startDate: '2023-09-01' },
];

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Review Q4 Marketing Plan', dueDate: new Date().toISOString().split('T')[0], priority: 'High', completed: false, country: 'US' },
  { id: '2', title: 'Approve new banner ads', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'Medium', completed: false, country: 'Global' },
  { id: '3', title: 'Send invite for webinar', dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], priority: 'High', completed: true, country: 'UK' },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1', name: 'Website Redesign', description: 'Overhaul the homepage and pricing page for better conversion.',
    status: 'Active', progress: 65, dueDate: '2023-12-01', members: ['https://picsum.photos/40/40?random=1', 'https://picsum.photos/40/40?random=2'],
    country: 'Global',
    columns: [
      { id: 'c1', title: 'To Do', tasks: [{ id: 't1', content: 'Draft new copy', priority: 'High' }] },
      { id: 'c2', title: 'In Progress', tasks: [{ id: 't2', content: 'Design hero section', priority: 'Medium', assignee: 'https://picsum.photos/40/40?random=1' }] },
      { id: 'c3', title: 'Done', tasks: [] }
    ]
  },
  {
    id: '2', name: 'Q4 Product Launch', description: 'Go-to-market strategy for the new AI features.',
    status: 'Planning', progress: 15, dueDate: '2023-11-15', members: ['https://picsum.photos/40/40?random=3'],
    country: 'US',
    columns: [
      { id: 'c1', title: 'To Do', tasks: [{ id: 't3', content: 'Define KPIs', priority: 'High' }] },
      { id: 'c2', title: 'In Progress', tasks: [] },
      { id: 'c3', title: 'Done', tasks: [] }
    ]
  }
];

const MOCK_EVENTS: Event[] = [
  {
    id: 'tr-2025', name: 'Tidal Rave 2025', date: '2025-07-26', location: 'La Palm Royal Beach, Accra', attendees: 18000, capacity: 25000, status: 'Active', description: 'The upcoming edition of the biggest beach festival. Ready for live monitoring.', banner: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=1000', country: 'Global', revenue: 150000,
    ticketTiers: [
      { id: 't1', name: 'General Admission', price: 150, capacity: 20000, sold: 5000 },
      { id: 't2', name: 'VIP', price: 400, capacity: 5000, sold: 1000 }
    ],
    performances: [
      { id: 'p1', artistName: 'Sarkodie', timeSlot: '22:00 - 23:00', avgDecibels: 0, peakDecibels: 0, crowdSizeEstimate: 0 },
      { id: 'p2', artistName: 'Black Sherif', timeSlot: '21:00 - 22:00', avgDecibels: 0, peakDecibels: 0, crowdSizeEstimate: 0 },
      { id: 'p3', artistName: 'Shatta Wale', timeSlot: '23:00 - 00:00', avgDecibels: 0, peakDecibels: 0, crowdSizeEstimate: 0 },
      { id: 'p4', artistName: 'R2bees', timeSlot: '20:00 - 21:00', avgDecibels: 0, peakDecibels: 0, crowdSizeEstimate: 0 },
      { id: 'p5', artistName: 'Gyakie', timeSlot: '19:00 - 20:00', avgDecibels: 0, peakDecibels: 0, crowdSizeEstimate: 0 }
    ]
  },
  {
    id: 'tr-2024', name: 'Tidal Rave 2024', date: '2024-07-27', location: 'La Palm Royal Beach, Accra', attendees: 20000, capacity: 20000, status: 'Completed', description: 'Last year\'s sold-out festival. Full analytics available.', banner: 'https://images.unsplash.com/photo-1459749411177-287ce35e8b4f?auto=format&fit=crop&q=80&w=1000', country: 'Global', revenue: 3500000, averageRating: 4.8,
    ticketTiers: [
      { id: 't1', name: 'General Admission', price: 100, capacity: 15000, sold: 15000 },
      { id: 't2', name: 'VIP', price: 300, capacity: 5000, sold: 5000 }
    ],
    performances: [
      { id: 'p1', artistName: 'Sarkodie', timeSlot: '22:00 - 23:00', avgDecibels: 108, peakDecibels: 118, crowdSizeEstimate: 19500 },
      { id: 'p2', artistName: 'Black Sherif', timeSlot: '21:00 - 22:00', avgDecibels: 110, peakDecibels: 122, crowdSizeEstimate: 20000 },
      { id: 'p3', artistName: 'Shatta Wale', timeSlot: '23:00 - 00:00', avgDecibels: 115, peakDecibels: 128, crowdSizeEstimate: 20000 },
      { id: 'p4', artistName: 'R2bees', timeSlot: '20:00 - 21:00', avgDecibels: 102, peakDecibels: 110, crowdSizeEstimate: 18000 },
      { id: 'p5', artistName: 'Gyakie', timeSlot: '19:00 - 20:00', avgDecibels: 95, peakDecibels: 102, crowdSizeEstimate: 15000 }
    ],
    feedback: [
      { id: 'f1', attendeeName: 'Kojo B.', rating: 5, comment: 'Shatta Wale performance was legendary!', sentiment: 'Positive', date: '2024-07-28' },
      { id: 'f2', attendeeName: 'Ama S.', rating: 4, comment: 'Crowd was too packed but music was good.', sentiment: 'Neutral', date: '2024-07-28' },
      { id: 'f3', attendeeName: 'Yaw D.', rating: 5, comment: 'Best Tidal Rave ever.', sentiment: 'Positive', date: '2024-07-28' }
    ]
  },
  {
    id: '2', name: 'Visionary Tech Summit', date: '2023-11-15', location: 'Virtual', attendees: 120, capacity: 500, status: 'Scheduled', description: 'Annual developer conference.', banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000', country: 'Global', revenue: 0,
    ticketTiers: [{ id: 't3', name: 'Online Pass', price: 0, capacity: 500, sold: 120 }]
  },
  {
    id: '3', name: 'Product Launch Gala', date: '2023-09-10', location: 'Grand Hotel, London', attendees: 200, capacity: 200, status: 'Completed', description: 'Exclusive invite-only launch event.', banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000', country: 'UK', revenue: 0, averageRating: 4.8,
    ticketTiers: [{ id: 't4', name: 'Invite Only', price: 0, capacity: 200, sold: 200 }],
    feedback: [
      { id: 'f1', attendeeName: 'Sarah Jenkins', rating: 5, comment: 'Absolutely stunning event. The reveal was magical.', sentiment: 'Positive', date: '2023-09-11' },
      { id: 'f2', attendeeName: 'Mike Ross', rating: 4, comment: 'Great networking, but the food ran out a bit fast.', sentiment: 'Neutral', date: '2023-09-11' },
      { id: 'f3', attendeeName: 'Jessica P.', rating: 5, comment: 'Best launch I have attended in years.', sentiment: 'Positive', date: '2023-09-12' }
    ],
    performances: [
      { id: 'p4', artistName: 'CEO Keynote', timeSlot: '19:00', avgDecibels: 75, peakDecibels: 85, crowdSizeEstimate: 200 },
      { id: 'p5', artistName: 'Live Jazz Band', timeSlot: '20:30', avgDecibels: 88, peakDecibels: 95, crowdSizeEstimate: 180 }
    ]
  }
];

const MOCK_PROMOTIONS: Promotion[] = [
  { id: '1', name: 'Welcome Deposit Bonus', description: '100% match up to $500.', qualificationCriteria: 'First deposit > $20', reward: '$500 Bonus Cash', requiresOptIn: true, status: 'Active', country: 'US' },
  { id: '2', name: 'Free Spins Friday', description: 'Get 50 spins on Starburst.', qualificationCriteria: 'Wager $50 on slots', reward: '50 Free Spins', requiresOptIn: true, status: 'Active', country: 'UK' },
];

const MOCK_ASSETS: Asset[] = [
  { id: '1', name: 'Summer Campaign Hero.jpg', type: 'image', url: 'https://picsum.photos/400/400?random=10', tags: ['summer', 'hero', 'beach'], uploadedBy: 'Alice', uploadedAt: '2023-06-01', country: 'Global' },
  { id: '2', name: 'Q4 Strategy.pdf', type: 'document', url: '#', tags: ['strategy', 'q4', 'planning'], uploadedBy: 'Bob', uploadedAt: '2023-09-15', country: 'US' },
];

const MOCK_JOURNEYS: Journey[] = [
  {
    id: '1', name: 'New User Onboarding', status: 'Active', country: 'Global',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'User Signs Up', x: 50, y: 50 },
      { id: 'n2', type: 'wait', label: 'Wait 1 Hour', x: 250, y: 50 },
      { id: 'n3', type: 'action', label: 'Send Welcome Email', x: 450, y: 50 }
    ],
    connections: [
      { id: 'c1', source: 'n1', target: 'n2' },
      { id: 'c2', source: 'n2', target: 'n3' }
    ]
  },
  {
    id: '2', name: 'Cart Abandonment Recovery', status: 'Draft', country: 'US',
    nodes: [
      { id: 'n1', type: 'trigger', label: 'Cart Abandoned', x: 50, y: 50 },
      { id: 'n2', type: 'condition', label: 'Cart Value > $100', x: 250, y: 50 },
      { id: 'n3', type: 'action', label: 'Send Discount Email', x: 450, y: 0 },
      { id: 'n4', type: 'action', label: 'Send Reminder Email', x: 450, y: 100 }
    ],
    connections: [
      { id: 'c1', source: 'n1', target: 'n2' },
      { id: 'c2', source: 'n2', target: 'n3' },
      { id: 'c3', source: 'n2', target: 'n4' }
    ]
  }
];

const MOCK_SOCIAL_POSTS: SocialPost[] = [
  { id: '1', content: 'Excited to announce our new summer collection! ☀️ #SummerVibes', platforms: ['twitter', 'instagram'], scheduledDate: '2023-10-25', status: 'Published', likes: 124, shares: 45, comments: 12, reach: 5400, country: 'Global' },
  { id: '2', content: 'Join our webinar on Q4 trends. Link in bio.', platforms: ['linkedin'], scheduledDate: '2023-11-02', status: 'Scheduled', country: 'US' }
];

const MOCK_SOCIAL_CONNECTIONS: SocialConnection[] = [
  { platform: 'twitter', connected: true, username: '@VisionarySpace', lastSync: '10 mins ago' },
  { platform: 'linkedin', connected: true, username: 'Visionary Space Inc.', lastSync: '1 hour ago' },
  { platform: 'instagram', connected: false },
  { platform: 'facebook', connected: false }
];

const MOCK_FORMS: Form[] = [
  {
    id: '1', name: 'Newsletter Signup', status: 'Active', country: 'Global',
    fields: [{ id: 'f1', type: 'email', label: 'Email Address', required: true, placeholder: 'you@company.com' }],
    submissions: 1240, views: 5600, conversionRate: 22.1
  },
  {
    id: '2', name: 'Event Pre-registration', status: 'Draft', country: 'US',
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', required: true },
      { id: 'f2', type: 'email', label: 'Email', required: true },
      { id: 'f3', type: 'select', label: 'Ticket Type', required: false }
    ],
    submissions: 0, views: 12, conversionRate: 0
  }
];

const MOCK_DEALS: Deal[] = [
  { id: '1', title: 'Enterprise License - TechNova', value: 45000, stage: 'Qualified', probability: 40, expectedCloseDate: '2023-12-15', contactName: 'Alice Freeman', country: 'US' },
  { id: '2', title: 'Consulting Retainer - LogiCorp', value: 12000, stage: 'Discovery', probability: 20, expectedCloseDate: '2024-01-20', contactName: 'Bob Smith', country: 'UK' },
  { id: '3', title: 'Q4 Ad Campaign - Amazonia', value: 85000, stage: 'Negotiation', probability: 80, expectedCloseDate: '2023-11-30', contactName: 'Diana Prince', country: 'DE' },
  { id: '4', title: 'Platform Audit', value: 5000, stage: 'Closed Won', probability: 100, expectedCloseDate: '2023-10-10', contactName: 'Evan Wright', country: 'FR' }
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@visionary.com', role: 'Super Admin', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff', assignedCountries: ['Global', 'US', 'UK', 'DE', 'FR', 'JP'] },
  { id: 'u2', name: 'Sarah Smith', email: 'sarah@visionary.com', role: 'Country Manager', avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=10b981&color=fff', assignedCountries: ['UK'] },
  { id: 'u3', name: 'Mike Jones', email: 'mike@visionary.com', role: 'Employee', avatar: 'https://ui-avatars.com/api/?name=Mike+Jones&background=f59e0b&color=fff', assignedCountries: ['US'] },
];

const MOCK_LOGS: AuditLog[] = [
  { id: '1', user: 'John Doe', action: 'Created Campaign "Summer Sale"', entity: 'Campaign', timestamp: '2023-10-24 10:30 AM', country: 'US' },
  { id: '2', user: 'Sarah Smith', action: 'Updated Promotion "Welcome Bonus"', entity: 'Promotion', timestamp: '2023-10-24 11:15 AM', country: 'UK' },
];

// --- DATABASE SERVICE ---

interface DatabaseState {
  contacts: Contact[];
  campaigns: Campaign[];
  tasks: Task[];
  projects: Project[];
  events: Event[];
  promotions: Promotion[];
  assets: Asset[];
  journeys: Journey[];
  socialPosts: SocialPost[];
  socialConnections: SocialConnection[];
  forms: Form[];
  formSubmissions: FormSubmission[];
  deals: Deal[];
  logs: AuditLog[];
  users: User[];
  currentUserId: string;
  theme: Theme;
}

export const BASE_API_URL = 'http://localhost:3001/api';
const GLOBAL_COUNTRY_CODE = 'Global';
const DEFAULT_THEME: Theme = 'indigo';

const initialDatabaseState: DatabaseState = {
  contacts: [],
  campaigns: [],
  tasks: [],
  projects: [],
  events: [],
  promotions: [],
  assets: [],
  journeys: [],
  socialPosts: [],
  socialConnections: [],
  forms: [],
  formSubmissions: [],
  deals: [],
  logs: [],
  users: [],
  currentUserId: 'u1',
  theme: DEFAULT_THEME
};

let localDatabaseState: DatabaseState = initialDatabaseState;
const stateChangeSubscribers = new Set<() => void>();

// Load from API
export const initializeDatabase = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard?country=${GLOBAL_COUNTRY_CODE}`);
    const data = await response.json();
    localDatabaseState = { ...initialDatabaseState, ...data };

    // Load countries
    const countriesRes = await fetch(`${BASE_API_URL}/countries`);
    if (countriesRes.ok) {
      COUNTRIES = await countriesRes.json();
    }

    stateChangeSubscribers.forEach(subscriber => subscriber());
  } catch (error) {
    console.error("Failed to load DB from API", error);
  }
};

const notifySubscribers = () => {
  stateChangeSubscribers.forEach(subscriber => subscriber());
};

const persistDatabaseState = () => {
  // No-op for now, as we save individual items via API
  notifySubscribers();
};

export const subscribeToStateChanges = (listener: () => void) => {
  stateChangeSubscribers.add(listener);
  return () => stateChangeSubscribers.delete(listener);
};

// --- ACCESSORS ---

export const getCurrentUser = (): User => {
  return localDatabaseState.users.find(u => u.id === localDatabaseState.currentUserId) || localDatabaseState.users[0];
};

export const switchUser = (userId: string) => {
  if (localDatabaseState.users.find(u => u.id === userId)) {
    localDatabaseState.currentUserId = userId;
    persistDatabaseState();
  }
};

export const getTheme = (): Theme => {
  return localDatabaseState.theme || 'indigo';
};

export const updateTheme = (theme: Theme) => {
  localDatabaseState.theme = theme;
  persistDatabaseState();
};

export const addUser = async (user: Omit<User, 'id' | 'avatar'>) => {
  try {
    const res = await fetch(`${BASE_API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (res.ok) {
      const newUser = await res.json();
      localDatabaseState.users.push(newUser);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const getAllUsers = () => localDatabaseState.users;

export const updateUser = async (user: User) => {
  try {
    const res = await fetch(`${BASE_API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (res.ok) {
      localDatabaseState.users = localDatabaseState.users.map(u => u.id === user.id ? user : u);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const addCountry = async (country: { code: string; name: string; flag: string }) => {
  try {
    const res = await fetch(`${BASE_API_URL}/countries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(country)
    });
    if (res.ok) {
      const newCountry = await res.json();
      COUNTRIES = [...COUNTRIES, newCountry]; // Create new reference
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const updateCountry = async (originalCode: string, country: { code: string; name: string; flag: string }) => {
  try {
    const res = await fetch(`${BASE_API_URL}/countries/${originalCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(country)
    });
    if (res.ok) {
      const updatedCountry = await res.json();
      COUNTRIES = COUNTRIES.map(c => c.code === originalCode ? updatedCountry : c); // Map returns new array
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const deleteCountry = async (code: string) => {
  try {
    const res = await fetch(`${BASE_API_URL}/countries/${code}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      COUNTRIES = COUNTRIES.filter(c => c.code !== code); // Filter returns new array
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const retrieveDashboardData = (country: CountryCode) => {
  // loadDB(); // Don't load on every get, rely on initial load and updates

  const filterByCountry = (item: any) => {
    if (country === 'Global') return true;
    return item.country === country;
  };

  return {
    contacts: localDatabaseState.contacts.filter(filterByCountry),
    campaigns: localDatabaseState.campaigns.filter(filterByCountry),
    tasks: localDatabaseState.tasks.filter(filterByCountry),
    projects: localDatabaseState.projects.filter(filterByCountry),
    events: localDatabaseState.events.filter(filterByCountry),
    promotions: localDatabaseState.promotions.filter(filterByCountry),
    assets: localDatabaseState.assets.filter(filterByCountry),
    journeys: localDatabaseState.journeys.filter(filterByCountry),
    socialPosts: localDatabaseState.socialPosts.filter(filterByCountry),
    socialConnections: localDatabaseState.socialConnections,
    forms: localDatabaseState.forms.filter(filterByCountry),
    deals: localDatabaseState.deals.filter(filterByCountry),
    logs: localDatabaseState.logs.filter(filterByCountry),
    user: getCurrentUser(),
    theme: localDatabaseState.theme,
    countries: COUNTRIES
  };
};

// --- MUTATIONS ---

// CONTACTS
export const addContact = async (contact: Contact) => {
  try {
    const res = await fetch(`${BASE_API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    if (res.ok) {
      localDatabaseState.contacts.unshift(contact);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const updateContact = (contact: Contact) => {
  localDatabaseState.contacts = localDatabaseState.contacts.map(c => c.id === contact.id ? contact : c);
  persistDatabaseState();
};

export const importContacts = (newContacts: Contact[]) => {
  localDatabaseState.contacts = [...newContacts, ...localDatabaseState.contacts];
  logAction(`Imported ${newContacts.length} contacts`, 'Contact', newContacts[0].country);
  persistDatabaseState();
};

// TASKS
export const addTask = async (task: Task) => {
  try {
    const res = await fetch(`${BASE_API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (res.ok) {
      localDatabaseState.tasks.push(task);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const updateTask = (task: Task) => {
  localDatabaseState.tasks = localDatabaseState.tasks.map(t => t.id === task.id ? task : t);
  persistDatabaseState();
};

export const toggleTask = (id: string) => {
  const task = localDatabaseState.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    persistDatabaseState();
  }
};

export const deleteTask = (id: string) => {
  localDatabaseState.tasks = localDatabaseState.tasks.filter(t => t.id !== id);
  persistDatabaseState();
};

// CAMPAIGNS
export const addCampaign = async (campaign: Campaign) => {
  try {
    const res = await fetch(`${BASE_API_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });
    if (res.ok) {
      localDatabaseState.campaigns.unshift(campaign);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const deleteCampaign = (id: string) => {
  localDatabaseState.campaigns = localDatabaseState.campaigns.filter(c => c.id !== id);
  persistDatabaseState();
};

// PROJECTS
export const addProject = async (project: Project) => {
  try {
    const res = await fetch(`${BASE_API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      localDatabaseState.projects.unshift(project);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const updateProject = (project: Project) => {
  localDatabaseState.projects = localDatabaseState.projects.map(p => p.id === project.id ? project : p);
  persistDatabaseState();
};

// EVENTS
// EVENTS
export const addEvent = async (event: Event) => {
  try {
    const res = await fetch(`${BASE_API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (res.ok) {
      localDatabaseState.events.unshift(event);
      logAction(`Scheduled event ${event.name}`, 'Event', event.country);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const updateEvent = async (event: Event) => {
  try {
    const res = await fetch(`${BASE_API_URL}/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (res.ok) {
      localDatabaseState.events = localDatabaseState.events.map(e => e.id === event.id ? event : e);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const res = await fetch(`${BASE_API_URL}/events/${eventId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      localDatabaseState.events = localDatabaseState.events.filter(e => e.id !== eventId);
      persistDatabaseState();
    }
  } catch (e) { console.error(e); }
};

export const addEventFeedback = (eventId: string, feedback: EventFeedback[]) => {
  const event = localDatabaseState.events.find(e => e.id === eventId);
  if (event) {
    event.feedback = [...(event.feedback || []), ...feedback];

    // Recalculate average rating
    const total = event.feedback.reduce((acc, f) => acc + f.rating, 0);
    event.averageRating = Number((total / event.feedback.length).toFixed(1));

    persistDatabaseState();
  }
};

export const issueTicket = (eventId: string, tierId: string, name: string, email: string) => {
  const event = localDatabaseState.events.find(e => e.id === eventId);
  if (event && event.ticketTiers) {
    const tier = event.ticketTiers.find(t => t.id === tierId);
    if (tier && tier.sold < tier.capacity) {
      tier.sold++;
      event.revenue = (event.revenue || 0) + tier.price;
      event.attendees = (event.attendees || 0) + 1;
      persistDatabaseState();
      return true;
    }
  }
  return false;
};

export const getEventTickets = (eventId: string): Ticket[] => {
  // Generate deterministic mock tickets based on sales count
  const event = localDatabaseState.events.find(e => e.id === eventId);
  const tickets: Ticket[] = [];
  if (event && event.ticketTiers) {
    event.ticketTiers.forEach(tier => {
      for (let i = 0; i < tier.sold; i++) {
        tickets.push({
          id: `${eventId}-${tier.id}-${i}`,
          eventId: event.id,
          tierId: tier.id,
          attendeeName: i === 0 ? 'John Doe' : `Attendee ${i + 1}`,
          attendeeEmail: 'user@example.com',
          purchaseDate: new Date().toISOString(),
          status: 'Valid',
          qrCode: 'mock-qr'
        });
      }
    });
  }
  return tickets;
};

// PROMOTIONS
export const addPromotion = (promo: Promotion) => {
  localDatabaseState.promotions.unshift(promo);
  logAction(`Created promotion ${promo.name}`, 'Promotion', promo.country);
  persistDatabaseState();
};

export const deletePromotion = (id: string) => {
  localDatabaseState.promotions = localDatabaseState.promotions.filter(p => p.id !== id);
  persistDatabaseState();
};

// ASSETS
export const addAsset = (asset: Asset) => {
  localDatabaseState.assets.unshift(asset);
  persistDatabaseState();
};

export const updateAssetTags = (id: string, tags: string[]) => {
  const asset = localDatabaseState.assets.find(a => a.id === id);
  if (asset) {
    asset.tags = tags;
    persistDatabaseState();
  }
};

// SOCIAL
export const addSocialPost = (post: SocialPost) => {
  localDatabaseState.socialPosts.unshift(post);
  persistDatabaseState();
};

export const deleteSocialPost = (id: string) => {
  localDatabaseState.socialPosts = localDatabaseState.socialPosts.filter(p => p.id !== id);
  persistDatabaseState();
};

export const toggleSocialConnection = (platform: string) => {
  const conn = localDatabaseState.socialConnections.find(c => c.platform === platform);
  if (conn) {
    conn.connected = !conn.connected;
    if (conn.connected) {
      conn.username = '@VisionaryUser'; // mock
      conn.lastSync = 'Just now';
    } else {
      conn.username = undefined;
    }
    persistDatabaseState();
  }
};

export const publishToPlatform = async (platform: string): Promise<boolean> => {
  // Mock API delay
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
};

// FORMS
export const addForm = (form: Form) => {
  localDatabaseState.forms.unshift(form);
  logAction(`Created lead form ${form.name}`, 'Form', form.country);
  persistDatabaseState();
};

export const updateForm = (form: Form) => {
  localDatabaseState.forms = localDatabaseState.forms.map(f => f.id === form.id ? form : f);
  persistDatabaseState();
};

export const deleteForm = (id: string) => {
  localDatabaseState.forms = localDatabaseState.forms.filter(f => f.id !== id);
  persistDatabaseState();
};

export const addFormSubmission = (formId: string, data: Record<string, string>) => {
  const submission: FormSubmission = {
    id: Date.now().toString(),
    formId,
    submittedAt: new Date().toISOString(),
    data
  };
  localDatabaseState.formSubmissions.push(submission);

  const form = localDatabaseState.forms.find(f => f.id === formId);
  if (form) {
    form.submissions++;
    // Auto-create contact from submission
    const email = data['email'] || data['Email'];
    if (email) {
      addContact({
        id: Date.now().toString(),
        name: data['name'] || data['Full Name'] || 'Web Lead',
        email: email,
        company: data['company'] || 'N/A',
        status: 'Lead',
        lastContact: 'Just now',
        avatar: `https://picsum.photos/40/40?random=${Date.now()}`,
        country: form.country,
        score: 50,
        scoreReason: 'Captured via web form'
      });
    }
  }
  persistDatabaseState();
};

// DEALS
export const addDeal = (deal: Deal) => {
  localDatabaseState.deals.unshift(deal);
  logAction(`Created deal ${deal.title}`, 'Deal', deal.country);
  persistDatabaseState();
};

export const updateDeal = (deal: Deal) => {
  localDatabaseState.deals = localDatabaseState.deals.map(d => d.id === deal.id ? deal : d);
  persistDatabaseState();
};

export const deleteDeal = (id: string) => {
  localDatabaseState.deals = localDatabaseState.deals.filter(d => d.id !== id);
  persistDatabaseState();
};

// DATA MANAGEMENT
export const getFullDatabase = () => {
  return localDatabaseState;
};

export const restoreDatabase = (jsonString: string) => {
  try {
    const data = JSON.parse(jsonString);
    if (data && data.contacts) {
      localDatabaseState = data;
      persistDatabaseState();
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// LOGGING
const logAction = (action: string, entity: string, country: CountryCode) => {
  const newLog: AuditLog = {
    id: Date.now().toString(),
    user: getCurrentUser().name,
    action,
    entity,
    timestamp: new Date().toLocaleString(),
    country
  };
  localDatabaseState.logs.unshift(newLog);
  // Keep logs manageable
  if (localDatabaseState.logs.length > 100) localDatabaseState.logs = localDatabaseState.logs.slice(0, 100);
};

// SEGMENTS
export const getSegments = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/segments`);
    if (!response.ok) throw new Error('Failed to fetch segments');
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch segments:", error);
    return [];
  }
};

export const createSegment = async (name: string) => {
  try {
    const response = await fetch(`${BASE_API_URL}/segments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create segment');
    return await response.json();
  } catch (error) {
    console.error("Failed to create segment:", error);
    return null;
  }
};

// Initialize
// loadDB(); // Called explicitly by App
