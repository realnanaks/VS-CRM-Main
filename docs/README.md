# Visionary Space CRM - Agency Operating System

**Last updated:** 2025-12-09

## Project Overview
Visionary Space CRM is a comprehensive, enterprise-grade Agency Operating System designed to centralize and automate the operations of modern marketing and creative agencies. It replaces fragmented tools with a single "Source of Truth" for managing clients, campaigns, projects, events, and financial deals.

The platform combines traditional CRM functionalities with advanced AI capabilities, offering predictive analytics, automated content generation, and intelligent strategic advice.

## Key Modules
- **Mission Control Dashboard:** Real-time visibility into agency health (Active Campaigns, Revenue, Tasks).
- **Projects & Tasks:** Kanban-style project management with deep collaborative features.
- **Campaign Management:** End-to-end tracking of multi-channel marketing campaigns.
- **Event Intelligence:** Specialized module for managing large-scale events (ticketing, revenue, crowd analytics).
- **AI Advisor:** Integrated LLM assistant for strategy generation and data insights.
- **Infographics Generator:** AI-powered creation of visual data summaries.

## Tech Stack Summary
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend:** Node.js, Express.js.
- **Database:** Hybrid Architecture (Mock Seed + Live Runtime Persistence).
- **AI Integration:** Google Gemini Pro (Text/Chat), Custom Models.
- **Integration:** Google Drive (Document Sync), Social Media APIs.

## Quick Start for Developers

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/VisionarySpace/crm-core.git
    cd crm-core
    ```

2.  **Install dependencies and start:**
    ```bash
    # Terminal 1: Backend
    cd backend
    npm install
    npm start
    
    # Terminal 2: Frontend
    cd frontend
    npm install
    npm run dev
    ```

3.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.
    Backend runs on [http://localhost:3001](http://localhost:3001).

## Credentials (Dev)
- **User:** `john@visionary.com`
- **Pass:** `password123`
