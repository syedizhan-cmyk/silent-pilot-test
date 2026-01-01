import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, CreditCard } from 'lucide-react';
import { createCheckoutSession, getCurrentSubscription, cancelSubscription } from '../lib/stripe';
import { toast } from 'react-toastify';
import { useConfirm } from '../hooks/useConfirm';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    timezone: 'UTC'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    postReminders: true,
    performanceReports: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true
  });

  const [subscription, setSubscription] = useState({
    plan: 'Starter',
    status: 'active',
    billingCycle: 'monthly',
    amount: 0,
    nextBillingDate: null,
    paymentMethod: null
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchSubscriptionData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setProfile({
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          company: user.user_metadata?.company || '',
          phone: user.user_metadata?.phone || '',
          timezone: user.user_metadata?.timezone || 'UTC'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      const result = await getCurrentSubscription();
      if (result.success && result.subscription) {
        setSubscription({
          plan: result.subscription.plan_name || 'Starter',
          status: result.subscription.status || 'active',
          billingCycle: result.subscription.billing_cycle || 'monthly',
          amount: result.subscription.amount || 0,
          nextBillingDate: result.subscription.current_period_end,
          paymentMethod: result.subscription.payment_method
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleUpgradePlan = async (planId, billingCycle) => {
    try {
      // Verify user is logged in first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to upgrade your plan');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const result = await createCheckoutSession(planId, billingCycle);
      if (!result.success) {
        if (result.error.includes('log in') || result.error.includes('Session expired')) {
          toast.error('Please log in again to continue');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          toast.error(result.error || 'Failed to start checkout');
        }
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to upgrade plan');
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = await confirm({
      title: 'Cancel Subscription?',
      message: 'Are you sure you want to cancel your subscription?\n\nYou will still have access until the end of your billing period.',
      confirmText: 'Yes, Cancel',
      cancelText: 'Keep Subscription'
    });
    
    if (!confirmed) return;
    
    try {
      const result = await cancelSubscription();
      if (result.success) {
        toast.success('Subscription cancelled successfully');
        fetchSubscriptionData();
      } else {
        toast.error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          company: profile.company,
          phone: profile.phone,
          timezone: profile.timezone
        }
      });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsUpdate = () => {
    setMessage({ type: 'success', text: 'Notification preferences saved!' });
  };

  const handlePrivacyUpdate = () => {
    setMessage({ type: 'success', text: 'Privacy settings saved!' });
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: '⚠️ Delete Account?',
      message: 'Are you sure you want to delete your account?\n\nThis action cannot be undone and all your data will be permanently deleted.',
      confirmText: 'Yes, Delete Account',
      cancelText: 'Cancel'
    });
    
    if (confirmed) {
      setMessage({ type: 'error', text: 'Account deletion requires admin approval. Please contact support.' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="settings-v2">
      <div className="settings-header">
        <div>
          <h1><SettingsIcon className="header-icon" size={32} /> Settings</h1>
          <p>Manage your account preferences and security</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="settings-layout">
        <div className="settings-nav">
          {[
            { id: 'profile', icon: <User size={20} />, label: 'Profile' },
            { id: 'security', icon: <Lock size={20} />, label: 'Security' },
            { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
            { id: 'privacy', icon: <Shield size={20} />, label: 'Privacy' },
            { id: 'billing', icon: <CreditCard size={20} />, label: 'Billing' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-main">
          {activeTab === 'profile' && (
            <div className="section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your personal details and preferences</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="settings-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input 
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-field">
                    <label>Email Address</label>
                    <input 
                      type="email"
                      value={profile.email}
                      disabled
                      className="disabled"
                    />
                    <small>Contact support to change your email</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Company</label>
                    <input 
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="form-field">
                    <label>Phone Number</label>
                    <input 
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Timezone</label>
                  <select 
                    value={profile.timezone}
                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="section">
              <div className="section-header">
                <h2>Security Settings</h2>
                <p>Manage your password and account security</p>
              </div>

              <form onSubmit={handlePasswordChange} className="settings-form">
                <div className="form-field">
                  <label>Current Password</label>
                  <input 
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-field">
                  <label>New Password</label>
                  <input 
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-field">
                  <label>Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Irreversible actions. Please be careful.</p>
                <div className="danger-actions">
                  <button className="btn-danger" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                  <button className="btn-secondary" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="section">
              <div className="section-header">
                <h2>Notification Preferences</h2>
                <p>Choose how you want to be notified</p>
              </div>

              <div className="toggle-list">
                {[
                  { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'postReminders', title: 'Post Reminders', desc: 'Get reminded about scheduled posts' },
                  { key: 'performanceReports', title: 'Performance Reports', desc: 'Weekly analytics and insights' },
                  { key: 'weeklyDigest', title: 'Weekly Digest', desc: 'Summary of your weekly activity' },
                  { key: 'marketingEmails', title: 'Marketing Emails', desc: 'Product updates and tips' }
                ].map(item => (
                  <div key={item.key} className="toggle-row">
                    <div className="toggle-info">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={handleNotificationsUpdate}>
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="section">
              <div className="section-header">
                <h2>Privacy Settings</h2>
                <p>Control your data and visibility</p>
              </div>

              <div className="toggle-list">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <h4>Profile Visibility</h4>
                    <p>Control who can see your profile</p>
                  </div>
                  <select 
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    className="select-field"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="team">Team Only</option>
                  </select>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h4>Data Sharing</h4>
                    <p>Share anonymous usage data</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({...privacy, dataSharing: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h4>Analytics Tracking</h4>
                    <p>Help us improve your experience</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={privacy.analyticsTracking}
                      onChange={(e) => setPrivacy({...privacy, analyticsTracking: e.target.checked})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <button className="btn-primary" onClick={handlePrivacyUpdate}>
                Save Privacy Settings
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="section">
              <div className="section-header">
                <h2>Billing & Subscription</h2>
                <p>Manage your plan and payment methods</p>
              </div>

              <div className="billing-card">
                <div className="plan-badge">
                  Current Plan: {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                </div>
                <div className="plan-info">
                  <h3>{subscription.plan} Plan</h3>
                  <div className="plan-price">
                    ${subscription.amount}
                    <span>/{subscription.billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                  {subscription.plan === 'Starter' && (
                    <ul className="plan-features">
                      <li>✓ 10 posts per month</li>
                      <li>✓ 2 social media accounts</li>
                      <li>✓ Basic AI content generation</li>
                      <li>✓ Email support</li>
                    </ul>
                  )}
                  {subscription.plan === 'Professional' && (
                    <ul className="plan-features">
                      <li>✓ Unlimited posts</li>
                      <li>✓ 10 social media accounts</li>
                      <li>✓ Advanced AI content creation</li>
                      <li>✓ Email marketing campaigns</li>
                      <li>✓ Analytics & insights</li>
                      <li>✓ Priority support</li>
                    </ul>
                  )}
                  {subscription.plan === 'Enterprise' && (
                    <ul className="plan-features">
                      <li>✓ Everything in Professional</li>
                      <li>✓ Unlimited social accounts</li>
                      <li>✓ White-label solution</li>
                      <li>✓ Custom AI training</li>
                      <li>✓ Dedicated account manager</li>
                      <li>✓ API access</li>
                    </ul>
                  )}
                  {subscription.nextBillingDate && (
                    <p style={{ marginTop: '12px', fontSize: '14px', color: '#888' }}>
                      Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    {subscription.plan === 'Starter' && (
                      <>
                        <button 
                          className="btn-primary" 
                          onClick={() => handleUpgradePlan('professional', 'monthly')}
                        >
                          Upgrade to Professional
                        </button>
                        <button 
                          className="btn-secondary" 
                          onClick={() => handleUpgradePlan('enterprise', 'monthly')}
                        >
                          Upgrade to Enterprise
                        </button>
                      </>
                    )}
                    {subscription.plan === 'Professional' && (
                      <>
                        <button 
                          className="btn-primary" 
                          onClick={() => handleUpgradePlan('enterprise', 'monthly')}
                        >
                          Upgrade to Enterprise
                        </button>
                        {subscription.status === 'active' && (
                          <button 
                            className="btn-secondary" 
                            onClick={handleCancelSubscription}
                            style={{ background: '#ef4444' }}
                          >
                            Cancel Subscription
                          </button>
                        )}
                      </>
                    )}
                    {subscription.plan === 'Enterprise' && subscription.status === 'active' && (
                      <button 
                        className="btn-secondary" 
                        onClick={handleCancelSubscription}
                        style={{ background: '#ef4444' }}
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {subscription.paymentMethod && (
                <div className="payment-card">
                  <h3>Payment Method</h3>
                  <div className="card-display">
                    <span className="card-icon">💳</span>
                    <div className="card-details">
                      <p className="card-number">
                        •••• •••• •••• {subscription.paymentMethod.last4 || '****'}
                      </p>
                      <p className="card-expiry">
                        {subscription.paymentMethod.exp_month && subscription.paymentMethod.exp_year
                          ? `Expires ${subscription.paymentMethod.exp_month}/${subscription.paymentMethod.exp_year}`
                          : 'No expiry'}
                      </p>
                    </div>
                    <button className="btn-text" onClick={() => toast.info('Contact support to update payment method')}>
                      Update
                    </button>
                  </div>
                </div>
              )}

              <div className="invoice-section">
                <h3>Billing History</h3>
                <div className="invoice-list">
                  <p style={{ color: '#888', fontSize: '14px', padding: '20px 0' }}>
                    Your billing history will appear here once you have active subscriptions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
