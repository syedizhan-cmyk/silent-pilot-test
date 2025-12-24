// Stripe Webhook Handler
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();
  
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log(`Webhook received: ${event.type}`);

    // Log the event
    await supabaseAdmin
      .from('billing_events')
      .insert({
        event_type: event.type,
        stripe_event_id: event.id,
        data: event.data,
        processed: false,
      });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodAttached(paymentMethod);
        break;
      }

      case 'payment_method.detached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodDetached(paymentMethod);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await supabaseAdmin
      .from('billing_events')
      .update({ processed: true })
      .eq('stripe_event_id', event.id);

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  const planId = session.metadata?.plan_id;
  
  if (!userId) {
    console.error('No user ID in session metadata');
    return;
  }

  // Update subscription with completed checkout info
  await supabaseAdmin
    .from('user_subscriptions')
    .update({
      stripe_subscription_id: session.subscription as string,
      status: 'trialing',
    })
    .eq('user_id', userId);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  
  if (!userId) {
    // Try to find user by customer ID
    const { data: existingSub } = await supabaseAdmin
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', subscription.customer as string)
      .single();
    
    if (!existingSub) {
      console.error('Could not find user for subscription');
      return;
    }
  }

  const planId = subscription.metadata?.plan_id;
  const billingCycle = subscription.metadata?.billing_cycle || 'monthly';

  await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      user_id: userId || (await getUserFromCustomerId(subscription.customer as string)),
      plan_id: planId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      billing_cycle: billingCycle,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const userId = await getUserFromCustomerId(invoice.customer as string);
  
  if (!userId) {
    console.error('Could not find user for invoice');
    return;
  }

  // Get subscription ID from our database
  const { data: subscription } = await supabaseAdmin
    .from('user_subscriptions')
    .select('id')
    .eq('stripe_customer_id', invoice.customer as string)
    .single();

  await supabaseAdmin
    .from('invoices')
    .upsert({
      user_id: userId,
      subscription_id: subscription?.id,
      stripe_invoice_id: invoice.id,
      amount_due: invoice.amount_due / 100,
      amount_paid: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: invoice.status || 'paid',
      invoice_pdf: invoice.invoice_pdf,
      billing_reason: invoice.billing_reason,
      period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
      period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      paid_at: new Date().toISOString(),
    });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const userId = await getUserFromCustomerId(invoice.customer as string);
  
  if (!userId) {
    console.error('Could not find user for invoice');
    return;
  }

  // Update subscription status
  await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_customer_id', invoice.customer as string);

  // TODO: Send email notification to user about failed payment
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  const userId = await getUserFromCustomerId(paymentMethod.customer as string);
  
  if (!userId) {
    console.error('Could not find user for payment method');
    return;
  }

  await supabaseAdmin
    .from('payment_methods')
    .upsert({
      user_id: userId,
      stripe_payment_method_id: paymentMethod.id,
      type: paymentMethod.type,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
      exp_month: paymentMethod.card?.exp_month,
      exp_year: paymentMethod.card?.exp_year,
      is_default: false,
    });
}

async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod) {
  await supabaseAdmin
    .from('payment_methods')
    .delete()
    .eq('stripe_payment_method_id', paymentMethod.id);
}

async function getUserFromCustomerId(customerId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  return data?.user_id || null;
}
