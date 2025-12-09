# System Architecture

**Last updated:** 2025-12-09

## High-Level Overview

![Visionary Space CRM Architecture](./assets/architecture_diagram.png)

Visionary Space CRM follows a client-server architecture. The frontend is a rich, interactive Single Page Application (SPA) that communicates with a Node.js backend. The system is designed to be modular, with distinct services for data management, file storage, and AI processing.

```mermaid
C4Context
    title System Context Diagram for Visionary Space CRM

    Person(user, "Agency User", "Marketing Specialist, Manager, or Admin.")
    
    System_Boundary(vscrm, "Visionary Space CRM") {
        System(webapp, "Frontend App", "React/Vite", "Interactive dashboard and management UI.")
        System(api, "Backend API", "Node.js/Express", "Business logic and data orchestration.")
        SystemDb(db, "Hybrid Data Store", "Seed (data.js) + Runtime (JSON)", "Bootstraps from file, updates in memory.")
        System(ai, "AI Service", "Gemini Integration", "Generates insights and content.")
    }

    System_Ext(gdrive, "Google Drive", "Google Workspace", "Stores briefs, assets, and reports.")
    System_Ext(social, "Social Platforms", "Twitter/LinkedIn/Meta", "Publishes posts and fetches analytics.")

    Rel(user, webapp, "Uses", "HTTPS")
    Rel(webapp, api, "API Calls", "JSON/HTTPS")
    Rel(api, db, "Reads/Writes", "Internal/SQL")
    Rel(api, ai, "Prompts/Responses", "API")
    Rel(api, gdrive, "Syncs Files", "OAuth2/REST")
    Rel(api, social, "Publishes Content", "OAuth2/REST")
```

## Core Components

### 1. Frontend (Client)
- **Build Tool:** Vite (v6.2.0).
- **Framework:** React (v19.2.0) with TypeScript (v5.8.2).
- **Styling:** Tailwind CSS (via `tailwind-merge` & `clsx`).
- **Visualization:** Recharts (v3.5.1).
- **State Management:** React Context API + Hooks.
- **Diagrams:** Mermaid.js (v11.12.2) & `html-to-image` for exports.

### 2. Backend (Server)
- **Runtime:** Node.js (v18+).
- **Framework:** Express.js (v5.1.0).
- **Data Persistence Layer (Hybrid):**
  - **Seed:** `data.js` provides rich, static initial data for development bootstrapping.
  - **Runtime:** In-memory/JSON storage allows for interactive CRUD operations during the session.
  - **Live:** Uploads and Google integrations interact with real external systems.
- **File Handling:** Multer (v2.0.2).
- **Google Integration:** `googleapis` SDK (v166.0.0) for Drive Sync.
- **AI Integration:** `@google/genai` (v1.30.0).

### 3. AI Engine
- **Provider:** Google Gemini.
- **Function:**
  - **Advisor:** RAG-lite implementation where system data is injected into the context window to answer questions like "How is my Q4 campaign performing?".
  - **Infographics:** Generates structural data (Mermaid syntax/JSON) that the frontend renders as diagrams.

### 4. Integrations
- **Google Drive:** Two-way sync for project documentation.
- **Feature Flags:** A built-in toggle system to enable/disable modules (Beta Dashboard, Dark Mode) dynamically per country or user.
