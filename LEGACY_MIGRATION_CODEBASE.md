# Legacy Migration Codebase Guide

## 📁 **File Structure**

```
VS-CRM-Main/
├── frontend/
│   ├── components/
│   │   ├── LegacyMigration.tsx          ← MAIN WIZARD (800+ lines)
│   │   ├── DataArchitectureInfographic.tsx  ← Visual infographic
│   │   └── settings/
│   │       └── DataIntegrations.tsx     ← Entry point with "Start Migration" button
│   ├── services/
│   │   └── dataMigration.ts             ← Mock data & simulation functions
│   ├── types.ts                         ← Migration types
│   └── App.tsx                          ← Route: 'migration'
├── backend/
│   ├── drivePermissions.js              ← 12 departments permissions
│   └── setupDriveFolders.js             ← Creates 81 folders
└── docs/
    └── LEGACY_MIGRATION_UI_PLAN.md      ← Implementation roadmap
```

---

## 🎯 **Main Component: LegacyMigration.tsx**

**Location**: `frontend/components/LegacyMigration.tsx`

### **Structure**:
```typescript
export default function LegacyMigration() {
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [cloudStorage, setCloudStorage] = useState<CloudStorageConnection>();
  const [uploadedFiles, setUploadedFiles] = useState<LegacyFile[]>([]);
  const [classifying, setClassifying] = useState(false);
  const [importing, setImporting] = useState(false);
  const [migrationSession, setMigrationSession] = useState<MigrationSession | null>(null);

  // Step 1: Connect Drive
  const handleConnectDrive = async () => { ... }

  // Step 2: Upload Files
  const handleFileUpload = async (event) => { ... }
  const handleUseMockFiles = () => { ... }
  // ⚠️ MISSING: handlePullFromDrive() ← TO BE ADDED

  // Step 3: Classify
  const handleClassify = async () => { ... }

  // Step 4: Review
  const handleEditFile = (fileId, updates) => { ... }
  const handleApproveAll = () => { ... }

  // Step 5: Import
  const handleImport = async () => { ... }

  // Render 6 steps
  return (
    <div>
      {/* Stepper */}
      {/* Step Content */}
      {/* Navigation */}
    </div>
  );
}
```

### **Key Functions**:

| Function | Line | Purpose |
|----------|------|---------|
| `handleConnectDrive()` | ~50 | Mock OAuth connection |
| `handleFileUpload()` | ~60 | Upload files from computer |
| `handleUseMockFiles()` | ~75 | Load 12 mock files |
| `handleClassify()` | ~80 | AI classification simulation |
| `handleEditFile()` | ~90 | Edit file classification |
| `handleApproveAll()` | ~95 | Approve all files |
| `handleImport()` | ~100 | Import to CRM |

---

## 🔧 **Services: dataMigration.ts**

**Location**: `frontend/services/dataMigration.ts`

### **Exported Functions**:

```typescript
// Mock Data
export const mockLegacyFiles: LegacyFile[]  // 12 sample files
export const mockCloudStorage: CloudStorageConnection

// Simulation Functions
export const simulateConnectDrive = async (): Promise<CloudStorageConnection>
export const simulateFileUpload = async (file: File, onProgress): Promise<LegacyFile>
export const simulateAIClassification = async (files, onProgress): Promise<LegacyFile[]>
export const simulateDataExtraction = async (file): Promise<any>

// Helper Functions
export const getCountryFlag = (countryCode): string
export const getDepartmentIcon = (departmentId): string
export const getDepartmentName = (departmentId): string
export const formatFileSize = (bytes): string
export const createMockMigrationSession = (): MigrationSession

// ⚠️ TO BE ADDED:
// export const simulatePullFromDrive = async (): Promise<LegacyFile[]>
```

---

## 📊 **Types: types.ts**

**Location**: `frontend/types.ts`

### **Migration Types** (lines 350-420):

```typescript
export type MigrationStatus = 'not-started' | 'uploading' | 'classifying' | 'reviewing' | 'importing' | 'complete';

export type ClassificationStatus = 'pending' | 'auto-approved' | 'needs-review' | 'approved' | 'rejected';

export type DepartmentId = 'creative' | 'media' | 'strategy' | 'digital' | 'production' | 
  'client_services' | 'data_analytics' | 'finance' | 'operations' | 'hr' | 'technology' | 'business_dev';

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
```

---

## 🎨 **Entry Point: DataIntegrations.tsx**

**Location**: `frontend/components/settings/DataIntegrations.tsx`

### **Legacy Migration Section** (lines 100-130):

```tsx
{/* Legacy Migration */}
<div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
        <Upload size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">Legacy Data Migration</h3>
        <p className="text-sm text-indigo-100 mt-1">Import old files with AI-powered classification</p>
      </div>
    </div>
    <Button
      onClick={() => window.location.hash = 'migration'}
      className="bg-white text-indigo-600 hover:bg-indigo-50 border-none"
    >
      Start Migration →
    </Button>
  </div>
  {/* Feature highlights */}
</div>
```

