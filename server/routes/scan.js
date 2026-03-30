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
        
        db.run(`INSERT INTO Results (target, type, verdict, score, reasons, screenshot) VALUES (?, ?, ?, ?, ?, ?)`, 
            [url, 'URL', result.verdict, result.score, JSON.stringify(result.reasons), result.screenshot], 
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID, ...result, details: url });
            }
        );
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
        
        db.run(`INSERT INTO Results (target, type, verdict, score, reasons, screenshot) VALUES (?, ?, ?, ?, ?, ?)`, 
            [req.file.originalname, 'FILE', result.verdict, result.score, JSON.stringify(result.reasons), null], 
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID, ...result, details: req.file.originalname });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/result/:id', (req, res) => {
    db.get('SELECT * FROM Results WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Result not found' });
        
        row.reasons = JSON.parse(row.reasons || '[]');
        row.details = row.target;
        res.json(row);
    });
});

module.exports = router;
