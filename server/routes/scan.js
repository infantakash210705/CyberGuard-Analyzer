const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const db = require('../db');
const { calculateUrlRisk, calculateFileRisk } = require('../engines/risk_engine');

const upload = multer({ dest: 'uploads/' });

router.post('/scan-url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const result = await calculateUrlRisk(url);
        
        const info = db.prepare(`INSERT INTO Results (target, type, verdict, score, reasons, screenshot) VALUES (?, ?, ?, ?, ?, ?)`).run(url, 'URL', result.verdict, result.score, JSON.stringify(result.reasons), result.screenshot);
        res.json({ id: info.lastInsertRowid, ...result, details: url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/scan-file', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    try {
        const result = await calculateFileRisk(req.file.path, req.file.originalname);
        
        // Clean up uploaded file if needed
        fs.unlink(req.file.path, () => {});
        
        const info = db.prepare(`INSERT INTO Results (target, type, verdict, score, reasons, screenshot) VALUES (?, ?, ?, ?, ?, ?)`).run(req.file.originalname, 'FILE', result.verdict, result.score, JSON.stringify(result.reasons), null);
        res.json({ id: info.lastInsertRowid, ...result, details: req.file.originalname });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/result/:id', (req, res) => {
    try {
        const row = db.prepare('SELECT * FROM Results WHERE id = ?').get(req.params.id);
        if (!row) return res.status(404).json({ error: 'Result not found' });
        
        row.reasons = JSON.parse(row.reasons || '[]');
        row.details = row.target;
        res.json(row);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
