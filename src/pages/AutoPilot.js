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
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/ConfirmDialog';
import './AutoPilot-v2.css';

export default function AutoPilot() {
  console.log('🚀 AutoPilot component rendering...');
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { profile, loadProfile, loading: profileLoading } = useBusinessProfileStore();
  console.log('👤 AutoPilot - User:', user?.id, 'Profile:', profile ? 'exists' : 'null');
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
  const [profileLoadAttempted, setProfileLoadAttempted] = useState(false);
  
  const [generatedContent, setGeneratedContent] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    pending: 0,
    nextPostDate: null
  });
  
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    if (user && !profileLoadAttempted) {
      console.log('👤 User found, loading data for:', user.id);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (!profileLoadAttempted) {
          console.warn('⏰ Profile load timeout - proceeding anyway');
          setProfileLoadAttempted(true);
        }
      }, 3000); // 3 second timeout
      
      loadProfile(user.id)
        .finally(() => {
          clearTimeout(timeoutId);
          setProfileLoadAttempted(true);
        });
      
      loadAutoPilotSettings();
      loadScheduledContent();
      // Try to load enriched data, but don't fail if table doesn't exist
      loadEnrichedData(user.id).catch(err => {
        console.log('Brand intelligence not available yet:', err);
      });
    } else if (!user) {
      console.log('❌ No user found in AutoPilot');
      setProfileLoadAttempted(true); // Mark as attempted even if no user
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profileLoadAttempted]);

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
  const checkContentLevel = async () => {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + (settings.contentWeeks * 7));
      
      // Query actual scheduled content from database
      const { data: scheduledPosts, error } = await supabase
        .from('scheduled_content')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .gte('scheduled_for', now.toISOString())
        .lte('scheduled_for', futureDate.toISOString());
      
      if (error) throw error;
      
      const scheduledPostsCount = scheduledPosts?.length || 0;
      
      // Calculate expected posts (assuming ~2 posts per day per platform)
      const expectedPosts = settings.contentWeeks * 7 * 2 * settings.platforms.length;
      
      console.log('📊 Content check:', {
        scheduled: scheduledPostsCount,
        expected: expectedPosts,
        threshold: expectedPosts * 0.5
      });
      
      return {
        current: scheduledPostsCount,
        expected: expectedPosts,
        isSufficient: scheduledPostsCount >= (expectedPosts * 0.5) // 50% of expected (more realistic)
      };
    } catch (error) {
      console.error('Error checking content level:', error);
      // If there's an error, assume we need content
      return {
        current: 0,
        expected: settings.contentWeeks * 7 * 2 * settings.platforms.length,
        isSufficient: false
      };
    }
  };

  const handleToggleAutoPilot = async () => {
    const newState = !autoPilotEnabled;
    
    if (newState) {
      // Turning ON - just enable the setting, don't generate content yet
      if (!profile) {
        toast.error('Please complete your Business Profile first!');
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
        const contentLevel = await checkContentLevel();
        if (!contentLevel.isSufficient) {
          setConfirmDialog({
            isOpen: true,
            title: '✅ Auto-Pilot is ON!',
            message: `You currently have ${contentLevel.current} posts scheduled.\nRecommended: ${contentLevel.expected} posts for ${settings.contentWeeks} weeks.\n\nWould you like to generate ${settings.contentWeeks} weeks of content now?`,
            onConfirm: async () => {
              await handleGenerateAdditionalContent();
            }
          });
        } else {
          toast.success('✅ Auto-Pilot activated! You have sufficient content scheduled. The system will monitor and auto-generate as needed.');
        }
      } catch (error) {
        console.error('Error enabling auto-pilot:', error);
        toast.error('Error activating Auto-Pilot: ' + error.message);
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
        toast.success('✓ Auto-Pilot deactivated. Your scheduled posts remain intact.');
      } catch (error) {
        console.error('Error disabling auto-pilot:', error);
        toast.error('Error deactivating Auto-Pilot: ' + error.message);
      }
    }
  };

  const handleGenerateAdditionalContent = async () => {
    if (!profile) {
      toast.error('Please complete your Business Profile first!');
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
      
      toast.success(`✅ Generated ${result.scheduled} additional posts over ${settings.contentWeeks} weeks!`);
      
      loadScheduledContent();
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Error generating content: ' + error.message);
    }
    setGenerating(false);
    setGenerationProgress({ current: 0, total: 0, message: '' });
  };

  const handleCancelGeneration = () => {
    setGenerating(false);
    setGenerationProgress({ current: 0, total: 0, message: '' });
  };

  const handleRegenerateContent = async () => {
    const confirmed = await new Promise((resolve) => setConfirmDialog({ isOpen: true, ...arguments[0], onConfirm: () => resolve(true) }))({
        title: "Regenerate All Content?",
        message: `This will delete all scheduled posts and create a fresh -week content calendar.\n\nThis action cannot be undone.`,
        confirmText: "Regenerate",
        cancelText: "Cancel"
      });
      if (confirmed) {
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
        toast.error('Error regenerating content: ' + error.message);
      }
      setGenerating(false);
      setGenerationProgress({ current: 0, total: 0, message: '' });
    }
  };

  const handleRemoveAllPosts = async () => {
    const confirmed = await new Promise((resolve) => setConfirmDialog({ isOpen: true, ...arguments[0], onConfirm: () => resolve(true) }))({
        title: "⚠️ Clear All Posts?",
        message: "Are you sure you want to remove ALL scheduled posts?\n\nThis action cannot be undone.",
        confirmText: "Yes, Clear All",
        cancelText: "Cancel"
      });
      if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from('scheduled_content')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'scheduled');

      if (error) throw error;

      toast.success('✅ All scheduled posts have been removed!');
      await loadScheduledContent();
    } catch (error) {
      console.error('Error removing posts:', error);
      toast.error('Error removing posts: ' + error.message);
    }
  };

  const handleRefreshBrandIntelligence = async () => {
    const confirmed = await new Promise((resolve) => setConfirmDialog({ isOpen: true, ...arguments[0], onConfirm: () => resolve(true) }))({
        title: "Refresh Brand Intelligence?",
        message: "This will crawl your website and online presence to update brand data.\n\nThis may take a few minutes.",
        confirmText: "Yes, Refresh",
        cancelText: "Cancel"
      });
      if (confirmed) {
      setCrawlingWeb(true);
      try {
        console.log('🔄 Refreshing brand intelligence...');
        const newEnrichedData = await enrichBusinessProfile(profile);
        console.log('📊 New enriched data received:', newEnrichedData);
        await saveEnrichedData(user.id, newEnrichedData);
        console.log('✅ Brand intelligence saved!');
        toast.success('✅ Brand intelligence refreshed successfully!');
      } catch (error) {
        console.error('Error refreshing:', error);
        toast.error('Error refreshing brand intelligence: ' + error.message);
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
      toast.success(`✅ Analyzed ${analyzedMedia.length} media files! They will be used in your content generation.`);
      
    } catch (error) {
      console.error('Error analyzing media:', error);
      toast.error('Error analyzing media: ' + error.message);
    } finally {
      setAnalyzingMedia(false);
    }
  };

  const handleRemoveMedia = (index) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
  };

  // Render the main page - profile checks will be done inside functions
  console.log('🎯 Rendering decision - profile:', profile ? 'exists' : 'null', 'profileLoadAttempted:', profileLoadAttempted);
  
  if (!profileLoadAttempted) {
    console.log('⏳ Still loading profile...');
    return (
      <div className="autopilot-page">
        <div className="setup-required">
          <h1><Bot className="header-icon" size={32} /> Silent Pilot - Auto-Pilot Mode</h1>
          <div className="warning-box">
            <h2>⏳ Loading...</h2>
            <p>Please wait while we load your profile.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return profile ? (
    <div className="autopilot-page-v2">
      {/* Hero Section - Redesigned */}
      <div className="autopilot-hero-new">
        <div className="hero-header">
          <div className="feature-badge-new">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {autoPilotEnabled ? 'Active & Running' : 'Ready to Launch'}
          </div>
          <h1 className="hero-title-new">
            {autoPilotEnabled ? (
              <>Your Marketing is on <span className="gradient-text">AutoPilot</span></>
            ) : (
              <>Activate <span className="gradient-text">AutoPilot</span> Mode</>
            )}
          </h1>
          <p className="hero-description-new">
            {autoPilotEnabled 
              ? 'AI is working 24/7 to create, schedule, and optimize your social media content'
              : 'Let AI handle your entire social media strategy—from content creation to posting'
            }
          </p>
        </div>

        {/* Control Panel */}
        <div className="control-panel-new">
          <div className="control-main">
            {/* Power Toggle */}
            <div className="power-toggle-container">
              <button 
                className={`power-toggle ${autoPilotEnabled ? 'active deactivate-mode' : 'activate-mode'}`}
                onClick={handleToggleAutoPilot}
                disabled={generating}
              >
                <div className="toggle-inner">
                  <div className="toggle-icon">
                    {autoPilotEnabled ? (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    )}
                  </div>
                  <div className="toggle-status">
                    <span className="status-text">{autoPilotEnabled ? 'Deactivate' : 'Activate'}</span>
                    <span className="status-subtext">
                      {autoPilotEnabled ? 'Turn off AutoPilot' : 'Start AutoPilot'}
                    </span>
                  </div>
                </div>
              </button>
              
              {autoPilotEnabled && !generating && (
                <button 
                  className="generate-more-btn"
                  onClick={handleGenerateAdditionalContent}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  <span>Generate More Content</span>
                </button>
              )}

              {generating && (
                <button 
                  className="cancel-btn"
                  onClick={handleCancelGeneration}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="6" width="12" height="12"/>
                  </svg>
                  <span>Stop Generation</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {generating && generationProgress.total > 0 && (
              <div className="progress-container-new">
                <div className="progress-header">
                  <span className="progress-label">{generationProgress.message}</span>
                  <span className="progress-value">{generationProgress.current}%</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${generationProgress.current}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
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
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmed = await new Promise((resolve) => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Delete Post?",
                        message: "Are you sure you want to delete this post?\n\nThis action cannot be undone.",
                        onConfirm: () => resolve(true)
                      });
                    });
                    if (confirmed) {
                      supabase
                        .from('scheduled_content')
                        .delete()
                        .eq('id', content.id)
                        .then(() => {
                          loadScheduledContent();
                        })
                        .catch(err => toast.error('Error deleting post: ' + err.message));
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

      {/* Custom Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  ) : (
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