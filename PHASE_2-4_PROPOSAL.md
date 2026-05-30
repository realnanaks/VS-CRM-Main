# Echo House CRM - Phases 2-4 Implementation Proposal

**Date**: May 29, 2026  
**Status**: Awaiting Approval  
**Scope**: Google Drive Integration, File Ingestion, Cross-Source Dashboards, Department Modules

---

## Phase 2: Folder-Level Permissions & Google Drive Integration

### Overview
Implement granular folder-level permissions tied to Google Drive, allowing users to access only their authorized country/department folders.

### Key Features

#### 2.1 Google Drive Folder Structure
```
Echo House (Root)
├── Ghana/
│   ├── Creative/
│   ├── Media & Advertising/
│   ├── Strategy & Planning/
│   ├── Digital & Social/
│   ├── Production/
│   ├── Client Services/
│   ├── Data & Analytics/
│   └── Finance & Operations/
├── Nigeria/
│   ├── Creative/
│   ├── Media & Advertising/
│   └── ... (same 8 departments)
├── Ivory Coast/
├── South Africa/
├── Benin/
├── Togo/
└── Global/
    └── Shared Resources/
```

#### 2.2 Permission Mapping System
- **Database Schema**: Add `googleDriveFolders` table
  ```json
  {
    "id": "folder_1",
    "country": "GH",
    "department": "creative",
    "googleDriveFolderId": "1a2b3c4d5e6f",
    "folderPath": "Echo House/Ghana/Creative",
    "permissions": ["read", "write", "delete"]
  }
  ```

- **User Access Matrix**: Map users to specific folder IDs
  - Super Admin → All folders
  - Country Manager (Nigeria) → All Nigeria folders
  - Department Lead (Ghana Creative) → Only Ghana/Creative folder
  - Staff (SA Finance) → Only South Africa/Finance & Operations folder

#### 2.3 API Endpoints
- `GET /api/drive/folders` - List accessible folders for current user
- `GET /api/drive/folders/:folderId/files` - List files in a folder
- `POST /api/drive/folders/:folderId/upload` - Upload file to folder
- `GET /api/drive/files/:fileId` - Download/preview file
- `DELETE /api/drive/files/:fileId` - Delete file (if permitted)

#### 2.4 Frontend Components
- **Folder Browser**: Tree view of accessible Google Drive folders
- **File Manager**: Upload, download, preview, delete files
- **Permission Indicator**: Visual badges showing user's access level
- **Breadcrumb Navigation**: Show current folder path

#### 2.5 Security Features
- Server-side permission validation on every request
- Audit logging for all file access/modifications
- Rate limiting to prevent abuse
- File type validation (only allow business documents)

---

## Phase 3: File Ingestion Pipeline

### Overview
Build automated pipeline to extract structured data from Excel, Word, PDF, and CSV files stored in Google Drive.

### Key Features

#### 3.1 File Parsers

**Excel Parser** (.xlsx, .xls)
- Extract tables, charts, pivot tables
- Parse budget sheets, campaign reports, client lists
- Convert to structured JSON
- Example: Budget spreadsheet → Campaign budget entries in database

**Word Parser** (.docx)
- Extract text, tables, images
- Parse proposals, briefs, contracts
- OCR for scanned documents
- Example: Client brief → Project entry with requirements

**PDF Parser** (.pdf)
- Text extraction with layout preservation
- Table detection and extraction
- Form data extraction
- Example: Signed contract → Deal entry with terms

**CSV Parser** (.csv)
- Bulk data import
- Column mapping interface
- Data validation and cleaning
- Example: Contact export → Bulk contact import

#### 3.2 Data Extraction Rules
```json
{
  "fileType": "excel",
  "template": "Monthly Budget",
  "rules": {
    "sheetName": "Budget Summary",
    "dataStartRow": 3,
    "columns": {
      "A": "campaign_name",
      "B": "budget_allocated",
      "C": "budget_spent",
      "D": "department"
    }
  }
}
```

