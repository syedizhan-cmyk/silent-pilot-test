import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
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

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
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
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
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
          <h1>Settings</h1>
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
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'security', icon: '🔒', label: 'Security' },
            { id: 'notifications', icon: '🔔', label: 'Notifications' },
            { id: 'privacy', icon: '🛡️', label: 'Privacy' },
            { id: 'billing', icon: '💳', label: 'Billing' }
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
                <div className="plan-badge">Current Plan</div>
                <div className="plan-info">
                  <h3>Pro Plan</h3>
                  <div className="plan-price">$49<span>/month</span></div>
                  <ul className="plan-features">
                    <li>✓ Unlimited posts</li>
                    <li>✓ All social platforms</li>
                    <li>✓ AI content generation</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <button className="btn-secondary">Upgrade Plan</button>
                </div>
              </div>

              <div className="payment-card">
                <h3>Payment Method</h3>
                <div className="card-display">
                  <span className="card-icon">💳</span>
                  <div className="card-details">
                    <p className="card-number">•••• •••• •••• 4242</p>
                    <p className="card-expiry">Expires 12/25</p>
                  </div>
                  <button className="btn-text">Update</button>
                </div>
              </div>

              <div className="invoice-section">
                <h3>Billing History</h3>
                <div className="invoice-list">
                  {[
                    { date: 'Dec 1, 2024', desc: 'Pro Plan - Monthly', amount: '$49.00' },
                    { date: 'Nov 1, 2024', desc: 'Pro Plan - Monthly', amount: '$49.00' }
                  ].map((invoice, idx) => (
                    <div key={idx} className="invoice-item">
                      <div className="invoice-info">
                        <p className="invoice-date">{invoice.date}</p>
                        <p className="invoice-desc">{invoice.desc}</p>
                      </div>
                      <div className="invoice-actions">
                        <span className="invoice-amount">{invoice.amount}</span>
                        <button className="btn-text">Download</button>
                      </div>
                    </div>
                  ))}
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
