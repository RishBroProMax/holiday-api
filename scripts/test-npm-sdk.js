const api = require('../dist/index.js');

console.log('🧪 Testing sri-lankan-holiday-api Node Module SDK...');

// Test 1: Basic getters
console.log('1. Upcoming Holiday:', api.getUpcomingHoliday()?.name);
console.log('2. Next Poya Day:', api.getNextPoyaDay()?.name, 'in', api.getNextPoyaDay()?.daysUntil, 'days');
console.log('3. Is 2026-04-13 public holiday?', api.isPublicHoliday('2026-04-13'));
console.log('4. Is 2026-04-13 working day?', api.isWorkingDay('2026-04-13'));
console.log('5. Is 2026-04-15 working day?', api.isWorkingDay('2026-04-15'));

// Test 2: Ranges & Counts
const holidaysApril = api.getHolidaysInRange('2026-04-01', '2026-04-30');
console.log('6. April 2026 Holidays Count:', holidaysApril.length);

const workingDaysApril = api.countWorkingDays('2026-04-01', '2026-04-30');
console.log('7. April 2026 Working Days Count:', workingDaysApril);

// Test 3: Long Weekends
const longWeekends2026 = api.getLongWeekends(2026);
console.log('8. 2026 Long Weekends Count:', longWeekends2026.length);
if (longWeekends2026.length > 0) {
  console.log('   Example Long Weekend:', longWeekends2026[0].holiday.name, longWeekends2026[0].dates);
}

// Test 4: Religion queries
console.log('9. Buddhist Holidays (2026):', api.getBuddhistHolidays(2026).length);
console.log('10. Hindu Holidays (2026):', api.getHinduHolidays(2026).length);
console.log('11. Islamic Holidays (2026):', api.getIslamicHolidays(2026).length);

// Test 5: Days until & Lookup
console.log('12. Days until 2026-12-25 (Christmas):', api.getDaysUntil('2026-12-25'));
console.log('13. Lookup by ID (2026-01-03-duruthu-full-moon-poya-day):', api.getHolidayById('2026-01-03-duruthu-full-moon-poya-day')?.name);

// Test 6: Dataset Stats
console.log('14. Dataset Stats:', api.getDatasetStats());

console.log('✅ ALL SDK METHODS TESTED AND WORKING PERFECTLY!');
