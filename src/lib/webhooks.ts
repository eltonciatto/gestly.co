import { supabase } from './supabase';

interface WebhookPayload {
  type: string;
  data: any;
}

export async function deliverWebhook(businessId: string, payload: WebhookPayload) {
  try {
    // Get all active webhook endpoints for this business
    const { data: endpoints, error } = await supabase
      .from('webhook_endpoints')
      .select('*')
      .eq('business_id', businessId)
      .eq('active', true)
      .filter('events', 'cs', `{${payload.type}}`);

    if (error) throw error;

    // Deliver to each endpoint
    const deliveryPromises = endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Type': payload.type,
            'X-Webhook-Signature': generateSignature(endpoint.id, payload),
          },
          body: JSON.stringify(payload),
        });

        // Log delivery attempt
        await supabase.from('webhook_deliveries').insert({
          endpoint_id: endpoint.id,
          payload,
          status: response.ok ? 'success' : 'failed',
          status_code: response.status,
          response_body: await response.text(),
        });

        return response.ok;
      } catch (error) {
        // Log failed delivery
        await supabase.from('webhook_deliveries').insert({
          endpoint_id: endpoint.id,
          payload,
          status: 'failed',
          status_code: 0,
          response_body: error.message,
        });
        return false;
      }
    });

    await Promise.all(deliveryPromises);
  } catch (error) {
    console.error('Error delivering webhooks:', error);
  }
}

function generateSignature(endpointId: string, payload: any): string {
  // In a real implementation, use a proper HMAC signature
  // This is just a placeholder
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}