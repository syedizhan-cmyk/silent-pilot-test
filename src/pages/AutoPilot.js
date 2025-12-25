import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import { useBrandIntelligenceStore } from '../lib/brandIntelligenceStore';
import { autoGenerateContentCalendar } from '../lib/autoContentGenerator';
import { enrichBusinessProfile } from '../lib/brandIntelligence';
import { supabase } from '../lib/supabase';
import { analyzeMediaBatch } from '../lib/visionAnalyzer';
import { Bot } from 'lucide-react';
import './AutoPilot-v2.css';

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
  const [showSettings, setShowSettings] = useState(false);
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


  // Check if we have enough scheduled content for the configured period
  const checkContentLevel = () => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + (settings.contentWeeks * 7));
    
    const scheduledPostsInPeriod = generatedContent.filter(c => {
      const postDate = new Date(c.scheduled_for);
      return c.status === 'scheduled' && postDate > now && postDate <= futureDate;
    }).length;
    
    // Calculate expected posts (assuming ~2 posts per day per platform)
    const expectedPosts = settings.contentWeeks * 7 * 2 * settings.platforms.length;
    
    return {
      current: scheduledPostsInPeriod,
      expected: expectedPosts,
      isSufficient: scheduledPostsInPeriod >= (expectedPosts * 0.8) // 80% of expected
    };
  };

  const handleToggleAutoPilot = async () => {
    const newState = !autoPilotEnabled;
    
    if (newState) {
      // Turning ON - just enable the setting, don't generate content yet
      if (!profile) {
        alert('Please complete your Business Profile first!');
        return;
      }

      try {
        await supabase
          .from('autopilot_settings')
          .upsert({
            user_id: user.id,
            settings: { ...settings, enabled: true },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
        
        setAutoPilotEnabled(true);
        setSettings({ ...settings, enabled: true });
        
        // Check if we need to generate content
        const contentLevel = checkContentLevel();
        if (!contentLevel.isSufficient) {
          const generateNow = window.confirm(
            `Auto-Pilot is now ON! You don't have enough content scheduled yet.\n\nGenerate ${settings.contentWeeks} weeks of content now?\n\nCurrent: ${contentLevel.current} posts\nExpected: ${contentLevel.expected} posts`
          );
          
          if (generateNow) {
            await handleGenerateAdditionalContent();
          }
        } else {
          alert('✅ Auto-Pilot activated! You have sufficient content scheduled. The system will monitor and auto-generate as needed.');
        }
      } catch (error) {
        console.error('Error enabling auto-pilot:', error);
        alert('Error activating Auto-Pilot: ' + error.message);
      }
    } else {
      // Turning OFF
      try {
        await supabase
          .from('autopilot_settings')
          .upsert({
            user_id: user.id,
            settings: { ...settings, enabled: false },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
        
        setAutoPilotEnabled(false);
        setSettings({ ...settings, enabled: false });
        setGenerating(false);
        alert('✓ Auto-Pilot deactivated. Your scheduled posts remain intact.');
      } catch (error) {
        console.error('Error disabling auto-pilot:', error);
        alert('Error deactivating Auto-Pilot: ' + error.message);
      }
    }
  };

  const handleGenerateAdditionalContent = async () => {
    if (!profile) {
      alert('Please complete your Business Profile first!');
      return;
    }

    setGenerating(true);
    setGenerationProgress({ current: 0, total: 100, message: 'Initializing content generation...' });
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
          console.log('✅ Brand intelligence saved!');
        } catch (error) {
          console.warn('Web crawling failed, continuing without enriched data:', error);
          currentEnrichedData = null;
        } finally {
          setCrawlingWeb(false);
        }
      }
      
      // Generate content calendar
      const result = await autoGenerateContentCalendar(profile, settings.contentWeeks, {
        enableWebCrawling: false,
        userId: user.id,
        enrichedData: currentEnrichedData,
        uploadedMedia: uploadedMedia,
        onProgress: (percent, message) => {
          setGenerationProgress({ current: percent, total: 100, message });
        }
      });
      
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
      
      alert(`✅ Generated ${result.scheduled} additional posts over ${settings.contentWeeks} weeks!`);
      
      loadScheduledContent();
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content: ' + error.message);
    }
    setGenerating(false);
    setGenerationProgress({ current: 0, total: 0, message: '' });
  };

  const handleCancelGeneration = () => {
    setGenerating(false);
    setGenerationProgress({ current: 0, total: 0, message: '' });
  };

  const handleRegenerateContent = async () => {
    if (window.confirm(`Regenerate all content? This will delete all scheduled posts and create a fresh ${settings.contentWeeks}-week content calendar.`)) {
      setGenerating(true);
      setGenerationProgress({ current: 0, total: 100, message: 'Clearing old content...' });
      try {
        // Delete old scheduled content
        await supabase
          .from('scheduled_content')
          .delete()
          .eq('user_id', user.id)
          .eq('status', 'scheduled');
        
        // Generate new content
        await handleGenerateAdditionalContent();
      } catch (error) {
        alert('Error regenerating content: ' + error.message);
      }
      setGenerating(false);
      setGenerationProgress({ current: 0, total: 0, message: '' });
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
          <h1><Bot className="header-icon" size={32} /> Silent Pilot - Auto-Pilot Mode</h1>
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
    <div className="autopilot-page-v2">
      {/* Hero Section */}
      <div className="autopilot-hero">
        <div className="hero-content">
          <div className="hero-top">
            <h1>Auto-Pilot Mode</h1>
            <div className="hero-badge">
              <span className={`status-badge ${autoPilotEnabled ? 'active' : 'inactive'}`}>
                {autoPilotEnabled ? '✓ Active' : '○ Inactive'}
              </span>
            </div>
            <p className="hero-subtitle">Automatically generate, schedule, and post content to all platforms</p>
          </div>

          {/* CTA Section - Large Buttons */}
          <div className="hero-cta-section">
            {!autoPilotEnabled ? (
              <button 
                onClick={handleToggleAutoPilot}
                disabled={generating}
                className="btn-hero btn-hero-activate"
              >
                <span className="btn-icon">🚀</span>
                <span className="btn-text">
                  <span className="btn-main">Activate Auto-Pilot</span>
                  <span className="btn-sub">Turn on to start generating content</span>
                </span>
              </button>
            ) : (
              <div className="hero-cta-active">
                <button 
                  onClick={handleToggleAutoPilot}
                  className="btn-hero btn-hero-deactivate"
                >
                  <span className="btn-icon">⏻</span>
                  Deactivate
                </button>
                {generating ? (
                  <button 
                    onClick={handleCancelGeneration}
                    className="btn-hero btn-hero-cancel"
                  >
                    <span className="btn-icon">⏹</span>
                    Stop Generation
                  </button>
                ) : (
                  <button 
                    onClick={handleGenerateAdditionalContent}
                    className="btn-hero btn-hero-generate"
                  >
                    <span className="btn-icon">→</span>
                    <span className="btn-text">
                      <span className="btn-main">Generate Additional Content</span>
                      <span className="btn-sub">{settings.contentWeeks} weeks of posts</span>
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {generating && generationProgress.total > 0 && (
            <div className="generation-progress-v2">
              <div className="progress-info">
                <span className="progress-message">{generationProgress.message}</span>
                <span className="progress-percent">{generationProgress.current}%</span>
              </div>
              <div className="progress-bar-v2">
                <div 
                  className="progress-fill-v2" 
                  style={{ width: `${generationProgress.current}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards - Only shown when active */}
      {autoPilotEnabled && (
        <div className="stats-grid">
          <div 
            className="stat-card-v2 stat-clickable" 
            onClick={() => navigate('/dashboard/content')}
            title="View all scheduled posts"
          >
            <div className="stat-card-header">
              <span className="stat-label">Scheduled</span>
              <span className="stat-icon">📅</span>
            </div>
            <div className="stat-value-large">{stats.scheduled}</div>
            <p className="stat-description">Posts ready to go</p>
          </div>

          <div 
            className="stat-card-v2 stat-clickable" 
            onClick={() => navigate('/dashboard/analytics')}
            title="View published posts analytics"
          >
            <div className="stat-card-header">
              <span className="stat-label">Published</span>
              <span className="stat-icon">✅</span>
            </div>
            <div className="stat-value-large">{stats.published}</div>
            <p className="stat-description">Posts live</p>
          </div>

          <div 
            className="stat-card-v2 stat-clickable" 
            onClick={() => navigate('/dashboard/content')}
            title="Review pending posts"
          >
            <div className="stat-card-header">
              <span className="stat-label">Pending</span>
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-value-large">{stats.pending}</div>
            <p className="stat-description">Awaiting review</p>
          </div>

          <div 
            className="stat-card-v2 stat-clickable" 
            onClick={() => navigate('/dashboard/calendar')}
            title="View calendar with upcoming posts"
          >
            <div className="stat-card-header">
              <span className="stat-label">Next Post</span>
              <span className="stat-icon">🗓️</span>
            </div>
            <div className="stat-value-large stat-date">
              {stats.nextPostDate ? new Date(stats.nextPostDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            </div>
            <p className="stat-description">Upcoming</p>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="content-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">◉</div>
            <h3>Analyze</h3>
            <p>AI studies your website and online presence</p>
          </div>
          <div className="step-card">
            <div className="step-icon">◆</div>
            <h3>Generate</h3>
            <p>{settings.contentWeeks} weeks of brand-specific content</p>
          </div>
          <div className="step-card">
            <div className="step-icon">▭</div>
            <h3>Schedule</h3>
            <p>Posts optimized for each platform</p>
          </div>
          <div className="step-card">
            <div className="step-icon">↻</div>
            <h3>Update</h3>
            <p>Automatically refreshes content</p>
          </div>
        </div>
      </div>

      {/* Brand Intelligence Card */}
      {settings.enableWebCrawling && (
        <div className="content-section">
          <div className="section-header">
            <h2>Brand Intelligence</h2>
            {enrichedData && (
              <button onClick={handleRefreshBrandIntelligence} className="btn-refresh-enhanced" title="Refresh brand intelligence">
                🔄
              </button>
            )}
          </div>

          {crawlingWeb ? (
            <div className="card-minimal">
              <div className="loading-state">
                <div className="spinner-mini"></div>
                <p>Analyzing your website and online presence...</p>
              </div>
            </div>
          ) : enrichedData ? (
            <div className="intelligence-display">
              <div className="intelligence-badges">
                {enrichedData.websiteData && <span className="badge">◉ Website Data</span>}
                {enrichedData.brandInsights && <span className="badge">◆ Insights</span>}
                {enrichedData.contentThemes?.length > 0 && <span className="badge">{enrichedData.contentThemes.length} Themes</span>}
              </div>
              
              <div className="intelligence-grid">
                {enrichedData.websiteData && (
                  <div className="intelligence-item">
                    <div className="intelligence-icon">◉</div>
                    <h4>Website Analyzed</h4>
                    <p>Your site structure, content, and messaging</p>
                  </div>
                )}
                {enrichedData.brandInsights && (
                  <div className="intelligence-item">
                    <div className="intelligence-icon">◆</div>
                    <h4>Brand Insights</h4>
                    <p>Your unique value proposition and audience</p>
                  </div>
                )}
                {enrichedData.contentThemes?.length > 0 && (
                  <div className="intelligence-item">
                    <div className="intelligence-icon">▭</div>
                    <h4>Content Themes</h4>
                    <p>{enrichedData.contentThemes.length} key topics identified</p>
                  </div>
                )}
              </div>
              
              <div className="intelligence-sources">
                <p className="text-small">
                  <strong>Data gathered from:</strong> Website content, meta tags, and online presence analysis
                </p>
                <p className="text-small">Last updated {new Date(enrichedData.websiteData?.scrapedAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="card-minimal card-subtle">
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <p>Brand intelligence will be gathered when you activate Auto-Pilot</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings - Collapsible */}
      <div className="content-section">
        <div 
          className="settings-header-v2" 
          onClick={() => setShowSettings(!showSettings)}
        >
          <h2>Settings & Configuration</h2>
          <span className="toggle-arrow">{showSettings ? '▼' : '▶'}</span>
        </div>
        
        {showSettings && (
        <div className="settings-panel">
        
        <div className="setting-group">
          <label>Content Generation Window</label>
          <select 
            value={settings.contentWeeks}
            onChange={(e) => setSettings({ ...settings, contentWeeks: Number(e.target.value) })}
          >
            <option value="1">1 week (7 posts)</option>
            <option value="2">2 weeks (14 posts)</option>
            <option value="4">4 weeks (28 posts)</option>
            <option value="6">6 weeks (42 posts)</option>
            <option value="8">8 weeks (56 posts)</option>
            <option value="12">12 weeks (84 posts)</option>
            <option value="16">16 weeks (112 posts)</option>
            <option value="24">24 weeks (168 posts)</option>
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
        )}
      </div>

      {/* Content Calendar Preview */}
      {generatedContent.length > 0 && (
        <div className="content-section">
          <div className="section-header">
            <h2>Scheduled Content</h2>
            <span className="badge-count">
              {generatedContent.filter(content => new Date(content.scheduled_for) > new Date()).length}
            </span>
          </div>
          
          <div className="content-preview-grid">
            {generatedContent
              .filter(content => new Date(content.scheduled_for) > new Date())
              .map((content, index) => (
              <div 
                key={index} 
                className="content-item-card"
                onClick={() => window.location.href = `/dashboard/calendar?postId=${content.id}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    window.location.href = `/dashboard/calendar?postId=${content.id}`;
                  }
                }}
              >
                <button
                  className="card-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this post?')) {
                      supabase
                        .from('scheduled_content')
                        .delete()
                        .eq('id', content.id)
                        .then(() => {
                          loadScheduledContent();
                        })
                        .catch(err => alert('Error deleting post: ' + err.message));
                    }
                  }}
                  title="Delete this post"
                >
                  ✕
                </button>
                {content.image_url && (
                  <div className="card-image">
                    <img src={content.image_url} alt="Post preview" />
                  </div>
                )}
                <div className="card-content">
                  <div className="card-meta">
                    <span className="meta-date">
                      {new Date(content.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="meta-platform">{content.platform}</span>
                  </div>
                  <p className="card-text">{content.content.substring(0, 60)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}