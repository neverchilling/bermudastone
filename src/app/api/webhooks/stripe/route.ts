import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      // Fallback in dev if webhook secret is not yet set
      event = JSON.parse(payload);
    } else {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle successful checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const chargeId = session.metadata?.chargeId;

    if (chargeId) {
      console.log(`⚡ Stripe Webhook: Updating charge ${chargeId} to 'paid' in Supabase...`);

      const { error } = await supabase
        .from('charges')
        .update({ status: 'paid' })
        .eq('id', chargeId);

      if (error) {
        console.error('❌ Supabase update error via webhook:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`✅ Charge ${chargeId} successfully marked as PAID!`);
    }
  }

  return NextResponse.json({ received: true });
}
