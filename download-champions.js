import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Champion list with correct image filenames
const champions = [
	'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar', 'Ambessa', 'Amumu', 'Anivia', 'Annie', 'Aphelios',
	'Ashe', 'AurelionSol', 'Aurora', 'Azir', 'Bard', 'Belveth', 'Blitzcrank', 'Brand', 'Braum', 'Briar',
	'Caitlyn', 'Camille', 'Cassiopeia', 'Chogath', 'Corki', 'Darius', 'Diana', 'DrMundo', 'Draven', 'Ekko',
	'Elise', 'Evelynn', 'Ezreal', 'Fiddlesticks', 'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar',
	'Gragas', 'Graves', 'Gwen', 'Hecarim', 'Heimerdinger', 'Hwei', 'Illaoi', 'Irelia', 'Ivern', 'Janna',
	'JarvanIV', 'Jax', 'Jayce', 'Jhin', 'Jinx', 'Ksante', 'Kaisa', 'Kalista', 'Karma', 'Karthus',
	'Kassadin', 'Katarina', 'Kayle', 'Kayn', 'Kennen', 'Khazix', 'Kindred', 'Kled', 'KogMaw', 'Leblanc',
	'LeeSin', 'Leona', 'Lillia', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai',
	'MasterYi', 'Mel', 'Milio', 'MissFortune', 'Mordekaiser', 'Morgana', 'Naafiri', 'Nami', 'Nasus', 'Nautilus',
	'Neeko', 'Nidalee', 'Nilah', 'Nocturne', 'Nunu', 'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy',
	'Pyke', 'Qiyana', 'Quinn', 'Rakan', 'Rammus', 'RekSai', 'Rell', 'Renata', 'Renekton', 'Rengar',
	'Riven', 'Rumble', 'Ryze', 'Samira', 'Sejuani', 'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen',
	'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Smolder', 'Sona', 'Soraka', 'Swain', 'Sylas',
	'Syndra', 'TahmKench', 'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle', 'Tryndamere',
	'TwistedFate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Velkoz', 'Vex', 'Vi',
	'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xayah', 'Xerath', 'XinZhao', 'Yasuo',
	'Yone', 'Yorick', 'Yuumi', 'Zac', 'Zed', 'Zeri', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'
];

const outputDir = path.join(__dirname, 'client', 'static', 'champions');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Starting champion image download...');
console.log('This will download images from Riot\'s Data Dragon CDN');
console.log('');

let downloaded = 0;
let failed = 0;

// Function to download a single champion image
function downloadChampion(championName) {
	return new Promise((resolve) => {
		const url = `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${championName}.png`;
		const filePath = path.join(outputDir, `${championName}.png`);

		// Skip if already exists
		if (fs.existsSync(filePath)) {
			console.log(`✓ ${championName}.png (already exists)`);
			resolve(true);
			return;
		}

		const file = fs.createWriteStream(filePath);

		https.get(url, (response) => {
			if (response.statusCode === 200) {
				response.pipe(file);
				file.on('finish', () => {
					file.close();
					console.log(`✓ ${championName}.png downloaded`);
					downloaded++;
					resolve(true);
				});
			} else {
				fs.unlink(filePath, () => {});
				console.log(`✗ ${championName}.png failed (HTTP ${response.statusCode})`);
				failed++;
				resolve(false);
			}
		}).on('error', (err) => {
			fs.unlink(filePath, () => {});
			console.log(`✗ ${championName}.png failed (${err.message})`);
			failed++;
			resolve(false);
		});
	});
}

// Download all champions with rate limiting
async function downloadAll() {
	for (let i = 0; i < champions.length; i++) {
		await downloadChampion(champions[i]);
		// Small delay to avoid rate limiting
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	console.log('');
	console.log('='.repeat(50));
	console.log(`Download complete!`);
	console.log(`Successfully downloaded: ${downloaded}`);
	console.log(`Failed: ${failed}`);
	console.log(`Total champions: ${champions.length}`);
	console.log('='.repeat(50));
}

downloadAll();
