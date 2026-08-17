import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
  try {
    const { amount, chargeId, tenantEmail } = await request.json();

    if (!amount || !chargeId) {
      return NextResponse.json({ error: 'Missing amount or chargeId' }, { status: 400 });
    }

    const host = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: tenantEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Property Rent / Ledger Charge',
            },
            unit_amount: Math.round(Number(amount) * 100), // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        chargeId: String(chargeId),
        tenantEmail: String(tenantEmail || ''),
      },
      success_url: `${host}/?payment=success&chargeId=${chargeId}`,
      cancel_url: `${host}/?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
