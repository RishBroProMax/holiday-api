/**
 * Sri Lankan Holiday Data Generator
 * 
 * Generates a complete holiday dataset for 2024-2045 using:
 * - Astronomical full moon calculations (Jean Meeus algorithm) for Poya days
 * - Researched dates for Islamic, Hindu, Christian holidays
 * - Fixed-date national and international observances
 * 
 * Run: node scripts/generate-holidays.js
 * Output: data/holidays.json
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// SECTION 1: Full Moon Calculator (Jean Meeus Algorithm)
// ============================================================

/**
 * Calculate the Julian Day Number for a full moon
 * Based on Jean Meeus "Astronomical Algorithms" (1991)
 * Accuracy: ~1 minute for dates within 1900-2100
 */
function getFullMoonDate(year, month) {
  // Approximate k value for the lunation
  const k = Math.round((year + (month - 0.5) / 12 - 2000) * 12.3685);
  
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  
  // Mean phase (Julian Ephemeris Day)
  let JDE = 2451550.09766 + 29.530588861 * k
    + 0.00015437 * T2
    - 0.000000150 * T3
    + 0.00000000073 * T4;
  
  // Sun's mean anomaly
  const M = (2.5534 + 29.10535670 * k
    - 0.0000014 * T2
    - 0.00000011 * T3) % 360;
  
  // Moon's mean anomaly
  const Mp = (201.5643 + 385.81693528 * k
    + 0.0107582 * T2
    + 0.00001238 * T3
    - 0.000000058 * T4) % 360;
  
  // Moon's argument of latitude
  const F = (160.7108 + 390.67050284 * k
    - 0.0016118 * T2
    - 0.00000227 * T3
    + 0.000000011 * T4) % 360;
  
  // Longitude of ascending node
  const O = (124.7746 - 1.56375588 * k
    + 0.0020672 * T2
    + 0.00000215 * T3) % 360;
  
  const rad = Math.PI / 180;
  
  // Eccentricity correction
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  
  // Full moon corrections
  let correction = 0;
  correction += -0.40614 * Math.sin(Mp * rad);
  correction += 0.17302 * E * Math.sin(M * rad);
  correction += 0.01614 * Math.sin(2 * Mp * rad);
  correction += 0.01043 * Math.sin(2 * F * rad);
  correction += 0.00734 * E * Math.sin(Mp * rad - M * rad);
  correction += -0.00515 * E * Math.sin(Mp * rad + M * rad);
  correction += 0.00209 * E * E * Math.sin(2 * M * rad);
  correction += -0.00111 * Math.sin(Mp * rad - 2 * F * rad);
  correction += -0.00057 * Math.sin(Mp * rad + 2 * F * rad);
  correction += 0.00056 * E * Math.sin(2 * Mp * rad + M * rad);
  correction += -0.00042 * Math.sin(3 * Mp * rad);
  correction += 0.00042 * E * Math.sin(M * rad + 2 * F * rad);
  correction += 0.00038 * E * Math.sin(M * rad - 2 * F * rad);
  correction += -0.00024 * E * Math.sin(2 * Mp * rad - M * rad);
  correction += -0.00017 * Math.sin(O * rad);
  
  JDE += correction;
  
  // Convert JDE to Date (UTC)
  const JD0 = 2440587.5; // Unix epoch in JD
  const unixMs = (JDE - JD0) * 86400000;
  const utcDate = new Date(unixMs);
  
  // Convert to Sri Lanka time (UTC+5:30)
  const sriLankaMs = unixMs + (5.5 * 3600000);
  const slDate = new Date(sriLankaMs);
  
  return slDate;
}

/**
 * Get all full moon dates for a given year (in Sri Lanka time)
 */
