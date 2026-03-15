const userToken = 'Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM';
const secretKey = 'sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8';
const YAMPI_API_BASE = 'https://api.dooki.com.br/v2/vaseu2/catalog/products';

async function searchProduct(query) {
    const headers = {
        'User-Token': userToken,
        'User-Secret-Key': secretKey,
        'Content-Type': 'application/json'
    };

    console.log(`Searching for: ${query}`);
    try {
        const response = await fetch(`${YAMPI_API_BASE}?include=skus&limit=50&search=${encodeURIComponent(query)}`, { headers });
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            console.log('No products found.');
            return;
        }

        for (const product of data.data) {
            console.log(`\n=== PRODUCT: ${product.name} (ID: ${product.id}) ===`);
            if (product.skus && product.skus.data) {
                for (const sku of product.skus.data) {
                    const variations = sku.variations ? sku.variations.map(v => `${v.name}:${v.value}`).join(', ') : 'No variations';
                    console.log(`  Size: ${sku.title.split(' ').pop()} | Token: ${sku.token} | SKU: ${sku.sku} | Variations: [${variations}]`);
                }
            }
        }
    } catch (e) {
        console.error(`Fetch error for ${query}:`, e.message);
    }
}

async function main() {
    await searchProduct('T-shirt Oversized Basic Black');
    await searchProduct('T-shirt Oversized Basic White');
    await searchProduct('T-shirt Boxy Basic Black');
    await searchProduct('T-shirt Boxy Basic White');
}

main().catch(console.error);
