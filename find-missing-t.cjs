const fs = require('fs');
const path = require('path');

const contextFile = fs.readFileSync(path.join(__dirname, 'src/context/LanguageContext.tsx'), 'utf-8');

const enKeys = new Set();
const frKeys = new Set();

let currentLang = '';
for (const line of contextFile.split('\n')) {
  if (line.includes('const translations = {') || line.includes('en: {')) currentLang = 'en';
  else if (line.includes('fr: {')) currentLang = 'fr';
  
  const match = line.match(/^\s*'([^']+)':/);
  if (match) {
    if (currentLang === 'en') enKeys.add(match[1]);
    else if (currentLang === 'fr') frKeys.add(match[1]);
  }
}

const usedKeys = new Set();

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // match t('key') or t("key") or labelKey: 'key'
      const matches = content.matchAll(/t\(['"]([^'"]+)['"]\)/g);
      for (const m of matches) usedKeys.add(m[1]);
      
      const labelMatches = content.matchAll(/labelKey:\s*['"]([^'"]+)['"]/g);
      for (const m of labelMatches) usedKeys.add(m[1]);

      const titleMatches = content.matchAll(/titleKey:\s*['"]([^'"]+)['"]/g);
      for (const m of titleMatches) usedKeys.add(m[1]);
    }
  }
}

walk(path.join(__dirname, 'src'));

console.log(`Found ${usedKeys.size} unique keys in source code.`);

const missingInEn = Array.from(usedKeys).filter(k => !enKeys.has(k));
const missingInFr = Array.from(usedKeys).filter(k => !frKeys.has(k));

console.log('Missing in EN LanguageContext:', missingInEn);
console.log('Missing in FR LanguageContext:', missingInFr);
