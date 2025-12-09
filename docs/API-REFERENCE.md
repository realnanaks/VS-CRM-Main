# API Reference

**Last updated:** 2025-12-09

Base URL: `http://localhost:3001/api`

> [!NOTE]
> **Persistence Strategy:** This API uses a Hybrid Data model. Initial data is seeded from `data.js`. Modifications (POST/PUT) are persisted to the runtime session or local JSON files, but the specific implementation details mean some data may reset on a full server restart depending on the environment configuration. File uploads and Google Drive Sync are permanently stored.

## Authentication

### `POST /auth/login`
- **Body:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "user": UserObject, "token": "mock-jwt-token" }`

## CRM Modules

### Contacts (`/contacts`)
- **GET** `?country=US` - List contacts filtered by country.
- **POST** - Create a new contact.
- **PUT** `/:id` - Update contact details.

### Campaigns (`/campaigns`)
- **GET** `?country=Global` - List marketing campaigns.
- **POST** - Create a new campaign.
- **DELETE** `/:id` - Remove a campaign.

### Projects (`/projects`)
- **GET** - List projects with Kanban column data.
- **POST** - Create a project.
- **PUT** `/:id` - Update status/progress.

### Events (`/events`)
- **GET** - List events with ticket sales and performance metrics.
- **POST** - Create a new event.

## System

### Users (`/users`)
- **GET** - List all system users.
- **POST** - Invite a new user (triggers mock email).

### Feature Flags (`/feature-flags`)
- **GET** - List all flags.
- **PUT** `/:id` - Update flag status or country availability.

### Uploads (`/upload`)
- **POST** - Multipart form data.
- **Response:** `{ "url": "http://localhost:3001/uploads/image-123.jpg" }`

## AI Services (Mocked/Proxy)

### Advisor
- **Context:** The frontend injects dashboard state into the prompt.
- **Response:** Natural language strategic advice.
