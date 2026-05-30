# Echo House CRM - Production Setup Guide

**Last Updated**: May 29, 2026  
**Status**: Ready for Production Deployment

---

## 📋 **Pre-Deployment Checklist**

### ✅ **Completed**
- [x] Phase 1: Echo House data foundation
- [x] Phase 2: Google Drive permissions system
- [x] Phase 3: File ingestion pipeline
- [x] Phase 4: AI dashboards & reporting
- [x] All backend APIs tested
- [x] Frontend UI complete
- [x] Security features implemented

### 🔧 **To Complete**
- [ ] Create Google Drive folder structure
- [ ] Configure Gemini API key
- [ ] Set up production database
- [ ] Configure production environment
- [ ] Deploy to cloud
- [ ] Set up monitoring

---

## 🚀 **Step-by-Step Production Setup**

### **Step 1: Create Google Drive Folder Structure**

Run the automated setup script:

```bash
cd backend
node setupDriveFolders.js
```

This will:
- Create 1 root folder (Echo House)
- Create 7 country folders
- Create 49 department folders
- Generate `drive-folder-mapping.json` with all folder IDs

**Expected Output**:
```
✅ Created: Echo House (folder_id_here)
✅ Created: Ghana (folder_id_here)
  ✅ Created: Creative (folder_id_here)
  ✅ Created: Media & Advertising (folder_id_here)
  ...
💾 Folder mapping saved to: drive-folder-mapping.json
```

---

### **Step 2: Map Folder IDs to Permission System**

After running the setup script, the folder mapping is automatically saved. To load it into the system:

**Option A: Automatic (Recommended)**

Add this to `server.js` after the Drive connection:

```javascript
// Load folder mapping
const folderMapping = require('./drive-folder-mapping.json');
const { updateFolderStructure } = require('./drivePermissions');
updateFolderStructure(folderMapping);
console.log('✅ Folder structure loaded');
```

**Option B: Manual**

Edit `drivePermissions.js` and update the `ECHO_HOUSE_FOLDER_STRUCTURE` object with actual folder IDs from `drive-folder-mapping.json`.

---

### **Step 3: Configure Gemini API Key**

1. **Get API Key**:
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy the key

2. **Set Environment Variable**:

```bash
# Create .env file
cp backend/.env.example backend/.env

# Edit .env and add your key
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Install dotenv** (if not already installed):

```bash
cd backend
npm install dotenv
```

4. **Load environment variables** in `server.js`:

Add at the top of `server.js`:
```javascript
require('dotenv').config();
```

---

### **Step 4: Set Up Production Database**

**Current**: Using JSON file (`db.json`)  
**Recommended for Production**: PostgreSQL

#### **Option A: Keep JSON (Quick Start)**
- No changes needed
- Good for small teams (<10 users)
- Limited scalability

#### **Option B: Migrate to PostgreSQL (Recommended)**

1. **Install PostgreSQL**:
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql
```

2. **Create Database**:
```sql
CREATE DATABASE echohouse_crm;
CREATE USER echohouse WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE echohouse_crm TO echohouse;
```

3. **Install Dependencies**:
```bash
npm install pg sequelize
```

4. **Update .env**:
```bash
DATABASE_URL=postgresql://echohouse:your_password@localhost:5432/echohouse_crm
```

---

### **Step 5: Configure Production Environment**

Edit `backend/.env`:

```bash
# Production settings
NODE_ENV=production
PORT=3001

# Your actual Gemini API key
GEMINI_API_KEY=AIza...your_key_here

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/echohouse_crm

# Security
JWT_SECRET=generate_a_random_secret_here
SESSION_SECRET=another_random_secret_here

# CORS - Add your production domain
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Email (for user invitations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@echohouse.com
```

---

### **Step 6: Deploy Backend**

#### **Option A: Deploy to Google Cloud Platform**

```bash
# Install Google Cloud SDK
gcloud init

# Create app.yaml
cat > app.yaml << EOF
runtime: nodejs18
env: standard
instance_class: F2

env_variables:
  NODE_ENV: "production"
  GEMINI_API_KEY: "your_key_here"

automatic_scaling:
  min_instances: 1
  max_instances: 10
EOF

# Deploy
gcloud app deploy
```

