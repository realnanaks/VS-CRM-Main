# Testing Guide

**Last updated:** 2025-12-09

## Testing Layers

### 1. Unit Tests (Vite/Vitest)
Located in `frontend/src/__tests__`.
- **Run:** `npm run test`
- **Focus:**
  - Component rendering (e.g., `TaskCard`, `Badge`).
  - Utility functions (e.g., `formatCurrency`, `calculateProgress`).

### 2. API Tests (Jest/Supertest)
Located in `backend/tests`.
- **Run:** `npm test`
- **Focus:**
  - Endpoint availability (`GET /api/status`).
  - Data persistence (Create User -> Get User).

## Manual QA Checklist

- [ ] **Auth:** Login flow works with correct/incorrect credentials.
- [ ] **Routing:** Browser back button works correctly between modules.
- [ ] **Feature Flags:** Disabling `feature_dashboard` hides the link in sidebar.
- [ ] **Responsiveness:** Sidebar toggles correctly on mobile view.
- [ ] **Data:** Creating a project instantly updates the Kanban board.
