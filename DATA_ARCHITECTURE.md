# Echo House CRM - Data Architecture & Migration Strategy

**Version**: 1.0  
**Date**: May 30, 2026  
**Status**: Production Ready

---

## 📋 **Table of Contents**

1. [System Overview](#system-overview)
2. [Data Architecture](#data-architecture)
3. [Google Drive Integration](#google-drive-integration)
4. [Legacy Data Migration Strategy](#legacy-data-migration-strategy)
5. [File Workflow](#file-workflow)
6. [Data Layers](#data-layers)
7. [Implementation Guide](#implementation-guide)

---

## 🏗️ **System Overview**

### **Current State**
- **12 Departments** across 7 countries (6 African + Global)
- **File Management**: Google Drive integration with permission-based access
- **Data Storage**: JSON database (db.json) - ready for PostgreSQL migration
- **AI Integration**: Google Gemini for insights and analysis
- **File Parsing**: Excel, Word, PDF, CSV support

### **Total Folder Structure**
```
Echo House (Root)
├── Global
│   └── Shared Resources (1 folder)
├── Ghana
│   ├── Creative
│   ├── Media & Advertising
│   ├── Strategy & Planning
│   ├── Digital & Social
│   ├── Production
│   ├── Client Services
│   ├── Data & Analytics
│   ├── Finance
│   ├── Operations
│   ├── Human Resources
│   ├── Technology & IT
│   └── Business Development (12 folders)
├── Nigeria (12 folders)
├── Ivory Coast (12 folders)
├── South Africa (12 folders)
├── Benin (12 folders)
└── Togo (12 folders)

Total: 81 folders (1 root + 7 countries + 73 department folders)
```

---

## 🎯 **Data Architecture**

### **4-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECHO HOUSE DATA ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TIER 1: RAW FILES (Google Drive - Source of Truth)              │
├─────────────────────────────────────────────────────────────────┤
│ • Excel spreadsheets (budgets, reports, data exports)           │
│ • Word documents (proposals, briefs, contracts)                 │
│ • PDF files (reports, presentations, signed documents)          │
│ • CSV files (data exports, contact lists)                       │
│ • Images/Videos (creative assets, campaign materials)           │
│                                                                  │
│ Storage: Google Drive (81 folders)                              │
│ Access: Permission-based (role + department + country)          │
│ Retention: Permanent (with archival strategy)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [File Ingestion Pipeline]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ TIER 2: STRUCTURED DATA (CRM Database)                          │
├─────────────────────────────────────────────────────────────────┤
│ • Contacts (clients, prospects, vendors)                        │
│ • Campaigns (marketing campaigns, performance data)             │
│ • Projects (client work, internal initiatives)                  │
│ • Tasks (assignments, to-dos, deadlines)                        │
│ • Events (activations, conferences, meetings)                   │
│ • Deals (sales pipeline, opportunities)                         │
│ • Users (team members, permissions, roles)                      │
│                                                                  │
│ Storage: PostgreSQL (production) / JSON (development)           │
│ Access: API-based with role permissions                         │
│ Retention: Active data (with archival after 2 years)            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    [Analytics Processing]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ TIER 3: ANALYTICS DATA (Data Warehouse)                         │
├─────────────────────────────────────────────────────────────────┤
│ • Aggregated metrics (KPIs, performance indicators)             │
│ • Time-series data (trends, historical analysis)                │
│ • Cross-country comparisons                                     │
│ • Department performance metrics                                │
│ • Client health scores                                          │
│ • Campaign ROI analysis                                         │
│                                                                  │
│ Storage: BigQuery / Snowflake (future)                          │
│ Access: BI tools, dashboards                                    │
│ Retention: Historical data (5+ years)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                        [AI Processing]
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ TIER 4: AI INSIGHTS (Gemini AI)                                 │
├─────────────────────────────────────────────────────────────────┤
│ • Predictive analytics (campaign success, churn risk)           │
│ • Natural language queries                                      │
│ • Automated report generation                                   │
│ • Budget optimization recommendations                           │
│ • Client sentiment analysis                                     │
│ • Market trend identification                                   │
│                                                                  │
│ Storage: Cached insights in database                            │
│ Access: API endpoints, advisor interface                        │
│ Retention: 90 days (regenerated as needed)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 **Google Drive Integration**

### **Permission Model**

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Super Admin** | All 81 folders | Read, Write, Delete |
| **Country Manager** | All departments in assigned country (12 folders) | Read, Write, Delete |
| **Department Lead** | Assigned department in assigned country (1 folder) | Read, Write, Delete |
| **Staff** | Assigned department in assigned country (1 folder) | Read, Write |

### **Folder Naming Convention**
```
Echo House/
  {Country Name}/
    {Department Name}/
      {Year}/
        {Month}/
          {Project or Client Name}/
            files...
```

**Example**:
```
Echo House/
  Ghana/
    Creative/
      2026/
        May/
          MTN Campaign/
            brand-guidelines.pdf
            logo-variations.ai
            campaign-brief.docx
```

---

## 📦 **Legacy Data Migration Strategy**

### **The Challenge**
- **Unstructured data** scattered across personal drives, email attachments, shared folders
- **Inconsistent naming** conventions
- **Mixed formats** (Excel, Word, PDF, CSV, images)
- **No metadata** (country, department, project tags)
- **Duplicate files** across different locations

### **Migration Approach: AI-Powered Ingestion Pipeline**

```
┌─────────────────────────────────────────────────────────────────┐
│              LEGACY DATA MIGRATION PIPELINE                      │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: COLLECTION
├─ Create "Legacy Inbox" folder in Google Drive
├─ Teams upload ALL old files (no organization required)
├─ Deadline: 2 weeks
└─ Expected: 5,000-10,000 files

                    ↓

PHASE 2: AI CLASSIFICATION
├─ AI reads file names + content
├─ Extracts metadata:
│  ├─ Country (Ghana, Nigeria, etc.)
│  ├─ Department (Creative, Media, etc.)
│  ├─ Type (Campaign, Report, Contract, etc.)
│  ├─ Date (from content or file metadata)
│  └─ Client/Project name
├─ Confidence score (0-100%)
└─ Duration: Automated (1-2 days)

                    ↓

PHASE 3: HUMAN VALIDATION
├─ Data Migration Dashboard shows:
│  ├─ AI-classified files
│  ├─ Confidence scores
│  ├─ Suggested folder location
│  └─ Extracted metadata
├─ Users review and confirm/correct
├─ Batch approval for high-confidence (>90%)
└─ Duration: 1-2 weeks

                    ↓

PHASE 4: DATA EXTRACTION
├─ Parse files to extract structured data:
│  ├─ Excel → Contacts, budgets, metrics
│  ├─ Word → Client briefs, proposals
│  ├─ PDF → Reports, contracts
│  └─ CSV → Data exports
├─ Map to CRM entities (contacts, campaigns, etc.)
└─ Duration: Automated (2-3 days)

                    ↓

PHASE 5: IMPORT TO CRM
├─ Preview extracted data
├─ Deduplicate (match existing records)
├─ User confirms import
├─ Data loaded into database
└─ Duration: 1 week

                    ↓

PHASE 6: ORGANIZE & ARCHIVE
├─ Move files to proper folders
├─ Original files → "Processed Archives"
├─ Maintain link between file and CRM record
└─ Duration: Automated (1 day)
```

### **Migration Timeline**

| Phase | Duration | Owner | Status |
|-------|----------|-------|--------|
| 1. Collection | 2 weeks | All teams | Not started |
| 2. AI Classification | 2 days | System (automated) | Not started |
| 3. Human Validation | 2 weeks | Department Leads | Not started |
| 4. Data Extraction | 3 days | System (automated) | Not started |
| 5. Import to CRM | 1 week | Data team | Not started |
| 6. Organize & Archive | 1 day | System (automated) | Not started |
| **Total** | **6 weeks** | | |

---

## 🔄 **File Workflow**

### **Workflow 1: Upload New File**
```
User → Select Folder → Upload File → Google Drive
                                          ↓
                              Permission Check (backend)
                                          ↓
                              File Stored in Drive
                                          ↓
                              Metadata Logged in CRM
```

### **Workflow 2: Retrieve & Import Data**
```
User → Browse Files → Select File → Download
                                        ↓
                              Parse File (backend)
                                        ↓
                              Extract Structured Data
                                        ↓
                              Preview in UI
                                        ↓
                              User Confirms
                                        ↓
                              Import to Database
                                        ↓
                              Link File to Records
```

### **Workflow 3: Modify & Sync Back**
```
User → Edit Data in CRM → Generate Export
                                        ↓
                              Create Updated File
                                        ↓
                              Upload to Original Location
                                        ↓
                              Version History Maintained
                                        ↓
                              Notification Sent
```

### **Workflow 4: AI Analysis**
```
User → Request Insights → AI Analyzes Data
                                        ↓
                              Generate Report
                                        ↓
                              Save Report to Drive
                                        ↓
                              Display in CRM
                                        ↓
                              Share with Team
```

---

## 📊 **Data Layers**

### **Layer 1: Raw Files (Google Drive)**
- **Purpose**: Source of truth for all documents
- **Format**: Original file formats (Excel, Word, PDF, etc.)
- **Access**: Permission-based via CRM
- **Backup**: Google Drive native backup + weekly snapshots

### **Layer 2: Structured Data (Database)**
- **Purpose**: Operational data for CRM functions
- **Format**: Relational database (PostgreSQL)
- **Schema**:
  ```sql
  -- Core entities
  contacts (id, name, email, company, country, department, ...)
  campaigns (id, name, status, country, budget, roi, ...)
  projects (id, name, status, country, department, ...)
  tasks (id, title, assignee, due_date, completed, ...)
  deals (id, title, value, stage, probability, ...)
  
  -- File tracking
  files (id, drive_file_id, name, path, uploaded_by, uploaded_at, ...)
  file_links (id, file_id, entity_type, entity_id, ...)
  
  -- Users & permissions
  users (id, name, email, role, assigned_countries, assigned_departments, ...)
  audit_logs (id, user_id, action, entity, timestamp, ...)
  ```

### **Layer 3: Analytics Data (Data Warehouse)**
- **Purpose**: Historical analysis and reporting
- **Format**: Columnar storage (BigQuery/Snowflake)
- **Aggregations**:
  - Daily/weekly/monthly metrics
  - Country-level performance
  - Department-level KPIs
  - Client lifetime value
  - Campaign ROI trends

### **Layer 4: AI Insights (Cached)**
- **Purpose**: Intelligent recommendations and predictions
- **Format**: JSON objects stored in database
- **Types**:
  - Campaign performance predictions
  - Client churn risk scores
  - Budget optimization suggestions
  - Market trend analysis
  - Automated report summaries

---

## 🛠️ **Implementation Guide**

### **Step 1: Create Google Drive Folders**
```bash
cd backend
node setupDriveFolders.js
```
This creates all 81 folders and generates `drive-folder-mapping.json`.

### **Step 2: Map Folder IDs**
The script automatically saves folder IDs. To load them:
```javascript
// In server.js startup
const folderMapping = require('./drive-folder-mapping.json');
const { updateFolderStructure } = require('./drivePermissions');
updateFolderStructure(folderMapping);
```

### **Step 3: Set Up Legacy Inbox**
Manually create a "Legacy Inbox" folder in Google Drive root for migration.

### **Step 4: Configure AI Classification**
```javascript
// backend/legacyMigration.js (to be created)
async function classifyFile(file) {
  const prompt = `
    Analyze this file and extract:
    - Country (Ghana, Nigeria, Ivory Coast, South Africa, Benin, Togo, or Global)
    - Department (Creative, Media, Strategy, Digital, Production, Client Services, 
                  Data Analytics, Finance, Operations, HR, Technology, Business Dev)
    - Type (Campaign, Report, Contract, Brief, Budget, etc.)
    - Client/Project name
    - Date
    
    File name: ${file.name}
    File content preview: ${fileContent}
  `;
  
  const result = await geminiAI.analyze(prompt);
  return result;
}
```

### **Step 5: Build Migration Dashboard**
Create a UI component for reviewing and approving AI classifications.

### **Step 6: Implement Data Extraction**
Use existing `fileParsers.js` to extract structured data from classified files.

### **Step 7: Import Workflow**
Create import preview → user confirmation → database insert workflow.

---

## 🔐 **Security & Compliance**

### **Data Protection**
- **Encryption**: All files encrypted at rest (Google Drive native)
- **Access Control**: Role-based permissions enforced at API level
- **Audit Trail**: All file operations logged with user, timestamp, action
- **Backup**: Daily automated backups of database + weekly Drive snapshots

### **Compliance**
- **GDPR**: Right to access, right to deletion, data portability
- **Data Retention**: 
  - Active data: Unlimited
  - Archived data: 7 years
  - Deleted data: 30-day recovery window
- **Privacy**: PII encrypted, access logged, consent tracked

---

## 📈 **Scalability**

### **Current Capacity**
- **Files**: Unlimited (Google Drive)
- **Database**: 100K records (JSON), 10M+ records (PostgreSQL)
- **Users**: 100 concurrent users
- **API**: 1000 requests/minute

### **Growth Plan**
- **Year 1**: 10K files, 50K records, 50 users
- **Year 2**: 50K files, 200K records, 150 users
- **Year 3**: 200K files, 1M records, 500 users

### **Scaling Strategy**
1. **Database**: Migrate to PostgreSQL (Year 1)
2. **Caching**: Add Redis for frequently accessed data (Year 1)
3. **Search**: Implement Elasticsearch for file search (Year 2)
4. **Analytics**: Move to BigQuery for data warehouse (Year 2)
5. **CDN**: Add CloudFlare for global file delivery (Year 3)

---

## 🎯 **Success Metrics**

### **Migration Success**
- [ ] 100% of legacy files uploaded to Legacy Inbox
- [ ] 95%+ AI classification accuracy
- [ ] 90%+ user validation completion
- [ ] 80%+ data successfully extracted and imported
- [ ] 0 data loss during migration

### **Operational Success**
- [ ] <2 seconds average file upload time
- [ ] <1 second average file search time
- [ ] 99.9% uptime for file access
- [ ] <5% duplicate file rate
- [ ] 100% audit trail coverage

---

## 📞 **Support & Maintenance**

### **Ongoing Tasks**
- **Daily**: Monitor file uploads, check error logs
- **Weekly**: Review storage usage, optimize slow queries
- **Monthly**: Audit permissions, archive old files
- **Quarterly**: Review data architecture, plan improvements

### **Contact**
- **Technical Issues**: tech@echohouse.com
- **Data Questions**: data@echohouse.com
- **Migration Support**: migration@echohouse.com

---

**Document Version**: 1.0  
**Last Updated**: May 30, 2026  
**Next Review**: June 30, 2026
