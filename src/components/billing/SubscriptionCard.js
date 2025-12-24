import React, { useState, useEffect } from 'react';
import { getCurrentSubscription, createPortalSession, cancelSubscription, reactivateSubscription } from '../../lib/stripe';
import { toast } from 'react-toastify';
import './SubscriptionCard.css';

function SubscriptionCard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setLoading(true);
    const { data, error } = await getCurrentSubscription();
    
    if (error) {
      console.error('Error loading subscription:', error);
    } else {
      setSubscription(data);
    }
    
    setLoading(false);
  };

  const handleManageBilling = async () => {
    setActionLoading(true);
    const result = await createPortalSession();
    
    if (!result.success) {
      toast.error(result.error || 'Failed to open billing portal');
      setActionLoading(false);
    }
    // Portal redirects, so no need to set loading to false
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    setActionLoading(true);
    const result = await cancelSubscription(true);
    
    if (result.success) {
      toast.success('Subscription canceled. You will have access until the end of your billing period.');
      await loadSubscription();
    } else {
      toast.error(result.error || 'Failed to cancel subscription');
    }
    
    setActionLoading(false);
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    const result = await reactivateSubscription();
    
    if (result.success) {
      toast.success('Subscription reactivated successfully!');
      await loadSubscription();
    } else {
      toast.error(result.error || 'Failed to reactivate subscription');
    }
    
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="subscription-card">
        <div className="loading-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="subscription-card no-subscription">
        <div className="card-icon">📋</div>
        <h3>No Active Subscription</h3>
        <p>You're currently on the free plan. Upgrade to unlock more features!</p>
        <a href="/pricing" className="btn btn-primary">View Plans</a>
      </div>
    );
  }

  const isTrialing = subscription.status === 'trialing';
  const isCanceled = subscription.cancel_at_period_end;
  const isPastDue = subscription.status === 'past_due';

  return (
    <div className={`subscription-card ${isPastDue ? 'past-due' : ''}`}>
      <div className="subscription-header">
        <div className="plan-info">
          <h3>{subscription.plan?.name || 'Unknown Plan'}</h3>
          <span className={`status-badge status-${subscription.status}`}>
            {isTrialing ? '🎉 Free Trial' : isCanceled ? '⚠️ Canceling' : isPastDue ? '⚠️ Payment Failed' : '✓ Active'}
          </span>
        </div>
        <div className="plan-price">
          <span className="amount">
            ${subscription.billing_cycle === 'monthly' 
              ? subscription.plan?.price_monthly 
              : subscription.plan?.price_yearly}
          </span>
          <span className="period">/{subscription.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
      </div>

      <div className="subscription-details">
        {isTrialing && subscription.trial_end && (
          <div className="detail-row highlight">
            <span className="label">Trial Ends:</span>
            <span className="value">{new Date(subscription.trial_end).toLocaleDateString()}</span>
          </div>
        )}
        
        <div className="detail-row">
          <span className="label">Billing Cycle:</span>
          <span className="value">{subscription.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
        </div>

        {subscription.current_period_end && (
          <div className="detail-row">
            <span className="label">{isCanceled ? 'Access Until:' : 'Next Billing:'}</span>
            <span className="value">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {isPastDue && (
        <div className="alert alert-warning">
          <strong>Payment Failed:</strong> Please update your payment method to continue your subscription.
        </div>
      )}

      {isCanceled && (
        <div className="alert alert-info">
          Your subscription will be canceled at the end of the current billing period. You can reactivate anytime before then.
        </div>
      )}

      <div className="subscription-actions">
        {isCanceled ? (
          <button 
            className="btn btn-primary" 
            onClick={handleReactivate}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Reactivate Subscription'}
          </button>
        ) : (
          <>
            <button 
              className="btn btn-secondary" 
              onClick={handleManageBilling}
              disabled={actionLoading}
            >
              {actionLoading ? 'Loading...' : 'Manage Billing'}
            </button>
            <button 
              className="btn btn-danger-outline" 
              onClick={handleCancelSubscription}
              disabled={actionLoading}
            >
              Cancel Subscription
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionCard;
