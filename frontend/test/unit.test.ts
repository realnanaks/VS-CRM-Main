import { calculateProgress, getStatusColor } from '../utils/eventUtils';
import { retrieveDashboardData } from '../services/data';

console.log('Running Unit Tests...');

// Test calculateProgress
const progress1 = calculateProgress(50, 100);
if (progress1 !== 50) console.error(`FAIL: calculateProgress(50, 100) expected 50, got ${progress1}`);
else console.log('PASS: calculateProgress(50, 100)');

const progress2 = calculateProgress(0, 100);
if (progress2 !== 0) console.error(`FAIL: calculateProgress(0, 100) expected 0, got ${progress2}`);
else console.log('PASS: calculateProgress(0, 100)');

const progress3 = calculateProgress(100, 0);
if (progress3 !== 0) console.error(`FAIL: calculateProgress(100, 0) expected 0, got ${progress3}`);
else console.log('PASS: calculateProgress(100, 0)');

// Test getStatusColor
const color1 = getStatusColor('Active');
if (!color1.includes('emerald')) console.error(`FAIL: getStatusColor('Active') expected emerald, got ${color1}`);
else console.log('PASS: getStatusColor("Active")');

const color2 = getStatusColor('Unknown');
if (!color2.includes('gray')) console.error(`FAIL: getStatusColor('Unknown') expected gray, got ${color2}`);
else console.log('PASS: getStatusColor("Unknown")');

// Test retrieveDashboardData
try {
    const data = retrieveDashboardData('US');
    if (!data.events) console.error('FAIL: retrieveDashboardData("US") missing events');
    else console.log(`PASS: retrieveDashboardData("US") returned ${data.events.length} events`);
} catch (e) {
    console.error('FAIL: retrieveDashboardData("US") threw error', e);
}

console.log('Tests Completed.');
