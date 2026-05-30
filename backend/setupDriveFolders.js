// Script to create Echo House folder structure in Google Drive
// Run this once to set up the complete folder hierarchy

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const KEY_FILE_PATH = path.join(__dirname, 'google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Echo House folder structure
const COUNTRIES = [
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'BJ', name: 'Benin' },
  { code: 'TG', name: 'Togo' },
  { code: 'Global', name: 'Global' }
];

const DEPARTMENTS = [
  { id: 'creative', name: 'Creative' },
  { id: 'media', name: 'Media & Advertising' },
  { id: 'strategy', name: 'Strategy & Planning' },
  { id: 'digital', name: 'Digital & Social' },
  { id: 'production', name: 'Production' },
  { id: 'client_services', name: 'Client Services' },
  { id: 'data_analytics', name: 'Data & Analytics' },
  { id: 'finance', name: 'Finance' },
  { id: 'operations', name: 'Operations' },
  { id: 'hr', name: 'Human Resources' },
  { id: 'technology', name: 'Technology & IT' },
  { id: 'business_dev', name: 'Business Development' }
];

async function setupDrive() {
  try {
    if (!fs.existsSync(KEY_FILE_PATH)) {
      console.error('❌ Google credentials file not found at:', KEY_FILE_PATH);
      console.log('Please ensure google-credentials.json exists in the backend folder');
      return;
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: SCOPES,
    });

    const drive = google.drive({ version: 'v3', auth });
    console.log('✅ Connected to Google Drive\n');

    // Create root folder
    console.log('📁 Creating Echo House root folder...');
    const rootFolder = await drive.files.create({
      requestBody: {
        name: 'Echo House',
        mimeType: 'application/vnd.google-apps.folder'
      },
      fields: 'id, name'
    });

    const rootFolderId = rootFolder.data.id;
    console.log(`✅ Created: Echo House (${rootFolderId})\n`);

    const folderMapping = {
      root: rootFolderId,
      countries: {}
    };

    // Create country folders and their department subfolders
    for (const country of COUNTRIES) {
      console.log(`📁 Creating ${country.name} folder...`);
      
      const countryFolder = await drive.files.create({
        requestBody: {
          name: country.name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [rootFolderId]
        },
        fields: 'id, name'
      });

      const countryFolderId = countryFolder.data.id;
      console.log(`✅ Created: ${country.name} (${countryFolderId})`);

      folderMapping.countries[country.code] = {
        folderId: countryFolderId,
        departments: {}
      };

      // Create department folders for this country
      if (country.code === 'Global') {
        // Global only gets Shared Resources
        console.log(`  📂 Creating Shared Resources...`);
        const deptFolder = await drive.files.create({
          requestBody: {
            name: 'Shared Resources',
            mimeType: 'application/vnd.google-apps.folder',
            parents: [countryFolderId]
          },
          fields: 'id, name'
        });
        folderMapping.countries[country.code].departments['shared_resources'] = deptFolder.data.id;
        console.log(`  ✅ Created: Shared Resources (${deptFolder.data.id})`);
      } else {
        // Other countries get all 8 departments
        for (const dept of DEPARTMENTS) {
          console.log(`  📂 Creating ${dept.name}...`);
          const deptFolder = await drive.files.create({
            requestBody: {
              name: dept.name,
              mimeType: 'application/vnd.google-apps.folder',
              parents: [countryFolderId]
            },
            fields: 'id, name'
          });
          folderMapping.countries[country.code].departments[dept.id] = deptFolder.data.id;
          console.log(`  ✅ Created: ${dept.name} (${deptFolder.data.id})`);
        }
      }
      console.log('');
    }

    // Save folder mapping to file
    const mappingFile = path.join(__dirname, 'drive-folder-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(folderMapping, null, 2));
    console.log(`\n💾 Folder mapping saved to: ${mappingFile}`);

    // Generate code to update drivePermissions.js
    console.log('\n📝 To update drivePermissions.js, add this code:\n');
    console.log('```javascript');
    console.log('const { updateFolderStructure } = require(\'./drivePermissions\');');
    console.log('const folderMapping = require(\'./drive-folder-mapping.json\');');
    console.log('updateFolderStructure(folderMapping);');
    console.log('```\n');

    console.log('✅ Setup complete!');
    console.log(`📊 Total folders created: ${1 + COUNTRIES.length + (COUNTRIES.length - 1) * DEPARTMENTS.length + 1}`);
    console.log('   - 1 root folder (Echo House)');
    console.log('   - 7 country folders');
    console.log(`   - ${(COUNTRIES.length - 1) * DEPARTMENTS.length + 1} department folders (6 countries × 12 departments + 1 Global/Shared Resources)`);
    console.log('\n🎉 Echo House folder structure is ready!');

  } catch (error) {
    console.error('❌ Error setting up folders:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the setup
console.log('🚀 Echo House Google Drive Setup\n');
console.log('This script will create the complete folder structure:');
console.log('- 1 root folder (Echo House)');
console.log('- 7 country folders');
console.log('- 73 department folders (6 countries × 12 departments + 1 Global/Shared Resources)\n');

setupDrive();
