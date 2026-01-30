const fs = require('fs');
const content = fs.readFileSync('client/src/lib/items.js', 'utf-8');
const match = content.match(/export const items = (\[[\s\S]*\]);/);
const items = JSON.parse(match[1]);
const itemNames = items.map(i => i.name.toLowerCase());

// Wiki Legendary Items
const legendaryItems = [
  "Abyssal Mask", "Actualizer", "Archangel's Staff", "Ardent Censer", "Axiom Arc",
  "Bandlepipes", "Banshee's Veil", "Bastionbreaker", "Black Cleaver", "Blackfire Torch",
  "Blade of the Ruined King", "Bloodletter's Curse", "Bloodsong", "Bloodthirster",
  "Bounty of Worlds", "Celestial Opposition", "Chempunk Chainsword", "Cosmic Drive",
  "Cryptbloom", "Dawncore", "Dead Man's Plate", "Death's Dance", "Diadem of Songs",
  "Dream Maker", "Dusk and Dawn", "Echoes of Helia", "Eclipse", "Edge of Night",
  "Endless Hunger", "Essence Reaver", "Experimental Hexplate", "Fiendhunter Bolts",
  "Fimbulwinter", "Force of Nature", "Frozen Heart", "Guardian Angel",
  "Guinsoo's Rageblade", "Heartsteel", "Hexoptics C44", "Hextech Gunblade",
  "Hextech Rocketbelt", "Hollow Radiance", "Horizon Focus", "Hubris", "Hullbreaker",
  "Iceborn Gauntlet", "Immortal Shieldbow", "Imperial Mandate", "Infinity Edge",
  "Jak'Sho The Protean", "Kaenic Rookern", "Knight's Vow", "Kraken Slayer",
  "Liandry's Torment", "Lich Bane", "Locket of the Iron Solari", "Lord Dominik's Regards",
  "Luden's Tempest", "Malignance", "Manamune", "Maw of Malmortius", "Mejai's Soulstealer",
  "Mercurial Scimitar", "Mikael's Blessing", "Moonstone Renewer", "Morellonomicon",
  "Mortal Reminder", "Muramana", "Nashor's Tooth", "Navori Flickerblade", "Opportunity",
  "Overlord's Bloodmail", "Phantom Dancer", "Profane Hydra", "Protoplasm Harness",
  "Rabadon's Deathcap", "Randuin's Omen", "Rapid Firecannon", "Ravenous Hydra",
  "Redemption", "Riftmaker", "Rod of Ages", "Runaan's Hurricane", "Rylai's Crystal Scepter",
  "Seraph's Embrace", "Serpent's Fang", "Serylda's Grudge", "Shadowflame",
  "Shurelya's Battlesong", "Solstice Sleigh", "Spear of Shojin", "Spectral Cutlass",
  "Spirit Visage", "Staff of Flowing Water", "Statikk Shiv", "Sterak's Gage",
  "Stormrazor", "Stormsurge", "Stridebreaker", "Sundered Sky", "Sunfire Aegis",
  "Terminus", "The Collector", "Thornmail", "Titanic Hydra", "Trailblazer",
  "Trinity Force", "Umbral Glaive", "Unending Despair", "Void Staff", "Voltaic Cyclosword",
  "Warmog's Armor", "Whispering Circlet", "Winter's Approach", "Wit's End",
  "Youmuu's Ghostblade", "Yun Tal Wildarrows", "Zaz'Zak's Realmspike",
  "Zeke's Convergence", "Zhonya's Hourglass"
];

// Wiki Epic Items
const epicItems = [
  "Aether Wisp", "Bami's Cinder", "Bandleglass Mirror", "Blighting Jewel",
  "Bramble Vest", "Catalyst of Aeons", "Caulfield's Warhammer", "Chain Vest",
  "Crystalline Bracer", "Executioner's Calling", "Fated Ashes", "Fiendish Codex",
  "Forbidden Idol", "Giant's Belt", "Glacial Buckler", "Haunting Guise",
  "Hearthbound Axe", "Hexdrinker", "Hextech Alternator", "Kindlegem",
  "Last Whisper", "Lifeline", "Lost Chapter", "Negatron Cloak", "Noonquiver",
  "Oblivion Orb", "Phage", "Quicksilver Sash", "Rectrix", "Recurve Bow",
  "Runic Compass", "Scout's Slingshot", "Seeker's Armguard", "Serrated Dirk",
  "Shattered Armguard", "Sheen", "Spectre's Cowl", "Steel Sigil",
  "The Brutalizer", "Tiamat", "Tunneler", "Vampiric Scepter", "Verdant Barrier",
  "Warden's Mail", "Winged Moonplate", "Zeal"
];

console.log("=== EPIC ITEMS ===");
console.log("Missing:");
epicItems.forEach(item => {
  if (!itemNames.includes(item.toLowerCase())) {
    console.log("  - " + item);
  }
});

console.log("\n=== LEGENDARY ITEMS ===");
console.log("Missing:");
let missingCount = 0;
legendaryItems.forEach(item => {
  const lowerItem = item.toLowerCase();
  // Also check for variations like "Luden's Echo" vs "Luden's Tempest"
  const found = itemNames.some(n => {
    if (n === lowerItem) return true;
    // Check if the base name matches (without 's suffix variations)
    const baseItem = lowerItem.split("'")[0];
    const baseName = n.split("'")[0];
    if (baseItem === baseName && baseItem.length > 5) return true;
    return false;
  });

  if (!found) {
    console.log("  - " + item);
    missingCount++;
  }
});
console.log("\nTotal missing legendary: " + missingCount);
