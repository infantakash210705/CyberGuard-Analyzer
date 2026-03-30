const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'threat_analyzer.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS Results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target TEXT,
            type TEXT,
            verdict TEXT,
            score INTEGER,
            reasons TEXT,
            screenshot TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS Blacklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            indicator TEXT,
            type TEXT
        )`);

        // Insert some dummy blacklist data for testing
        db.get("SELECT count(*) as count FROM Blacklist", (err, row) => {
            if (row && row.count === 0) {
                const insert = db.prepare('INSERT INTO Blacklist (indicator, type) VALUES (?, ?)');
                insert.run('192.168.1.100', 'IP');
                insert.run('malicious-site.com', 'DOMAIN');
                insert.run('phishing-login.net', 'DOMAIN');
                insert.run('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'HASH');
                insert.finalize();
            }
        });
    }
});

module.exports = db;
