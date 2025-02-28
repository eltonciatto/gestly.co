import { loadStripe } from '@stripe/stripe-js'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export async function getStripe() {
  if (!stripeKey) {
    throw new Error('Stripe publishable key not found');
  }
  
  const stripe = await loadStripe(stripeKey);
  if (!stripe) {
    throw new Error('Failed to initialize Stripe');
  }
  
  return stripe;
}