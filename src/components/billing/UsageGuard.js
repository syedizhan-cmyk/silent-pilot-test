import React, { useState, useEffect } from 'react';
import { checkUsageLimit } from '../../lib/stripe';
import { toast } from 'react-toastify';
import './UsageGuard.css';

/**
 * Component to guard actions that require subscription limits checking
 * Wraps children and prevents action if limit is exceeded
 */
function UsageGuard({ metricType, quantity = 1, children, fallback, onLimitExceeded }) {
  const [hasAccess, setHasAccess] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [metricType, quantity]);

  const checkAccess = async () => {
    setChecking(true);
    const { allowed, error } = await checkUsageLimit(metricType, quantity);
    
    if (error) {
      console.error('Error checking usage limit:', error);
      setHasAccess(true); // Allow on error to prevent blocking
    } else {
      setHasAccess(allowed);
      
      if (!allowed && onLimitExceeded) {
        onLimitExceeded();
      }
    }
    
    setChecking(false);
  };

  if (checking) {
    return children; // Show UI while checking
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="usage-limit-reached">
        <div className="limit-icon">🚫</div>
        <h3>Usage Limit Reached</h3>
        <p>You've reached your plan's limit for {metricType.replace(/_/g, ' ')}.</p>
        <a href="/#pricing" className="btn btn-primary">Upgrade Plan</a>
      </div>
    );
  }

  return children;
}

/**
 * Higher-order component to wrap functions with usage tracking
 */
export const withUsageTracking = (fn, metricType, quantity = 1) => {
  return async (...args) => {
    const { allowed, error } = await checkUsageLimit(metricType, quantity);
    
    if (error) {
      console.error('Error checking usage limit:', error);
      // Continue on error
    } else if (!allowed) {
      toast.error(`Usage limit reached for ${metricType.replace(/_/g, ' ')}. Please upgrade your plan.`, {
        autoClose: 5000,
        onClick: () => window.location.href = '/#pricing'
      });
      return null;
    }
    
    return await fn(...args);
  };
};

export default UsageGuard;
