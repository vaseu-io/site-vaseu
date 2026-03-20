// Yampi Checkout Integration
// Maps Shopify product titles to Yampi buy tokens for direct checkout
// No API credentials are stored here - only public purchase tokens

const YAMPI_CHECKOUT_BASE = 'https://vaseu2.pay.yampi.com.br/r';

/**
 * Converts a standard Yampi checkout URL to the branded /checkout path
 */
export function getBrandedCheckoutUrl(yampiUrl: string | null): string | null {
    if (!yampiUrl) return null;
    
    // Handle standard /r/ structure
    if (yampiUrl.includes('/r/')) {
        const tokenPath = yampiUrl.split('/r/')[1];
        return `/checkout/${tokenPath}`;
    }

    // Handle checkout?tokenReference=... structure (like in user screenshot)
    if (yampiUrl.includes('/checkout?') && yampiUrl.includes('yampi.com.br')) {
        const query = yampiUrl.split('/checkout?')[1];
        return `/checkout?${query}`;
    }

    // Generic domain replacement for any yampi.com.br checkout link
    if (yampiUrl.includes('yampi.com.br')) {
        try {
            const url = new URL(yampiUrl);
            return `/checkout${url.search}${url.hash}`;
        } catch (e) {
            return yampiUrl;
        }
    }

    return yampiUrl;
}

