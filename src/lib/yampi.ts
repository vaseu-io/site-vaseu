// Yampi Checkout Integration
// Maps Shopify product titles to Yampi buy tokens for direct checkout
// No API credentials are stored here - only public purchase tokens

const YAMPI_CHECKOUT_BASE = 'https://vaseu2.pay.yampi.com.br/r';

// Mapping: "Product Title Size" -> Yampi buy token
// Generated from Yampi API data - these are public tokens, safe for frontend
const YAMPI_TOKENS: Record<string, string> = {
    // T-Shirt Reflexo Preta
    "T-Shirt `Reflexo Preta|P": "63V1H8JQGY",
    "T-Shirt `Reflexo Preta|M": "1PSWEME94M",
    "T-Shirt `Reflexo Preta|G": "JUFITU1GF9",
    "T-Shirt `Reflexo Preta|GG": "NMLLLV5N1G",

    // T-Shirt Reflexo Off-White
    "T-Shirt `Reflexo Off-White|P": "M1LSKDK12K",
    "T-Shirt `Reflexo Off-White|M": "GV5J8FBJRG",
    "T-Shirt `Reflexo Off-White|G": "I0PMS4RRK4",
    "T-Shirt `Reflexo Off-White|GG": "8NXDYAVTX4",

    // T-Shirt Ruínas
    "T-Shirt `Ruínas|P": "A1YPDZJPP0",
    "T-Shirt `Ruínas|M": "RZOFGN6UU2",
    "T-Shirt `Ruínas|G": "T8BC0EO07J",
    "T-Shirt `Ruínas|GG": "7S0Z0R004D",

    // T-Shirt Orquidário | Vaseu x Ibanez
    "T-Shirt `Orquidário | Vaseu x Ibanez|P": "21I4KNWHHT",
    "T-Shirt `Orquidário | Vaseu x Ibanez|M": "PE24CN2E6F",
    "T-Shirt `Orquidário | Vaseu x Ibanez|G": "MUJ5T459O0",
    "T-Shirt `Orquidário | Vaseu x Ibanez|GG": "E0XWEM17JL",

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
    "Premium Oversized - Time`s Now|P": "99I4160XHI",
    "Premium Oversized - Time`s Now|M": "L2A9BRS89B",
    "Premium Oversized - Time`s Now|G": "I55EB5CLJ0",
    "Premium Oversized - Time`s Now|GG": "1WI1BRCU6N",
    "Premium Oversized - Time`s Now|XG": "FH5EHI151K",

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
};

/**
 * Get Yampi checkout URL for a specific product variant
 */
export function getYampiCheckoutUrl(
    productTitle: string,
    selectedSize: string,
    quantity: number = 1
): string | null {
    // Normalize the size
    const normalizedSize = SIZE_MAP[selectedSize] || selectedSize;

    // Try exact match first
    const key = `${productTitle}|${normalizedSize}`;
    let token = YAMPI_TOKENS[key];

    // If no exact match, try fuzzy matching by product name
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
        const key = `${item.productTitle}|${normalizedSize}`;
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
