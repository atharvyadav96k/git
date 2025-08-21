// Server to receive IPs
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/ip-update', (req, res) => {
    const { ip, hostname } = req.body;
    console.log(`Received IP update from ${hostname}: ${ip}`);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`IP receiver server running on port ${PORT}`);
});
