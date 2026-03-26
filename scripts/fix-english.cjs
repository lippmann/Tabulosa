const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'english.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Add example_sentence_native field (same as example_sentence_english for English)
const fixedData = data.map(item => ({
  ...item,
  example_sentence_native: item.example_sentence_english
}));

fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2));
console.log(`Fixed ${fixedData.length} entries in english.json`);
