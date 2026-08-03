const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'holidays.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

console.log('🔍 Auditing Sri Lankan Holiday Dataset...');
console.log(`Total Records: ${dataset.holidays.length}`);

let errorsCount = 0;
const seenIds = new Set();
const seenDatesName = new Set();

dataset.holidays.forEach((item, index) => {
  const prefix = `[Item ${index + 1} - ${item.id || 'NO_ID'}]`;

  // 1. Check ID uniqueness
  if (!item.id) {
    console.error(`❌ ${prefix}: Missing 'id' field`);
    errorsCount++;
  } else if (seenIds.has(item.id)) {
    console.error(`❌ ${prefix}: Duplicate ID '${item.id}'`);
    errorsCount++;
  } else {
    seenIds.add(item.id);
  }

  // 2. Check Date Format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
    console.error(`❌ ${prefix}: Invalid date format '${item.date}' (expected YYYY-MM-DD)`);
    errorsCount++;
  }

  // 3. Check year, month, day matches date string
  const [y, m, d] = item.date.split('-').map(Number);
  if (item.year !== y) {
    console.error(`❌ ${prefix}: Mismatched year (${item.year} vs ${y})`);
    errorsCount++;
  }
  if (item.month !== m) {
    console.error(`❌ ${prefix}: Mismatched month (${item.month} vs ${m})`);
    errorsCount++;
  }
  if (item.day !== d) {
    console.error(`❌ ${prefix}: Mismatched day (${item.day} vs ${d})`);
    errorsCount++;
  }

  // 4. Check dayOfWeek matches actual day of week
  const utcDate = new Date(item.date + 'T00:00:00Z');
  const actualDayOfWeek = DAY_NAMES[utcDate.getUTCDay()];
  if (item.dayOfWeek !== actualDayOfWeek) {
    console.error(`❌ ${prefix}: Incorrect dayOfWeek '${item.dayOfWeek}' (should be '${actualDayOfWeek}')`);
    errorsCount++;
  }

  // 5. Check duplicate date + name combination
  const key = `${item.date}_${item.name}`;
  if (seenDatesName.has(key)) {
    console.error(`❌ ${prefix}: Duplicate date + holiday name '${key}'`);
    errorsCount++;
  } else {
    seenDatesName.add(key);
  }

  // 6. Check required string fields
  if (!item.name || item.name.trim() === '') {
    console.error(`❌ ${prefix}: Missing or empty 'name'`);
    errorsCount++;
  }
  if (!item.description || item.description.trim() === '') {
    console.error(`❌ ${prefix}: Missing or empty 'description'`);
    errorsCount++;
  }
});

if (errorsCount === 0) {
  console.log('✅ Dataset audit PASSED with 0 errors! All records are 100% valid and verified.');
} else {
  console.error(`💥 Dataset audit FAILED with ${errorsCount} errors.`);
  process.exit(1);
}
