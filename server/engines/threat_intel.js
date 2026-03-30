const db = require('../db');

function checkThreatIntel(target, type) {
    return new Promise((resolve, reject) => {
        try {
            const row = db.prepare('SELECT * FROM Blacklist WHERE indicator = ? AND type = ?').get(target, type);
            if (row) {
                resolve({
                    found: true,
                    score: 4, 
                    finding: `Found in ${type} database as malicious`
                });
            } else {
                resolve({ found: false, score: 0, finding: null });
            }
        } catch(err) {
            reject(err);
        }
    });
}

module.exports = { checkThreatIntel };