#### 3.3 Automated Processing
- **File Watcher**: Monitor Google Drive for new files
- **Queue System**: Process files asynchronously
- **Error Handling**: Retry failed extractions, notify users
- **Validation**: Check extracted data against schema
- **Deduplication**: Prevent duplicate entries

#### 3.4 API Endpoints
- `POST /api/ingest/file/:fileId` - Manually trigger file ingestion
- `GET /api/ingest/jobs` - List ingestion jobs and status
- `GET /api/ingest/templates` - List available extraction templates
- `POST /api/ingest/templates` - Create custom extraction template

#### 3.5 Frontend Components
- **File Ingestion Dashboard**: View processing status
- **Template Builder**: Visual interface to create extraction rules
- **Data Preview**: Review extracted data before saving
- **Error Resolution**: Fix validation errors manually

---

## Phase 4: Cross-Source Dashboards & AI Reporting

### Overview
Create intelligent dashboards that aggregate data from Google Drive files, database, and external sources, with AI-powered insights.

### Key Features

#### 4.1 Unified Data Layer
- Combine data from:
  - Database (contacts, campaigns, deals)
  - Google Drive files (budgets, reports, briefs)
  - External APIs (social media metrics, ad platforms)
- Real-time data synchronization
- Caching for performance

#### 4.2 Department-Specific Dashboards

**Creative Dashboard**
- Active campaigns by country
- Asset library usage statistics
- Design approval workflow status
- Brand guideline compliance score

**Media & Advertising Dashboard**
- Media spend by country/channel
- Campaign performance metrics (CTR, CPC, ROAS)
- Budget vs. actual spend
- Media plan calendar

**Strategy & Planning Dashboard**
- Market research insights
- Competitive analysis
- Strategic initiatives tracker
- KPI achievement vs. targets

**Digital & Social Dashboard**
- Social media engagement metrics
- Website traffic by country
- SEO performance
- Content calendar

**Production Dashboard**
- Event pipeline (upcoming, in-progress, completed)
- Production resource allocation
- Vendor management
- Equipment inventory

**Client Services Dashboard**
- Client satisfaction scores
- Account health indicators
- Revenue by client/country
- Renewal pipeline

**Data & Analytics Dashboard**
- Cross-country performance comparison
- Predictive analytics (churn risk, upsell opportunities)
- Custom report builder
- Data quality metrics

**Finance & Operations Dashboard**
- P&L by country/department
- Payroll summary
- Invoice tracking
- Compliance status

#### 4.3 AI-Powered Features

**Gemini AI Integration**
- **Natural Language Queries**: "Show me Ghana's top performing campaigns this quarter"
- **Automated Insights**: AI detects trends, anomalies, opportunities
- **Report Generation**: Auto-generate executive summaries from data
- **Predictive Analytics**: Forecast campaign performance, budget needs
- **Smart Recommendations**: Suggest optimal budget allocation, best channels

**AI Report Types**
1. **Executive Summary**: Weekly/monthly overview for leadership
2. **Campaign Performance Report**: Deep dive into specific campaigns
3. **Country Comparison Report**: Benchmark performance across markets
4. **Department Efficiency Report**: Resource utilization analysis
5. **Client Health Report**: Risk assessment and growth opportunities

#### 4.4 API Endpoints
- `GET /api/dashboards/:department` - Get department dashboard data
- `POST /api/reports/generate` - Generate AI report
- `GET /api/insights` - Get AI-generated insights
- `POST /api/query` - Natural language data query

#### 4.5 Frontend Components
- **Dashboard Builder**: Drag-and-drop widget customization
- **Report Scheduler**: Automated report delivery
- **AI Chat Interface**: Conversational data exploration
- **Export Center**: Download reports in PDF, Excel, PowerPoint

---

## Department-Based System Modules

### Proposed Module Structure

Each department gets dedicated modules tailored to their workflow:

