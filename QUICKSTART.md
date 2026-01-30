# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

1. **Install Dependencies**

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

2. **Start the Application**

Open two terminal windows:

**Terminal 1 - Frontend (SvelteKit)**
```bash
cd client
npm run dev
```
The frontend will be available at: http://localhost:5173

**Terminal 2 - Backend (Express.js)**
```bash
cd server
npm run dev
```
The backend API will be available at: http://localhost:3001

3. **Open in Browser**

Navigate to http://localhost:5173 and you'll see the tier list page!

## 📖 Features Overview

### Tier List Page (`/tierlist`)
- ✅ Drag and drop champions between tiers
- ✅ Search champions by name
- ✅ Edit tier names and colors
- ✅ Add/remove custom tiers
- ✅ Highlight champions with colors
- ✅ Auto-save to localStorage
- ✅ Double-click to return champion to pool

### Drafting Page (`/drafting`)
- ✅ Pick/ban system for both teams
- ✅ Role-based filtering (Top, Jungle, Mid, ADC, Support)
- ✅ Search champions
- ✅ Right-click to remove from slot
- ✅ Auto-save draft state
- ✅ Professional draft UI

## 🎮 Usage Tips

### Tier List
1. Drag any champion from the bottom pool into a tier
2. Reorder champions within tiers by dragging
3. Double-click a champion in a tier to send it back to the pool
4. Click "Edit Tiers" to customize tier names, colors, and order
5. Click "Highlighter" to add colored borders to champions
6. Search filters only the champion pool (not tiers)

### Drafting
1. Click a ban/pick slot to select it (it will glow)
2. Click a champion from the pool to fill that slot
3. Right-click a filled slot to remove the champion
4. Use role filters to narrow down options
5. Banned champions show with a red X overlay
6. Picked champions are removed from the pool

## 🎨 Customization

### Adding More Champions
1. Add the champion image to `client/static/champions/`
2. Update `client/src/lib/champions.js` with the champion data
3. Follow the naming convention (e.g., `Aatrox.png`, `MissFortune.png`)

### Changing Colors
Edit the CSS in the respective `.svelte` files:
- Default background: `#0d0d0d`
- Sidebar: `#1a1a1a`
- Accent gold: `#d4af37`
- Active orange: `#ff6b35`

## 🐛 Troubleshooting

### Missing Champion Images
If you see missing images, ensure:
1. The image file exists in `client/static/champions/`
2. The filename matches the `image` property in `champions.js`
3. The file is a `.png` format

### Port Already in Use
If port 5173 or 3001 is already in use:
- Frontend: Edit `client/vite.config.js` and add `server: { port: 3000 }`
- Backend: Edit `server/index.js` and change `PORT = 3001` to another port

### Drag and Drop Not Working
Make sure you installed all dependencies:
```bash
cd client
npm install svelte-dnd-action
```

## 📦 Build for Production

```bash
cd client
npm run build
npm run preview
```

## 🔧 Technology Stack

- **Frontend**: SvelteKit 2.0, Svelte 5.0
- **Drag & Drop**: svelte-dnd-action
- **Backend**: Express.js 4.18
- **Styling**: Pure CSS (no frameworks)
- **Storage**: localStorage (client-side)

## 📝 Notes

- The Mel champion image may be missing as she's very new
- K'Sante image uses the alternate spelling "KSante"
- Wukong uses the internal name "MonkeyKing"
- All state is saved to localStorage automatically
- No database required - everything runs client-side

Enjoy creating tier lists and practicing drafts! 🎮