// Mapping: "Product Title Size" -> Yampi buy token
// Generated from Yampi API data - these are public tokens, safe for frontend
const YAMPI_TOKENS: Record<string, string> = {
    // T-Shirt Reflexo Preta
    "T-Shirt Reflexo Preta|P": "63V1H8JQGY",
    "T-Shirt Reflexo Preta|M": "1PSWEME94M",
    "T-Shirt Reflexo Preta|G": "JUFITU1GF9",
    "T-Shirt Reflexo Preta|GG": "NMLLLV5N1G",

    // T-Shirt Reflexo Off-White
    "T-Shirt Reflexo Off-White|P": "M1LSKDK12K",
    "T-Shirt Reflexo Off-White|M": "GV5J8FBJRG",
    "T-Shirt Reflexo Off-White|G": "I0PMS4RRK4",
    "T-Shirt Reflexo Off-White|GG": "8NXDYAVTX4",

    // T-Shirt Ruínas
    "T-Shirt Ruínas|P": "A1YPDZJPP0",
    "T-Shirt Ruínas|M": "RZOFGN6UU2",
    "T-Shirt Ruínas|G": "T8BC0EO07J",
    "T-Shirt Ruínas|GG": "7S0Z0R004D",

    // T-Shirt Orquidário | Vaseu x Ibanez
    "T-Shirt Orquidário | Vaseu x Ibanez|P": "21I4KNWHHT",
    "T-Shirt Orquidário | Vaseu x Ibanez|M": "PE24CN2E6F",
    "T-Shirt Orquidário | Vaseu x Ibanez|G": "MUJ5T459O0",
    "T-Shirt Orquidário | Vaseu x Ibanez|GG": "E0XWEM17JL",

    // Drop Box
    "Drop Box|P": "DX0IZ5D8C1",
    "Drop Box|M": "4MOW2L5H2R",
    "Drop Box|G": "B3CEPP53GT",
    "Drop Box|GG": "1HWY4PEH1K",
    "Drop Box|XG": "1XPXS362P7",

    // Premium Oversized - Legacy
    "Premium Oversized - Legacy|P": "259HBPYY4V",
    "Premium Oversized - Legacy|M": "G804314VKW",
    "Premium Oversized - Legacy|G": "IVEMB5Y1VL",
    "Premium Oversized - Legacy|GG": "A1QWY5D4WE",
    "Premium Oversized - Legacy|XG": "P3N7KF7A9X",

    // Premium Oversized - Discipline
    "Premium Oversized - Discipline|P": "6MTV9AIWNA",
    "Premium Oversized - Discipline|M": "HFZIPZHK4H",
    "Premium Oversized - Discipline|G": "O0OKND7MJ0",
    "Premium Oversized - Discipline|GG": "4O5OHD9Y7G",
    "Premium Oversized - Discipline|XG": "FSJ4JLV7E3",

    // Moletom Premium | Beija Flor
    "Moletom Premium | Beija Flor|P": "2GIFQAU576",
    "Moletom Premium | Beija Flor|M": "J7LP2GQBUA",
    "Moletom Premium | Beija Flor|G": "NUI9VMJUB0",
    "Moletom Premium | Beija Flor|GG": "A8SHS558H8",
    "Moletom Premium | Beija Flor|XG": "BDXF9LSPSB",

    // Premium Oversized - Time's Now
    "Premium Oversized - Time's Now|P": "99I4160XHI",
    "Premium Oversized - Time's Now|M": "L2A9BRS89B",
    "Premium Oversized - Time's Now|G": "I55EB5CLJ0",
    "Premium Oversized - Time's Now|GG": "1WI1BRCU6N",
    "Premium Oversized - Time's Now|XG": "FH5EHI151K",

    // Oversized Premium Lisa | Branca
    "Oversized Premium Lisa | Branca|P": "9I47Q3BNEP",
    "Oversized Premium Lisa | Branca|M": "1L3JJ1C6NY",
    "Oversized Premium Lisa | Branca|G": "GYATYRHMHP",
    "Oversized Premium Lisa | Branca|GG": "LNYV42AUN5",
    "Oversized Premium Lisa | Branca|XG": "89EIABHPUO",

    // Oversized Premium Lisa | Preta
    "Oversized Premium Lisa | Preta|P": "DNN5ENYY1F",
    "Oversized Premium Lisa | Preta|M": "F5N2AMZEVS",
    "Oversized Premium Lisa | Preta|G": "O9VBQ3DDCR",
    "Oversized Premium Lisa | Preta|GG": "7FB5JAS2BT",
    "Oversized Premium Lisa | Preta|XG": "R1BF9O6GBL",

    // T-shirt Oversized Basic Black
    "T-shirt Oversized Basic Black|PP": "KCP2UZN5KI",
    "T-shirt Oversized Basic Black|P": "MNWEU18XLM",
    "T-shirt Oversized Basic Black|M": "1IH3RDCBDA",
    "T-shirt Oversized Basic Black|G": "MM8CWAE7UY",
    "T-shirt Oversized Basic Black|GG": "3ZFUUOQTW5",
    "T-shirt Oversized Basic Black|XG": "2FP98H94OW",

    // T-shirt Oversized Basic White
    "T-shirt Oversized Basic White|PP": "A5NKAED03I",
    "T-shirt Oversized Basic White|P": "N3SK3T4K5I",
    "T-shirt Oversized Basic White|M": "GB6A9QHGPB",
    "T-shirt Oversized Basic White|G": "T0XAMUOQGS",
    "T-shirt Oversized Basic White|GG": "A1146JNUP8",
    "T-shirt Oversized Basic White|XG": "CT8SLJZSOH",

    // T-shirt Boxy Basic White
    "T-shirt Boxy Basic White|PP": "DJWVO5SJXQ",
    "T-shirt Boxy Basic White|P": "N3SHYQHWYW",
    "T-shirt Boxy Basic White|M": "8I7AZOAG8S",
    "T-shirt Boxy Basic White|G": "KDQVPPMK42",
    "T-shirt Boxy Basic White|GG": "B8HDWHNL33",
    "T-shirt Boxy Basic White|XG": "LWE3LXI8QP",

    // T-shirt Boxy Basic Black
    "T-shirt Boxy Basic Black|PP": "RXKQQXMRXI",
    "T-shirt Boxy Basic Black|P": "6HBUDNO1M0",
    "T-shirt Boxy Basic Black|M": "GG7UJBIN7D",
    "T-shirt Boxy Basic Black|G": "77W8KJKMFH",
    "T-shirt Boxy Basic Black|GG": "AGK95NSZ5B",
    "T-shirt Boxy Basic Black|XG": "CZA2C9XDEL",

    // Shorts Moletinho Basic Black
    "Shorts Moletinho Basic Black|PP": "TNFF90H794",
    "Shorts Moletinho Basic Black|P": "28BUKE2D47",
    "Shorts Moletinho Basic Black|M": "CABQWR6QYM",
    "Shorts Moletinho Basic Black|G": "9V7C2WOPDK",
    "Shorts Moletinho Basic Black|GG": "9V7C2WOPDK",
    "Shorts Moletinho Basic Black|XG": "SD7NM2KGHQ",

    // Shorts Moletinho Basic White
    "Shorts Moletinho Basic White|PP": "NB85UKV7PT",
    "Shorts Moletinho Basic White|P": "TNSUR8GI5F",
    "Shorts Moletinho Basic White|M": "1FYSFLD7TN",
    "Shorts Moletinho Basic White|G": "JHVWTPMNPD",
    "Shorts Moletinho Basic White|GG": "JHVWTPMNPD",
    "Shorts Moletinho Basic White|XG": "D7AN9C6LAN",

    // Conjunto All Basic Black
    "Conjunto All Basic Black|PP": "T5HCKASY6Q",
    "Conjunto All Basic Black|P": "GKCWQT045G",
    "Conjunto All Basic Black|M": "PVE5YELEBP",
    "Conjunto All Basic Black|G": "9SWLQ4H4QD",
    "Conjunto All Basic Black|GG": "6LGRXSXZJA",
    "Conjunto All Basic Black|XG": "LRCE4XZJYW",

    // Conjunto All Basic White
    "Conjunto All Basic White|PP": "3087V4UJTJ",
    "Conjunto All Basic White|P": "3CP57ZOLO6",
    "Conjunto All Basic White|M": "BLDERFXM57",
    "Conjunto All Basic White|G": "4C1O5ID9R4",
    "Conjunto All Basic White|GG": "45PJLMVVPZ",
    "Conjunto All Basic White|XG": "NJDXU3Z0ZB",

    // 2 T-Shirt Oversized Basic Black&White
    "2 T-Shirt Oversized Basic Black&White|PP": "CHYNRADRVV",
    "2 T-Shirt Oversized Basic Black&White|P": "5J9Q9294KS",
    "2 T-Shirt Oversized Basic Black&White|M": "OF50781WL4",
    "2 T-Shirt Oversized Basic Black&White|G": "4HYT6TKLGS",
    "2 T-Shirt Oversized Basic Black&White|GG": "JP7N7F9VMD",
    "2 T-Shirt Oversized Basic Black&White|XG": "3ONGE8MQEM",
};

