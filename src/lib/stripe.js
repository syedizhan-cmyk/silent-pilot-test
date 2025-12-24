// Stripe Payment Integration Service
import { supabase } from './supabase';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// Load Stripe.js
let stripePromise = null;
const loadStripe = async () => {
  if (!stripePromise) {
    const { loadStripe: loadStripeLib } = await import('@stripe/stripe-js');
    stripePromise = loadStripeLib(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create a checkout session for subscription
 */
export const createCheckoutSession = async (planId, billingCycle = 'monthly') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Call backend to create Stripe checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        planId,
        billingCycle,
        priceId: billingCycle === 'monthly' ? plan.stripe_price_id_monthly : plan.stripe_price_id_yearly,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      }
    });

    if (error) throw error;

    // Redirect to Stripe Checkout
    const stripe = await loadStripe();
    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (stripeError) throw stripeError;

    return { success: true };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create a portal session for managing subscription
 */
export const createPortalSession = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Call backend to create Stripe portal session
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        returnUrl: `${window.location.origin}/settings?tab=billing`
      }
    });

    if (error) throw error;

    // Redirect to Stripe Customer Portal
    window.location.href = data.url;

    return { success: true };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get current user's subscription
 */
export const getCurrentSubscription = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Get all available subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching plans:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get user's payment methods
 */
export const getPaymentMethods = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Call backend to update default payment method in Stripe
    const { data, error } = await supabase.functions.invoke('update-default-payment-method', {
      body: { paymentMethodId }
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's invoices
 */
export const getInvoices = async (limit = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (atPeriodEnd = true) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { atPeriodEnd }
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reactivate a canceled subscription
 */
export const reactivateSubscription = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('reactivate-subscription');

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Change subscription plan
 */
export const changeSubscriptionPlan = async (newPlanId, billingCycle) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('change-subscription-plan', {
      body: { newPlanId, billingCycle }
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error changing subscription plan:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user has access to a feature based on their subscription
 */
export const hasFeatureAccess = async (feature) => {
  try {
    const { data: subscription } = await getCurrentSubscription();
    
    if (!subscription || !subscription.plan) {
      return false; // No subscription = no access
    }

    const limits = subscription.plan.limits || {};
    
    // Check specific feature limits
    if (limits[feature] !== undefined) {
      return limits[feature] === -1 || limits[feature] > 0;
    }

    return true; // If no limit specified, allow access
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
};

/**
 * Track usage for metered billing
 */
export const trackUsage = async (metricType, quantity = 1, metadata = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('track_usage', {
      p_user_id: user.id,
      p_metric_type: metricType,
      p_quantity: quantity,
      p_metadata: metadata
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error tracking usage:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user has exceeded usage limits
 */
export const checkUsageLimit = async (metricType, quantity = 1) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('check_usage_limit', {
      p_user_id: user.id,
      p_metric_type: metricType,
      p_quantity: quantity
    });

    if (error) throw error;

    return { allowed: data, error: null };
  } catch (error) {
    console.error('Error checking usage limit:', error);
    return { allowed: false, error: error.message };
  }
};

/**
 * Get usage statistics for current billing period
 */
export const getUsageStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get current subscription period
    const { data: subscription } = await getCurrentSubscription();
    if (!subscription) throw new Error('No active subscription');

    const { data, error } = await supabase
      .from('usage_records')
      .select('metric_type, quantity')
      .eq('user_id', user.id)
      .gte('timestamp', subscription.current_period_start);

    if (error) throw error;

    // Aggregate by metric type
    const stats = data.reduce((acc, record) => {
      if (!acc[record.metric_type]) {
        acc[record.metric_type] = 0;
      }
      acc[record.metric_type] += record.quantity;
      return acc;
    }, {});

    return { data: stats, limits: subscription.plan.limits, error: null };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return { data: {}, limits: {}, error: error.message };
  }
};

export default {
  createCheckoutSession,
  createPortalSession,
  getCurrentSubscription,
  getSubscriptionPlans,
  getPaymentMethods,
  setDefaultPaymentMethod,
  getInvoices,
  cancelSubscription,
  reactivateSubscription,
  changeSubscriptionPlan,
  hasFeatureAccess,
  trackUsage,
  checkUsageLimit,
  getUsageStats
};