#### **Option B: Deploy to AWS (EC2)**

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd VS-CRM-Main/backend

# Install dependencies
npm install --production

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name echohouse-api

# Set up PM2 to start on boot
pm2 startup
pm2 save
```

#### **Option C: Deploy to Heroku**

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create echohouse-crm-api

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

### **Step 7: Deploy Frontend**

#### **Option A: Deploy to Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts to configure
```

#### **Option B: Deploy to Netlify**

```bash
# Build frontend
cd frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### **Option C: Deploy to AWS S3 + CloudFront**

```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### **Step 8: Set Up Monitoring**

#### **Application Monitoring**

1. **Install Sentry** (Error tracking):
```bash
npm install @sentry/node
```

Add to `server.js`:
```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your_sentry_dsn' });
```

2. **Install New Relic** (Performance monitoring):
```bash
npm install newrelic
```

#### **Server Monitoring**

- **Uptime**: Use UptimeRobot or Pingdom
- **Logs**: Use Papertrail or Loggly
- **Metrics**: Use Datadog or Grafana

---

### **Step 9: Configure SSL/HTTPS**

#### **For Custom Domain**

1. **Get SSL Certificate**:
   - Use Let's Encrypt (free)
   - Or use your cloud provider's SSL

2. **Configure Nginx** (if using EC2):
```nginx
server {
    listen 443 ssl;
    server_name api.echohouse.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### **Step 10: User Training & Documentation**

1. **Create User Guides**:
   - How to upload files
   - How to use AI features
   - Permission system explanation

2. **Conduct Training Sessions**:
   - Super Admins: Full system overview
   - Country Managers: Country-specific features
   - Department Leads: Department management
   - Staff: Basic usage

3. **Set Up Support**:
   - Create support email
   - Set up ticketing system
   - Create FAQ document

---

## 🔒 **Security Checklist**

- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Enable audit logging
- [ ] Set up backup system
- [ ] Configure user permissions

---

## 📊 **Performance Optimization**

### **Backend**
- [ ] Enable Redis caching
- [ ] Optimize database queries
- [ ] Enable gzip compression
- [ ] Set up CDN for static files
- [ ] Implement connection pooling

### **Frontend**
- [ ] Enable code splitting
- [ ] Optimize images
- [ ] Enable lazy loading
- [ ] Minimize bundle size
- [ ] Enable service workers

---

## 🧪 **Testing Before Go-Live**

### **Functional Testing**
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

### **Load Testing**
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3001/api/dashboard
```

### **Security Testing**
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 📱 **Post-Deployment**

### **Day 1**
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Test user logins
- [ ] Verify file uploads

### **Week 1**
- [ ] Gather user feedback
- [ ] Monitor usage patterns
- [ ] Check system performance
- [ ] Review error rates
- [ ] Optimize slow queries

### **Month 1**
- [ ] Review analytics
- [ ] Plan feature improvements
- [ ] Conduct user survey
- [ ] Review costs
- [ ] Plan scaling strategy

---

## 🆘 **Troubleshooting**

### **Common Issues**

**Issue**: Google Drive folders not showing
- **Solution**: Run `node setupDriveFolders.js` and restart server

**Issue**: AI features not working
- **Solution**: Check GEMINI_API_KEY in .env file

**Issue**: File upload fails
- **Solution**: Check folder permissions and file size limits

**Issue**: Slow performance
- **Solution**: Enable Redis caching and optimize database

---

## 📞 **Support Contacts**

- **Technical Issues**: tech@echohouse.com
- **User Support**: support@echohouse.com
- **Emergency**: +233-XXX-XXXX

---

## ✅ **Production Readiness Checklist**

- [ ] Google Drive folders created (57 folders)
- [ ] Folder IDs mapped to permission system
- [ ] Gemini API key configured
- [ ] Environment variables set
- [ ] Database configured
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] SSL/HTTPS enabled
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] User training completed
- [ ] Documentation created
- [ ] Security audit passed
- [ ] Load testing passed
- [ ] Go-live date scheduled

---

**Once all items are checked, you're ready to go live!** 🚀
