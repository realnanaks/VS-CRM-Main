# Legacy Data Migration UI/UX - Implementation Plan

**Status**: Foundation Complete - Ready for Full Implementation  
**Date**: May 30, 2026

---

## ✅ **What's Been Completed**

### **1. Type Definitions** ✅
**File**: `frontend/types.ts`
- `MigrationStatus` - Track migration progress
- `ClassificationStatus` - File classification states
- `DepartmentId` - All 12 departments
- `LegacyFile` - File metadata with AI suggestions
- `MigrationSession` - Complete migration session data
- `CloudStorageConnection` - Drive connection state

### **2. Mock Data Service** ✅
**File**: `frontend/services/dataMigration.ts`
- 12 mock legacy files with realistic data
- `simulateConnectDrive()` - Mock OAuth flow
- `simulateFileUpload()` - Mock file upload with progress
- `simulateAIClassification()` - Mock AI processing
- `simulateDataExtraction()` - Mock data parsing
- Helper functions: flags, icons, formatting

### **3. Data Architecture Infographic** ✅
**File**: `frontend/components/DataArchitectureInfographic.tsx`
- **Complete visual representation** of 4-tier architecture
- Data Sources section (Drive, Email, Local, Cloud Apps)
- Tier 1: Raw Files (81 folders, file types)
- Tier 2: Structured Data (Contacts, Campaigns, Projects, Deals)
- Tier 3: Analytics (KPIs, dashboards, trends)
- Tier 4: AI Insights (Predictions, Reports, Queries)
- Bidirectional data flow diagram
- Architecture summary with status

---

## 📋 **What Needs To Be Built**

### **4. Enhanced DataIntegrations Component** (Priority 1)
**File**: `frontend/components/settings/DataIntegrations.tsx`

**Current State**: Basic UI with placeholders  
**Needed Changes**:
```tsx
// Add these sections:
1. Cloud Storage section with:
   - "Connect Google Drive" button (mock OAuth)
   - Connection status display
   - Connected email display
   - "Echo House" folder detected message

2. Legacy Migration section with:
   - Migration status card
   - "Start Migration" button
   - Progress indicator
   - Link to migration wizard

3. Architecture Infographic toggle:
   - "View Data Architecture" button
   - Modal/expandable section showing DataArchitectureInfographic

4. Migration History:
   - List of past migrations
   - Stats (files processed, records imported)
```

**Estimated Lines**: ~200 lines of additions

---

### **5. Legacy Migration Wizard** (Priority 1 - BIGGEST COMPONENT)
**File**: `frontend/components/LegacyMigration.tsx` (NEW)

**6-Step Wizard Structure**:

```tsx
Step 1: Connect & Discover
├─ Mock OAuth button
├─ "Connected as you@echohouse.com" status
├─ "Echo House folder detected" message
└─ Folder structure preview (collapsible tree)

Step 2: Upload Files
├─ Drag & drop zone
├─ File browser button
├─ Upload progress bars (per file)
├─ Total progress indicator
└─ File list with status

Step 3: AI Classification
├─ "Gemini AI analyzing..." animation
├─ Progress bar with current file name
├─ Classification results table
├─ Confidence score badges (green/yellow/red)
└─ Auto-approved vs needs-review counts

Step 4: Review & Approve
├─ Filterable table (all/approved/needs-review)
├─ Edit classification inline
├─ Country/Department dropdowns
├─ Bulk approve button
├─ Individual approve/reject buttons
└─ Folder preview showing where files will go

Step 5: Extract & Import
├─ Data extraction progress
├─ Preview tables (contacts, campaigns, etc.)
├─ Deduplication warnings
├─ Import confirmation
└─ "Import to CRM" button

Step 6: Complete
├─ Success animation
├─ Summary stats (files, records, time)
├─ Links to view imported data
├─ "View in Files" button
├─ "View Dashboard" button
└─ "Start New Migration" button
```

**Key Features**:
- Stepper component showing current step
- Back/Next navigation
- State management for entire flow
- Mock API calls with realistic delays
- Animations and transitions
- Responsive design

**Estimated Lines**: ~800-1000 lines

---

### **6. App.tsx Route Updates** (Priority 2)
**File**: `frontend/App.tsx`

**Add Route**:
```tsx
case 'migration':
  return <LegacyMigration />;
```

**Estimated Lines**: ~5 lines

---

### **7. Sidebar Navigation Update** (Priority 3)
**File**: `frontend/components/layout/Sidebar.tsx`

**Add Menu Item** (optional):
```tsx
{
  icon: Upload,
  label: 'Migration',
  view: 'migration',
  badge: migrationInProgress ? 'In Progress' : undefined
}
```

**Estimated Lines**: ~10 lines

---

## 🎯 **Implementation Order**

| Priority | Component | Effort | Impact |
|----------|-----------|--------|--------|
| **P0** | DataArchitectureInfographic | ✅ DONE | High |
| **P1** | Enhanced DataIntegrations | 2 hours | High |
| **P1** | LegacyMigration Wizard | 4-5 hours | Critical |
| **P2** | App.tsx routes | 15 min | Medium |
| **P3** | Sidebar updates | 15 min | Low |

