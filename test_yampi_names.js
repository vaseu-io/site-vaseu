const https = require('https');
const fs = require('fs');

const userToken = 'Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM';
const secretKey = 'sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8';

function fetchPage(page) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.dooki.com.br',
            path: `/v2/vaseu2/catalog/products?limit=50&page=${page}`,
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
        req.end();
    });
}

async function run() {
    let output = '';
    for (let page = 1; page <= 2; page++) {
        const json = await fetchPage(page);
        if (json.data) {
            json.data.forEach(p => output += p.name + '\n');
        }
    }
    fs.writeFileSync('yampi_names_dump.txt', output);
}
run();
