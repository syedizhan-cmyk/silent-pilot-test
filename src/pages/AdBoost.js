import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import './AdBoost.css';

function AdBoost() {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'facebook',
    objective: 'awareness',
    budget: 50,
    duration: 7,
    audience: '',
    content: ''
  });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCreate = async () => {
    if (!formData.name || !formData.content) {
      setMessage({ type: 'error', text: 'Name and content are required' });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('ad_campaigns')
        .insert([{
          user_id: user?.id,
          ...formData,
          status: 'draft',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Ad campaign created!' });
      setFormData({ name: '', platform: 'facebook', objective: 'awareness', budget: 50, duration: 7, audience: '', content: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="ad-boost-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            <TrendingUp className="header-icon" size={32} />
            Ad Boost
          </h1>
          <p className="text-secondary mt-2">Create and manage paid advertising campaigns</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="ad-form-layout">
        <div className="form-section">
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Campaign Details</h2>
            <div className="form-field">
              <label>Campaign Name</label>
              <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Summer Sale 2024" />
            </div>
            <div className="form-field">
              <label>Platform</label>
              <select value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})}>
                <option value="facebook">Facebook Ads</option>
                <option value="instagram">Instagram Ads</option>
                <option value="google">Google Ads</option>
                <option value="linkedin">LinkedIn Ads</option>
              </select>
            </div>
            <div className="form-field">
              <label>Objective</label>
              <select value={formData.objective} onChange={(e) => setFormData({...formData, objective: e.target.value})}>
                <option value="awareness">Brand Awareness</option>
                <option value="traffic">Website Traffic</option>
                <option value="engagement">Engagement</option>
                <option value="leads">Lead Generation</option>
                <option value="conversions">Conversions</option>
              </select>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Budget & Schedule</h2>
            <div className="form-field">
              <label>Daily Budget ($)</label>
              <input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})} />
            </div>
            <div className="form-field">
              <label>Duration (days)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} />
            </div>
            <div className="budget-summary">
              <strong>Total Budget:</strong> ${formData.budget * formData.duration}
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Ad Content</h2>
            <div className="form-field">
              <label>Ad Copy</label>
              <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows="4" placeholder="Write your ad copy..."></textarea>
            </div>
            <div className="form-field">
              <label>Target Audience</label>
              <input value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} placeholder="e.g., Business owners, 25-45" />
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating...' : '🚀 Create Campaign'}
          </button>
        </div>

        <div className="preview-section">
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Preview</h2>
            <div className="ad-preview">
              <div className="preview-platform">{formData.platform}</div>
              <div className="preview-content">
                <p>{formData.content || 'Your ad copy will appear here...'}</p>
              </div>
              <div className="preview-stats">
                <span>Budget: ${formData.budget}/day</span>
                <span>Duration: {formData.duration} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdBoost;
