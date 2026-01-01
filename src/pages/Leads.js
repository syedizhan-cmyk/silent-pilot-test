import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useLeadsStore } from '../store/leadsStore';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import './Leads.css';

function Leads() {
  const { confirm } = useConfirm();
  const user = useAuthStore((state) => state.user);
  const { leads, getLeads, addLead, updateLead, deleteLead, updateLeadStatus, loading } = useLeadsStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    company: '',
    source: '',
    phone: '',
    notes: '',
    status: 'cold',
    score: 0
  });

  useEffect(() => {
    if (user?.id) {
      getLeads(user.id);
    }
  }, [user, getLeads]);

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter;
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast.error('Name and email are required');
      return;
    }

    const result = await addLead(user?.id, newLead);
    if (!result.error) {
      setShowAddModal(false);
      setNewLead({
        name: '',
        email: '',
        company: '',
        source: '',
        phone: '',
        notes: '',
        status: 'cold',
        score: 0
      });
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    await updateLeadStatus(leadId, newStatus);
  };

  const handleDelete = async (leadId) => {
    const confirmed = await confirm({      title: 'Delete Lead?',      message: 'Are you sure you want to delete this lead?\n\nThis action cannot be undone.',      confirmText: 'Delete',      cancelText: 'Cancel'    });    if (confirmed) {
      await deleteLead(leadId);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setNewLead(lead);
    setShowAddModal(true);
  };

  const handleUpdate = async () => {
    if (editingLead) {
      const result = await updateLead(editingLead.id, newLead);
      if (!result.error) {
        setShowAddModal(false);
        setEditingLead(null);
        setNewLead({
          name: '',
          email: '',
          company: '',
          source: '',
          phone: '',
          notes: '',
          status: 'cold',
          score: 0
        });
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Source', 'Phone', 'Status', 'Score'];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.company || '',
      lead.source || '',
      lead.phone || '',
      lead.status,
      lead.score
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'hot': return 'badge-hot';
      case 'warm': return 'badge-warm';
      case 'cold': return 'badge-cold';
      default: return 'badge-cold';
    }
  };

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'hot').length,
    warm: leads.filter(l => l.status === 'warm').length,
    cold: leads.filter(l => l.status === 'cold').length,
  };

  return (
    <div className="leads-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            <Users className="header-icon" size={32} />
            Leads
          </h1>
          <p className="text-secondary mt-2">Manage and track your leads</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportToCSV}>
            📊 Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => {
            setEditingLead(null);
            setNewLead({
              name: '',
              email: '',
              company: '',
              source: '',
              phone: '',
              notes: '',
              status: 'cold',
              score: 0
            });
            setShowAddModal(true);
          }}>
            + Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        <div className="stat-card hot">
          <div className="stat-value">{stats.hot}</div>
          <div className="stat-label">🔥 Hot</div>
        </div>
        <div className="stat-card warm">
          <div className="stat-value">{stats.warm}</div>
          <div className="stat-label">🟡 Warm</div>
        </div>
        <div className="stat-card cold">
          <div className="stat-value">{stats.cold}</div>
          <div className="stat-label">❄️ Cold</div>
        </div>
      </div>

      {/* Filters */}
      <div className="leads-controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({leads.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'hot' ? 'active' : ''}`}
            onClick={() => setFilter('hot')}
          >
            🔥 Hot ({stats.hot})
          </button>
          <button 
            className={`filter-tab ${filter === 'warm' ? 'active' : ''}`}
            onClick={() => setFilter('warm')}
          >
            🟡 Warm ({stats.warm})
          </button>
          <button 
            className={`filter-tab ${filter === 'cold' ? 'active' : ''}`}
            onClick={() => setFilter('cold')}
          >
            ❄️ Cold ({stats.cold})
          </button>
        </div>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="section-card">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No leads found</h3>
            <p>Start adding leads to track your prospects</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              + Add Your First Lead
            </button>
          </div>
        ) : (
          <div className="leads-table">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Company</span>
              <span>Source</span>
              <span>Score</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="table-row">
                <span className="font-semibold">{lead.name}</span>
                <span className="text-secondary">{lead.email}</span>
                <span>{lead.company || '-'}</span>
                <span>{lead.source || '-'}</span>
                <span className="score">{lead.score}/100</span>
                <span>
                  <select 
                    className={`status-select ${getStatusColor(lead.status)}`}
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                  >
                    <option value="hot">🔥 Hot</option>
                    <option value="warm">🟡 Warm</option>
                    <option value="cold">❄️ Cold</option>
                  </select>
                </span>
                <span className="actions">
                  <button className="action-btn" onClick={() => handleEdit(lead)} title="Edit">✏️</button>
                  <button className="action-btn delete" onClick={() => handleDelete(lead.id)} title="Delete">🗑️</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-field">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="form-field">
                  <label>Company</label>
                  <input 
                    type="text" 
                    value={newLead.company}
                    onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                    placeholder="Tech Corp"
                  />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="form-field">
                  <label>Source</label>
                  <select 
                    value={newLead.source}
                    onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                  >
                    <option value="">Select source...</option>
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select 
                    value={newLead.status}
                    onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                  >
                    <option value="cold">❄️ Cold</option>
                    <option value="warm">🟡 Warm</option>
                    <option value="hot">🔥 Hot</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label>Notes</label>
                  <textarea 
                    value={newLead.notes}
                    onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                    placeholder="Additional notes about this lead..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={editingLead ? handleUpdate : handleAddLead}>
                {editingLead ? 'Update Lead' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;