---

## 🚀 **How to Add "Pull from Drive" Feature**

### **Step 1: Add to dataMigration.ts**

```typescript
// Add this function to frontend/services/dataMigration.ts

export const simulatePullFromDrive = async (
  onProgress: (progress: number, fileName: string) => void
): Promise<LegacyFile[]> => {
  // Simulate fetching files from Drive
  const driveFiles: LegacyFile[] = [];
  
  // Mock files from "Legacy Inbox" folder
  const mockDriveFiles = [
    'Old_Campaign_Data_2023.xlsx',
    'Client_Contacts_Archive.csv',
    'Budget_History.xlsx',
    'Meeting_Notes_2023.pdf',
    'Project_Files_Archive.zip',
  ];

  for (let i = 0; i < mockDriveFiles.length; i++) {
    const fileName = mockDriveFiles[i];
    onProgress(Math.floor(((i + 1) / mockDriveFiles.length) * 100), fileName);
    
    // Simulate fetch delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create LegacyFile object
    const file: LegacyFile = {
      id: 'drive-' + Date.now() + '-' + i,
      name: fileName,
      size: Math.floor(Math.random() * 5000000) + 500000,
      type: fileName.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
            fileName.endsWith('.csv') ? 'text/csv' :
            fileName.endsWith('.pdf') ? 'application/pdf' : 'application/zip',
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    };
    
    driveFiles.push(file);
  }

  return driveFiles;
};
```

### **Step 2: Update LegacyMigration.tsx**

Add this to the component (around line 80):

```typescript
// Add state for pulling from Drive
const [pullingFromDrive, setPullingFromDrive] = useState(false);
const [pullProgress, setPullProgress] = useState(0);
const [currentPullingFile, setCurrentPullingFile] = useState('');

// Add handler
const handlePullFromDrive = async () => {
  setPullingFromDrive(true);
  const files = await simulatePullFromDrive((progress, fileName) => {
    setPullProgress(progress);
    setCurrentPullingFile(fileName);
  });
  setUploadedFiles(prev => [...prev, ...files]);
  setPullingFromDrive(false);
  setPullProgress(0);
};
```

### **Step 3: Update Step 2 UI**

Replace the upload section with:

```tsx
{/* Step 2: Upload */}
{currentStep === 2 && (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <div className="text-6xl mb-4">📤</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Legacy Files
      </h2>
      <p className="text-gray-600">
        Upload from computer or pull from your connected Drive
      </p>
    </div>

    <div className="max-w-2xl mx-auto space-y-4">
      {/* Pull from Drive */}
      {cloudStorage.connected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-blue-900">Pull from Google Drive</div>
              <div className="text-sm text-blue-700">
                Fetch files from your "Legacy Inbox" folder
              </div>
            </div>
            <Button 
              onClick={handlePullFromDrive}
              isLoading={pullingFromDrive}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Cloud size={16} className="mr-2" />
              Pull from Drive
            </Button>
          </div>
          
          {pullingFromDrive && (
            <div className="mt-4">
              <div className="text-sm text-blue-700 mb-2">
                Fetching: {currentPullingFile}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${pullProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Upload Zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors">
        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-700 font-medium mb-2">
          Or drop files here to upload from computer
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports: Excel, Word, PDF, CSV, Images
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button onClick={handleFileSelect} variant="secondary">
          Browse Files
        </Button>
      </div>

      {/* Mock Data Button */}
      <div className="text-center">
        <Button onClick={handleUseMockFiles} variant="secondary">
          Use Mock Files (12 files)
        </Button>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="font-semibold text-gray-900 mb-3">
            Uploaded Files ({uploadedFiles.length})
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles.map(file => (
              <div key={file.id} className="bg-white rounded p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {file.id.startsWith('drive-') ? '☁️' : '📄'}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                      {file.id.startsWith('drive-') && (
                        <span className="ml-2 text-blue-600">from Drive</span>
                      )}
                    </div>
                  </div>
                </div>
                <Check className="text-green-600" size={20} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}
```

---

## 📝 **Summary of Changes Needed**

1. **Add to `dataMigration.ts`**: `simulatePullFromDrive()` function
2. **Update `LegacyMigration.tsx`**: 
   - Add state: `pullingFromDrive`, `pullProgress`, `currentPullingFile`
   - Add handler: `handlePullFromDrive()`
   - Update Step 2 UI with "Pull from Drive" section
3. **Visual indicator**: Show ☁️ icon for Drive files vs 📄 for uploaded files

---

## 🎯 **Result**

Users will be able to:
- ✅ Click "Pull from Drive" button
- ✅ See progress: "Fetching: Old_Campaign_Data_2023.xlsx"
- ✅ Watch progress bar fill up
- ✅ See files appear with ☁️ icon (from Drive) vs 📄 (uploaded)
- ✅ Continue with classification as normal

**This creates a seamless experience where users can pull files directly from their connected Google Drive instead of manually uploading!**