function getFullMoonsForYear(year) {
  const moons = [];
  // Check each month, plus previous December and next January for edge cases
  for (let m = 0; m <= 13; m++) {
    const date = getFullMoonDate(year, m);
    if (date.getUTCFullYear() === year) {
      const dateStr = `${year}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
      // Avoid duplicates
      if (!moons.find(d => d === dateStr)) {
        moons.push(dateStr);
      }
    }
  }
  return moons.sort();
}

// ============================================================
// SECTION 2: Poya Day Name Mapping
// ============================================================

const POYA_NAMES = {
  1: { name: 'Duruthu', description: 'Commemorates the first visit of Lord Buddha to Sri Lanka.' },
  2: { name: 'Navam', description: 'Commemorates the appointment of two chief disciples of Lord Buddha and the establishment of a code of conduct for Buddhist monks.' },
  3: { name: 'Medin', description: 'Marks the visit of Lord Buddha to his father\'s kingdom after attaining enlightenment.' },
  4: { name: 'Bak', description: 'Commemorates the second visit of Lord Buddha to Sri Lanka to settle a dispute between Naga kings.' },
  5: { name: 'Vesak', description: 'The most important Buddhist festival, commemorating the birth, enlightenment, and passing of Lord Buddha.' },
  6: { name: 'Poson', description: 'Celebrates the introduction of Buddhism to Sri Lanka by Arahat Mahinda.' },
  7: { name: 'Esala', description: 'Commemorates the arrival of the Sacred Tooth Relic to Sri Lanka and Buddha\'s first sermon.' },
  8: { name: 'Nikini', description: 'Commemorates the first Buddhist council held to preserve Buddha\'s teachings.' },
  9: { name: 'Binara', description: 'Commemorates the establishment of the Bhikkuni order (Order of Nuns) in Buddhism.' },
  10: { name: 'Vap', description: 'Marks the end of the Vas season (rainy retreat for monks) and the beginning of the Katina season.' },
  11: { name: 'Il', description: 'Commemorates the sending of sixty enlightened monks to spread Buddhism across the land.' },
  12: { name: 'Unduvap', description: 'Celebrates the arrival of Sangamitta Theri with a sapling of the sacred Sri Maha Bodhi tree.' },
};

// When there are 13 full moons in a year, the extra one gets "Adhi" prefix
const ADHI_POYA_DESC = 'An additional Poya day occurring due to the lunar calendar alignment.';

// ============================================================
// SECTION 3: Fixed & Variable Holiday Data
// ============================================================

// Good Friday dates (researched, 2024-2045)
const GOOD_FRIDAY = {
  2024: '2024-03-29', 2025: '2025-04-18', 2026: '2026-04-03',
  2027: '2027-03-26', 2028: '2028-04-14', 2029: '2029-03-30',
  2030: '2030-04-19', 2031: '2031-04-11', 2032: '2032-03-26',
  2033: '2033-04-15', 2034: '2034-04-07', 2035: '2035-03-23',
  2036: '2036-04-11', 2037: '2037-04-03', 2038: '2038-04-23',
  2039: '2039-04-08', 2040: '2040-03-30', 2041: '2041-04-19',
  2042: '2042-04-04', 2043: '2043-03-27', 2044: '2044-04-15',
  2045: '2045-04-07'
};

// Eid al-Fitr (approximate, shifts ~11 days/year)
const EID_AL_FITR = {
  2024: '2024-04-11', 2025: '2025-03-31', 2026: '2026-03-21',
  2027: '2027-03-10', 2028: '2028-02-27', 2029: '2029-02-14',
  2030: '2030-02-04', 2031: '2031-01-24', 2032: '2032-01-13',
  2033: '2033-01-02', 2034: '2034-12-12', 2035: '2035-12-01',
  2036: '2036-11-19', 2037: '2037-11-09', 2038: '2038-10-29',
  2039: '2039-10-19', 2040: '2040-10-07', 2041: '2041-09-26',
  2042: '2042-09-15', 2043: '2043-09-05', 2044: '2044-08-24',
  2045: '2045-08-14'
};

// Eid al-Adha (approximate, shifts ~11 days/year)
const EID_AL_ADHA = {
  2024: '2024-06-17', 2025: '2025-06-07', 2026: '2026-05-28',
  2027: '2027-05-17', 2028: '2028-05-06', 2029: '2029-04-24',
  2030: '2030-04-13', 2031: '2031-04-02', 2032: '2032-03-22',
  2033: '2033-03-11', 2034: '2034-02-28', 2035: '2035-02-17',
  2036: '2036-02-06', 2037: '2037-01-26', 2038: '2038-01-16',
  2039: '2039-01-05', 2040: '2040-12-15', 2041: '2041-12-05',
  2042: '2042-11-24', 2043: '2043-11-13', 2044: '2044-11-01',
  2045: '2045-10-22'
};

// Milad-un-Nabi (approximate, shifts ~11 days/year)
const MILAD_UN_NABI = {
  2024: '2024-09-16', 2025: '2025-09-05', 2026: '2026-08-26',
  2027: '2027-08-15', 2028: '2028-08-03', 2029: '2029-07-24',
  2030: '2030-07-13', 2031: '2031-07-02', 2032: '2032-06-21',
  2033: '2033-06-10', 2034: '2034-05-30', 2035: '2035-05-20',
  2036: '2036-05-08', 2037: '2037-04-27', 2038: '2038-04-17',
  2039: '2039-04-06', 2040: '2040-03-25', 2041: '2041-03-15',
  2042: '2042-03-04', 2043: '2043-02-21', 2044: '2044-02-11',
  2045: '2045-01-30'
};

// Maha Sivarathri (researched Hindu calendar dates)
const MAHA_SIVARATHRI = {
  2024: '2024-03-08', 2025: '2025-02-26', 2026: '2026-02-15',
  2027: '2027-03-06', 2028: '2028-02-23', 2029: '2029-02-11',
  2030: '2030-03-02', 2031: '2031-02-20', 2032: '2032-03-10',
  2033: '2033-02-27', 2034: '2034-02-17', 2035: '2035-03-08',
  2036: '2036-02-25', 2037: '2037-02-13', 2038: '2038-03-04',
  2039: '2039-02-21', 2040: '2040-03-11', 2041: '2041-02-28',
  2042: '2042-02-17', 2043: '2043-03-07', 2044: '2044-02-24',
  2045: '2045-02-13'
};

// Deepavali (researched Hindu calendar dates)
const DEEPAVALI = {
  2024: '2024-10-31', 2025: '2025-10-20', 2026: '2026-11-08',
  2027: '2027-10-29', 2028: '2028-10-17', 2029: '2029-11-05',
  2030: '2030-10-25', 2031: '2031-10-14', 2032: '2032-11-01',
  2033: '2033-10-21', 2034: '2034-11-09', 2035: '2035-10-29',
  2036: '2036-10-17', 2037: '2037-11-06', 2038: '2038-10-26',
  2039: '2039-10-14', 2040: '2040-11-02', 2041: '2041-10-22',
  2042: '2042-11-10', 2043: '2043-10-30', 2044: '2044-10-18',
  2045: '2045-11-06'
};

// Thai Pongal: typically Jan 14 or 15 (based on solar transit)
// Researched pattern: mostly Jan 14, sometimes Jan 15
const THAI_PONGAL = {
  2024: '2024-01-15', 2025: '2025-01-14', 2026: '2026-01-15',
  2027: '2027-01-15', 2028: '2028-01-15', 2029: '2029-01-14',
  2030: '2030-01-14', 2031: '2031-01-15', 2032: '2032-01-15',
  2033: '2033-01-14', 2034: '2034-01-14', 2035: '2035-01-15',
  2036: '2036-01-15', 2037: '2037-01-14', 2038: '2038-01-14',
  2039: '2039-01-15', 2040: '2040-01-15', 2041: '2041-01-14',
  2042: '2042-01-14', 2043: '2043-01-15', 2044: '2044-01-15',
  2045: '2045-01-14'
};

// ============================================================
// SECTION 4: Helper Utilities
// ============================================================

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return DAY_NAMES[d.getUTCDay()];
}

function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function makeId(dateStr, name) {
  return `${dateStr}-${slugify(name)}`;
}

function createHoliday(dateStr, name, type, category, description, isBank = true) {
  const { year, month, day } = parseDate(dateStr);
  return {
    id: makeId(dateStr, name),
    name,
    date: dateStr,
    year,
    month,
    day,
    dayOfWeek: getDayOfWeek(dateStr),
    type,
    category,
    isPublicHoliday: ['public', 'public_and_bank'].includes(category),
    isBankHoliday: isBank,
    description
  };
}

// ============================================================
// SECTION 5: Generate All Holidays for a Year
// ============================================================

function generateHolidaysForYear(year) {
  const holidays = [];

  // --- FIXED-DATE NATIONAL HOLIDAYS ---
  
  // New Year's Day (only some years it's a declared holiday in SL)
  holidays.push(createHoliday(
    `${year}-01-01`, "New Year's Day", 'national', 'public_and_bank',
    'The first day of the Gregorian calendar year.'
  ));

  // Independence Day - Feb 4 (always)
  holidays.push(createHoliday(
    `${year}-02-04`, 'Independence Day', 'national', 'public_and_bank',
    'Celebrates Sri Lanka\'s independence from British rule on February 4, 1948.'
  ));

  // Day prior to Sinhala & Tamil New Year - Apr 13 (always)
  holidays.push(createHoliday(
    `${year}-04-13`, 'Day prior to Sinhala & Tamil New Year', 'national', 'public_and_bank',
    'The eve of Sinhala and Tamil New Year, a time of preparation and cultural rituals.'
  ));

  // Sinhala & Tamil New Year Day - Apr 14 (always)
  holidays.push(createHoliday(
    `${year}-04-14`, 'Sinhala & Tamil New Year Day', 'national', 'public_and_bank',
    'The most widely celebrated holiday in Sri Lanka, marking the traditional New Year for both Sinhala and Tamil communities.'
  ));

  // May Day - May 1 (always)
  holidays.push(createHoliday(
    `${year}-05-01`, 'May Day (International Workers\' Day)', 'national', 'public_and_bank',
    'International Workers\' Day, celebrating workers\' rights and the labour movement.'
  ));

  // Christmas Day - Dec 25 (always)
  holidays.push(createHoliday(
    `${year}-12-25`, 'Christmas Day', 'christian', 'public_and_bank',
    'Celebrates the birth of Jesus Christ.'
  ));

  // --- BUDDHIST POYA DAYS (computed astronomically) ---
  const fullMoons = getFullMoonsForYear(year);

  // Map each full moon to a Poya name based on its month
  const monthPoyaCount = {};
  fullMoons.forEach((dateStr, index) => {
    const { month } = parseDate(dateStr);
    if (!monthPoyaCount[month]) monthPoyaCount[month] = 0;
    monthPoyaCount[month]++;

    const isExtraPoya = fullMoons.length > 12 && monthPoyaCount[month] > 1;
    const poya = POYA_NAMES[month];

    if (poya) {
      const poyaName = isExtraPoya
        ? `Adhi ${poya.name} Full Moon Poya Day`
        : `${poya.name} Full Moon Poya Day`;
      const poyaDesc = isExtraPoya
        ? `${ADHI_POYA_DESC} ${poya.description}`
        : poya.description;

      holidays.push(createHoliday(dateStr, poyaName, 'buddhist', 'public_and_bank', poyaDesc));

      // Day following Vesak
      if (month === 5 && !isExtraPoya) {
        const vesak = new Date(dateStr + 'T00:00:00Z');
        vesak.setUTCDate(vesak.getUTCDate() + 1);
        const nextDay = vesak.toISOString().split('T')[0];
        holidays.push(createHoliday(
          nextDay,
          'Day following Vesak Full Moon Poya Day',
          'buddhist', 'public_and_bank',
          'Continuation of Vesak celebrations.'
        ));
      }
    }
  });

  // --- HINDU HOLIDAYS ---
  
  // Tamil Thai Pongal
  if (THAI_PONGAL[year]) {
    holidays.push(createHoliday(
      THAI_PONGAL[year], 'Tamil Thai Pongal Day', 'hindu', 'public_and_bank',
      'A harvest festival celebrated by Sri Lankan Tamils, marking the beginning of the Tamil month of Thai.'
    ));
  }

  // Maha Sivarathri
  if (MAHA_SIVARATHRI[year]) {
    holidays.push(createHoliday(
      MAHA_SIVARATHRI[year], 'Maha Sivarathri Day', 'hindu', 'public_and_bank',
      'A Hindu festival dedicated to Lord Shiva, observed with fasting and night-long prayers.'
    ));
  }

  // Deepavali
  if (DEEPAVALI[year]) {
    holidays.push(createHoliday(
      DEEPAVALI[year], 'Deepavali Festival Day', 'hindu', 'public_and_bank',
      'The Hindu Festival of Lights, symbolizing the victory of light over darkness and good over evil.'
    ));
  }

  // --- ISLAMIC HOLIDAYS ---
  
  // Eid al-Fitr
  if (EID_AL_FITR[year]) {
    holidays.push(createHoliday(
      EID_AL_FITR[year], 'Id-Ul-Fitr (Ramazan Festival Day)', 'islamic', 'public_and_bank',
      'Marks the end of Ramadan, the Islamic holy month of fasting. Date is subject to moon sighting.'
    ));
  }

  // Eid al-Adha
  if (EID_AL_ADHA[year]) {
    holidays.push(createHoliday(
      EID_AL_ADHA[year], 'Id-Ul-Alha (Hadji Festival Day)', 'islamic', 'public_and_bank',
      'The Festival of Sacrifice, commemorating Prophet Ibrahim\'s willingness to sacrifice his son. Date is subject to moon sighting.'
    ));
  }

  // Milad-un-Nabi
  if (MILAD_UN_NABI[year]) {
    holidays.push(createHoliday(
      MILAD_UN_NABI[year], 'Milad-Un-Nabi (Holy Prophet\'s Birthday)', 'islamic', 'public_and_bank',
      'Celebrates the birthday of Prophet Muhammad (Peace Be Upon Him). Date is subject to moon sighting.'
    ));
  }

  // --- CHRISTIAN HOLIDAYS ---

  // Good Friday
  if (GOOD_FRIDAY[year]) {
    holidays.push(createHoliday(
      GOOD_FRIDAY[year], 'Good Friday', 'christian', 'public_and_bank',
      'Commemorates the crucifixion of Jesus Christ.'
    ));
  }

  // --- BANK-ONLY / SPECIAL HOLIDAYS ---
  
  // Day before and after long weekends are often bank holidays
  // Tamil Thai Pongal Day is also observed by banks

  // --- INTERNATIONAL OBSERVANCES (not public holidays, but widely recognized) ---

  holidays.push(createHoliday(
    `${year}-02-14`, "Valentine's Day", 'international', 'observance',
    'A day to celebrate love and affection.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-03-08`, "International Women's Day", 'international', 'observance',
    'A global day celebrating the social, economic, cultural and political achievements of women.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-05-18`, 'National War Heroes Day', 'national', 'observance',
    'Remembrance day for Sri Lankan soldiers who sacrificed their lives in the civil war.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-06-01`, "International Children's Day", 'international', 'observance',
    'A day to promote the welfare of children worldwide.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-10-01`, "International Day of Older Persons", 'international', 'observance',
    'A day to recognize the contributions of older persons.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-11-14`, "Children's Day (Sri Lanka)", 'national', 'observance',
    'A day dedicated to children in Sri Lanka.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-12-10`, 'Human Rights Day', 'international', 'observance',
    'Commemorates the adoption of the Universal Declaration of Human Rights.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-01-26`, 'International Customs Day', 'international', 'observance',
    'Recognizes the role of customs officials and agencies.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-04-22`, 'Earth Day', 'international', 'observance',
    'An annual event to demonstrate support for environmental protection.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-06-05`, 'World Environment Day', 'international', 'observance',
    'The United Nations\' principal vehicle for encouraging awareness and action for the protection of the environment.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-06-21`, 'International Day of Yoga', 'international', 'observance',
    'A day to raise awareness worldwide of the benefits of practicing yoga.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-09-21`, 'International Day of Peace', 'international', 'observance',
    'Devoted to strengthening the ideals of peace worldwide.',
    false
  ));

  holidays.push(createHoliday(
    `${year}-10-02`, 'International Day of Non-Violence', 'international', 'observance',
    'Commemorates the birthday of Mahatma Gandhi.',
    false
  ));

  // Sort by date
  holidays.sort((a, b) => a.date.localeCompare(b.date));

  return holidays;
}

