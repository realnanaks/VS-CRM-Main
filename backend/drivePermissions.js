// Google Drive Folder Permissions Management
// Maps users to their authorized Google Drive folders based on country and department

const ECHO_HOUSE_FOLDER_STRUCTURE = {
  // This will be populated with actual Google Drive folder IDs
  root: null, // Echo House root folder ID
  countries: {
    'Global': {
      folderId: null,
      departments: {
        'shared_resources': { folderId: null, name: 'Shared Resources' }
      }
    },
    'GH': {
      folderId: null,
      name: 'Ghana',
      departments: {
        'creative': { folderId: null, name: 'Creative' },
        'media': { folderId: null, name: 'Media & Advertising' },
        'strategy': { folderId: null, name: 'Strategy & Planning' },
        'digital': { folderId: null, name: 'Digital & Social' },
        'production': { folderId: null, name: 'Production' },
        'client_services': { folderId: null, name: 'Client Services' },
        'data_analytics': { folderId: null, name: 'Data & Analytics' },
        'finance': { folderId: null, name: 'Finance' },
        'operations': { folderId: null, name: 'Operations' },
        'hr': { folderId: null, name: 'Human Resources' },
        'technology': { folderId: null, name: 'Technology & IT' },
        'business_dev': { folderId: null, name: 'Business Development' }
      }
    },
    'NG': {
      folderId: null,
      name: 'Nigeria',
      departments: {
        'creative': { folderId: null, name: 'Creative' },
        'media': { folderId: null, name: 'Media & Advertising' },
        'strategy': { folderId: null, name: 'Strategy & Planning' },
        'digital': { folderId: null, name: 'Digital & Social' },
        'production': { folderId: null, name: 'Production' },
        'client_services': { folderId: null, name: 'Client Services' },
        'data_analytics': { folderId: null, name: 'Data & Analytics' },
        'finance': { folderId: null, name: 'Finance' },
        'operations': { folderId: null, name: 'Operations' },
        'hr': { folderId: null, name: 'Human Resources' },
        'technology': { folderId: null, name: 'Technology & IT' },
        'business_dev': { folderId: null, name: 'Business Development' }
      }
    },
    'CI': {
      folderId: null,
      name: 'Ivory Coast',
      departments: {
        'creative': { folderId: null, name: 'Creative' },
        'media': { folderId: null, name: 'Media & Advertising' },
        'strategy': { folderId: null, name: 'Strategy & Planning' },
        'digital': { folderId: null, name: 'Digital & Social' },
        'production': { folderId: null, name: 'Production' },
        'client_services': { folderId: null, name: 'Client Services' },
        'data_analytics': { folderId: null, name: 'Data & Analytics' },
        'finance': { folderId: null, name: 'Finance' },
        'operations': { folderId: null, name: 'Operations' },
        'hr': { folderId: null, name: 'Human Resources' },
        'technology': { folderId: null, name: 'Technology & IT' },
        'business_dev': { folderId: null, name: 'Business Development' }
      }
    },
    'ZA': {
      folderId: null,
      name: 'South Africa',
      departments: {
        'creative': { folderId: null, name: 'Creative' },
        'media': { folderId: null, name: 'Media & Advertising' },
        'strategy': { folderId: null, name: 'Strategy & Planning' },
        'digital': { folderId: null, name: 'Digital & Social' },
        'production': { folderId: null, name: 'Production' },
        'client_services': { folderId: null, name: 'Client Services' },
        'data_analytics': { folderId: null, name: 'Data & Analytics' },
        'finance': { folderId: null, name: 'Finance' },
        'operations': { folderId: null, name: 'Operations' },
        'hr': { folderId: null, name: 'Human Resources' },
        'technology': { folderId: null, name: 'Technology & IT' },
        'business_dev': { folderId: null, name: 'Business Development' }
      }
    },
    'BJ': {
      folderId: null,
      name: 'Benin',
      departments: {
        'creative': { folderId: null, name: 'Creative' },
        'media': { folderId: null, name: 'Media & Advertising' },
        'strategy': { folderId: null, name: 'Strategy & Planning' },
        'digital': { folderId: null, name: 'Digital & Social' },
        'production': { folderId: null, name: 'Production' },
        'client_services': { folderId: null, name: 'Client Services' },
        'data_analytics': { folderId: null, name: 'Data & Analytics' },
        'finance': { folderId: null, name: 'Finance' },
        'operations': { folderId: null, name: 'Operations' },
        'hr': { folderId: null, name: 'Human Resources' },
        'technology': { folderId: null, name: 'Technology & IT' },
        'business_dev': { folderId: null, name: 'Business Development' }
      }
    },
    'TG': {
      folderId: null,
      name: 'Togo',
      departments: {
        'creative': { folderId: null, name: 'Creative' },
        'media': { folderId: null, name: 'Media & Advertising' },
        'strategy': { folderId: null, name: 'Strategy & Planning' },
        'digital': { folderId: null, name: 'Digital & Social' },
        'production': { folderId: null, name: 'Production' },
        'client_services': { folderId: null, name: 'Client Services' },
        'data_analytics': { folderId: null, name: 'Data & Analytics' },
        'finance': { folderId: null, name: 'Finance' },
        'operations': { folderId: null, name: 'Operations' },
        'hr': { folderId: null, name: 'Human Resources' },
        'technology': { folderId: null, name: 'Technology & IT' },
        'business_dev': { folderId: null, name: 'Business Development' }
      }
    }
  }
};