**Total Remaining Effort**: ~6-7 hours

---

## 🎨 **UI/UX Flow Summary**

```
Settings → Data Integrations
    │
    ├─ ☁️ Cloud Storage
    │   ├─ [Connect Google Drive] → Mock OAuth
    │   └─ Status: Connected as you@echohouse.com
    │
    ├─ 🚚 Legacy Migration
    │   ├─ Status: Not Started
    │   └─ [Start Migration] → Opens Wizard
    │
    ├─ 📊 Data Architecture
    │   └─ [View Architecture] → Shows Infographic
    │
    └─ 📜 Migration History
        └─ List of past migrations

Migration Wizard (6 Steps):
    Step 1: Connect → Mock OAuth + Folder Detection
    Step 2: Upload → Drag & Drop + Progress
    Step 3: Classify → AI Processing + Results
    Step 4: Review → Edit + Approve
    Step 5: Import → Extract + Preview + Confirm
    Step 6: Complete → Summary + Links
```

---

## 📊 **Mock Data Flow**

```javascript
// User clicks "Connect Drive"
simulateConnectDrive() 
  → 1.5s delay
  → Returns: { connected: true, email: 'you@echohouse.com', folderName: 'Echo House' }

// User uploads file
simulateFileUpload(file, onProgress)
  → Progress: 0% → 10% → 20% → ... → 100%
  → Returns: LegacyFile with AI suggestions

// System classifies files
simulateAIClassification(files, onProgress)
  → Processes each file (800ms each)
  → Returns: Array of classified files

// System extracts data
simulateDataExtraction(file)
  → 1s delay
  → Returns: Extracted data preview
```

---

## 🔧 **Technical Details**

### **State Management**
```typescript
const [cloudStorage, setCloudStorage] = useState<CloudStorageConnection>(mockCloudStorage);
const [migrationSession, setMigrationSession] = useState<MigrationSession | null>(null);
const [currentStep, setCurrentStep] = useState(1);
const [uploadedFiles, setUploadedFiles] = useState<LegacyFile[]>([]);
const [classifying, setClassifying] = useState(false);
const [importing, setImporting] = useState(false);
```

### **Key Functions**
```typescript
const handleConnectDrive = async () => {
  const connection = await simulateConnectDrive();
  setCloudStorage(connection);
};

const handleFileUpload = async (files: FileList) => {
  for (const file of files) {
    const legacyFile = await simulateFileUpload(file, setProgress);
    setUploadedFiles(prev => [...prev, legacyFile]);
  }
};

const handleClassify = async () => {
  setClassifying(true);
  const classified = await simulateAIClassification(uploadedFiles, setProgress);
  setUploadedFiles(classified);
  setClassifying(false);
};

const handleImport = async () => {
  setImporting(true);
  // Import logic
  setImporting(false);
  setCurrentStep(6);
};
```

---

## 🎯 **Success Criteria**

### **User Can**:
- [x] View complete data architecture infographic
- [ ] Click "Connect Google Drive" and see mock OAuth flow
- [ ] See "Echo House" folder detected message
- [ ] Upload files via drag & drop
- [ ] Watch AI classification progress
- [ ] Review and edit AI suggestions
- [ ] See data extraction preview
- [ ] Import data to CRM
- [ ] View migration summary

### **System Shows**:
- [x] 4-tier architecture visualization
- [x] Data sources and flow
- [ ] Real-time progress indicators
- [ ] Confidence score badges
- [ ] File type icons
- [ ] Country flags
- [ ] Department icons
- [ ] Success animations

---

## 📝 **Next Steps**

1. **Implement Enhanced DataIntegrations** (~2 hours)
   - Add Cloud Storage section with mock connection
   - Add Legacy Migration section with status
   - Add Architecture Infographic toggle
   - Add Migration History list

2. **Build LegacyMigration Wizard** (~4-5 hours)
   - Create 6-step stepper component
   - Implement each step's UI
   - Wire up mock data services
   - Add animations and transitions
   - Test complete flow

3. **Add Routes** (~15 min)
   - Update App.tsx with migration route
   - Optional: Add to sidebar navigation

4. **Test End-to-End** (~30 min)
   - Navigate through entire flow
   - Verify all mock data works
   - Check responsive design
   - Test animations

---

## 🚀 **When Complete, User Will Have**:

✅ **Complete UI/UX flow** for legacy data migration  
✅ **Interactive data architecture** infographic  
✅ **6-step wizard** with realistic mock data  
✅ **Visual feedback** at every step  
✅ **No backend required** - pure UI/UX demonstration  

**Then**: Wire up actual Google Drive API and AI classification when ready!

---

**Current Status**: Foundation complete (types, mock data, infographic)  
**Remaining Work**: 2 major components (DataIntegrations enhancement + Migration Wizard)  
**Total Effort**: ~6-7 hours to complete full UI/UX flow
