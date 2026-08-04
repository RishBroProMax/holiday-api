const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting NPM Module Build Process for sri-lankan-holiday-api...');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const dataJsonPath = path.join(rootDir, 'data', 'holidays.json');

// 1. Create src directory if missing
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// 2. Read dataset and generate src/holidaysData.ts
console.log('📦 Bundling holiday dataset into src/holidaysData.ts...');
const holidayDataRaw = fs.readFileSync(dataJsonPath, 'utf8');
const holidaysDataContent = `// Auto-generated holiday dataset for sri-lankan-holiday-api\nexport const holidayData = ${holidayDataRaw};\n`;
fs.writeFileSync(path.join(srcDir, 'holidaysData.ts'), holidaysDataContent, 'utf8');

// 3. Ensure src/index.ts is present
console.log('📝 Checking src/index.ts entry point...');
const indexTsPath = path.join(srcDir, 'index.ts');
if (!fs.existsSync(indexTsPath)) {
  throw new Error('src/index.ts not found! Please ensure src/index.ts exists.');
}

// 4. Clean & recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 5. Compile TypeScript using tsc
console.log('⚙️ Compiling TypeScript definitions & CommonJS bundle via tsc...');
const tscPath = path.join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc');
const { spawnSync } = require('child_process');
const result = spawnSync(process.execPath, [tscPath, '-p', path.join(rootDir, 'tsconfig.npm.json')], {
  cwd: rootDir,
  stdio: 'inherit'
});

if (result.status !== 0) {
  throw new Error(`TypeScript compilation failed with code ${result.status}`);
}

// 6. Generate ES Module (dist/index.mjs)
console.log('⚡ Generating ES Module bundle (dist/index.mjs)...');
const cjsContent = fs.readFileSync(path.join(distDir, 'index.js'), 'utf8');
// Create ESM wrapper
const esmContent = `import cjs from './index.js';
export const {
  getAllHolidays,
  getHolidaysByYear,
  getHolidaysByMonth,
  getHolidayByDate,
  getTodayHoliday,
  getUpcomingHolidays,
  getUpcomingHoliday,
  getPoyaDays,
  getNextPoyaDay,
  getHolidaysByType,
  getHolidaysByReligion,
  isHoliday,
  isPublicHoliday,
  isBankHoliday,
  isPoyaDay,
  searchHolidays,
  getMetadata,
  SriLankanHolidayAPI,
  VALID_TYPES,
  VALID_CATEGORIES,
  SUPPORTED_YEARS
} = cjs;
export default cjs;
`;
fs.writeFileSync(path.join(distDir, 'index.mjs'), esmContent, 'utf8');

console.log('✅ NPM Module Build Complete!');
console.log(`📁 Artifacts generated in dist/:`);
fs.readdirSync(distDir).forEach(f => {
  const stat = fs.statSync(path.join(distDir, f));
  console.log(`   - ${f} (${(stat.size / 1024).toFixed(2)} KB)`);
});
