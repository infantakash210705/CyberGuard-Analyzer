const db = require('../db');

function checkThreatIntel(target, type) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Blacklist WHERE indicator = ? AND type = ?';
        db.get(query, [target, type], (err, row) => {
            if (err) return reject(err);
            if (row) {
                resolve({
                    found: true,
                    score: 4,  // Matches "if blacklist_match: score += 4" logic
                    finding: `Found in ${type} database as malicious`
                });
            } else {
                resolve({ found: false, score: 0, finding: null });
            }
        });
    });
}

module.exports = { checkThreatIntel };
