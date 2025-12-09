import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import { autoGenerateContentCalendar } from '../lib/autoContentGenerator';
import { supabase } from '../lib/supabase';
import './AutoPilot.css';

export default function AutoPilot() {
  const user = useAuthStore(state => state.user);
  const { profile, loadProfile } = useBusinessProfileStore();
  
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    contentWeeks: 4,
    autoRegenerate: true,
    autoPost: false,
    platforms: ['linkedin', 'twitter', 'facebook', 'instagram'],
    reviewRequired: true
  });
  
  const [generatedContent, setGeneratedContent] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    published: 0,
    pending: 0,
    nextPostDate: null
  });

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadAutoPilotSettings();
      loadScheduledContent();
    }
  }, [user]);

  const loadAutoPilotSettings = async () => {
    try {
      const { data } = await supabase
        .from('autopilot_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setSettings(data.settings);
        setAutoPilotEnabled(data.settings.enabled);
      }
    } catch (error) {
      console.log('No autopilot settings yet');
    }
  };

  const loadScheduledContent = async () => {
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
    try {
      // Generate content calendar
      const result = await autoGenerateContentCalendar(profile, settings.contentWeeks);
      
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
      
      alert(`🎉 Auto-Pilot Activated!\n\n${result.scheduled} posts scheduled over ${settings.contentWeeks} weeks!`);
      
      loadScheduledContent();
    } catch (error) {
      console.error('Error enabling auto-pilot:', error);
      alert('Error activating Auto-Pilot: ' + error.message);
    }
    setGenerating(false);
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
    if (window.confirm(`Generate ${settings.contentWeeks} weeks of fresh content?`)) {
      setGenerating(true);
      try {
        // Delete old scheduled content
        await supabase
          .from('scheduled_content')
          .delete()
          .eq('user_id', user.id)
          .eq('status', 'scheduled');
        
        // Generate new content
        await handleEnableAutoPilot();
      } catch (error) {
        alert('Error regenerating content: ' + error.message);
      }
      setGenerating(false);
    }
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
            <div className="stat-card">
              <div className="stat-value">{stats.scheduled}</div>
              <div className="stat-label">Scheduled Posts</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.published}</div>
              <div className="stat-label">Published</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.nextPostDate ? new Date(stats.nextPostDate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="stat-label">Next Post</div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="info-section">
        <h2>🎯 How Auto-Pilot Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🧠</span>
            <h3>AI Analyzes Your Business</h3>
            <p>Uses your business profile, industry, products, and target audience</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📝</span>
            <h3>Generates Content Ideas</h3>
            <p>Creates {settings.contentWeeks} weeks of relevant, engaging content topics</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">✨</span>
            <h3>Creates Full Posts</h3>
            <p>Writes complete posts with captions, hashtags, and images</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Smart Scheduling</h3>
            <p>Posts at optimal times based on your industry and platforms</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h3>Auto-Regenerates</h3>
            <p>Automatically creates new content when schedule runs low</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Tracks Performance</h3>
            <p>Learns from engagement to improve future content</p>
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

        <button 
          onClick={handleRegenerateContent}
          disabled={generating || !autoPilotEnabled}
          className="btn-secondary"
        >
          {generating ? '⏳ Regenerating...' : '🔄 Regenerate All Content'}
        </button>
      </div>

      {/* Content Calendar Preview */}
      {generatedContent.length > 0 && (
        <div className="calendar-preview">
          <h2>📅 Upcoming Content Schedule</h2>
          <div className="content-list">
            {generatedContent.slice(0, 10).map((content, index) => (
              <div key={index} className="content-item">
                <div className="content-date">
                  {new Date(content.scheduled_for).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="content-platform">{content.platform}</div>
                <div className="content-preview">
                  {content.content.substring(0, 100)}...
                </div>
                <div className="content-status">{content.status}</div>
              </div>
            ))}
          </div>
          {generatedContent.length > 10 && (
            <p className="view-more">+ {generatedContent.length - 10} more posts scheduled</p>
          )}
        </div>
      )}
    </div>
  );
}