// Mock Data Migration Service
// Simulates the legacy data migration flow with mock data

import { LegacyFile, MigrationSession, CloudStorageConnection, CountryCode, DepartmentId, ClassificationStatus } from '../types';

// Mock Cloud Storage Connection
export const mockCloudStorage: CloudStorageConnection = {
  connected: false,
  email: undefined,
  rootFolderId: undefined,
  folderName: undefined,
  connectedAt: undefined,
};

// Mock Legacy Files for Testing
export const mockLegacyFiles: LegacyFile[] = [
  {
    id: '1',
    name: 'Q3_Campaign_Report.xlsx',
    size: 2457600,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    suggestedCountry: 'GH',
    suggestedDepartment: 'media',
    suggestedType: 'Campaign Report',
    confidenceScore: 96,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Client_Proposal_MTN.docx',
    size: 1048576,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    suggestedCountry: 'GH',
    suggestedDepartment: 'client_services',
    suggestedType: 'Proposal',
    confidenceScore: 88,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Budget_2025.csv',
    size: 524288,
    type: 'text/csv',
    suggestedCountry: 'NG',
    suggestedDepartment: 'finance',
    suggestedType: 'Budget',
    confidenceScore: 72,
    status: 'needs-review',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Team_Photo.jpg',
    size: 3145728,
    type: 'image/jpeg',
    suggestedCountry: 'Global',
    suggestedDepartment: 'creative',
    suggestedType: 'Image',
    confidenceScore: 45,
    status: 'needs-review',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Meeting_Notes_Jan.pdf',
    size: 786432,
    type: 'application/pdf',
    suggestedCountry: 'ZA',
    suggestedDepartment: 'operations',
    suggestedType: 'Meeting Notes',
    confidenceScore: 61,
    status: 'needs-review',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Invoice_GH_001.pdf',
    size: 204800,
    type: 'application/pdf',
    suggestedCountry: 'GH',
    suggestedDepartment: 'finance',
    suggestedType: 'Invoice',
    confidenceScore: 96,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Social_Media_Calendar.xlsx',
    size: 1572864,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    suggestedCountry: 'NG',
    suggestedDepartment: 'digital',
    suggestedType: 'Calendar',
    confidenceScore: 91,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'HR_Policy_Document.docx',
    size: 1310720,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    suggestedCountry: 'Global',
    suggestedDepartment: 'hr',
    suggestedType: 'Policy',
    confidenceScore: 94,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Tech_Infrastructure_Plan.pdf',
    size: 2097152,
    type: 'application/pdf',
    suggestedCountry: 'ZA',
    suggestedDepartment: 'technology',
    suggestedType: 'Plan',
    confidenceScore: 89,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Sales_Pipeline_Q4.xlsx',
    size: 1835008,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    suggestedCountry: 'NG',
    suggestedDepartment: 'business_dev',
    suggestedType: 'Pipeline',
    confidenceScore: 93,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Production_Schedule.xlsx',
    size: 1048576,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    suggestedCountry: 'CI',
    suggestedDepartment: 'production',
    suggestedType: 'Schedule',
    confidenceScore: 87,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Market_Research_Report.pdf',
    size: 3670016,
    type: 'application/pdf',
    suggestedCountry: 'GH',
    suggestedDepartment: 'strategy',
    suggestedType: 'Research',
    confidenceScore: 92,
    status: 'auto-approved',
    uploadedAt: new Date().toISOString(),
  },
];

// Mock Migration Session
export const createMockMigrationSession = (): MigrationSession => {
  const autoApproved = mockLegacyFiles.filter(f => f.status === 'auto-approved').length;
  const needsReview = mockLegacyFiles.filter(f => f.status === 'needs-review').length;

  return {
    id: 'migration-' + Date.now(),
    status: 'not-started',
    startedAt: new Date().toISOString(),
    totalFiles: mockLegacyFiles.length,
    processedFiles: 0,
    autoApproved,
    needsReview,
    files: mockLegacyFiles,
    extractedRecords: {
      contacts: 15,
      campaigns: 8,
      projects: 5,
      deals: 12,
    },
  };
};

// Simulate Google Drive Connection
export const simulateConnectDrive = async (): Promise<CloudStorageConnection> => {
  // Simulate OAuth flow delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    connected: true,
    email: 'you@echohouse.com',
    rootFolderId: 'mock-root-folder-id',
    folderName: 'Echo House',
    connectedAt: new Date().toISOString(),
  };
};

// Simulate File Upload
export const simulateFileUpload = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<LegacyFile> => {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    onProgress(i);
  }

  // Generate random classification
  const countries: CountryCode[] = ['GH', 'NG', 'CI', 'ZA', 'BJ', 'TG', 'Global'];
  const departments: DepartmentId[] = [
    'creative', 'media', 'strategy', 'digital', 'production',
    'client_services', 'data_analytics', 'finance', 'operations',
    'hr', 'technology', 'business_dev'
  ];

  const confidence = Math.floor(Math.random() * 40) + 60; // 60-100
  const status: ClassificationStatus = confidence >= 85 ? 'auto-approved' : 'needs-review';

  return {
    id: 'file-' + Date.now(),
    name: file.name,
    size: file.size,
    type: file.type,
    suggestedCountry: countries[Math.floor(Math.random() * countries.length)],
    suggestedDepartment: departments[Math.floor(Math.random() * departments.length)],
    suggestedType: 'Document',
    confidenceScore: confidence,
    status,
    uploadedAt: new Date().toISOString(),
  };
};

