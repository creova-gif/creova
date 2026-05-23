const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

const enMatch = content.match(/en:\s*\{([\s\S]*?)\},[\s\S]*fr:\s*\{/);
const frMatch = content.match(/fr:\s*\{([\s\S]*?)\}\s*};/);

if (enMatch && frMatch) {
  const enKeys = [...enMatch[1].matchAll(/'([^']+)'\s*:/g)].map(m => m[1]);
  const frKeys = [...frMatch[1].matchAll(/'([^']+)'\s*:/g)].map(m => m[1]);
  
  console.log('EN keys:', enKeys.length);
  console.log('FR keys:', frKeys.length);
  
  const missingInFr = enKeys.filter(k => !frKeys.includes(k));
  const missingInEn = frKeys.filter(k => !enKeys.includes(k));
  
  console.log('Missing in FR:', missingInFr.length > 0 ? missingInFr : 'None');
  console.log('Missing in EN:', missingInEn.length > 0 ? missingInEn : 'None');
} else {
  console.log('Could not find translations');
}
