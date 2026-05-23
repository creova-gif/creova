const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/context/LanguageContext.tsx');
const content = fs.readFileSync(filePath, 'utf-8');

const enKeysMatch = content.match(/en:\s*{([\s\S]*?)},\s*fr:/);
const frKeysMatch = content.match(/fr:\s*{([\s\S]*?)}\s*};\s*export function/);

const extractFromBlock = (block) => {
  const keys = [];
  const keyRegex = /'([^']+)'\s*:/g;
  let keyMatch;
  while ((keyMatch = keyRegex.exec(block)) !== null) {
    keys.push(keyMatch[1]);
  }
  return keys;
}

const enKeys = extractFromBlock(enKeysMatch[1]);
const frKeys = extractFromBlock(frKeysMatch[1]);

console.log(`Total EN keys: ${enKeys.length}`);
console.log(`Total FR keys: ${frKeys.length}`);

const missingInFr = enKeys.filter(k => !frKeys.includes(k));
const missingInEn = frKeys.filter(k => !enKeys.includes(k));

if (missingInFr.length > 0) {
  console.log('\nKeys missing in FR:');
  missingInFr.forEach(k => console.log(`- ${k}`));
} else {
  console.log('\nNo keys missing in FR.');
}

if (missingInEn.length > 0) {
  console.log('\nKeys missing in EN:');
  missingInEn.forEach(k => console.log(`- ${k}`));
} else {
  console.log('\nNo keys missing in EN.');
}
