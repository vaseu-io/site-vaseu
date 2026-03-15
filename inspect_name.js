const userToken = 'Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM';
const secretKey = 'sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8';

async function inspectConjuntos() {
    const headers = {
        'User-Token': userToken,
        'User-Secret-Key': secretKey,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`https://api.dooki.com.br/v2/vaseu2/catalog/products?include=skus&limit=50&search=Conjunto`, { headers });
        const json = await response.json();
        console.log("TOTAL RESULTS:", json.data?.length);
        json.data?.forEach(product => {
            console.log("EXACT PRODUCT NAME:", JSON.stringify(product.name));
            console.log("NORMALIZED NAME:", product.name.replace(/\s+/g, ' ').trim().toLowerCase());
        });
    } catch (e) {
        console.error(e);
    }
}

inspectConjuntos();
