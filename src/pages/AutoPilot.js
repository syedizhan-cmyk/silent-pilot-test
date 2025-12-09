import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';
import { supabase } from '../lib/supabase';
import './AutoPilot.css';

function AutoPilot() {
  const user = useAuthStore((state) => state.user);
  const { posts, getPosts } = useContentStore();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState({
    enabled: false,
    frequency: 3, // posts per day
    useBestTimes: true,
    platforms: ['facebook', 'twitter', 'linkedin', 'instagram'],
    postingTimes: ['09:00', '13:00', '18:00'],
    contentTypes: ['promotional', 'educational', 'engagement'],
    aiGenerate: true,
    autoSchedule: true,
    weekdaysOnly: false,
    minInterval: 2 // hours between posts
  });

  useEffect(() => {
    if (user?.id) {
      loadSettings();
      getPosts(user.id);
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('autopilot_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({ ...settings, ...data.settings });
        setEnabled(data.settings.enabled || false);
      }
    } catch (error) {
      console.error('Error loading autopilot settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('autopilot_settings')
        .upsert({
          user_id: user.id,
          settings: settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoPilot = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    setSettings({ ...settings, enabled: newEnabled });
    
    // Auto-save when toggling
    try {
      await supabase
        .from('autopilot_settings')
        .upsert({
          user_id: user.id,
          settings: { ...settings, enabled: newEnabled },
          updated_at: new Date().toISOString()
        });

      setMessage({ 
        type: 'success', 
        text: newEnabled ? 'Auto-Pilot enabled!' : 'Auto-Pilot disabled!' 
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handlePlatformToggle = (platform) => {
    const platforms = settings.platforms.includes(platform)
      ? settings.platforms.filter(p => p !== platform)
      : [...settings.platforms, platform];
    setSettings({ ...settings, platforms });
  };

  const handleContentTypeToggle = (type) => {
    const contentTypes = settings.contentTypes.includes(type)
      ? settings.contentTypes.filter(t => t !== type)
      : [...settings.contentTypes, type];
    setSettings({ ...settings, contentTypes });
  };

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedToday = posts.filter(p => {
    const today = new Date().toDateString();
    return p.published_at && new Date(p.published_at).toDateString() === today;
  }).length;
  const pendingCount = posts.filter(p => p.status === 'draft').length;

  const getNextPostTime = () => {
    const scheduled = posts
      .filter(p => p.status === 'scheduled' && p.scheduled_for)
      .sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for));
    
    if (scheduled.length > 0) {
      const nextPost = new Date(scheduled[0].scheduled_for);
      return nextPost.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
    return 'None scheduled';
  };

  if (loading) {
    return (
      <div className="autopilot-v2">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Auto-Pilot settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="autopilot-v2">
      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Auto-Pilot</h1>
          <p className="text-secondary mt-2">Automate your content posting schedule</p>
        </div>
        <button 
          className={`btn ${enabled ? 'btn-danger' : 'btn-primary'}`} 
          onClick={toggleAutoPilot}
        >
          {enabled ? '⏸️ Disable' : '🚀 Enable'} Auto-Pilot
        </button>
      </div>

      {enabled && (
        <div className="alert-info">
          <span className="alert-icon">ℹ️</span>
          <span>Auto-Pilot is active and will automatically create and schedule posts based on your settings.</span>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{scheduledCount}</div>
          <div className="stat-label">Scheduled</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{publishedToday}</div>
          <div className="stat-label">Published Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getNextPostTime()}</div>
          <div className="stat-label">Next Post</div>
        </div>
      </div>

      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Posting Schedule</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <div>
              <strong>Post Frequency</strong>
              <p className="text-secondary">How often to post per day</p>
            </div>
            <select 
              className="input" 
              value={settings.frequency}
              onChange={(e) => handleSettingChange('frequency', parseInt(e.target.value))}
            >
              <option value="1">1 time per day</option>
              <option value="2">2 times per day</option>
              <option value="3">3 times per day</option>
              <option value="4">4 times per day</option>
              <option value="5">5 times per day</option>
            </select>
          </div>

          <div className="setting-item">
            <div>
              <strong>Use Best Times</strong>
              <p className="text-secondary">Post at optimal engagement times</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.useBestTimes}
                onChange={(e) => handleSettingChange('useBestTimes', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <strong>AI Content Generation</strong>
              <p className="text-secondary">Auto-generate post content with AI</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.aiGenerate}
                onChange={(e) => handleSettingChange('aiGenerate', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <strong>Auto Schedule</strong>
              <p className="text-secondary">Automatically schedule generated posts</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.autoSchedule}
                onChange={(e) => handleSettingChange('autoSchedule', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <strong>Weekdays Only</strong>
              <p className="text-secondary">Skip posting on weekends</p>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.weekdaysOnly}
                onChange={(e) => handleSettingChange('weekdaysOnly', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div>
              <strong>Minimum Interval</strong>
              <p className="text-secondary">Hours between posts</p>
            </div>
            <input 
              type="number" 
              className="input" 
              min="1" 
              max="24"
              value={settings.minInterval}
              onChange={(e) => handleSettingChange('minInterval', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Target Platforms</h2>
        <div className="platforms-grid">
          {['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube'].map(platform => (
            <div 
              key={platform} 
              className={`platform-chip ${settings.platforms.includes(platform) ? 'active' : ''}`}
              onClick={() => handlePlatformToggle(platform)}
            >
              <span className="platform-icon">{
                platform === 'facebook' ? '📘' :
                platform === 'twitter' ? '🐦' :
                platform === 'linkedin' ? '💼' :
                platform === 'instagram' ? '📷' :
                platform === 'tiktok' ? '🎵' :
                '📹'
              }</span>
              <span className="platform-name">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              {settings.platforms.includes(platform) && <span className="check-icon">✓</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Content Types</h2>
        <div className="content-types-grid">
          {[
            { id: 'promotional', label: 'Promotional', desc: 'Product launches, sales, offers' },
            { id: 'educational', label: 'Educational', desc: 'Tips, how-tos, tutorials' },
            { id: 'engagement', label: 'Engagement', desc: 'Questions, polls, discussions' },
            { id: 'news', label: 'News', desc: 'Industry news, updates' },
            { id: 'entertainment', label: 'Entertainment', desc: 'Fun content, memes' },
            { id: 'testimonial', label: 'Testimonials', desc: 'Customer reviews, success stories' }
          ].map(type => (
            <div 
              key={type.id}
              className={`content-type-card ${settings.contentTypes.includes(type.id) ? 'active' : ''}`}
              onClick={() => handleContentTypeToggle(type.id)}
            >
              <div className="type-header">
                <strong>{type.label}</strong>
                {settings.contentTypes.includes(type.id) && <span className="check-icon">✓</span>}
              </div>
              <p className="text-secondary">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => loadSettings()}>
          Reset Changes
        </button>
        <button className="btn btn-primary" onClick={saveSettings} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default AutoPilot;
