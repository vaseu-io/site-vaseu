
const YAMPI_API_BASE = 'https://api.dooki.com.br/v2/vaseu2/catalog/products';
const userToken = 'Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM';
const secretKey = 'sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8';

async function testYampi() {
    console.log('Testing Yampi API...');
    const headers = {
        'User-Token': userToken,
        'User-Secret-Key': secretKey,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${YAMPI_API_BASE}?include=skus&limit=5`, { headers });
        console.log('Response status:', response.status);
        if (response.ok) {
            const json = await response.json();
            console.log('Products found:', json.data?.length || 0);
            if (json.data && json.data.length > 0) {
                console.log('First product:', json.data[0].name);
                console.log('SKUs for first product:', json.data[0].skus?.data?.length || 0);
            }
        } else {
            const err = await response.text();
            console.error('Error body:', err);
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testYampi();