#### 1. Creative Module
**Main Features**:
- **Asset Library**: Centralized brand assets (logos, templates, guidelines)
- **Campaign Briefs**: Create and manage creative briefs
- **Design Approval Workflow**: Multi-stage approval process
- **Brand Compliance Checker**: AI-powered brand guideline validation
- **Inspiration Board**: Mood boards and reference collections

**Data Sources**:
- Google Drive: Design files, brand guidelines
- Database: Campaign metadata, approval status
- AI: Brand compliance scoring

---

#### 2. Media & Advertising Module
**Main Features**:
- **Media Planning**: Create and manage media plans
- **Budget Tracker**: Real-time spend monitoring
- **Campaign Manager**: Multi-channel campaign orchestration
- **Performance Analytics**: ROI, ROAS, attribution modeling
- **Vendor Management**: Media partner database

**Data Sources**:
- Google Drive: Media plans, insertion orders
- Database: Campaign data, budgets
- External APIs: Facebook Ads, Google Ads, LinkedIn Ads
- AI: Budget optimization recommendations

---

#### 3. Strategy & Planning Module
**Main Features**:
- **Market Research Hub**: Store and analyze research findings
- **Competitive Intelligence**: Track competitor activities
- **Strategic Initiatives Tracker**: OKRs and strategic goals
- **Client Insights**: Deep dive into client business
- **Pitch Deck Builder**: Template-based proposal creation

**Data Sources**:
- Google Drive: Research reports, strategy docs
- Database: Client data, market data
- AI: Trend analysis, opportunity identification

---

#### 4. Digital & Social Module
**Main Features**:
- **Social Media Calendar**: Multi-platform content scheduling
- **Community Management**: Unified inbox for all social channels
- **SEO Tracker**: Keyword rankings, backlink monitoring
- **Website Analytics**: Traffic, conversions, user behavior
- **Influencer Management**: Influencer database and campaign tracking

**Data Sources**:
- Google Drive: Content calendars, social media reports
- Database: Social posts, engagement data
- External APIs: Twitter, Instagram, Facebook, LinkedIn, Google Analytics
- AI: Content performance prediction, optimal posting times

---

#### 5. Production Module
**Main Features**:
- **Event Management**: End-to-end event planning (like Tidal Rave)
- **Production Calendar**: Resource scheduling
- **Vendor Portal**: Vendor onboarding and management
- **Equipment Inventory**: Track production equipment
- **Budget & Invoicing**: Production cost tracking

**Data Sources**:
- Google Drive: Event briefs, vendor contracts
- Database: Event data, vendor data, inventory
- AI: Budget forecasting, vendor performance scoring

---

#### 6. Client Services Module
**Main Features**:
- **Account Dashboard**: 360° client view
- **Meeting Notes**: Centralized client communication log
- **Deliverables Tracker**: Track project deliverables and deadlines
- **Client Satisfaction**: NPS surveys and feedback collection
- **Renewal Pipeline**: Contract renewal tracking

**Data Sources**:
- Google Drive: Meeting notes, client contracts
- Database: Client data, project data, satisfaction scores
- AI: Churn risk prediction, upsell opportunity identification

---

#### 7. Data & Analytics Module
**Main Features**:
- **Custom Report Builder**: Drag-and-drop report creation
- **Data Warehouse**: Centralized data repository
- **Predictive Models**: ML models for forecasting
- **Data Quality Dashboard**: Monitor data completeness and accuracy
- **API Integrations**: Connect external data sources

**Data Sources**:
- All Google Drive folders (read-only access)
- All database tables
- All external APIs
- AI: Automated insight generation, anomaly detection

---

#### 8. Finance & Operations Module
**Main Features**:
- **P&L Dashboard**: Real-time financial performance
- **Invoice Management**: Create, send, track invoices
- **Payroll System**: Employee compensation tracking
- **Compliance Tracker**: Regulatory compliance monitoring
- **HR Portal**: Employee records, leave management

