// Custom hook for subscription management
import { useState, useEffect } from 'react';
import { getCurrentSubscription, hasFeatureAccess, trackUsage, checkUsageLimit } from '../lib/stripe';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setLoading(true);
    const { data, error: err } = await getCurrentSubscription();
    
    if (err) {
      setError(err);
    } else {
      setSubscription(data);
    }
    
    setLoading(false);
  };

  const refresh = () => {
    loadSubscription();
  };

  return {
    subscription,
    loading,
    error,
    refresh,
    isActive: subscription?.status === 'active' || subscription?.status === 'trialing',
    isCanceled: subscription?.cancel_at_period_end,
    isPastDue: subscription?.status === 'past_due',
    plan: subscription?.plan
  };
};

export const useFeatureAccess = (feature) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [feature]);

  const checkAccess = async () => {
    setLoading(true);
    const access = await hasFeatureAccess(feature);
    setHasAccess(access);
    setLoading(false);
  };

  return { hasAccess, loading };
};

export const useUsageTracking = () => {
  const track = async (metricType, quantity = 1, metadata = {}) => {
    return await trackUsage(metricType, quantity, metadata);
  };

  const checkLimit = async (metricType, quantity = 1) => {
    return await checkUsageLimit(metricType, quantity);
  };

  return { track, checkLimit };
};

export default useSubscription;
