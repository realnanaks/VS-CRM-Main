# Admin Dashboard Guide

**Last updated:** 2025-12-09

The Admin Dashboard provides control over the Agency OS configuration, user management, and feature rollout.

## 1. User Management
Located at `/settings`.
- **Invite User:** Click "Add User" to create a profile.
  - *Required:* Name, Email, Role, Assigned Countries.
  - *Note:* The system automatically generates a unique avatar using `ui-avatars.com`.
- **Onboarding Status:** Track which users have completed the welcome tour (`hasCompletedOnboarding` flag).

## 2. Feature Flags
Located at `/settings` (Admin Only).
Visionary Space CRM uses a robust Feature Flagging system to control module visibility per country.
- **Global Rollout:** Enable a feature like "Dark Mode V2" for all users.
- **Regional Beta:** Enable "Advisor" only for `US` users to test before a global launch.

**Common Flags:**
- `feature_dashboard`: Main dashboard access.
- `ff_beta_dashboard`: Experimental AI-driven layout.
- `feature_infographics`: AI visual generator.

## 3. Country Configuration
Manage the regions your agency operates in.
- **Add Country:** Define Name, ISO Code, and Flag Emoji.
- **Collision Check:** The system prevents duplicate country codes.

## 4. Theme & Branding
- **Theme Switcher:** Change the primary color palette (Indigo, Rose, Emerald, etc.) for the entire organization or specific regions.
