const https = require('https');
const fs = require('fs');
const path = require('path');

const VERSION = '16.2.1';
const ITEMS_JSON_URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/item.json`;
const ITEMS_IMG_BASE = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/item/`;

const ITEMS_DIR = path.join(__dirname, 'client', 'static', 'items');
const ITEMS_JS_PATH = path.join(__dirname, 'client', 'src', 'lib', 'items.js');

// Items to exclude by name pattern
const EXCLUDE_PATTERNS = [
  'Structure Bounty', 'Turret Plating', 'Fortification', 'Reinforced Armor',
  'Penetrating Bullets', 'Warden\'s Eye', 'Overcharged', 'Anti-tower',
  'Super Mech', 'Gusto', 'Tower Power', 'OvererchargedHA', 'Shield of Molten',
  'Scarecrow Effigy', 'Kalista\'s Black Spear', 'Poro-Snax', 'The Golden Spatula',
  'rarityLegendary', 'Silver Serpents', 'Raise Morale', 'Death\'s Daughter', 'Fire at Will',
  'Forever Forward', 'Gambler\'s Blade', 'Flesheater', 'Atma\'s Reckoning',
  'Demon King\'s Crown', 'Sword of Blossoming', 'Cloak of Starry Night',
  'Sword of the Divine', 'Anathema\'s Chains', 'Synchronized Souls', 'Overgrowth',
  'Gargoyle Stoneplate', 'Prowler\'s Claw', 'Night Harvester', 'Leeching Leer',
  'Veigar\'s Talisman', 'Cappa Juice', 'Elixir of Skill', 'Elixir of Avarice',
  'Cruelty', 'Chemtech Putrifier', 'Disabled Recall', 'Recall', 'Zephyr'
];

// Items to explicitly remove (from user request)
const REMOVE_ITEMS = [
  'Crown of the Shattered Queen',
  'Ironspike Whip',
  'Iron Spike',
  'Vigilant Wardstone'
];

// Valid item tags for purchasable items
const VALID_TAGS = [
  'Boots', 'Damage', 'CriticalStrike', 'AttackSpeed', 'LifeSteal',
  'SpellDamage', 'Mana', 'ManaRegen', 'HealthRegen', 'Health', 'Armor',
  'SpellBlock', 'CooldownReduction', 'AbilityHaste', 'NonbootsMovement',
  'Tenacity', 'SpellVamp', 'GoldPer', 'Consumable', 'Active', 'Stealth',
  'Vision', 'Aura', 'Slow', 'MagicPenetration', 'ArmorPenetration', 'OnHit',
  'Trinket', 'Lane', 'Jungle'
];

// Ensure items directory exists
if (!fs.existsSync(ITEMS_DIR)) {
  fs.mkdirSync(ITEMS_DIR, { recursive: true });
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function shouldExclude(itemName) {
  // Check explicit remove list
  if (REMOVE_ITEMS.some(r => itemName.includes(r))) return true;

  // Check exclude patterns
  if (EXCLUDE_PATTERNS.some(p => itemName.includes(p))) return true;

  return false;
}

async function main() {
  console.log('Fetching item data from Data Dragon...');
  const data = await fetchJSON(ITEMS_JSON_URL);

  const items = [];
  const downloadPromises = [];

  // Filter and process items
  for (const [itemId, item] of Object.entries(data.data)) {
    // Skip items without names
    if (!item.name) continue;

    // Skip excluded items
    if (shouldExclude(item.name)) continue;

    // Skip items not available in Summoner's Rift (map 11)
    if (item.maps && !item.maps['11']) continue;

    // Skip hidden items
    if (item.hideFromAll) continue;

    // Skip items with inStore: false (not purchasable)
    if (item.inStore === false) continue;

    // Skip items with no gold cost and not consumables/wards
    const isConsumable = item.tags && item.tags.includes('Consumable');
    const isWard = item.tags && (item.tags.includes('Vision') || item.tags.includes('Trinket'));
    const isStarterItem = item.tags && item.tags.includes('Lane');

    if (!item.gold || (item.gold.total === 0 && !isConsumable && !isWard)) continue;

    // Skip jungle pet items (they evolve automatically)
    if (item.name.includes('Hatchling') || item.name.includes('Seedling') || item.name.includes('Pup')) continue;

    // Skip mode-specific items
    if (item.requiredAlly || item.requiredChampion) continue;

    const imageName = `${itemId}.png`;
    const imagePath = path.join(ITEMS_DIR, imageName);
    const imageUrl = ITEMS_IMG_BASE + imageName;

    items.push({
      id: parseInt(itemId),
      name: item.name,
      image: `/items/${imageName}`,
      gold: item.gold?.total || 0,
      depth: item.depth || 1 // depth helps categorize: 1=basic, 2=epic, 3+=legendary
    });

    // Download image if not exists
    if (!fs.existsSync(imagePath)) {
      downloadPromises.push(
        downloadImage(imageUrl, imagePath)
          .then(() => console.log(`Downloaded: ${item.name}`))
          .catch(err => console.error(`Failed to download ${item.name}:`, err.message))
      );
    }
  }

  // Sort by depth (basic first), then by gold cost
  items.sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.gold - b.gold;
  });

  // Re-assign IDs after sorting
  items.forEach((item, index) => {
    item.id = index + 1;
    delete item.gold;
    delete item.depth;
  });

  console.log(`\nDownloading ${downloadPromises.length} new images...`);
  await Promise.all(downloadPromises);

  // Generate items.js
  const itemsJS = `export const items = ${JSON.stringify(items, null, 2)};\n`;
  fs.writeFileSync(ITEMS_JS_PATH, itemsJS);

  console.log(`\nDone! ${items.length} items saved to items.js`);

  // Print categories
  const basicItems = items.filter((_, i) => i < 20);
  const epicItems = items.filter((_, i) => i >= 20 && i < 70);
  const legendaryItems = items.filter((_, i) => i >= 70);

  console.log(`\nCategories (approximate):`);
  console.log(`- Basic items: ~${basicItems.length}`);
  console.log(`- Epic items: ~${epicItems.length - basicItems.length}`);
  console.log(`- Legendary items: ~${legendaryItems.length}`);
}

main().catch(console.error);
