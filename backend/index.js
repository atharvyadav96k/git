const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = 3000;

// MongoDB connection
const MONGO_URI = process.env.DB_URL;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// Schema and model — no unique constraint
const ipRecordSchema = new mongoose.Schema({
    hostname: { type: String },
    ip: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
});

const IpRecord = mongoose.model('IpRecord', ipRecordSchema);

// POST to always update the single stored IP
app.post('/ip-update', async (req, res) => {
    const { ip, hostname } = req.body;

    if (!ip) {
        return res.status(400).json({ message: 'Missing IP' });
    }

    try {
        // Find the single existing record (or create one if not exists)
        await IpRecord.findOneAndUpdate(
            {}, // Match any document (first one)
            { ip, hostname: hostname || 'unknown', updatedAt: new Date() },
            { upsert: true, new: true }
        );

        console.log(`Stored latest IP: ${ip}`);
        res.sendStatus(200);
    } catch (err) {
        console.error('Database update failed:', err);
        res.sendStatus(500);
    }
});

// GET to retrieve the single stored IP
app.get('/ip', async (req, res) => {
    try {
        const record = await IpRecord.findOne();

        if (!record) {
            return res.status(404).json({ message: 'No IP stored' });
        }

        res.json({
            ip: record.ip,
            hostname: record.hostname,
            updatedAt: record.updatedAt,
        });
    } catch (err) {
        console.error('Error fetching IP:', err);
        res.sendStatus(500);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`IP receiver server running on port ${PORT}`);
});