// Simulate AI Classification
export const simulateAIClassification = async (
  files: LegacyFile[],
  onProgress: (progress: number, currentFile: string) => void
): Promise<LegacyFile[]> => {
  const classifiedFiles: LegacyFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = Math.floor(((i + 1) / files.length) * 100);
    
    onProgress(progress, file.name);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    classifiedFiles.push(file);
  }

  return classifiedFiles;
};

// Simulate Data Extraction
export const simulateDataExtraction = async (
  file: LegacyFile
): Promise<any> => {
  // Simulate extraction delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock extracted data based on file type
  if (file.type.includes('spreadsheet') || file.type.includes('csv')) {
    return {
      type: 'tabular',
      rows: Math.floor(Math.random() * 50) + 10,
      columns: ['Name', 'Email', 'Company', 'Country', 'Status'],
      preview: [
        { Name: 'Kwame Mensah', Email: 'kwame@mtn.com', Company: 'MTN Ghana', Country: 'GH', Status: 'Lead' },
        { Name: 'Ngozi Okonkwo', Email: 'ngozi@gtbank.com', Company: 'GTBank', Country: 'NG', Status: 'Customer' },
        { Name: 'Amara Diallo', Email: 'amara@orange.ci', Company: 'Orange CI', Country: 'CI', Status: 'Lead' },
      ],
    };
  } else if (file.type.includes('pdf') || file.type.includes('document')) {
    return {
      type: 'document',
      pages: Math.floor(Math.random() * 20) + 5,
      wordCount: Math.floor(Math.random() * 5000) + 500,
      summary: 'This document contains client proposals, budget information, and strategic planning details.',
    };
  } else {
    return {
      type: 'media',
      dimensions: '1920x1080',
      format: file.type.split('/')[1],
    };
  }
};

// Get country flag emoji
export const getCountryFlag = (countryCode: CountryCode): string => {
  const flags: Record<string, string> = {
    'GH': '🇬🇭',
    'NG': '🇳🇬',
    'CI': '🇨🇮',
    'ZA': '🇿🇦',
    'BJ': '🇧🇯',
    'TG': '🇹🇬',
    'Global': '🌍',
  };
  return flags[countryCode] || '🌍';
};

// Get department icon
export const getDepartmentIcon = (departmentId: DepartmentId): string => {
  const icons: Record<DepartmentId, string> = {
    creative: '🎨',
    media: '📢',
    strategy: '🎯',
    digital: '📱',
    production: '🎥',
    client_services: '👥',
    data_analytics: '📊',
    finance: '💰',
    operations: '⚙️',
    hr: '👤',
    technology: '💻',
    business_dev: '💼',
  };
  return icons[departmentId] || '📁';
};

// Get department name
export const getDepartmentName = (departmentId: DepartmentId): string => {
  const names: Record<DepartmentId, string> = {
    creative: 'Creative',
    media: 'Media & Advertising',
    strategy: 'Strategy & Planning',
    digital: 'Digital & Social',
    production: 'Production',
    client_services: 'Client Services',
    data_analytics: 'Data & Analytics',
    finance: 'Finance',
    operations: 'Operations',
    hr: 'Human Resources',
    technology: 'Technology & IT',
    business_dev: 'Business Development',
  };
  return names[departmentId] || departmentId;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

// Simulate pulling files from Google Drive
export const simulatePullFromDrive = async (
  onProgress: (progress: number, fileName: string) => void
): Promise<LegacyFile[]> => {
  // Simulate fetching files from Drive's "Legacy Inbox" folder
  const driveFiles: LegacyFile[] = [];
  
  // Mock files from Drive
  const mockDriveFiles = [
    { name: 'Old_Campaign_Data_2023.xlsx', size: 2457600, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { name: 'Client_Contacts_Archive.csv', size: 524288, type: 'text/csv' },
    { name: 'Budget_History_2022.xlsx', size: 1835008, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    { name: 'Meeting_Notes_Archive.pdf', size: 786432, type: 'application/pdf' },
    { name: 'Project_Files_2023.zip', size: 5242880, type: 'application/zip' },
  ];

  for (let i = 0; i < mockDriveFiles.length; i++) {
    const mockFile = mockDriveFiles[i];
    const progress = Math.floor(((i + 1) / mockDriveFiles.length) * 100);
    onProgress(progress, mockFile.name);
    
    // Simulate fetch delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random classification
    const countries: CountryCode[] = ['GH', 'NG', 'CI', 'ZA', 'BJ', 'TG', 'Global'];
    const departments: DepartmentId[] = [
      'creative', 'media', 'strategy', 'digital', 'production',
      'client_services', 'data_analytics', 'finance', 'operations',
      'hr', 'technology', 'business_dev'
    ];

    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100
    const status: ClassificationStatus = confidence >= 85 ? 'auto-approved' : 'needs-review';
    
    // Create LegacyFile object with drive- prefix
    const file: LegacyFile = {
      id: 'drive-' + Date.now() + '-' + i,
      name: mockFile.name,
      size: mockFile.size,
      type: mockFile.type,
      suggestedCountry: countries[Math.floor(Math.random() * countries.length)],
      suggestedDepartment: departments[Math.floor(Math.random() * departments.length)],
      suggestedType: 'Document',
      confidenceScore: confidence,
      status,
      uploadedAt: new Date().toISOString(),
    };
    
    driveFiles.push(file);
  }

  return driveFiles;
};
