
import { fetchProductByHandle } from './src/lib/shopify';

async function test() {
    const product = await fetchProductByHandle('conjunto-all-basic-black-1');
    console.log(JSON.stringify(product, null, 2));
}

test();
