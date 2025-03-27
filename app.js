const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const response = await fetch("https://api.steampowered.com/ISteamApps/GetAppList/v2/");
        const data = await response.json();
        let games = data.applist.apps.sort(() => Math.random() - 0.5).slice(0, 12)
        res.render('index', { games });
    } catch (error) {
        res.status(500).send("Error mengambil data game.");
    }
});

app.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${id}`);
        const data = await response.json();
        res.render('detail', { game: data[id].data });
    } catch (error) {
        res.status(500).send("Error mengambil detail game.");
    }
});

app.get('/players/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${id}`);
        const data = await response.json();
        res.render('players', { playerCount: data.response.player_count });
    } catch (error) {
        res.status(500).send("Error mengambil jumlah pemain.");
    }
});

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    try {
        const response = await fetch(`https://steamcommunity.com/actions/SearchApps/${query}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
