# Roles and Permissions

**Last updated:** 2025-12-09

Visionary Space CRM uses a Role-Based Access Control (RBAC) system to manage access to sensitive agency data.

## Defined Roles

### 1. Super Admin
*The Agency Owner or CTO.*
- **Scope:** Global (All Countries, All Modules).
- **Capabilities:**
  - Manage all users and feature flags.
  - Access system-wide logs and analytics.
  - Configure payment gateways and API keys.
  - Delete critical data (Projects, Campaigns).

### 2. Country Manager
*Head of operations for a specific region (e.g., US, UK).*
- **Scope:** Regional (Assigned Countries only).
- **Capabilities:**
  - View and manage Campaigns, Projects, and Contacts within their allocated region.
  - Invite new team members to their region.
  - Approval authority for high-budget campaigns.

### 3. Marketing Specialist
*Execution role.*
- **Scope:** Regional (Assigned Countries).
- **Capabilities:**
  - Create and edit Campaigns and Social Posts.
  - View Projects and Tasks.
  - **Cannot:** Delete Campaigns or access System Settings.

## Permissions Matrix

| Feature | Super Admin | Country Manager | Marketing Spec. |
| :--- | :---: | :---: | :---: |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **Create Campaign** | ✅ | ✅ | ✅ |
| **Delete Campaign** | ✅ | ✅ | ❌ |
| **Manage Users** | ✅ | ✅ (Region) | ❌ |
| **Feature Flags** | ✅ | ❌ | ❌ |
| **Export Data** | ✅ | ✅ | ❌ |
