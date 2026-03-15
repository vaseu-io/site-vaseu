import crypto from 'crypto';

const FB_PIXEL_ID = process.env.FB_PIXEL_ID || '2067417313817063';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

export function hashData(data: string): string {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

interface FBEventParams {
  eventName: string;
  eventSourceUrl: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  testEventCode?: string;
  userData?: {
    email?: string;
    phone?: string;
    externalId?: string;
  };
  customData?: Record<string, any>;
}

export async function sendFBEvent({
  eventName,
  eventSourceUrl,
  clientIpAddress,
  clientUserAgent,
  testEventCode,
  userData = {},
  customData = {}
}: FBEventParams) {
  if (!FB_ACCESS_TOKEN) {
    console.warn('FB_ACCESS_TOKEN not found. Skipping FB Event.');
    return;
  }

  const payload: any = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventSourceUrl,
        client_ip_address: clientIpAddress,
        client_user_agent: clientUserAgent,
        user_data: {
          em: userData.email ? [hashData(userData.email)] : undefined,
          ph: userData.phone ? [hashData(userData.phone)] : undefined,
          external_id: userData.externalId ? [hashData(userData.externalId)] : undefined,
        },
        custom_data: customData,
      },
    ],
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    if (typeof fetch === 'undefined') {
      console.warn('fetch is not available in this environment. Skipping FB Event.');
      return;
    }

    const response = await fetch(
      `https://graph.facebook.com/v17.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.error('FB CAPI Error:', result);
    }
    return result;
  } catch (error) {
    console.error('FB CAPI Fetch Error:', error);
  }
}
