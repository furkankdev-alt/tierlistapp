import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// API endpoints can be added here in the future
app.get('/api/champions', (req, res) => {
	res.json({ message: 'Champions API endpoint' });
});

app.get('/api/tierlists', (req, res) => {
	res.json({ message: 'Tier lists API endpoint' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
