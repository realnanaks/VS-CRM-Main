# Routes and Navigation

**Last updated:** 2025-12-09

The application uses hash-based routing (or state-based view switching) to manage navigation between modules without full page reloads.

## Primary Navigation Modules

| Module View | Description | Access Role |
| :--- | :--- | :--- |
| **Dashboard** | Main overview (KPIs, Active Projects). | All |
| **Projects** | Kanban board for operational workflows. | All |
| **Campaigns** | Marketing campaign tracker and scheduler. | Marketing, Admin |
| **Contacts** | CRM directory for clients and leads. | All |
| **Events** | Event management and ticketing intelligence. | All |
| **Tasks** | Personal and team task lists. | All |
| **Advisor** | AI Chat interface for strategic advice. | All |
| **Automation** | Workflow builder (Triggers & Actions). | Admin |
| **Assets** | Digital Asset Management (DAM). | All |
| **Social** | Social media scheduler and analytics. | Marketing |
| **Settings** | User profile, Team management, Feature flags. | All (limited) |

## Beta / Experimental Routes
| Module View | Description | Feature Flag |
| :--- | :--- | :--- |
| **Beta Dashboard** | New layout with predictive widgets. | `ff_beta_dashboard` |
| **Infographics** | AI-generated visual reports. | `feature_infographics` |

## Routing Logic
The `App.tsx` component handles routing via the `currentView` state.
- **URL Structure:** `/#dashboard`, `/#projects`, `/#settings`
- **Persistence:** The active view is saved to `localStorage`, preserving the user's location on refresh.
