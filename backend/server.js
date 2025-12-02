
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initialDB } = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const fs = require('fs');
const path = require('path');

// Persistence
const DB_FILE = path.join(__dirname, 'db.json');

const loadDB = () => {
    if (fs.existsSync(DB_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        } catch (e) {
            console.error("Failed to load DB file, using initial data", e);
            return { ...initialDB };
        }
    }
    return { ...initialDB };
};

const saveDB = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// Initialize DB
let db = loadDB();
// Save initial state if file doesn't exist
if (!fs.existsSync(DB_FILE)) {
    saveDB();
}

const { google } = require('googleapis');

// Helper to filter by country
const filterByCountry = (data, country) => {
    if (!country || country === 'Global') return data;
    return data.filter(item => item.country === country);
};

// Google Drive Integration
const KEY_FILE_PATH = path.join(__dirname, 'google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

let driveClient = null;
let connectedEmail = null;

const connectToDrive = async () => {
    try {
        if (!fs.existsSync(KEY_FILE_PATH)) {
            console.log('Google credentials file not found.');
            return false;
        }
        const credentials = JSON.parse(fs.readFileSync(KEY_FILE_PATH));
        connectedEmail = credentials.client_email;

        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: SCOPES,
        });
        driveClient = google.drive({ version: 'v3', auth });
        console.log(`Connected to Google Drive as ${connectedEmail}`);
        return true;
    } catch (error) {
        console.error('Error connecting to Drive:', error);
        return false;
    }
};

// Initialize Drive connection
connectToDrive();

// --- API Endpoints ---

app.get('/api/drive/status', (req, res) => {
    res.json({ connected: !!driveClient, email: connectedEmail });
});

app.post('/api/drive/connect', async (req, res) => {
    const success = await connectToDrive();
    res.json({ connected: success, email: connectedEmail });
});

// Dashboard / Summary Data
app.get('/api/dashboard', (req, res) => {
    const { country } = req.query;
    const data = {
        contacts: filterByCountry(db.contacts, country),
        campaigns: filterByCountry(db.campaigns, country),
        tasks: filterByCountry(db.tasks, country),
        projects: filterByCountry(db.projects, country),
        events: filterByCountry(db.events, country),
        promotions: filterByCountry(db.promotions, country),
        assets: filterByCountry(db.assets, country),
        journeys: filterByCountry(db.journeys, country),
        socialPosts: filterByCountry(db.socialPosts, country),
        socialConnections: db.socialConnections, // Global settings usually
        forms: filterByCountry(db.forms, country),
        deals: filterByCountry(db.deals, country),
        logs: filterByCountry(db.logs, country),
        user: db.users.find(u => u.id === db.currentUserId) || db.users[0],
        users: db.users, // Include all users for Settings page
        theme: db.theme
    };
    res.json(data);
});

// Contacts
app.get('/api/contacts', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.contacts, country));
});

app.post('/api/contacts', (req, res) => {
    const newContact = req.body;
    db.contacts.unshift(newContact);
    saveDB();
    res.status(201).json(newContact);
});

app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const updatedContact = req.body;
    db.contacts = db.contacts.map(c => c.id === id ? updatedContact : c);
    saveDB();
    res.json(updatedContact);
});

// Campaigns
app.get('/api/campaigns', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.campaigns, country));
});

app.post('/api/campaigns', (req, res) => {
    const newCampaign = req.body;
    db.campaigns.unshift(newCampaign);
    saveDB();
    res.status(201).json(newCampaign);
});

app.delete('/api/campaigns/:id', (req, res) => {
    const { id } = req.params;
    db.campaigns = db.campaigns.filter(c => c.id !== id);
    saveDB();
    res.status(204).send();
});

// Tasks
app.get('/api/tasks', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.tasks, country));
});

app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    db.tasks.unshift(newTask); // Changed from push to unshift for consistency
    saveDB();
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;
    db.tasks = db.tasks.map(t => t.id === id ? updatedTask : t);
    saveDB();
    res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.tasks = db.tasks.filter(t => t.id !== id);
    saveDB();
    res.status(204).send();
});

// Projects
app.get('/api/projects', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.projects, country));
});

app.post('/api/projects', (req, res) => {
    const newProject = req.body;
    db.projects.unshift(newProject);
    saveDB();
    res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const updatedProject = req.body;
    db.projects = db.projects.map(p => p.id === id ? updatedProject : p);
    saveDB();
    res.json(updatedProject);
});

// Events
app.get('/api/events', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.events, country));
});

app.post('/api/events', (req, res) => {
    const newEvent = req.body;
    db.events.unshift(newEvent);
    saveDB();
    res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const updatedEvent = req.body;
    db.events = db.events.map(e => e.id === id ? updatedEvent : e);
    saveDB();
    res.json(updatedEvent);
});

// File Uploads
const multer = require('multer');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Use timestamp to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Return the full URL to the uploaded file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Promotions
app.get('/api/promotions', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.promotions, country));
});

app.post('/api/promotions', (req, res) => {
    const newPromo = req.body;
    db.promotions.unshift(newPromo);
    saveDB();
    res.status(201).json(newPromo);
});

app.delete('/api/promotions/:id', (req, res) => {
    const { id } = req.params;
    db.promotions = db.promotions.filter(p => p.id !== id);
    saveDB();
    res.status(204).send();
});

// Assets
app.get('/api/assets', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.assets, country));
});

app.post('/api/assets', (req, res) => {
    const newAsset = req.body;
    db.assets.unshift(newAsset);
    saveDB();
    res.status(201).json(newAsset);
});

