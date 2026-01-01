import React, { useState } from 'react';
import { createCheckoutSession } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import './CheckoutButton.css';

function CheckoutButton({ plan, billingCycle, className = '', children }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.info('Please sign up or log in to continue');
        setTimeout(() => {
          window.location.href = '/signup';
        }, 1500);
        return;
      }
      
      // Handle free plan
      if (plan.price_monthly === 0 && plan.price_yearly === 0) {
        toast.success('Free plan activated! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        return;
      }
      
      const result = await createCheckoutSession(plan.id, billingCycle);
      
      if (!result.success) {
        // Check if user needs to log in
        if (result.error && result.error.includes('log in')) {
          toast.error('Please sign up or log in to subscribe');
          setTimeout(() => {
            window.location.href = '/signup';
          }, 2000);
        } else {
          toast.error(result.error || 'Failed to start checkout');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`checkout-button ${className}`}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Processing...
        </>
      ) : (
        children || (plan.price_monthly === 0 ? 'Get Started Free' : 'Start Free Trial')
      )}
    </button>
  );
}

export default CheckoutButton;
