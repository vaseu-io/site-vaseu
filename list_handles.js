const https = require('https');

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'vaseu-company.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '06d07699c902453a35081d37159dbd8c';

const query = `
  query {
    products(first: 50) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
`;

const postData = JSON.stringify({ query });

const options = {
  hostname: SHOPIFY_STORE_PERMANENT_DOMAIN,
  path: `/api/${SHOPIFY_API_VERSION}/graphql.json`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    'Content-Length': postData.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.data && data.data.products) {
        console.log(JSON.stringify(data.data.products.edges.map(e => e.node), null, 2));
      } else {
        console.log('No data found:', body);
      }
    } catch (e) {
      console.error('Parse error:', e, body);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(postData);
req.end();