app.put('/api/assets/:id', (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;
    const asset = db.assets.find(a => a.id === id);
    if (asset) {
        asset.tags = tags;
        saveDB();
        res.json(asset);
    } else {
        res.status(404).send('Asset not found');
    }
});

// Journeys
app.get('/api/journeys', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.journeys, country));
});

// Social Posts
app.get('/api/social-posts', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.socialPosts, country));
});

app.post('/api/social-posts', (req, res) => {
    const newPost = req.body;
    db.socialPosts.unshift(newPost);
    saveDB();
    res.status(201).json(newPost);
});

app.delete('/api/social-posts/:id', (req, res) => {
    const { id } = req.params;
    db.socialPosts = db.socialPosts.filter(p => p.id !== id);
    saveDB();
    res.status(204).send();
});

// Forms
app.get('/api/forms', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.forms, country));
});

app.post('/api/forms', (req, res) => {
    const newForm = req.body;
    db.forms.unshift(newForm);
    saveDB();
    res.status(201).json(newForm);
});

app.put('/api/forms/:id', (req, res) => {
    const { id } = req.params;
    const updatedForm = req.body;
    db.forms = db.forms.map(f => f.id === id ? updatedForm : f);
    saveDB();
    res.json(updatedForm);
});

app.delete('/api/forms/:id', (req, res) => {
    const { id } = req.params;
    db.forms = db.forms.filter(f => f.id !== id);
    saveDB();
    res.status(204).send();
});

// Deals
app.get('/api/deals', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.deals, country));
});

app.post('/api/deals', (req, res) => {
    const newDeal = req.body;
    db.deals.unshift(newDeal);
    saveDB();
    res.status(201).json(newDeal);
});

app.put('/api/deals/:id', (req, res) => {
    const { id } = req.params;
    const updatedDeal = req.body;
    db.deals = db.deals.map(d => d.id === id ? updatedDeal : d);
    saveDB();
    res.json(updatedDeal);
});

app.delete('/api/deals/:id', (req, res) => {
    const { id } = req.params;
    db.deals = db.deals.filter(d => d.id !== id);
    saveDB();
    res.status(204).send();
});

// Users
const { v4: uuidv4 } = require('uuid');

// Users
app.get('/api/users', (req, res) => {
    res.json(db.users);
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    db.users = db.users.map(u => u.id === id ? updatedUser : u);
    saveDB();
    res.json(updatedUser);
});

app.post('/api/users', (req, res) => {
    const activationToken = uuidv4();
    const newUser = {
        id: `u${Date.now()}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=random&color=fff`,
        status: 'Pending',
        activationToken,
        hasCompletedOnboarding: false,
        ...req.body
    };
    db.users.push(newUser);

    // Simulate sending email
    console.log(`[EMAIL SENT] To: ${newUser.email}`);
    console.log(`[EMAIL CONTENT] Welcome to Visionary Space! Activate your account here:`);
    console.log(`http://localhost:5173/activate?token=${activationToken}`);

    saveDB();
    res.status(201).json(newUser);
});

app.post('/api/users/:id/onboarding', (req, res) => {
    const { id } = req.params;
    const user = db.users.find(u => u.id === id);
    if (user) {
        user.hasCompletedOnboarding = true;
        saveDB();
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Auth
app.post('/api/auth/activate', (req, res) => {
    const { token, password } = req.body;
    const user = db.users.find(u => u.activationToken === token);

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = password; // In a real app, hash this!
    user.status = 'Active';
    user.activationToken = null;
    saveDB();
    res.json({ user, token: 'mock-jwt-token' });
});

app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (db.users.find(u => u.email === email)) {
        return res.status(409).json({ error: 'Email already exists' });
    }

    const newUser = {
        id: `u${Date.now()}`,
        name,
        email,
        password, // In a real app, hash this!
        role: 'Country Manager', // Default role for signups
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        assignedCountries: ['Global'],
        status: 'Active',
        hasCompletedOnboarding: false
    };

    db.users.push(newUser);
    saveDB();

    res.status(201).json({ user: newUser, token: 'mock-jwt-token' });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ user, token: 'mock-jwt-token' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Logs
app.get('/api/logs', (req, res) => {
    const { country } = req.query;
    res.json(filterByCountry(db.logs, country));
});

// Theme
app.get('/api/theme', (req, res) => {
    res.json({ theme: db.theme });
});

app.put('/api/theme', (req, res) => {
    const { theme } = req.body;
    db.theme = theme;
    saveDB();
    res.json({ theme });
});

// Countries
app.get('/api/countries', (req, res) => {
    res.json(db.countries);
});

app.post('/api/countries', (req, res) => {
    const newCountry = req.body;
    // Basic validation
    if (!newCountry.code || !newCountry.name || !newCountry.flag) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check if exists
    if (db.countries.some(c => c.code === newCountry.code)) {
        return res.status(409).json({ error: 'Country code already exists' });
    }
    db.countries.push(newCountry);
    saveDB();
    res.status(201).json(newCountry);
});

app.put('/api/countries/:code', (req, res) => {
    const { code } = req.params;
    const updatedCountry = req.body;

    // If code is changing, check for collision
    if (code !== updatedCountry.code) {
        if (db.countries.some(c => c.code === updatedCountry.code)) {
            return res.status(409).json({ error: 'Country code already exists' });
        }
    }

    const index = db.countries.findIndex(c => c.code === code);
    if (index !== -1) {
        db.countries[index] = updatedCountry;
        res.json(updatedCountry);
    } else {
        res.status(404).send('Country not found');
    }
});

app.delete('/api/countries/:code', (req, res) => {
    const { code } = req.params;
    db.countries = db.countries.filter(c => c.code !== code);
    saveDB();
    res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
