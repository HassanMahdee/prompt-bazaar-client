import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'

export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const userSession  = await auth.api.getSession({
      headers: headersList,
    })

    const email = userSession?.user?.email

    // Create Checkout Sessions from body params.
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1Tnfr5CHSbfgwmKRHr6axNwK',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(checkoutSession.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}