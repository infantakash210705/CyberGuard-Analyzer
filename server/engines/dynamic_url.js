const puppeteer = require('puppeteer');

async function analyzeUrlDynamic(url) {
    let browser;
    const findings = [];
    let score = 0;
    let screenshotBase64 = null;

    try {
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Capture network requests
        const requests = [];
        page.on('request', req => requests.push(req.url()));

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Take screenshot
        screenshotBase64 = await page.screenshot({ encoding: 'base64' });

        // Check for forms and inputs
        const hasLoginForm = await page.evaluate(() => {
            const forms = document.querySelectorAll('form');
            const passwordInputs = document.querySelectorAll('input[type="password"]');
            return forms.length > 0 && passwordInputs.length > 0;
        });

        if (hasLoginForm) {
            findings.push("Login form detected on the page");
            score += 3;
        }

        // Check for external scripts
        let externalScripts = 0;
        try {
            const urlObj = new URL(url);
            for (let reqUrl of requests) {
                if (!reqUrl.includes(urlObj.hostname) && (reqUrl.endsWith('.js') || reqUrl.includes('script'))) {
                    externalScripts++;
                }
            }
        } catch(e) {}
        
        if (externalScripts > 5) {
            findings.push("Suspiciously high number of external scripts loaded");
            score += 2;
        }

    } catch (err) {
        findings.push(`Dynamic analysis failed or timed out: ${err.message}`);
    } finally {
        if (browser) await browser.close();
    }

    return { 
        score, 
        findings, 
        screenshot: screenshotBase64 ? `data:image/png;base64,${screenshotBase64}` : null 
    };
}

module.exports = { analyzeUrlDynamic };
