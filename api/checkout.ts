import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendFBEvent } from './_lib/facebook';

// Vercel Serverless Function to fetch Yampi checkout tokens dynamically
// Requires YAMPI_USER_TOKEN and YAMPI_SECRET_KEY in Vercel Environment Variables

const YAMPI_API_BASE = 'https://api.dooki.com.br/v2/vaseu2/catalog/products';
const YAMPI_CHECKOUT_BASE = 'https://vaseu2.pay.yampi.com.br/r';

interface CartItem {
    productTitle: string;
    size: string;
    quantity: number;
    price?: number;
}

// Size mapping: Shopify sizes might differ from Yampi variations
const SIZE_MAP: Record<string, string> = {
    'P': 'P',
    'M': 'M',
    'G': 'G',
    'GG': 'GG',
    'XG': 'XG',
    'S': 'P',
    'L': 'G',
    'XL': 'GG',
    'XXL': 'XG',
};

async function fetchProductsFromYampi(queries: string[], userToken: string, secretKey: string) {
    const headers = {
        'User-Token': userToken,
        'User-Secret-Key': secretKey,
        'Content-Type': 'application/json'
    };

    const results: any[] = [];

    // Clean uniqueness from queries
    const uniqueQueries = [...new Set(queries.map(q => q.toLowerCase()))];

    for (const query of uniqueQueries) {
        try {
            // Clean query string slightly to improve match rate
            const cleanQuery = query.replace('t-shirt', '').replace('boxy', '').trim();
            const searchTerms = cleanQuery.length > 3 ? cleanQuery : query;

            const response = await fetch(`${YAMPI_API_BASE}?include=skus&limit=50&search=${encodeURIComponent(searchTerms)}`, { headers });
            if (response.ok) {
                const json = await response.json() as any;
                if (json && json.data) {
                    results.push(...json.data);
                }
            }
        } catch (e) {
            console.error(`Error fetching: ${query}`, e);
        }
    }

    // Also try fetching standard products without a search filter if we don't have many results
    if (results.length < 5) {
        try {
            for (let page = 1; page <= 2; page++) {
                const res = await fetch(`${YAMPI_API_BASE}?include=skus&limit=50&page=${page}`, { headers });
                if (res.ok) {
                    const data = await res.json() as any;
                    if (data?.data) results.push(...data.data);
                }
            }
        } catch (e) { }
    }

    // Remove duplicates
    return Array.from(new Map(results.map(item => [item.id, item])).values());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { items, testEventCode } = req.body as { items: CartItem[], testEventCode?: string };

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart items are required' });
    }

    const userToken = process.env.YAMPI_USER_TOKEN || 'Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM'; 
    const secretKey = process.env.YAMPI_SECRET_KEY || 'sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8';

    if (!userToken || !secretKey) {
        return res.status(500).json({ error: 'Missing Yampi API credentials' });
    }

    try {
        const productTitlesToSearch = items.map(i => i.productTitle);
        const yampiProducts = await fetchProductsFromYampi(productTitlesToSearch, userToken, secretKey);

        const tokenParts: string[] = [];
        const missingItems: string[] = [];
        let totalValue = 0;

        for (const item of items) {
            const normalizedSize = SIZE_MAP[item.size?.toUpperCase()] || item.size?.toUpperCase() || 'M';
            const targetTitle = item.productTitle.toLowerCase();

            let foundVariantToken = null;

            const matchedProduct = yampiProducts.find((p: any) => {
                const pName = p.name.toLowerCase();
                if (pName === targetTitle) return true;
                if (targetTitle.includes('shorts') && pName.includes('shorts')) return true;
                if (targetTitle.includes('boxy') && pName.includes('boxy')) return true;
                return false;
            }) || yampiProducts.find((p: any) => p.name.toLowerCase().includes(targetTitle.split(' ')[0]));

            if (matchedProduct?.skus?.data) {
                const variant = matchedProduct.skus.data.find((sku: any) => {
                    if (!sku.variations || !Array.isArray(sku.variations)) return false;
                    return sku.variations.some((v: any) => v.name === 'Tamanho' && v.value.toUpperCase() === normalizedSize);
                });

                if (variant?.token) {
                    foundVariantToken = variant.token;
                } else if (matchedProduct.skus.data.length > 0 && matchedProduct.skus.data[0].token) {
                    foundVariantToken = matchedProduct.skus.data[0].token;
                }
                
                if (item.price) totalValue += item.price * item.quantity;
            }

            if (foundVariantToken) {
                tokenParts.push(`${foundVariantToken}:${item.quantity}`);
            } else {
                missingItems.push(item.productTitle);
            }
        }

        if (tokenParts.length > 0) {
            const checkoutUrl = `${YAMPI_CHECKOUT_BASE}/${tokenParts.join(',')}`;

            // Send Facebook CAPI Event
            try {
                const clientIp = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
                const userAgent = req.headers['user-agent'];

                await sendFBEvent({
                    eventName: 'InitiateCheckout',
                    eventSourceUrl: req.headers.referer || 'https://vaseu.com.br',
                    clientIpAddress: clientIp?.split(',')[0],
                    clientUserAgent: userAgent,
                    testEventCode: testEventCode || process.env.FB_TEST_EVENT_CODE,
                    customData: {
                        value: totalValue,
                        currency: 'BRL',
                        content_ids: items.map(i => i.productTitle),
                        content_type: 'product'
                    }
                });
            } catch (fbError) {
                console.error('Failed to send FB event:', fbError);
            }
            return res.status(200).json({
                url: checkoutUrl,
                success: true,
                missing: missingItems.length > 0 ? missingItems : undefined
            });
        } else {
            return res.status(404).json({ error: 'Could not resolve Yampi tokens for requested items' });
        }

    } catch (error) {
        console.error('Yampi API Error:', error);
        return res.status(500).json({ error: 'Failed to process checkout link' });
    }
}

