// File Parsers for Excel, Word, PDF, and CSV files
// Extracts structured data from various file formats

const XLSX = require('xlsx');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Parse Excel file (.xlsx, .xls)
 * @param {string} filePath - Path to the Excel file
 * @returns {Promise<Object>} Parsed data with sheets
 */
async function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const result = {
      fileName: path.basename(filePath),
      fileType: 'excel',
      sheets: [],
      metadata: {
        sheetCount: workbook.SheetNames.length,
        sheetNames: workbook.SheetNames
      }
    };

    // Parse each sheet
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Extract headers (first row)
      const headers = jsonData[0] || [];
      const rows = jsonData.slice(1);

      // Convert to objects
      const data = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      }).filter(obj => Object.values(obj).some(val => val !== undefined && val !== ''));

      result.sheets.push({
        name: sheetName,
        headers,
        rowCount: data.length,
        data: data.slice(0, 100) // Limit to first 100 rows for preview
      });
    });

    return result;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Parse Word document (.docx)
 * @param {string} filePath - Path to the Word file
 * @returns {Promise<Object>} Parsed data with text and tables
 */
async function parseWord(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    // Also extract with HTML to get tables
    const htmlResult = await mammoth.convertToHtml({ buffer });
    
    return {
      fileName: path.basename(filePath),
      fileType: 'word',
      text: result.value,
      html: htmlResult.value,
      metadata: {
        characterCount: result.value.length,
        wordCount: result.value.split(/\s+/).filter(word => word.length > 0).length,
        paragraphCount: result.value.split('\n\n').length
      },
      messages: result.messages // Any warnings or errors
    };
  } catch (error) {
    console.error('Error parsing Word file:', error);
    throw new Error(`Failed to parse Word file: ${error.message}`);
  }
}

/**
 * Parse PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} Parsed data with text
 */
async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    return {
      fileName: path.basename(filePath),
      fileType: 'pdf',
      text: data.text,
      metadata: {
        pages: data.numpages,
        info: data.info,
        version: data.version
      }
    };
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
}

/**
 * Parse CSV file
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Object>} Parsed data with rows
 */
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const csv = require('csv-parser');
    const results = [];
    let headers = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headerList) => {
        headers = headerList;
      })
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve({
          fileName: path.basename(filePath),
          fileType: 'csv',
          headers,
          rowCount: results.length,
          data: results.slice(0, 100), // Limit to first 100 rows for preview
          metadata: {
            columnCount: headers.length,
            totalRows: results.length
          }
        });
      })
      .on('error', (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      });
  });
}

/**
 * Auto-detect file type and parse accordingly
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<Object>} Parsed data
 */
async function parseFile(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Excel files
  if (ext === '.xlsx' || ext === '.xls' || 
      mimeType.includes('spreadsheet') || 
      mimeType.includes('excel')) {
    return await parseExcel(filePath);
  }
  
  // Word files
  if (ext === '.docx' || 
      mimeType.includes('wordprocessingml') || 
      mimeType.includes('msword')) {
    return await parseWord(filePath);
  }
  
  // PDF files
  if (ext === '.pdf' || mimeType.includes('pdf')) {
    return await parsePDF(filePath);
  }
  
  // CSV files
  if (ext === '.csv' || mimeType.includes('csv')) {
    return await parseCSV(filePath);
  }
  
  throw new Error(`Unsupported file type: ${ext} (${mimeType})`);
}

/**
 * Extract specific data based on template rules
 * @param {Object} parsedData - Data from parseFile()
 * @param {Object} template - Extraction template with rules
 * @returns {Object} Extracted data
 */
function extractData(parsedData, template) {
  // This is a placeholder for template-based extraction
  // In a real implementation, this would apply rules to extract specific data
  
  if (parsedData.fileType === 'excel' && template.type === 'excel') {
    const sheet = parsedData.sheets.find(s => s.name === template.sheetName) || parsedData.sheets[0];
    if (!sheet) return { error: 'Sheet not found' };
    
    // Apply column mapping
    const extracted = sheet.data.map(row => {
      const mapped = {};
      Object.keys(template.columns).forEach(col => {
        const targetField = template.columns[col];
        mapped[targetField] = row[col];
      });
      return mapped;
    });
    
    return {
      type: template.targetType || 'generic',
      count: extracted.length,
      data: extracted
    };
  }
  
  // For other types, return raw data
  return {
    type: 'raw',
    data: parsedData
  };
}

module.exports = {
  parseExcel,
  parseWord,
  parsePDF,
  parseCSV,
  parseFile,
  extractData
};
