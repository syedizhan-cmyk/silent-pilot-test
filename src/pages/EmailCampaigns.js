import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEmailCampaignsStore } from '../store/emailCampaignsStore';
import './EmailCampaigns.css';

function EmailCampaigns() {
  const user = useAuthStore((state) => state.user);
  const { campaigns, getCampaigns, createCampaign, updateCampaign, deleteCampaign, loading } = useEmailCampaignsStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: '',
    status: 'draft'
  });

  useEffect(() => {
    if (user?.id) {
      getCampaigns(user.id);
    }
  }, [user, getCampaigns]);

  const handleSave = async () => {
    if (!formData.name || !formData.subject) {
      setMessage({ type: 'error', text: 'Name and subject are required' });
      return;
    }

    let result;
    if (editingCampaign) {
      result = await updateCampaign(editingCampaign.id, formData);
    } else {
      result = await createCampaign(user?.id, formData);
    }

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: editingCampaign ? 'Campaign updated!' : 'Campaign created!' });
      setShowModal(false);
      setEditingCampaign(null);
      setFormData({ name: '', subject: '', content: '', recipients: '', status: 'draft' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this campaign?')) {
      const result = await deleteCampaign(id);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Campaign deleted!' });
      }
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData(campaign);
    setShowModal(true);
  };

  return (
    <div className="email-campaigns-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Email Campaigns</h1>
          <p className="text-secondary mt-2">Create and manage email campaigns</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingCampaign(null);
          setFormData({ name: '', subject: '', content: '', recipients: '', status: 'draft' });
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
          <div className="empty-icon">📧</div>
          <h3>No campaigns yet</h3>
          <p>Create your first email campaign</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Campaign</button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((c) => (
            <div key={c.id} className="campaign-card">
              <h3>{c.name}</h3>
              <div className="campaign-stats">
                <div className="stat"><span className="label">Sent:</span><span className="value">{c.sent || 0}</span></div>
                <div className="stat"><span className="label">Opens:</span><span className="value">{c.opens || '0%'}</span></div>
                <div className="stat"><span className="label">Clicks:</span><span className="value">{c.clicks || '0%'}</span></div>
              </div>
              <span className={`badge badge-${c.status === 'sent' ? 'success' : 'primary'}`}>{c.status}</span>
              <div className="card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(c)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
                <label>Subject Line</label>
                <input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="form-field">
                <label>Email Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows="6"></textarea>
              </div>
              <div className="form-field">
                <label>Recipients (emails, comma separated)</label>
                <input value={formData.recipients} onChange={(e) => setFormData({...formData, recipients: e.target.value})} placeholder="email1@example.com, email2@example.com" />
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

export default EmailCampaigns;
