const { analyzeUrlStatic } = require('./static_url');
const { analyzeUrlDynamic } = require('./dynamic_url');
const { analyzeFileStatic } = require('./static_file');
const { checkThreatIntel } = require('./threat_intel');

async function calculateUrlRisk(url) {
    let totalScore = 0;
    let allFindings = [];
    
    // 1. Static Analysis
    const staticRes = analyzeUrlStatic(url);
    totalScore += staticRes.score;
    allFindings.push(...staticRes.findings);

    // 2. Threat Intel (Domain and IP check)
    let domainIntelFound = false;
    try {
        const urlObj = new URL(url);
        const intelDomain = await checkThreatIntel(urlObj.hostname, 'DOMAIN');
        if (intelDomain.found) {
            totalScore += intelDomain.score;
            allFindings.push(intelDomain.finding);
            domainIntelFound = true;
        }
        
        const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
        const ipMatch = urlObj.hostname.match(ipRegex);
        if (ipMatch && !domainIntelFound) {
            const intelIP = await checkThreatIntel(ipMatch[0], 'IP');
            if (intelIP.found) {
                totalScore += intelIP.score;
                allFindings.push(intelIP.finding);
            }
        }
    } catch(e) {}

    // 3. Dynamic Analysis
    const dynamicRes = await analyzeUrlDynamic(url);
    totalScore += dynamicRes.score;
    allFindings.push(...dynamicRes.findings);

    let verdict = "SAFE";
    if (totalScore >= 8) verdict = "MALICIOUS";
    else if (totalScore >= 4) verdict = "SUSPICIOUS";

    return {
        verdict,
        score: totalScore,
        reasons: allFindings,
        screenshot: dynamicRes.screenshot
    };
}

async function calculateFileRisk(filePath, originalName) {
    let totalScore = 0;
    let allFindings = [];

    // 1. Static Analysis
    const staticRes = await analyzeFileStatic(filePath);
    totalScore += staticRes.score;
    allFindings.push(...staticRes.findings);

    // 2. Threat Intel (Hash check)
    const intel = await checkThreatIntel(staticRes.sha256, 'HASH');
    if (intel.found) {
        totalScore += intel.score;
        allFindings.push(intel.finding);
    }

    if (originalName && originalName.toLowerCase().endsWith('.exe')) {
        totalScore += 2;
        allFindings.push("Executable file extension");
    }

    let verdict = "SAFE";
    if (totalScore >= 8) verdict = "MALICIOUS";
    else if (totalScore >= 4) verdict = "SUSPICIOUS";

    return {
        verdict,
        score: totalScore,
        reasons: allFindings,
        screenshot: null
    };
}

module.exports = { calculateUrlRisk, calculateFileRisk };
