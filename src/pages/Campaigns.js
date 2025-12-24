import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import './Campaigns.css';

function Campaigns() {
  const user = useAuthStore((state) => state.user);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'social',
    status: 'draft',
    budget: 0,
    start_date: '',
    end_date: '',
    description: '',
    platforms: []
  });

  useEffect(() => {
    if (user?.id) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type) {
      setMessage({ type: 'error', text: 'Name and type are required' });
      return;
    }

    try {
      if (editingCampaign) {
        const { error } = await supabase
          .from('campaigns')
          .update(formData)
          .eq('id', editingCampaign.id);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Campaign updated!' });
      } else {
        const { error } = await supabase
          .from('campaigns')
          .insert([{ ...formData, user_id: user.id }]);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Campaign created!' });
      }

      setShowModal(false);
      setEditingCampaign(null);
      setFormData({ name: '', type: 'social', status: 'draft', budget: 0, start_date: '', end_date: '', description: '', platforms: [] });
      loadCampaigns();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this campaign?')) {
      try {
        const { error } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        setMessage({ type: 'success', text: 'Campaign deleted!' });
        loadCampaigns();
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData(campaign);
    setShowModal(true);
  };

  return (
    <div className="campaigns-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            <Target className="header-icon" size={32} />
            Campaigns
          </h1>
          <p className="text-secondary mt-2">Manage your marketing campaigns</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingCampaign(null);
          setFormData({ name: '', type: 'social', status: 'draft', budget: 0, start_date: '', end_date: '', description: '', platforms: [] });
          setShowModal(true);
        }}>
          + New Campaign
        </button>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No campaigns yet</h3>
          <p>Create your first marketing campaign</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Campaign</button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-card">
              <div className="card-header">
                <h3>{campaign.name}</h3>
                <span className={`badge badge-${campaign.status === 'active' ? 'success' : campaign.status === 'completed' ? 'info' : 'primary'}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Type:</strong> {campaign.type}</p>
                <p><strong>Budget:</strong> ${campaign.budget}</p>
                {campaign.start_date && <p><strong>Starts:</strong> {new Date(campaign.start_date).toLocaleDateString()}</p>}
              </div>
              <div className="card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(campaign)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(campaign.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCampaign ? 'Edit' : 'Create'} Campaign</h2>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>Campaign Name</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-field">
                <label>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="social">Social Media</option>
                  <option value="email">Email</option>
                  <option value="ads">Paid Ads</option>
                  <option value="content">Content Marketing</option>
                </select>
              </div>
              <div className="form-field">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-field">
                <label>Budget ($)</label>
                <input type="number" value={formData.budget} onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;
