import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEmailCampaignsStore } from '../store/emailCampaignsStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import { generateABVariants, autoOptimizeCampaign } from '../lib/emailAutomation';
import { supabase } from '../lib/supabase';
import './EmailCampaigns.css';

function EmailCampaigns() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const user = useAuthStore((s) => s.user);
  const profile = useBusinessProfileStore((s) => s.profile);
  const { campaigns, getCampaigns, addCampaign, updateCampaign, deleteCampaign } = useEmailCampaignsStore();
  
  // Subscriber import state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  
  // AI generation state
  const [showAIModal, setShowAIModal] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // A/B Testing State
  const [showABModal, setShowABModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [abVariants, setAbVariants] = useState([]);
  const [generatingVariants, setGeneratingVariants] = useState(false);
  const [showVariantsView, setShowVariantsView] = useState(false);
  const [campaignVariants, setCampaignVariants] = useState({});
  
  // New Campaign Modal State
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    objective: 'engagement',
    type: 'newsletter',
    subject: '',
    preview_text: '',
    body: ''
  });
  const [sending, setSending] = useState(false);
  
  // Real subscriber stats
  const [subscriberStats, setSubscriberStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0
  });

  useEffect(() => {
    if (user) {
      console.log('📧 Fetching campaigns for user:', user.id);
      getCampaigns(user.id).then(result => {
        console.log('📊 Campaigns result:', result);
        console.log('📊 Campaigns in store:', campaigns);
      });
      loadCampaignVariants();
      loadSubscriberStats();
      useBusinessProfileStore.getState().loadProfile(user.id);
    }
  }, [user, getCampaigns]);
  
  // Load real subscriber stats
  const loadSubscriberStats = async () => {
    if (!user) return;
    
    const { data: subs, error } = await supabase
      .from('email_subscribers')
      .select('status')
      .eq('user_id', user.id);
    
    if (!error && subs) {
      const stats = {
        total: subs.length,
        active: subs.filter(s => s.status === 'active').length,
        unsubscribed: subs.filter(s => s.status === 'unsubscribed').length,
        bounced: subs.filter(s => s.status === 'bounced').length
      };
      setSubscriberStats(stats);
      console.log('📊 Subscriber stats:', stats);
    }
  };

  // Load variants for all campaigns
  const loadCampaignVariants = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('email_variants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      // Group variants by campaign_id
      const variantsByCampaign = {};
      data.forEach(variant => {
        if (!variantsByCampaign[variant.campaign_id]) {
          variantsByCampaign[variant.campaign_id] = [];
        }
        variantsByCampaign[variant.campaign_id].push(variant);
      });
      setCampaignVariants(variantsByCampaign);
    }
  };

  // Generate A/B Test Variants
  const handleCreateABTest = async (campaign) => {
    setSelectedCampaign(campaign);
    setGeneratingVariants(true);
    setShowABModal(true);

    try {
      // Mock business profile for demo - in real app, fetch from user's profile
      const businessProfile = {
        business_name: 'Your Business',
        industry: 'Technology',
        target_audience: 'Business professionals',
        brand_voice: { tone: 'Professional' }
      };

      const originalContent = {
        subject: campaign.subject || campaign.name,
        body: campaign.content || 'Your email content here...'
      };

      const variants = await generateABVariants(originalContent, businessProfile, 3);
      
      // Save variants to database
      const variantInserts = variants.map(v => ({
        campaign_id: campaign.id,
        variant_name: v.variantName,
        subject: v.subject,
        preview_text: v.previewText,
        body: v.body,
        hypothesis: v.hypothesis
      }));

      const { data, error } = await supabase
        .from('email_variants')
        .insert(variantInserts)
        .select();

      if (!error) {
        setAbVariants(data);
        await loadCampaignVariants();
      }
    } catch (error) {
      console.error('Error generating variants:', error);
      // Create demo variants as fallback
      const demoVariants = [
        {
          variant_name: 'Variant A - Emotional',
          subject: `${campaign.name} - Don't Miss Out! ❤️`,
          hypothesis: 'Emotional appeal with emoji increases engagement',
          open_rate: 0,
          click_rate: 0
        },
        {
          variant_name: 'Variant B - Data-Driven',
          subject: `${campaign.name} - Save 30% Today`,
          hypothesis: 'Clear value proposition drives more opens',
          open_rate: 0,
          click_rate: 0
        },
        {
          variant_name: 'Variant C - Curiosity',
          subject: `Have you seen this? (${campaign.name})`,
          hypothesis: 'Question format creates curiosity',
          open_rate: 0,
          click_rate: 0
        }
      ];
      setAbVariants(demoVariants);
    } finally {
      setGeneratingVariants(false);
    }
  };

  // Auto-optimize campaign
  const handleAutoOptimize = async (campaignId) => {
    try {
      const result = await autoOptimizeCampaign(campaignId);
      if (result.optimized) {
        alert(`✅ Campaign optimized! Winner: ${result.winner} with ${result.improvement}% improvement`);
        await loadCampaignVariants();
      } else {
        alert(`ℹ️ ${result.reason}`);
      }
    } catch (error) {
      console.error('Error optimizing:', error);
      alert('Error optimizing campaign. Please try again.');
    }
  };

  // View variants for a campaign
  const handleViewVariants = (campaign) => {
    setSelectedCampaign(campaign);
    setAbVariants(campaignVariants[campaign.id] || []);
    setShowVariantsView(true);
  };

  // Create new campaign
  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject) {
      alert('Please fill in campaign name and subject');
      return;
    }

    const result = await addCampaign(user.id, {
      ...newCampaign,
      status: 'draft'
    });

    if (result.error) {
      alert('Error creating campaign: ' + result.error);
    } else {
      alert('✅ Campaign created successfully!');
      setShowNewCampaignModal(false);
      setNewCampaign({
        name: '',
        objective: 'engagement',
        type: 'newsletter',
        subject: '',
        preview_text: '',
        body: ''
      });
      getCampaigns(user.id);
    }
  };

  // Send campaign
  const handleSendCampaign = async (campaign, testMode = false) => {
    // For test mode, automatically use logged-in user's email
    const testEmail = user?.email || user?.user_metadata?.email;
    
    const confirmMsg = testMode 
      ? `Send test email to ${testEmail}?` 
      : `Send this campaign to all subscribers? This cannot be undone.`;
    
    if (!window.confirm(confirmMsg)) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          campaignId: campaign.id,
          recipientEmail: testMode ? testEmail : null,
          testMode
        }
      });

      if (error) throw error;

      if (data.success) {
        alert(`✅ ${data.message}\nSent to: ${data.successCount}/${data.totalRecipients} recipients`);
        if (!testMode) {
          await updateCampaign(campaign.id, { status: 'sent', sent_at: new Date().toISOString() });
        }
        getCampaigns(user.id);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('❌ Error sending campaign: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  // Schedule campaign
  const handleScheduleCampaign = async (campaign) => {
    const scheduledTime = prompt('Enter schedule time (e.g., 2024-12-25 10:00):');
    if (!scheduledTime) return;

    const result = await updateCampaign(campaign.id, {
      status: 'scheduled',
      scheduled_for: new Date(scheduledTime).toISOString()
    });

    if (result.error) {
      alert('Error scheduling campaign: ' + result.error);
    } else {
      alert('✅ Campaign scheduled successfully!');
      getCampaigns(user.id);
    }
  };

  // Delete campaign
  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    const result = await deleteCampaign(campaignId);
    if (result.error) {
      alert('Error deleting campaign: ' + result.error);
    } else {
      alert('✅ Campaign deleted successfully!');
      getCampaigns(user.id);
    }
  };

  // Import subscribers from CSV
  const handleImportSubscribers = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const emailIdx = headers.indexOf('email');
      const firstNameIdx = headers.indexOf('first_name') || headers.indexOf('firstname');
      const lastNameIdx = headers.indexOf('last_name') || headers.indexOf('lastname');

      if (emailIdx === -1) {
        alert('CSV must have an "email" column');
        return;
      }

      const subscribers = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols[emailIdx]) {
          subscribers.push({
            user_id: user.id,
            email: cols[emailIdx],
            first_name: cols[firstNameIdx] || '',
            last_name: cols[lastNameIdx] || '',
            status: 'active'
          });
        }
      }

      const { error } = await supabase.from('email_subscribers').insert(subscribers);
      
      if (error) throw error;
      
      alert(`✅ Imported ${subscribers.length} subscribers!`);
      setShowImportModal(false);
    } catch (error) {
      alert('Error importing: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  // Generate campaign with AI
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please describe what you want to send');
      return;
    }

    setGeneratingAI(true);
    try {
      const businessContext = profile ? `
Business: ${profile.business_name}
Industry: ${profile.industry}
Target Audience: ${profile.target_audience}
Brand Voice: ${profile.brand_voice?.tone || 'Professional'}
      ` : '';

      const fullPrompt = `Create an email campaign for: ${aiPrompt}

${businessContext}

Format your response EXACTLY like this:
Subject: [compelling subject line]
Preview: [preview text]

[HTML email body with professional styling]`;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: fullPrompt,
          type: 'email'
        }
      });

      if (error) throw error;

      if (!data || !data.content) {
        throw new Error('No content generated');
      }

      const content = data.content;
      const lines = content.split('\n');
      const subjectLine = lines.find(l => l.toLowerCase().startsWith('subject:'));
      const previewLine = lines.find(l => l.toLowerCase().startsWith('preview:'));
      
      const subject = subjectLine ? subjectLine.replace(/subject:/i, '').trim() : aiPrompt;
      const preview = previewLine ? previewLine.replace(/preview:/i, '').trim() : '';
      
      // Extract HTML body (everything after preview or subject)
      const bodyStartIndex = Math.max(
        content.indexOf(previewLine || subjectLine || '') + (previewLine || subjectLine || '').length,
        0
      );
      let body = content.substring(bodyStartIndex).trim();
      
      // If no HTML tags found, wrap in basic HTML
      if (!body.includes('<')) {
        body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${body.split('\n').map(line => `<p>${line}</p>`).join('\n  ')}
</div>`;
      }

      setNewCampaign({
        name: aiPrompt,
        objective: 'engagement',
        type: 'newsletter',
        subject,
        preview_text: preview,
        body
      });
      
      setShowAIModal(false);
      setShowNewCampaignModal(true);
      setAiPrompt('');
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Error generating campaign: ' + error.message);
    } finally {
      setGeneratingAI(false);
    }
  };

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

  // subscribers now uses subscriberStats from state (loaded from database)

  return (
    <div className="email-campaigns-page">
      <div className="page-header">
        <div>
          <h1>Email Campaigns</h1>
          <p>Create, manage, and track your email marketing campaigns</p>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button className="btn btn-secondary" onClick={() => setShowAIModal(true)}>✨ AI Generate</button>
          <button className="btn btn-primary" onClick={() => setShowNewCampaignModal(true)}>+ New Campaign</button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <div className="stat-label">Total Subscribers</div>
            <div className="stat-value">{subscriberStats.total.toLocaleString()}</div>
            <div className="stat-change positive">+12% this month</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Active Subscribers</div>
            <div className="stat-value">{subscriberStats.active.toLocaleString()}</div>
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
            {console.log('🔍 Rendering campaigns. Count:', campaigns?.length, 'Using demo:', !campaigns?.length)}
            {(campaigns && campaigns.length > 0 ? campaigns : demoCampaigns).map(campaign => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-header">
                  <h3>{campaign.name}</h3>
                  <span className={`status-badge ${campaign.status}`}>
                    {campaign.status}
                  </span>
                </div>
                
                {/* Email Preview */}
                {campaign.subject && (
                  <div className="campaign-preview">
                    <p><strong>Subject:</strong> {campaign.subject}</p>
                    {campaign.preview_text && (
                      <p><strong>Preview:</strong> {campaign.preview_text}</p>
                    )}
                    {campaign.content && (
                      <div className="email-body-preview">
                        <iframe 
                          srcDoc={campaign.content}
                          style={{
                            width: '100%',
                            height: '200px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            marginTop: '10px'
                          }}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    )}
                  </div>
                )}
                
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
                        <button className="action-btn" onClick={() => handleSendCampaign(campaign, true)} title="Send Test Email" disabled={sending}>🧪 Test</button>
                        <button className="action-btn" onClick={() => handleScheduleCampaign(campaign)} title="Schedule Campaign">⏰ Schedule</button>
                        <button className="action-btn" onClick={() => handleSendCampaign(campaign, false)} disabled={sending}>📤 Send Now</button>
                        <button className="action-btn" onClick={() => handleDeleteCampaign(campaign.id)} title="Delete">🗑️</button>
                      </>
                    )}
                    {campaign.status === 'scheduled' && (
                      <>
                        <button className="action-btn" onClick={() => handleViewVariants(campaign)} title="View Variants">🧪 Variants</button>
                        <button className="action-btn" onClick={() => updateCampaign(campaign.id, { status: 'draft', scheduled_for: null })}>❌ Cancel</button>
                      </>
                    )}
                    {campaign.status === 'sent' && (
                      <>
                        {campaignVariants[campaign.id] && campaignVariants[campaign.id].length > 0 && (
                          <>
                            <button className="action-btn" onClick={() => handleViewVariants(campaign)} title="View A/B Results">📊 A/B Results</button>
                            <button className="action-btn" onClick={() => handleAutoOptimize(campaign.id)} title="Auto-Optimize">⚡ Optimize</button>
                          </>
                        )}
                        <button className="action-btn" onClick={() => addCampaign(user.id, { name: campaign.name + ' (Copy)', subject: 'Copy', content: '...', status: 'draft' })}>📋 Duplicate</button>
                        <button className="action-btn" onClick={() => deleteCampaign(campaign.id)}>🗑️ Delete</button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Show A/B Test Badge if variants exist */}
                {campaignVariants[campaign.id] && campaignVariants[campaign.id].length > 0 && (
                  <div className="ab-test-badge">
                    🧪 {campaignVariants[campaign.id].length} A/B Variants
                  </div>
                )}
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
              <button className="btn btn-secondary" onClick={() => setShowImportModal(true)}>📤 Import CSV</button>
              <button className="btn btn-primary">+ Add Subscriber</button>
            </div>
          </div>

          <div className="subscribers-stats">
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">👥</div>
              <div>
                <div className="subscriber-stat-label">Total Subscribers</div>
                <div className="subscriber-stat-value">{subscriberStats.total.toLocaleString()}</div>
              </div>
            </div>
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">✅</div>
              <div>
                <div className="subscriber-stat-label">Active</div>
                <div className="subscriber-stat-value">{subscriberStats.active.toLocaleString()}</div>
              </div>
            </div>
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">❌</div>
              <div>
                <div className="subscriber-stat-label">Unsubscribed</div>
                <div className="subscriber-stat-value">{subscriberStats.unsubscribed.toLocaleString()}</div>
              </div>
            </div>
            <div className="subscriber-stat">
              <div className="subscriber-stat-icon">⚠️</div>
              <div>
                <div className="subscriber-stat-label">Bounced</div>
                <div className="subscriber-stat-value">{subscriberStats.bounced.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="segments-section">
            <h3>Subscriber Segments</h3>
            <div className="segments-grid">
              <div className="segment-card">
                <div className="segment-name">All Subscribers</div>
                <div className="segment-count">{subscriberStats.total.toLocaleString()} contacts</div>
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
          <button className="quick-action" onClick={() => setShowNewCampaignModal(true)}>
            <span className="quick-action-icon">✍️</span>
            <span>New Campaign</span>
          </button>
          <button className="quick-action" onClick={() => setShowAIModal(true)}>
            <span className="quick-action-icon">🧪</span>
            <span>AI Generate</span>
          </button>
          <button className="quick-action" onClick={() => setActiveTab('analytics')}>
            <span className="quick-action-icon">📊</span>
            <span>View Reports</span>
          </button>
          <button className="quick-action" onClick={() => setActiveTab('subscribers')}>
            <span className="quick-action-icon">👥</span>
            <span>Manage Lists</span>
          </button>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="modal-overlay" onClick={() => setShowNewCampaignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Campaign</h2>
              <button className="close-btn" onClick={() => setShowNewCampaignModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Campaign Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Holiday Sale 2024"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Objective</label>
                  <select
                    value={newCampaign.objective}
                    onChange={(e) => setNewCampaign({ ...newCampaign, objective: e.target.value })}
                  >
                    <option value="engagement">Engagement</option>
                    <option value="sales">Sales</option>
                    <option value="awareness">Awareness</option>
                    <option value="retention">Retention</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Campaign Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                  >
                    <option value="newsletter">Newsletter</option>
                    <option value="promo">Promotional</option>
                    <option value="welcome">Welcome Series</option>
                    <option value="transactional">Transactional</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Email Subject *</label>
                <input
                  type="text"
                  placeholder="Your compelling subject line"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Preview Text</label>
                <input
                  type="text"
                  placeholder="Text shown in email preview"
                  value={newCampaign.preview_text}
                  onChange={(e) => setNewCampaign({ ...newCampaign, preview_text: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Body</label>
                <textarea
                  rows="10"
                  placeholder="Your email content (HTML supported)..."
                  value={newCampaign.body}
                  onChange={(e) => setNewCampaign({ ...newCampaign, body: e.target.value })}
                />
                <small>💡 Tip: Use {'{first_name}'}, {'{last_name}'}, {'{email}'} for personalization</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewCampaignModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateCampaign}>
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A/B Test Modal */}
      {showABModal && (
        <div className="modal-overlay" onClick={() => setShowABModal(false)}>
          <div className="modal-content ab-test-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🧪 A/B Test Variants</h2>
              <button className="modal-close" onClick={() => setShowABModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              {generatingVariants ? (
                <div className="generating-loader">
                  <div className="loader-spinner"></div>
                  <p>AI is generating optimized variants...</p>
                  <small>This may take 10-20 seconds</small>
                </div>
              ) : (
                <>
                  <div className="variants-intro">
                    <p>✨ AI has generated {abVariants.length} strategic variants for your campaign:</p>
                  </div>
                  
                  <div className="variants-grid">
                    {abVariants.map((variant, index) => (
                      <div key={index} className="variant-card">
                        <div className="variant-header">
                          <h3>{variant.variant_name}</h3>
                        </div>
                        <div className="variant-content">
                          <div className="variant-field">
                            <label>Subject Line:</label>
                            <div className="variant-value">{variant.subject}</div>
                          </div>
                          {variant.preview_text && (
                            <div className="variant-field">
                              <label>Preview:</label>
                              <div className="variant-value small">{variant.preview_text}</div>
                            </div>
                          )}
                          <div className="variant-field">
                            <label>Hypothesis:</label>
                            <div className="variant-hypothesis">{variant.hypothesis}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ab-test-info">
                    <h4>📈 How A/B Testing Works:</h4>
                    <ul>
                      <li>Each variant will be sent to an equal portion of your audience</li>
                      <li>AI tracks opens, clicks, and conversions in real-time</li>
                      <li>After statistical significance, the winner is automatically selected</li>
                      <li>Future campaigns are optimized based on learnings</li>
                    </ul>
                  </div>

                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={() => setShowABModal(false)}>
                      Close
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                      setShowABModal(false);
                      alert('✅ A/B test variants saved! You can now schedule or send your campaign.');
                    }}>
                      ✅ Save Variants & Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showAIModal && (
        <div className="modal-overlay" onClick={() => setShowAIModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✨ AI Campaign Generator</h2>
              <button className="close-btn" onClick={() => setShowAIModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Describe what you want to send to your subscribers:</p>
              <textarea
                rows="5"
                placeholder="e.g., A holiday sale announcement with 30% off all products, urgency-focused..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                style={{width: '100%', marginTop: '10px'}}
              />
              {profile && (
                <div style={{marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '5px'}}>
                  <strong>Using your business context:</strong>
                  <p style={{fontSize: '14px', margin: '5px 0'}}>
                    {profile.business_name} | {profile.industry}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAIModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGenerateWithAI} disabled={generatingAI}>
                {generatingAI ? '⏳ Generating...' : '✨ Generate Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Subscribers Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Import Subscribers</h2>
              <button className="close-btn" onClick={() => setShowImportModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Upload a CSV file with the following columns:</p>
              <ul style={{marginTop: '10px', marginBottom: '20px'}}>
                <li><strong>email</strong> (required)</li>
                <li>first_name (optional)</li>
                <li>last_name (optional)</li>
              </ul>
              <p style={{fontSize: '14px', color: '#666', marginBottom: '15px'}}>
                Example: email,first_name,last_name<br/>
                john@example.com,John,Doe<br/>
                jane@example.com,Jane,Smith
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportSubscribers}
                disabled={importing}
                style={{width: '100%'}}
              />
              {importing && <p style={{marginTop: '10px'}}>⏳ Importing...</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowImportModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Variants View Modal */}
      {showVariantsView && (
        <div className="modal-overlay" onClick={() => setShowVariantsView(false)}>
          <div className="modal-content variants-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📊 A/B Test Results</h2>
              <button className="modal-close" onClick={() => setShowVariantsView(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <h3>{selectedCampaign?.name}</h3>
              
              <div className="variants-comparison">
                {abVariants.length > 0 ? (
                  abVariants.map((variant, index) => (
                    <div key={index} className="variant-result-card">
                      <div className="variant-result-header">
                        <h4>{variant.variant_name}</h4>
                        {variant.open_rate > 0 && (
                          <span className={`winner-badge ${index === 0 ? 'winner' : ''}`}>
                            {index === 0 ? '🏆 Winner' : ''}
                          </span>
                        )}
                      </div>
                      
                      <div className="variant-metrics">
                        <div className="metric">
                          <div className="metric-label">Sent</div>
                          <div className="metric-value">{variant.sent_count || 0}</div>
                        </div>
                        <div className="metric">
                          <div className="metric-label">Open Rate</div>
                          <div className="metric-value">{variant.open_rate || 0}%</div>
                        </div>
                        <div className="metric">
                          <div className="metric-label">Click Rate</div>
                          <div className="metric-value">{variant.click_rate || 0}%</div>
                        </div>
                        <div className="metric">
                          <div className="metric-label">Conversion Rate</div>
                          <div className="metric-value">{variant.conversion_rate || 0}%</div>
                        </div>
                      </div>

                      <div className="variant-details">
                        <p><strong>Subject:</strong> {variant.subject}</p>
                        <p><strong>Hypothesis:</strong> {variant.hypothesis}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-variants">
                    <p>No A/B test variants found for this campaign.</p>
                    <button className="btn btn-primary" onClick={() => {
                      setShowVariantsView(false);
                      handleCreateABTest(selectedCampaign);
                    }}>
                      🧪 Create A/B Test
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailCampaigns;
