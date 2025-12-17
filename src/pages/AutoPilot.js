import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import { useBrandIntelligenceStore } from '../lib/brandIntelligenceStore';
import { autoGenerateContentCalendar } from '../lib/autoContentGenerator';
import { enrichBusinessProfile } from '../lib/brandIntelligence';
import { supabase } from '../lib/supabase';
import { analyzeMediaBatch } from '../lib/visionAnalyzer';
import './AutoPilot.css';

export default function AutoPilot() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { profile, loadProfile } = useBusinessProfileStore();
  const { 
    enrichedData, 
    loadEnrichedData, 
    saveEnrichedData, 
    needsRefresh 
  } = useBrandIntelligenceStore();
  
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [crawlingWeb, setCrawlingWeb] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, message: '' });
  const [showAllContent, setShowAllContent] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    contentWeeks: 4,
    autoRegenerate: true,
    autoPost: true, // Changed: Enable auto-posting by default
    platforms: ['linkedin', 'twitter', 'facebook', 'instagram'],
    reviewRequired: false, // Changed: Disable manual review to allow auto-posting
    enableWebCrawling: true
  });
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [analyzingMedia, setAnalyzingMedia] = useState(false);
  
  const [generatedContent, setGeneratedContent] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    pending: 0,
    nextPostDate: null
  });

  useEffect(() => {
    if (user) {
      console.log('👤 User found, loading data for:', user.id);
      loadProfile(user.id);
      loadAutoPilotSettings();
      loadScheduledContent();
      // Try to load enriched data, but don't fail if table doesn't exist
      loadEnrichedData(user.id).catch(err => {
        console.log('Brand intelligence not available yet:', err);
      });
    } else {
      console.log('❌ No user found in AutoPilot');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Debug: Log enrichedData changes
  useEffect(() => {
    console.log('🧠 enrichedData updated:', enrichedData);
    if (enrichedData) {
      console.log('   - websiteData:', enrichedData.websiteData ? '✓' : '✗');
      console.log('   - brandInsights:', enrichedData.brandInsights ? '✓' : '✗');
      console.log('   - contentThemes:', enrichedData.contentThemes?.length || 0);
    }
  }, [enrichedData]);

  const loadAutoPilotSettings = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('autopilot_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data && data.settings) {
        setSettings(prev => ({
          ...prev,
          ...data.settings
        }));
        setAutoPilotEnabled(data.settings.enabled || false);
      }
    } catch (error) {
      console.log('No autopilot settings yet');
    }
  };

  const loadScheduledContent = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('scheduled_content')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_for', { ascending: true });
      
      if (data) {
        setGeneratedContent(data);
        
        const now = new Date();
        const scheduled = data.filter(c => c.status === 'scheduled' && new Date(c.scheduled_for) > now).length;
        const published = data.filter(c => c.status === 'published').length;
        const pending = data.filter(c => c.status === 'pending').length;
        const nextPost = data.find(c => c.status === 'scheduled' && new Date(c.scheduled_for) > now);
        
        setStats({
          scheduled,
          published,
          pending,
          nextPostDate: nextPost?.scheduled_for
        });
      }
    } catch (error) {
      console.error('Error loading scheduled content:', error);
    }
  };

  const handleEnableAutoPilot = async () => {
    if (!profile) {
      alert('Please complete your Business Profile first!');
      return;
    }

    setGenerating(true);
    setGenerationProgress({ current: 0, total: 100, message: 'Initializing Auto-Pilot...' });
    try {
      // Enrich business profile with web intelligence if enabled
      let currentEnrichedData = enrichedData;
      
      if (settings.enableWebCrawling && (needsRefresh() || !enrichedData)) {
        setCrawlingWeb(true);
        try {
          console.log('🔍 Crawling web for brand intelligence...');
          currentEnrichedData = await enrichBusinessProfile(profile);
          console.log('📊 Enriched data received:', currentEnrichedData);
          await saveEnrichedData(user.id, currentEnrichedData);
          console.log('✅ Brand intelligence saved! (saveEnrichedData updates store automatically)');
        } catch (error) {
          console.warn('Web crawling failed, continuing without enriched data:', error);
          currentEnrichedData = null;
        } finally {
          setCrawlingWeb(false);
        }
      }
      
      // Generate content calendar with enriched data and user ID for performance learning
      const result = await autoGenerateContentCalendar(profile, settings.contentWeeks, {
        enableWebCrawling: false, // Already done above
        userId: user.id, // Pass user ID for performance insights
        enrichedData: currentEnrichedData, // IMPORTANT: Pass the enriched data!
        uploadedMedia: uploadedMedia, // Pass user's uploaded media
        onProgress: (percent, message) => {
          setGenerationProgress({ current: percent, total: 100, message });
        }
      });
      
      // Save enriched data from result if we got new data
      if (result.enrichedData && !currentEnrichedData) {
        console.log('💾 Saving enriched data from generation result...');
        await saveEnrichedData(user.id, result.enrichedData);
        console.log('✅ Enriched data saved!');
      }
      
      // Save to database
      const contentToSave = result.content.map(c => ({
        user_id: user.id,
        content: c.content,
        image_url: c.imageUrl,
        platform: c.platform,
        scheduled_for: c.scheduledFor,
        status: 'scheduled',
        type: c.type
      }));
      
      const { error } = await supabase
        .from('scheduled_content')
        .insert(contentToSave);
      
      if (error) throw error;
      
      // Save settings
      await supabase
        .from('autopilot_settings')
        .upsert({
          user_id: user.id,
          settings: { ...settings, enabled: true },
          updated_at: new Date().toISOString()
        });
      
      setAutoPilotEnabled(true);
      setSettings({ ...settings, enabled: true });
      
      const enrichmentMsg = currentEnrichedData ? '\n\n✨ Enhanced with real business intelligence from your website and online presence!' : '';
      alert(`🎉 Auto-Pilot Activated!\n\n${result.scheduled} posts scheduled over ${settings.contentWeeks} weeks!${enrichmentMsg}`);
      
      loadScheduledContent();
    } catch (error) {
      console.error('Error enabling auto-pilot:', error);
      alert('Error activating Auto-Pilot: ' + error.message);
    }
    setGenerating(false);
    setGenerationProgress({ current: 0, total: 0, message: '' });
  };

  const handleDisableAutoPilot = async () => {
    if (window.confirm('Are you sure you want to disable Auto-Pilot? Scheduled posts will remain but auto-regeneration will stop.')) {
      await supabase
        .from('autopilot_settings')
        .upsert({
          user_id: user.id,
          settings: { ...settings, enabled: false },
          updated_at: new Date().toISOString()
        });
      
      setAutoPilotEnabled(false);
      setSettings({ ...settings, enabled: false });
    }
  };

  const handleRegenerateContent = async () => {
    if (window.confirm(`Generate ${settings.contentWeeks} weeks of fresh content? This will also refresh your brand intelligence from the web.`)) {
      setGenerating(true);
      try {
        // Delete old scheduled content
        await supabase
          .from('scheduled_content')
          .delete()
          .eq('user_id', user.id)
          .eq('status', 'scheduled');
        
        // Generate new content (will also refresh web intelligence)
        await handleEnableAutoPilot();
      } catch (error) {
        alert('Error regenerating content: ' + error.message);
      }
      setGenerating(false);
    }
  };

  const handleRemoveAllPosts = async () => {
    if (!window.confirm('⚠️ Are you sure you want to remove ALL scheduled posts? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('scheduled_content')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'scheduled');

      if (error) throw error;

      alert('✅ All scheduled posts have been removed!');
      await loadScheduledContent();
    } catch (error) {
      console.error('Error removing posts:', error);
      alert('Error removing posts: ' + error.message);
    }
  };

  const handleRefreshBrandIntelligence = async () => {
    if (window.confirm('Refresh brand intelligence by crawling your website and online presence?')) {
      setCrawlingWeb(true);
      try {
        console.log('🔄 Refreshing brand intelligence...');
        const newEnrichedData = await enrichBusinessProfile(profile);
        console.log('📊 New enriched data received:', newEnrichedData);
        await saveEnrichedData(user.id, newEnrichedData);
        console.log('✅ Brand intelligence saved!');
        alert('✅ Brand intelligence refreshed successfully!');
      } catch (error) {
        console.error('Error refreshing:', error);
        alert('Error refreshing brand intelligence: ' + error.message);
      } finally {
        setCrawlingWeb(false);
      }
    }
  };

  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    console.log(`📸 ${files.length} media files selected`);
    setAnalyzingMedia(true);

    try {
      // Analyze all media files
      const analyzedMedia = await analyzeMediaBatch(files, profile);
      
      setUploadedMedia(prev => [...prev, ...analyzedMedia]);
      alert(`✅ Analyzed ${analyzedMedia.length} media files! They will be used in your content generation.`);
      
    } catch (error) {
      console.error('Error analyzing media:', error);
      alert('Error analyzing media: ' + error.message);
    } finally {
      setAnalyzingMedia(false);
    }
  };

  const handleRemoveMedia = (index) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  if (!profile) {
    return (
      <div className="autopilot-page">
        <div className="setup-required">
          <h1>🤖 Silent Pilot - Auto-Pilot Mode</h1>
          <div className="warning-box">
            <h2>⚠️ Business Profile Required</h2>
            <p>To activate Auto-Pilot, please complete your Business Profile first.</p>
            <p>The AI needs to understand your business to generate relevant content automatically.</p>
            <a href="/dashboard/business-profile" className="btn-primary">
              Complete Business Profile →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="autopilot-page">
      <div className="page-header">
        <h1>🤖 Silent Pilot - Auto-Pilot Mode</h1>
        <p>Fully automated content generation, scheduling, and posting</p>
      </div>

      {/* Progress Bar */}
      {generating && generationProgress.total > 0 && (
        <div className="generation-progress">
          <div className="progress-header">
            <h3>🤖 Generating Content...</h3>
            <span className="progress-counter">
              {generationProgress.current}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${generationProgress.current}%` }}
            />
          </div>
          <p className="progress-message">{generationProgress.message}</p>
        </div>
      )}

      {/* Status Card */}
      <div className="status-card">
        <div className="status-header">
          <div className="status-indicator">
            <div className={`indicator-dot ${autoPilotEnabled ? 'active' : 'inactive'}`}></div>
            <h2>{autoPilotEnabled ? '✅ Auto-Pilot Active' : '⏸️ Auto-Pilot Inactive'}</h2>
          </div>
          
          {autoPilotEnabled ? (
            <button onClick={handleDisableAutoPilot} className="btn-danger">
              Disable Auto-Pilot
            </button>
          ) : (
            <button 
              onClick={handleEnableAutoPilot} 
              disabled={generating}
              className="btn-primary btn-large"
            >
              {generating ? '⏳ Generating Content...' : '🚀 Activate Auto-Pilot'}
            </button>
          )}
        </div>

        {autoPilotEnabled && (
          <div className="status-stats">
            <div 
              className="stat-card clickable" 
              onClick={() => navigate('/dashboard/content')}
              title="View all scheduled posts"
            >
              <div className="stat-value">{stats.scheduled}</div>
              <div className="stat-label">Scheduled Posts</div>
              <div className="stat-action">👁️ View</div>
            </div>
            <div 
              className="stat-card clickable" 
              onClick={() => navigate('/dashboard/analytics')}
              title="View published posts analytics"
            >
              <div className="stat-value">{stats.published}</div>
              <div className="stat-label">Published</div>
              <div className="stat-action">📊 Analytics</div>
            </div>
            <div 
              className="stat-card clickable" 
              onClick={() => navigate('/dashboard/content')}
              title="Review pending posts"
            >
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
              <div className="stat-action">✏️ Review</div>
            </div>
            <div 
              className="stat-card clickable" 
              onClick={() => navigate('/dashboard/calendar')}
              title="View calendar with upcoming posts"
            >
              <div className="stat-value">
                {stats.nextPostDate ? new Date(stats.nextPostDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="stat-label">Next Post</div>
              <div className="stat-action">🗓️ Calendar</div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Intelligence Status */}
      {settings.enableWebCrawling && (
        <div className="info-section brand-intelligence-section">
          <h2>🧠 Brand Intelligence</h2>
          <div className="intelligence-status">
            {crawlingWeb ? (
              <div className="crawling-indicator">
                <div className="spinner"></div>
                <p>🔍 Crawling your website and online presence to gather brand intelligence...</p>
              </div>
            ) : enrichedData ? (
              <div className="intelligence-active">
                <div className="intelligence-info">
                  <span className="icon">✅</span>
                  <div>
                    <strong>Brand Intelligence Active</strong>
                    <p>Last updated: {new Date(enrichedData.websiteData?.scrapedAt || Date.now()).toLocaleDateString()}</p>
                    <p className="intelligence-details">
                      {enrichedData.websiteData && `✓ Website analyzed`}
                      {enrichedData.brandInsights && ` • ✓ Brand insights generated`}
                      {enrichedData.contentThemes?.length > 0 && ` • ✓ ${enrichedData.contentThemes.length} content themes identified`}
                    </p>
                  </div>
                </div>
                <button onClick={handleRefreshBrandIntelligence} className="btn-secondary-small">
                  🔄 Refresh
                </button>
              </div>
            ) : (
              <div className="intelligence-inactive">
                <p>Brand intelligence not yet gathered. Will be collected when you activate Auto-Pilot.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="info-section">
        <h2>🎯 How Auto-Pilot Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            <h3>Crawls Your Online Presence</h3>
            <p>Analyzes your website, social media, and brand presence to understand your business deeply</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🧠</span>
            <h3>AI Analyzes Your Business</h3>
            <p>Uses real business intelligence, industry data, products, and target audience insights</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📝</span>
            <h3>Generates Relevant Content</h3>
            <p>Creates {settings.contentWeeks} weeks of SPECIFIC content about YOUR business, not generic posts</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">✨</span>
            <h3>Creates Full Posts</h3>
            <p>Writes complete posts with captions, hashtags, and images tailored to your brand</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Smart Scheduling</h3>
            <p>Posts at optimal times based on your industry and platforms</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h3>Stays Fresh</h3>
            <p>Automatically creates new content and updates brand intelligence periodically</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="settings-section">
        <h2>⚙️ Auto-Pilot Settings</h2>
        
        <div className="setting-group">
          <label>Content Generation Window</label>
          <select 
            value={settings.contentWeeks}
            onChange={(e) => setSettings({ ...settings, contentWeeks: Number(e.target.value) })}
          >
            <option value="2">2 weeks (14 posts)</option>
            <option value="4">4 weeks (28 posts)</option>
            <option value="8">8 weeks (56 posts)</option>
            <option value="12">12 weeks (84 posts)</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Target Platforms</label>
          <div className="checkbox-group-horizontal">
            {['linkedin', 'twitter', 'facebook', 'instagram'].map(platform => (
              <label key={platform} className="checkbox-label-inline">
                <input
                  type="checkbox"
                  checked={settings.platforms.includes(platform)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSettings({ ...settings, platforms: [...settings.platforms, platform] });
                    } else {
                      setSettings({ ...settings, platforms: settings.platforms.filter(p => p !== platform) });
                    }
                  }}
                />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.autoRegenerate}
              onChange={(e) => setSettings({ ...settings, autoRegenerate: e.target.checked })}
            />
            <span>Auto-regenerate content when schedule runs low</span>
          </label>
        </div>

        <div className="setting-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.reviewRequired}
              onChange={(e) => setSettings({ ...settings, reviewRequired: e.target.checked })}
            />
            <span>Require manual review before posting</span>
          </label>
        </div>

        <div className="setting-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.autoPost}
              onChange={(e) => setSettings({ ...settings, autoPost: e.target.checked })}
              disabled={settings.reviewRequired}
            />
            <span>Automatically post content (requires social account connection)</span>
          </label>
          {settings.reviewRequired && (
            <p className="setting-note">Disable "Require manual review" to enable auto-posting</p>
          )}
        </div>

        <div className="setting-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.enableWebCrawling}
              onChange={(e) => setSettings({ ...settings, enableWebCrawling: e.target.checked })}
            />
            <span>Enable web crawling for brand intelligence (Recommended)</span>
          </label>
          <p className="setting-note">
            When enabled, the system will analyze your website and online presence to create highly relevant, 
            brand-specific content instead of generic posts.
          </p>
        </div>

        {/* Media Upload Section */}
        <div className="setting-group media-upload-section">
          <h3>📸 Upload Your Media (Optional)</h3>
          <p className="setting-note">
            Upload images or videos. AI will analyze them and create relevant posts using your media.
          </p>
          
          <input
            type="file"
            id="media-upload-input"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaUpload}
            style={{ display: 'none' }}
            disabled={analyzingMedia}
          />
          <label htmlFor="media-upload-input" className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '16px' }}>
            {analyzingMedia ? '🔍 Analyzing Media...' : '📤 Upload Images/Videos'}
          </label>
          
          {uploadedMedia.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>Uploaded Media ({uploadedMedia.length})</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                {uploadedMedia.map((media, index) => (
                  <div key={index} style={{ position: 'relative', border: '1px solid var(--border-default)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                    <div style={{ height: '100px', overflow: 'hidden' }}>
                      {media.fileType.startsWith('image/') ? (
                        <img src={media.fileUrl} alt={media.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', fontSize: '32px' }}>🎥</div>
                      )}
                    </div>
                    <div style={{ padding: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{media.fileName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {media.analysis.themes?.join(', ') || 'Analyzed'}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMedia(index)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <button 
            onClick={handleRegenerateContent}
            disabled={generating || !autoPilotEnabled}
            className="btn-secondary"
          >
            {generating ? '⏳ Regenerating...' : '🔄 Regenerate All Content'}
          </button>
          
          <button 
            onClick={handleRemoveAllPosts}
            disabled={generating || !autoPilotEnabled || generatedContent.length === 0}
            className="btn-danger"
          >
            🗑️ Remove All Scheduled Posts
          </button>
        </div>
      </div>

      {/* Content Calendar Preview */}
      {generatedContent.length > 0 && (
        <div className="calendar-preview">
          <div className="calendar-preview-header">
            <h2>📅 Upcoming Content Schedule</h2>
            <span className="content-count-badge">
              {generatedContent.filter(content => new Date(content.scheduled_for) > new Date()).length} posts
            </span>
          </div>
          <div className="content-list-scroll">
            <div className="content-grid">
              {generatedContent
                .filter(content => new Date(content.scheduled_for) > new Date()) // Only future posts
                .slice(0, showAllContent ? undefined : 10)
                .map((content, index) => (
                <div 
                  key={index} 
                  className="content-card"
                  onClick={() => window.location.href = `/dashboard/calendar?postId=${content.id}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      window.location.href = `/dashboard/calendar?postId=${content.id}`;
                    }
                  }}
                >
                  <div className="content-card-header">
                    <span className="content-date-compact">
                      {new Date(content.scheduled_for).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                    <span className="content-platform-badge">{content.platform}</span>
                  </div>
                  
                  <div className="content-card-body">
                    {content.image_url && (
                      <img 
                        src={content.image_url} 
                        alt="Post preview" 
                        className="content-thumbnail-small"
                      />
                    )}
                    <p className="content-text-compact">
                      {content.content.substring(0, 80)}...
                    </p>
                  </div>
                  
                  <div className="content-card-footer">
                    <span className="content-status-badge">{content.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {generatedContent.filter(content => new Date(content.scheduled_for) > new Date()).length > 10 && (
            <div className="show-more-container">
              <button 
                className="btn-show-more"
                onClick={() => setShowAllContent(!showAllContent)}
              >
                {showAllContent 
                  ? '📤 Show Less' 
                  : `📥 Show ${generatedContent.filter(content => new Date(content.scheduled_for) > new Date()).length - 10} More Posts`
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}