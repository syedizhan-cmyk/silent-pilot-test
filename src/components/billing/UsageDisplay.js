import React, { useState, useEffect } from 'react';
import { getUsageStats } from '../../lib/stripe';
import './UsageDisplay.css';

function UsageDisplay() {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    setLoading(true);
    const { data, limits, error } = await getUsageStats();
    
    if (error) {
      console.error('Error loading usage:', error);
    } else {
      setUsageData({ usage: data, limits });
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="usage-display">
        <h3>Usage This Period</h3>
        <div className="loading-skeleton">
          <div className="skeleton-bar"></div>
          <div className="skeleton-bar"></div>
        </div>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  const metrics = [
    {
      key: 'ai_requests_per_day',
      label: 'AI Requests',
      icon: '🤖',
      unit: 'requests'
    },
    {
      key: 'storage_gb',
      label: 'Storage Used',
      icon: '💾',
      unit: 'GB'
    },
    {
      key: 'social_accounts',
      label: 'Social Accounts',
      icon: '📱',
      unit: 'accounts'
    }
  ];

  return (
    <div className="usage-display">
      <h3>Usage This Period</h3>
      
      <div className="usage-grid">
        {metrics.map(metric => {
          const current = usageData.usage[metric.key] || 0;
          const limit = usageData.limits[metric.key];
          const isUnlimited = limit === -1;
          const percentage = isUnlimited ? 0 : (current / limit) * 100;
          const isNearLimit = percentage > 80;
          
          return (
            <div key={metric.key} className="usage-item">
              <div className="usage-header">
                <span className="usage-icon">{metric.icon}</span>
                <span className="usage-label">{metric.label}</span>
              </div>
              
              <div className="usage-stats">
                <div className="usage-numbers">
                  <span className="current">{current.toLocaleString()}</span>
                  {!isUnlimited && (
                    <>
                      <span className="separator">/</span>
                      <span className="limit">{limit.toLocaleString()}</span>
                    </>
                  )}
                  <span className="unit">{metric.unit}</span>
                </div>
                
                {isUnlimited ? (
                  <div className="unlimited-badge">
                    <span>∞</span>
                    <span>Unlimited</span>
                  </div>
                ) : (
                  <div className="usage-bar-container">
                    <div 
                      className={`usage-bar ${isNearLimit ? 'near-limit' : ''}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {!isUnlimited && isNearLimit && (
                <div className="usage-warning">
                  ⚠️ Approaching limit
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="usage-footer">
        <p>Usage resets at the start of each billing period</p>
      </div>
    </div>
  );
}

export default UsageDisplay;
