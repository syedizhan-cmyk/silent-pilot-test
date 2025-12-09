import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEmailCampaignsStore } from '../store/emailCampaignsStore';
import './EmailCampaigns.css';

function EmailCampaigns() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const user = useAuthStore((s) => s.user);
  const { campaigns, getCampaigns, addCampaign, updateCampaign, deleteCampaign } = useEmailCampaignsStore();

  useEffect(() => {
    if (user) getCampaigns(user.id);
  }, [user, getCampaigns]);

  const demoCampaigns = [
    { id: 1, name: 'Holiday Sale 2024', status: 'sent', sent: 2500, opened: 1250, clicked: 375, date: 'Dec 20, 2024' },
    { id: 2, name: 'Product Launch', status: 'scheduled', sent: 0, opened: 0, clicked: 0, date: 'Dec 28, 2024' },
    { id: 3, name: 'Newsletter - Week 51', status: 'draft', sent: 0, opened: 0, clicked: 0, date: 'Draft' },
    { id: 4, name: 'Customer Survey', status: 'sent', sent: 1800, opened: 900, clicked: 450, date: 'Dec 15, 2024' }
  ];

  const templates = [
    { id: 1, name: 'Welcome Series', category: 'Onboarding', preview: '👋' },
    { id: 2, name: 'Product Announcement', category: 'Marketing', preview: '🚀' },
    { id: 3, name: 'Weekly Newsletter', category: 'Newsletter', preview: '📰' },
    { id: 4, name: 'Promotional Offer', category: 'Sales', preview: '💰' },
    { id: 5, name: 'Event Invitation', category: 'Events', preview: '🎉' },
    { id: 6, name: 'Re-engagement', category: 'Retention', preview: '💌' }
  ];

  const subscribers = {
    total: 15847,
    active: 14523,
    unsubscribed: 892,
    bounced: 432
  };

  return (
    <div className="email-campaigns-page">
      <div className="page-header">
        <div>
          <h1>Email Campaigns</h1>
          <p>Create, manage, and track your email marketing campaigns</p>
        </div>
        <button className="btn btn-primary">+ New Campaign</button>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <div className="stat-label">Total Subscribers</div>
            <div className="stat-value">{subscribers.total.toLocaleString()}</div>
            <div className="stat-change positive">+12% this month</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Active Subscribers</div>
            <div className="stat-value">{subscribers.active.toLocaleString()}</div>
            <div className="stat-change positive">91.6% engagement</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Avg. Open Rate</div>
            <div className="stat-value">45.2%</div>
            <div className="stat-change positive">+3.1% vs industry</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖱️</div>
          <div className="stat-content">
            <div className="stat-label">Avg. Click Rate</div>
            <div className="stat-value">18.4%</div>
            <div className="stat-change positive">+5.2% vs last month</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="content-tabs">
        <button 
          className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          Subscribers
        </button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="campaigns-section">
          <div className="section-header">
            <div className="filter-buttons">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Sent</button>
              <button className="filter-btn">Scheduled</button>
              <button className="filter-btn">Draft</button>
            </div>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search campaigns..." />
            </div>
          </div>

          <div className="campaigns-grid">
            {(campaigns && campaigns.length ? campaigns : demoCampaigns).map(campaign => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-header">
                  <h3>{campaign.name}</h3>
                  <span className={`status-badge ${campaign.status}`}>
                    {campaign.status}
                  </span>
                </div>
                
                {campaign.status === 'sent' && (
                  <div className="campaign-stats">
                    <div className="mini-stat">
                      <div className="mini-stat-label">Sent</div>
                      <div className="mini-stat-value">{campaign.sent.toLocaleString()}</div>
                    </div>
                    <div className="mini-stat">
                      <div className="mini-stat-label">Opened</div>
                      <div className="mini-stat-value">{campaign.opened.toLocaleString()}</div>
                      <div className="mini-stat-percent">{((campaign.opened / campaign.sent) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="mini-stat">
                      <div className="mini-stat-label">Clicked</div>
                      <div className="mini-stat-value">{campaign.clicked.toLocaleString()}</div>
                      <div className="mini-stat-percent">{((campaign.clicked / campaign.sent) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}

                <div className="campaign-footer">
                  <div className="campaign-date">{campaign.date}</div>
                  <div className="campaign-actions">
                    {campaign.status === 'draft' && (
                      <>
                        <button className="action-btn" onClick={() => updateCampaign(campaign.id, { status: 'scheduled', scheduled_for: new Date(Date.now()+3600*1000).toISOString() })}>⏰ Schedule</button>
                        <button className="action-btn" onClick={() => updateCampaign(campaign.id, { status: 'sent', sent_at: new Date().toISOString() })}>📤 Send</button>
                      </>
                    )}
                    {campaign.status === 'scheduled' && (
                      <>
                        <button className="action-btn" onClick={() => updateCampaign(campaign.id, { status: 'draft', scheduled_for: null })}>❌ Cancel</button>
                      </>
                    )}
                    {campaign.status === 'sent' && (
                      <>
                        <button className="action-btn" onClick={() => addCampaign(user.id, { name: campaign.name + ' (Copy)', subject: 'Copy', content: '...', status: 'draft' })}>📋 Duplicate</button>
                        <button className="action-btn" onClick={() => deleteCampaign(campaign.id)}>🗑️ Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="templates-section">
          <div className="section-header">
            <h2>Email Templates</h2>
            <button className="btn btn-secondary">+ Create Template</button>
          </div>

          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-preview">
                  <div className="template-icon">{template.preview}</div>
                </div>
                <div className="template-info">
                  <h4>{template.name}</h4>
                  <div className="template-category">{template.category}</div>
                </div>
                <div className="template-actions">
                  <button className="action-btn">👁️ Preview</button>
                  <button className="action-btn">📝 Use</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="subscribers-section">
          <div className="section-header">
            <h2>Subscriber Management</h2>
            <div className="header-actions">
              <button className="btn btn-secondary">Import</button>
              <button className="btn btn-primary">+ Add Subscriber</button>
            </div>
          </div>

          <div className="subscribers-stats">
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">👥</div>
              <div>
                <div className="subscriber-stat-label">Total Subscribers</div>
                <div className="subscriber-stat-value">{subscribers.total.toLocaleString()}</div>
              </div>
            </div>
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">✅</div>
              <div>
                <div className="subscriber-stat-label">Active</div>
                <div className="subscriber-stat-value">{subscribers.active.toLocaleString()}</div>
              </div>
            </div>
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">❌</div>
              <div>
                <div className="subscriber-stat-label">Unsubscribed</div>
                <div className="subscriber-stat-value">{subscribers.unsubscribed.toLocaleString()}</div>
              </div>
            </div>
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">⚠️</div>
              <div>
                <div className="subscriber-stat-label">Bounced</div>
                <div className="subscriber-stat-value">{subscribers.bounced.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="segments-section">
            <h3>Subscriber Segments</h3>
            <div className="segments-grid">
              <div className="segment-card">
                <div className="segment-name">All Subscribers</div>
                <div className="segment-count">{subscribers.total.toLocaleString()} contacts</div>
              </div>
              <div className="segment-card">
                <div className="segment-name">Active Customers</div>
                <div className="segment-count">8,432 contacts</div>
              </div>
              <div className="segment-card">
                <div className="segment-name">Trial Users</div>
                <div className="segment-count">2,156 contacts</div>
              </div>
              <div className="segment-card">
                <div className="segment-name">Newsletter Only</div>
                <div className="segment-count">5,259 contacts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action">
            <span className="quick-action-icon">✍️</span>
            <span>New Campaign</span>
          </button>
          <button className="quick-action">
            <span className="quick-action-icon">📊</span>
            <span>View Reports</span>
          </button>
          <button className="quick-action">
            <span className="quick-action-icon">👥</span>
            <span>Manage Lists</span>
          </button>
          <button className="quick-action">
            <span className="quick-action-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailCampaigns;
