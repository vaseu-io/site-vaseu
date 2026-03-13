const https = require('https');
const fs = require('fs');

const userToken = 'Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM';
const secretKey = 'sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8';

function fetchSearch(term) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.dooki.com.br',
            path: `/v2/vaseu2/catalog/products?search=${encodeURIComponent(term)}&include=skus`,
            method: 'GET',
            headers: {
                'User-Token': userToken,
                'User-Secret-Key': secretKey,
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    let output = '';
    const terms = ['shorts', 'moletinho', 'basic', 'preto', 'branco', 'conjunto', 't-shirt', 'boxy'];

    for (const term of terms) {
        try {
            output += `--- SEARCH: ${term} ---\n`;
            const json = await fetchSearch(term);
            if (json && json.data) {
                json.data.forEach(p => {
                    output += `Name: ${p.name}\n`;
                    if (p.skus && p.skus.data) {
                        p.skus.data.forEach(s => {
                            output += `  Token: ${s.token} | Size: ${s.variations ? s.variations.map(v => v.value).join(', ') : 'N/A'}\n`;
                        });
                    }
                });
            } else {
                output += 'No data or error\n';
            }
        } catch (e) {
            output += `Error: ${e.message}\n`;
        }
    }
    fs.writeFileSync('yampi_search_test.txt', output);
}
run();
