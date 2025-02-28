import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { APIRoute } from 'astro';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response(
      JSON.stringify({ error: 'No signature provided' }), 
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeletion(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }));
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook error' }), 
      { status: 400 }
    );
  }
};

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { data: existingSub, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id, business_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  const subscriptionData = {
    plan_id: subscription.items.data[0].price.product as string,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: subscription.status,
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : null,
  };

  if (existingSub) {
    const { error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', existingSub.id);

    if (error) throw error;
  } else {
    // For new subscriptions, we need to find the business by customer ID
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single();

    if (businessError) throw businessError;

    const { error } = await supabase
      .from('subscriptions')
      .insert({
        ...subscriptionData,
        business_id: business.id,
      });

    if (error) throw error;
  }
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at: new Date(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) throw error;
}