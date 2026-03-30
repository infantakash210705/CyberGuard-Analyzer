const db = require('./db');
db.run("INSERT INTO Blacklist (indicator, type) VALUES ('testphp.vulnweb.com', 'DOMAIN')", (err) => {
    if (err) console.error(err);
    else console.log("Added testphp.vulnweb.com to blacklist");
    db.close();
});
