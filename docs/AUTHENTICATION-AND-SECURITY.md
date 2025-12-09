# Authentication and Security

**Last updated:** 2025-12-09

Security is paramount, especially given the handling of sensitive financial documents for mortgages.

## Authentication Strategy

### JWT (JSON Web Tokens)
We use a stateless JWT authentication mechanism.
1.  **Access Token:** Short-lived (15 minutes). Sent in the `Authorization: Bearer <token>` header.
2.  **Refresh Token:** Long-lived (7 days). Stored in a strict `HttpOnly` cookie.

### Login Flows
#### 1. Phone + OTP (Preferred for Mobile)
1.  User enters Phone Number.
2.  System generates 6-digit code (valid for 5 mins) and sends via SMS (Twilio/AfricaTalking).
3.  User enters code -> Exchange for Tokens.

#### 2. Email + Password (Preferred for Admins)
1.  Standard email/password login.
2.  Passwords are hashed using `bcrypt` (12 rounds) before storage.

## Security Measures

### Rate Limiting
implemented using `express-rate-limit` and Redis.
- **Login:** 5 attempts per 15 minutes per IP.
- **API General:** 100 requests per minute per IP.

### Data Privacy & ID Uploads
This is the most critical compliance area.
- User uploaded IDs and Bank Statements are **never** public.
- Files are encrypted server-side before upload to S3 (AES-256).
- URLs generated for these files are **Signed URLs** with a short expiration (e.g., 5 minutes), accessible only to authorized Bank Admins.

### Session Management
- **Force Logout:** Implementing a "Revoke all sessions" button (invalides the Refresh Token in DB).
- **Idle Timeout:** 30 minutes of inactivity for Admin dashboards.
