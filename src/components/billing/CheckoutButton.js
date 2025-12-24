import React, { useState } from 'react';
import { createCheckoutSession } from '../../lib/stripe';
import { toast } from 'react-toastify';
import './CheckoutButton.css';

function CheckoutButton({ plan, billingCycle, className = '', children }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const result = await createCheckoutSession(plan.id, billingCycle);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to start checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
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