// Size mapping: Shopify sizes might differ from Yampi
const SIZE_MAP: Record<string, string> = {
    'P': 'P',
    'M': 'M',
    'G': 'G',
    'GG': 'GG',
    'XG': 'XG',
    // Shopify might use different labels
    'S': 'P',
    'L': 'G',
    'XL': 'GG',
    'XXL': 'XG',
    'PP': 'PP',
};

/**
 * Normalizes a Shopify product title to match the keys in YAMPI_TOKENS
 */
function normalizeProductTitle(productTitle: string): string {
    const normalized = productTitle.toLowerCase().trim();
    
    if (normalized.includes('t-shirt oversized basic black')) return 'T-shirt Oversized Basic Black';
    if (normalized.includes('t-shirt oversized basic white')) return 'T-shirt Oversized Basic White';
    if (normalized.includes('t-shirt boxy basic black')) return 'T-shirt Boxy Basic Black';
    if (normalized.includes('t-shirt boxy basic white')) return 'T-shirt Boxy Basic White';
    if (normalized.includes('shorts moletinho basic black')) return 'Shorts Moletinho Basic Black';
    if (normalized.includes('shorts moletinho basic white')) return 'Shorts Moletinho Basic White';
    if (normalized.includes('conjunto') && (normalized.includes('black') || normalized.includes('preta'))) return 'Conjunto All Basic Black';
    if (normalized.includes('conjunto') && (normalized.includes('white') || normalized.includes('branca') || normalized.includes('off-white'))) return 'Conjunto All Basic White';
    if (normalized.includes('2 t-shirt oversized basic black&white')) return '2 T-Shirt Oversized Basic Black&White';
    
    return productTitle;
}

/**
 * Get Yampi checkout URL for a specific product variant
 */
export function getYampiCheckoutUrl(
    productTitle: string,
    selectedSize: string,
    quantity: number = 1
): string | null {
    const normalizedSize = SIZE_MAP[selectedSize] || selectedSize;
    const searchTitle = normalizeProductTitle(productTitle);

    const key = `${searchTitle}|${normalizedSize}`;
    let token = YAMPI_TOKENS[key];

    if (!token) {
        const lowerTitle = productTitle.toLowerCase();
        for (const [mapKey, mapToken] of Object.entries(YAMPI_TOKENS)) {
            const [mapTitle, mapSize] = mapKey.split('|');
            if (mapTitle.toLowerCase() === lowerTitle && mapSize === normalizedSize) {
                token = mapToken;
                break;
            }
        }
    }

    if (!token) return null;
    return `${YAMPI_CHECKOUT_BASE}/${token}:${quantity}`;
}

/**
 * Build a multi-product Yampi checkout URL from cart items
 */
export function getYampiCartCheckoutUrl(
    items: Array<{ productTitle: string; size: string; quantity: number }>
): string | null {
    const tokenParts: string[] = [];

    for (const item of items) {
        const normalizedSize = SIZE_MAP[item.size] || item.size;
        const searchTitle = normalizeProductTitle(item.productTitle);
        
        const key = `${searchTitle}|${normalizedSize}`;
        let token = YAMPI_TOKENS[key];

        if (!token) {
            const lowerTitle = item.productTitle.toLowerCase();
            for (const [mapKey, mapToken] of Object.entries(YAMPI_TOKENS)) {
                const [mapTitle, mapSize] = mapKey.split('|');
                if (mapTitle.toLowerCase() === lowerTitle && mapSize === normalizedSize) {
                    token = mapToken;
                    break;
                }
            }
        }

        if (token) {
            tokenParts.push(`${token}:${item.quantity}`);
        }
    }

    if (tokenParts.length === 0) return null;
    return `${YAMPI_CHECKOUT_BASE}/${tokenParts.join(',')}`;
}
