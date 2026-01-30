const fs = require('fs');
const content = fs.readFileSync('client/src/lib/items.js', 'utf-8');
const match = content.match(/export const items = (\[[\s\S]*\]);/);
const items = JSON.parse(match[1]);

// Search for similar names
const search = ['fimbul', 'jak', 'luden', 'muramana', 'seraph', 'spectral', 'bounty', 'lifeline', 'runic', 'shattered'];
search.forEach(s => {
  const found = items.filter(i => i.name.toLowerCase().includes(s));
  if (found.length > 0) {
    console.log(s + ': ' + found.map(f => f.name).join(', '));
  } else {
    console.log(s + ': NOT FOUND');
  }
});