/**
 * Get all folders a user has access to based on their assigned countries and departments
 * @param {Object} user - User object with assignedCountries and assignedDepartments
 * @returns {Array} Array of accessible folder objects
 */
function getUserAccessibleFolders(user) {
  const accessibleFolders = [];

  if (!user || !user.assignedCountries) {
    return accessibleFolders;
  }

  // Super Admin gets all folders
  if (user.role === 'Super Admin') {
    // Add all country folders
    Object.keys(ECHO_HOUSE_FOLDER_STRUCTURE.countries).forEach(countryCode => {
      const country = ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode];
      
      // Add country-level folder
      if (country.folderId) {
        accessibleFolders.push({
          id: country.folderId,
          name: country.name || countryCode,
          country: countryCode,
          department: null,
          path: `Echo House/${country.name || countryCode}`,
          permissions: ['read', 'write', 'delete']
        });
      }

      // Add all department folders
      if (country.departments) {
        Object.keys(country.departments).forEach(deptId => {
          const dept = country.departments[deptId];
          if (dept.folderId) {
            accessibleFolders.push({
              id: dept.folderId,
              name: dept.name,
              country: countryCode,
              department: deptId,
              path: `Echo House/${country.name || countryCode}/${dept.name}`,
              permissions: ['read', 'write', 'delete']
            });
          }
        });
      }
    });
    return accessibleFolders;
  }

  // For other roles, check assigned countries and departments
  user.assignedCountries.forEach(countryCode => {
    const country = ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode];
    if (!country) return;

    // Country Manager gets all departments in their country
    if (user.role === 'Country Manager') {
      // Add country-level folder
      if (country.folderId) {
        accessibleFolders.push({
          id: country.folderId,
          name: country.name || countryCode,
          country: countryCode,
          department: null,
          path: `Echo House/${country.name || countryCode}`,
          permissions: ['read', 'write', 'delete']
        });
      }

      // Add all department folders
      if (country.departments) {
        Object.keys(country.departments).forEach(deptId => {
          const dept = country.departments[deptId];
          if (dept.folderId) {
            accessibleFolders.push({
              id: dept.folderId,
              name: dept.name,
              country: countryCode,
              department: deptId,
              path: `Echo House/${country.name || countryCode}/${dept.name}`,
              permissions: ['read', 'write', 'delete']
            });
          }
        });
      }
    } else {
      // Department Lead and Staff only get their assigned departments
      if (user.assignedDepartments && country.departments) {
        user.assignedDepartments.forEach(deptId => {
          const dept = country.departments[deptId];
          if (dept && dept.folderId) {
            const permissions = user.role === 'Department Lead' 
              ? ['read', 'write', 'delete'] 
              : ['read', 'write'];

            accessibleFolders.push({
              id: dept.folderId,
              name: dept.name,
              country: countryCode,
              department: deptId,
              path: `Echo House/${country.name || countryCode}/${dept.name}`,
              permissions
            });
          }
        });
      }
    }
  });

  return accessibleFolders;
}

/**
 * Check if a user has access to a specific folder
 * @param {Object} user - User object
 * @param {string} folderId - Google Drive folder ID
 * @param {string} permission - Permission to check ('read', 'write', 'delete')
 * @returns {boolean} True if user has access
 */
function userHasAccessToFolder(user, folderId, permission = 'read') {
  const accessibleFolders = getUserAccessibleFolders(user);
  const folder = accessibleFolders.find(f => f.id === folderId);
  
  if (!folder) return false;
  return folder.permissions.includes(permission);
}

/**
 * Get folder metadata by ID
 * @param {string} folderId - Google Drive folder ID
 * @returns {Object|null} Folder metadata or null if not found
 */
function getFolderMetadata(folderId) {
  for (const countryCode in ECHO_HOUSE_FOLDER_STRUCTURE.countries) {
    const country = ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode];
    
    if (country.folderId === folderId) {
      return {
        id: folderId,
        name: country.name || countryCode,
        country: countryCode,
        department: null,
        path: `Echo House/${country.name || countryCode}`
      };
    }

    if (country.departments) {
      for (const deptId in country.departments) {
        const dept = country.departments[deptId];
        if (dept.folderId === folderId) {
          return {
            id: folderId,
            name: dept.name,
            country: countryCode,
            department: deptId,
            path: `Echo House/${country.name || countryCode}/${dept.name}`
          };
        }
      }
    }
  }
  return null;
}

/**
 * Update folder structure with actual Google Drive folder IDs
 * This should be called during setup to map the folder structure
 * @param {Object} folderMapping - Object mapping country/department to folder IDs
 */
function updateFolderStructure(folderMapping) {
  if (folderMapping.root) {
    ECHO_HOUSE_FOLDER_STRUCTURE.root = folderMapping.root;
  }

  if (folderMapping.countries) {
    Object.keys(folderMapping.countries).forEach(countryCode => {
      if (ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode]) {
        const countryMapping = folderMapping.countries[countryCode];
        
        if (countryMapping.folderId) {
          ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode].folderId = countryMapping.folderId;
        }

        if (countryMapping.departments) {
          Object.keys(countryMapping.departments).forEach(deptId => {
            if (ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode].departments[deptId]) {
              ECHO_HOUSE_FOLDER_STRUCTURE.countries[countryCode].departments[deptId].folderId = 
                countryMapping.departments[deptId];
            }
          });
        }
      }
    });
  }
}

module.exports = {
  ECHO_HOUSE_FOLDER_STRUCTURE,
  getUserAccessibleFolders,
  userHasAccessToFolder,
  getFolderMetadata,
  updateFolderStructure
};
