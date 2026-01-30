const fs = require('fs');
const path = require('path');

const ITEMS_JS_PATH = path.join(__dirname, 'client', 'src', 'lib', 'items.js');
const API_URL = 'http://localhost:3002/api';

async function main() {
  // Read items.js
  const content = fs.readFileSync(ITEMS_JS_PATH, 'utf-8');

  // Extract the array from "export const items = [...];
  const match = content.match(/export const items = (\[[\s\S]*\]);/);
  if (!match) {
    console.error('Could not parse items.js');
    return;
  }

  const items = JSON.parse(match[1]);
  console.log(`Found ${items.length} items`);

  // Initialize API with new items
  const response = await fetch(`${API_URL}/init/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  const result = await response.json();
  console.log('API Response:', result);
}

main().catch(console.error);
