import React, { useState, useEffect } from 'react';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import { useAuthStore } from '../store/authStore';
import './BusinessProfile.css';

function BusinessProfile() {
  const user = useAuthStore((state) => state.user);
  const { profile, loadProfile, saveProfile, loading } = useBusinessProfileStore();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    website: '',
    description: '',
    target_audience: '',
    brand_voice: { tone: 'professional', keywords: [] },
  });

  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadProfile(user.id);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || '',
        industry: profile.industry || '',
        website: profile.website || '',
        description: profile.description || '',
        target_audience: profile.target_audience || '',
        brand_voice: profile.brand_voice || { tone: 'professional', keywords: [] },
      });
    }
  }, [profile]);

  const industries = ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate', 'Other'];
  const tones = ['Professional', 'Casual', 'Friendly', 'Humorous', 'Inspiring'];

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.brand_voice.keywords.includes(newKeyword.trim())) {
      setFormData({ 
        ...formData, 
        brand_voice: {
          ...formData.brand_voice,
          keywords: [...formData.brand_voice.keywords, newKeyword.trim()]
        }
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({ 
      ...formData, 
      brand_voice: {
        ...formData.brand_voice,
        keywords: formData.brand_voice.keywords.filter(k => k !== keyword)
      }
    });
  };

  const handleSave = async () => {
    if (!formData.business_name || !formData.industry) {
      setMessage({ type: 'error', text: 'Business name and industry are required' });
      return;
    }

    const result = await saveProfile(user?.id, formData);
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const calculateProgress = () => {
    let completed = 0;
    if (formData.business_name) completed++;
    if (formData.industry) completed++;
    if (formData.description) completed++;
    if (formData.target_audience) completed++;
    if (formData.brand_voice.keywords.length > 0) completed++;
    return Math.round((completed / 5) * 100);
  };

  return (
    <div className="business-profile-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Business Profile</h1>
          <p className="text-secondary mt-2">Tell us about your business to personalize your experience</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          {loading ? '💾 Saving...' : '💾 Save Profile'}
        </button>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="profile-grid">
        {/* Main Form */}
        <div className="profile-main">
          {/* Basic Information */}
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Business Name *</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Your Company Name"
                  value={formData.business_name}
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                />
              </div>
              <div className="form-field">
                <label>Industry *</label>
                <select 
                  className="input"
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                >
                  <option value="">Select Industry</option>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Website</label>
                <input 
                  type="url" 
                  className="input" 
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
              <div className="form-field full-width">
                <label>Business Description</label>
                <textarea 
                  className="input" 
                  rows="4"
                  placeholder="Tell us about your business, products, and services..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Brand Voice */}
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Brand Voice</h2>
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Target Audience</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g., Small business owners, Marketing professionals..."
                  value={formData.target_audience}
                  onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                />
              </div>
              <div className="form-field full-width">
                <label>Tone of Voice</label>
                <div className="tone-grid">
                  {tones.map(tone => (
                    <button
                      key={tone}
                      className={`tone-card ${formData.brand_voice.tone === tone.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, brand_voice: {...formData.brand_voice, tone: tone.toLowerCase()}})}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Keywords */}
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Brand Keywords</h2>
            <p className="text-secondary mb-4">Add keywords that represent your brand (used for AI content generation)</p>
            <div className="keyword-input-group">
              <input 
                type="text"
                className="input"
                placeholder="Enter a keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <button className="btn btn-primary" onClick={addKeyword}>Add</button>
            </div>
            <div className="keywords-display">
              {formData.brand_voice.keywords.map(keyword => (
                <div key={keyword} className="keyword-tag">
                  <span>{keyword}</span>
                  <button onClick={() => removeKeyword(keyword)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="profile-sidebar">
          {/* Progress Card */}
          <div className="section-card">
            <h3 className="text-xl font-semibold mb-4">Profile Completion</h3>
            <div className="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-default)" strokeWidth="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-500)" strokeWidth="8" 
                  strokeDasharray="283" strokeDashoffset="113" transform="rotate(-90 50 50)"/>
              </svg>
              <div className="progress-text">{calculateProgress()}%</div>
            </div>
            <div className="progress-items">
              <div className="progress-item complete">✓ Basic Information</div>
              <div className="progress-item complete">✓ Brand Voice</div>
              <div className="progress-item">○ Social Accounts</div>
              <div className="progress-item">○ Payment Method</div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="section-card">
            <h3 className="text-xl font-semibold mb-4">💡 Pro Tips</h3>
            <ul className="tips-list">
              <li>Complete your profile to unlock AI features</li>
              <li>Keywords improve content quality</li>
              <li>Update tone to match your brand</li>
              <li>Connect social accounts for analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfile;
