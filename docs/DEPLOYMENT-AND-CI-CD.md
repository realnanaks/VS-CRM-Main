# Deployment and CI/CD

**Last updated:** 2025-12-09

## Deployment Strategy

### Frontend (Static Asset Hosting)
The React application is built using Vite (`npm run build`) and produces static files in `/dist`.
- **Target:** Vercel / Netlify / AWS S3 + CloudFront.
- **Command:** `npm run build`

### Backend (Node.js Service)
The Express API must be hosted on a persistent server/container.
- **Target:** Railway / Render / AWS EC2 / DigitalOcean Droplet.
- **Process Manager:** Use `pm2` to keep the process alive in production.

## Docker Support
A `Dockerfile` is available in the root to containerize the entire stack (or separate services).

```dockerfile
# Simplified Example
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

## Continuous Integration
We use GitHub Actions to run:
1.  **Linting:** `npm run lint`
2.  **Type Checking:** `tsc` (TypeScript Compiler)
3.  **Unit Tests:** `npm test`

Deployments are triggered automatically on push to `main`.