**Data Sources**:
- Google Drive: Financial reports, HR documents
- Database: Financial transactions, employee data
- AI: Expense anomaly detection, budget variance analysis

---

## Implementation Timeline

### Phase 2: Folder-Level Permissions (2-3 weeks)
- Week 1: Google Drive API integration, folder structure setup
- Week 2: Permission system implementation, API endpoints
- Week 3: Frontend components, testing

### Phase 3: File Ingestion Pipeline (3-4 weeks)
- Week 1: Excel and CSV parsers
- Week 2: Word and PDF parsers
- Week 3: Automated processing, queue system
- Week 4: Template builder UI, testing

### Phase 4: Cross-Source Dashboards & AI (4-5 weeks)
- Week 1-2: Department dashboards (4 departments per week)
- Week 3: AI integration (Gemini API)
- Week 4: Report generation, natural language queries
- Week 5: Testing, optimization

### Department Modules: Iterative Development (8-12 weeks)
- Weeks 1-2: Creative + Media modules
- Weeks 3-4: Strategy + Digital modules
- Weeks 5-6: Production + Client Services modules
- Weeks 7-8: Data & Analytics + Finance modules
- Weeks 9-12: Integration, testing, refinement

**Total Estimated Timeline**: 17-24 weeks (4-6 months)

---

## Technical Stack Additions

### Backend
- **File Processing**: `xlsx`, `mammoth` (Word), `pdf-parse`, `csv-parser`
- **Queue System**: `bull` (Redis-based job queue)
- **AI Integration**: `@google/generative-ai` (Gemini)
- **External APIs**: `googleapis`, `facebook-nodejs-business-sdk`, `google-ads-api`

### Frontend
- **File Upload**: `react-dropzone`
- **Data Visualization**: `recharts`, `d3.js`
- **Rich Text Editor**: `tiptap` or `quill`
- **Calendar**: `react-big-calendar`
- **Drag & Drop**: `react-beautiful-dnd`

### Infrastructure
- **Redis**: For job queue and caching
- **PostgreSQL**: Upgrade from JSON file to proper database
- **S3/Cloud Storage**: For file storage (backup to Google Drive)

---

## Cost Considerations

### API Costs
- **Google Drive API**: Free (within quotas)
- **Gemini AI API**: ~$0.001 per 1K characters (estimate $50-200/month)
- **External APIs**: Variable (Facebook Ads, Google Ads - depends on usage)

### Infrastructure
- **Redis**: Free (self-hosted) or $10-50/month (managed)
- **PostgreSQL**: Free (self-hosted) or $20-100/month (managed)
- **Cloud Storage**: $5-50/month depending on volume

**Estimated Monthly Operating Cost**: $85-400

---

## Success Metrics

### Phase 2
- ✅ 100% of users can access only their authorized folders
- ✅ Zero unauthorized access incidents
- ✅ <2 second folder load time

### Phase 3
- ✅ 90%+ successful file parsing rate
- ✅ <5 minute processing time for typical files
- ✅ 50+ files processed per day

### Phase 4
- ✅ All 8 department dashboards operational
- ✅ AI generates 100+ insights per week
- ✅ 80%+ user satisfaction with AI reports

### Department Modules
- ✅ 70%+ daily active usage across all modules
- ✅ 50%+ reduction in manual data entry
- ✅ 30%+ improvement in cross-department collaboration

---

## Next Steps

**Awaiting Your Approval On**:
1. ✅ Overall phase plan and timeline
2. ✅ Department module features and scope
3. ✅ Technical stack additions
4. ✅ Budget allocation for APIs and infrastructure

**Once Approved, We Will**:
1. Begin Phase 2 implementation
2. Set up development environment for new dependencies
3. Create detailed technical specifications for each module
4. Establish sprint schedule and milestones

---

**Ready to proceed?** Please review and approve, or suggest modifications to the plan.
