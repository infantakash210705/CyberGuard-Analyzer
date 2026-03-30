const crypto = require('crypto');
const fs = require('fs');

async function analyzeFileStatic(filePath) {
    const findings = [];
    let score = 0;
    
    // Hash generation
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const sha256 = hashSum.digest('hex');

    findings.push(`File SHA256: ${sha256}`);
    
    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size > 10 * 1024 * 1024) { 
        findings.push('Unusually large file (>10MB)');
        score += 1;
    }

    return { score, findings, sha256 };
}

module.exports = { analyzeFileStatic };
