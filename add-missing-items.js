const https = require('https');
const fs = require('fs');
const path = require('path');

const VERSION = '16.2.1';
const ITEMS_DIR = path.join(__dirname, 'client', 'static', 'items');
const ITEMS_JS_PATH = path.join(__dirname, 'client', 'src', 'lib', 'items.js');

// Missing items to add
const missingItems = [
  { name: "Lifeline", id: "6693" },
  { name: "Runic Compass", id: "3866" },
  { name: "Shattered Armguard", id: "4641" },
  { name: "Fimbulwinter", id: "3121" },
  { name: "Muramana", id: "3042" },
  { name: "Seraph's Embrace", id: "3040" },
  { name: "Spectral Cutlass", id: "4004" },
  { name: "Bounty of Worlds", id: "3867" }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        resolve(false);
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  // Read current items
  const content = fs.readFileSync(ITEMS_JS_PATH, 'utf-8');
  const match = content.match(/export const items = (\[[\s\S]*\]);/);
  const items = JSON.parse(match[1]);

  let nextId = Math.max(...items.map(i => i.id)) + 1;
  let addedCount = 0;

  for (const item of missingItems) {
    // Check if already exists
    if (items.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
      console.log(`Skipping ${item.name} - already exists`);
      continue;
    }

    const imagePath = path.join(ITEMS_DIR, `${item.id}.png`);
    const imageUrl = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/item/${item.id}.png`;

    // Download image if not exists
    if (!fs.existsSync(imagePath)) {
      console.log(`Downloading ${item.name}...`);
      const success = await downloadImage(imageUrl, imagePath);
      if (!success) {
        console.log(`  Failed to download ${item.name}`);
        continue;
      }
    }

    // Add to items array
    items.push({
      id: nextId++,
      name: item.name,
      image: `/items/${item.id}.png`
    });
    addedCount++;
    console.log(`Added ${item.name}`);
  }

  // Save updated items.js
  const output = 'export const items = ' + JSON.stringify(items, null, 2) + ';\n';
  fs.writeFileSync(ITEMS_JS_PATH, output);

  console.log(`\nDone! Added ${addedCount} items. Total: ${items.length}`);
}

main().catch(console.error);
