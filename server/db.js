const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'threat_analyzer.db');

// Open DB (sync, no callback)
const db = new Database(dbPath);

console.log('Connected to SQLite database.');

// Create tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS Results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target TEXT,
    type TEXT,
    verdict TEXT,
    score INTEGER,
    reasons TEXT,
    screenshot TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS Blacklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    indicator TEXT,
    type TEXT
  )
`).run();


// Check if blacklist is empty
const row = db.prepare("SELECT COUNT(*) as count FROM Blacklist").get();

if (row.count === 0) {
  const insert = db.prepare('INSERT INTO Blacklist (indicator, type) VALUES (?, ?)');

  insert.run('192.168.1.100', 'IP');
  insert.run('malicious-site.com', 'DOMAIN');
  insert.run('phishing-login.net', 'DOMAIN');
  insert.run('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'HASH');
}

module.exports = db;
