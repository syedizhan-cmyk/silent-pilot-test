import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEmailCampaignsStore } from '../store/emailCampaignsStore';
import './CampaignDetailView.css';

function CampaignDetailView() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const campaigns = useEmailCampaignsStore((state) => state.campaigns);
  const fetchCampaigns = useEmailCampaignsStore((state) => state.fetchCampaigns);
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const loadCampaign = async () => {
      if (campaigns.length === 0) {
        await fetchCampaigns();
      }
      const foundCampaign = campaigns.find(c => c.id === campaignId);
      setCampaign(foundCampaign);
      setLoading(false);
    };

    loadCampaign();
  }, [campaignId, campaigns, fetchCampaigns]);

  if (loading) {
    return (
      <div className="campaign-detail-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="campaign-detail-page">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h2>Campaign Not Found</h2>
          <p>The campaign you're looking for doesn't exist or has been deleted.</p>
          <Link to="/dashboard/email" className="back-button">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { icon: '📝', label: 'Draft', class: 'status-draft' },
      scheduled: { icon: '⏰', label: 'Scheduled', class: 'status-scheduled' },
      active: { icon: '✈️', label: 'Active', class: 'status-active' },
      sent: { icon: '✅', label: 'Sent', class: 'status-sent' },
      paused: { icon: '⏸️', label: 'Paused', class: 'status-paused' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`status-badge ${config.class}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = campaign.analytics || {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0
  };

  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(1) : 0;
  const clickRate = stats.delivered > 0 ? ((stats.clicked / stats.delivered) * 100).toFixed(1) : 0;
  const bounceRate = stats.sent > 0 ? ((stats.bounced / stats.sent) * 100).toFixed(1) : 0;

  return (
    <div className="campaign-detail-page">
      <div className="campaign-detail-header">
        <button onClick={() => navigate('/dashboard/email')} className="back-nav">
          ← Back to Campaigns
        </button>
        
        <div className="header-content">
          <div className="header-left">
            <h1>{campaign.name}</h1>
            {getStatusBadge(campaign.status)}
          </div>
          <div className="header-actions">
            <button className="action-btn secondary">
              <span>📝</span>
              <span>Edit</span>
            </button>
            <button className="action-btn secondary">
              <span>📊</span>
              <span>Analytics</span>
            </button>
            <button className="action-btn primary">
              <span>🚀</span>
              <span>Send Now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="campaign-detail-content">
        {/* Overview Section */}
        <div className="detail-section overview-section">
          <h2>Campaign Overview</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <span className="item-label">Campaign Type</span>
              <span className="item-value">{campaign.type || 'Standard'}</span>
            </div>
            <div className="overview-item">
              <span className="item-label">Subject Line</span>
              <span className="item-value">{campaign.subject || 'No subject'}</span>
            </div>
            <div className="overview-item">
              <span className="item-label">From Name</span>
              <span className="item-value">{campaign.from_name || 'Not set'}</span>
            </div>
            <div className="overview-item">
              <span className="item-label">From Email</span>
              <span className="item-value">{campaign.from_email || 'Not set'}</span>
            </div>
            <div className="overview-item">
              <span className="item-label">Created</span>
              <span className="item-value">{formatDate(campaign.created_at)}</span>
            </div>
            <div className="overview-item">
              <span className="item-label">Scheduled For</span>
              <span className="item-value">{formatDate(campaign.scheduled_at)}</span>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="detail-section stats-section">
          <h2>Performance Metrics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📤</div>
              <div className="stat-content">
                <span className="stat-label">Total Sent</span>
                <span className="stat-value">{stats.sent.toLocaleString()}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-content">
                <span className="stat-label">Delivered</span>
                <span className="stat-value">{stats.delivered.toLocaleString()}</span>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                <span className="stat-label">Opened</span>
                <span className="stat-value">{stats.opened.toLocaleString()}</span>
                <span className="stat-percentage">{openRate}%</span>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">🖱️</div>
              <div className="stat-content">
                <span className="stat-label">Clicked</span>
                <span className="stat-value">{stats.clicked.toLocaleString()}</span>
                <span className="stat-percentage">{clickRate}%</span>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <span className="stat-label">Bounced</span>
                <span className="stat-value">{stats.bounced.toLocaleString()}</span>
                <span className="stat-percentage">{bounceRate}%</span>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon">🚫</div>
              <div className="stat-content">
                <span className="stat-label">Unsubscribed</span>
                <span className="stat-value">{stats.unsubscribed.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Content Preview */}
        <div className="detail-section content-section">
          <h2>Email Content</h2>
          <div className="email-preview">
            <div className="preview-header">
              <div className="preview-field">
                <strong>Subject:</strong> {campaign.subject || 'No subject'}
              </div>
              <div className="preview-field">
                <strong>From:</strong> {campaign.from_name || 'Unknown'} &lt;{campaign.from_email || 'unknown@example.com'}&gt;
              </div>
            </div>
            <div className="preview-body">
              {campaign.content ? (
                <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
              ) : (
                <p className="no-content">No content available</p>
              )}
            </div>
          </div>
        </div>

        {/* Audience Section */}
        <div className="detail-section audience-section">
          <h2>Target Audience</h2>
          <div className="audience-info">
            <div className="audience-stat">
              <span className="audience-icon">👥</span>
              <div>
                <span className="audience-label">Total Recipients</span>
                <span className="audience-value">{campaign.recipient_count || 0}</span>
              </div>
            </div>
            {campaign.segments && campaign.segments.length > 0 && (
              <div className="segments-list">
                <span className="segments-label">Segments:</span>
                {campaign.segments.map((segment, index) => (
                  <span key={index} className="segment-tag">{segment}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* A/B Testing Section (if applicable) */}
        {campaign.email_variants && campaign.email_variants.length > 1 && (
          <div className="detail-section ab-testing-section">
            <h2>A/B Testing</h2>
            <div className="variants-grid">
              {campaign.email_variants.map((variant, index) => (
                <div key={index} className="variant-card">
                  <h3>Variant {String.fromCharCode(65 + index)}</h3>
                  <div className="variant-subject">{variant.subject}</div>
                  <div className="variant-stats">
                    <div className="variant-stat">
                      <span>Opens:</span>
                      <strong>{variant.opens || 0}</strong>
                    </div>
                    <div className="variant-stat">
                      <span>Clicks:</span>
                      <strong>{variant.clicks || 0}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignDetailView;