// ============================================================
// SECTION 6: Generate the Complete Dataset
// ============================================================

function generateAllHolidays() {
  const startYear = 2024;
  const endYear = 2045;
  const allHolidays = [];

  console.log(`\n🇱🇰 Sri Lankan Holiday Data Generator`);
  console.log(`${'='.repeat(45)}`);
  console.log(`Generating holidays from ${startYear} to ${endYear}...\n`);

  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = generateHolidaysForYear(year);
    const publicCount = yearHolidays.filter(h => h.isPublicHoliday).length;
    const observanceCount = yearHolidays.filter(h => !h.isPublicHoliday).length;
    console.log(`  ${year}: ${publicCount} public holidays + ${observanceCount} observances = ${yearHolidays.length} total`);
    allHolidays.push(...yearHolidays);
  }

  // Stats
  const types = {};
  allHolidays.forEach(h => {
    types[h.type] = (types[h.type] || 0) + 1;
  });

  console.log(`\n📊 Summary:`);
  console.log(`  Total holidays: ${allHolidays.length}`);
  console.log(`  Years covered: ${startYear}-${endYear} (${endYear - startYear + 1} years)`);
  console.log(`  Public holidays: ${allHolidays.filter(h => h.isPublicHoliday).length}`);
  console.log(`  Bank holidays: ${allHolidays.filter(h => h.isBankHoliday).length}`);
  console.log(`  Observances: ${allHolidays.filter(h => !h.isPublicHoliday).length}`);
  console.log(`\n  By type:`);
  Object.entries(types).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`    ${type}: ${count}`);
  });

  return {
    meta: {
      version: '2.0.0',
      generated: new Date().toISOString(),
      startYear,
      endYear,
      totalHolidays: allHolidays.length,
      totalPublicHolidays: allHolidays.filter(h => h.isPublicHoliday).length,
      totalBankHolidays: allHolidays.filter(h => h.isBankHoliday).length,
      totalObservances: allHolidays.filter(h => !h.isPublicHoliday).length,
      types: Object.keys(types),
      disclaimer: 'Poya dates are computed astronomically (Jean Meeus algorithm). Islamic holiday dates are approximate and subject to moon sighting. Hindu festival dates may vary by regional tradition. Always verify with the Sri Lankan Government Gazette for legally binding dates.',
      source: 'Compiled from government gazettes, astronomical calculations, and publicly available calendar data.',
      timezone: 'Asia/Colombo (UTC+5:30)'
    },
    holidays: allHolidays
  };
}

// ============================================================
// SECTION 7: Run & Save
// ============================================================

const data = generateAllHolidays();

const outputPath = path.join(__dirname, '..', 'data', 'holidays.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n✅ Written to: ${outputPath}`);
console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB\n`);
