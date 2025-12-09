# Environment Variables

**Last updated:** 2025-12-09

To run Visionary Space CRM, configure the following `.env` files.

## Backend (`/backend/.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | API Port (Default: `3001`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON (for Drive Sync) |
| `GEMINI_API_KEY` | Google AI Studio Key for Advisor |

## Frontend (`/frontend/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | URL of the backend API (Default: `http://localhost:3001/api`) |
