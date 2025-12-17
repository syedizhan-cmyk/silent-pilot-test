import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import './ContentLibrary.css';

function ContentLibrary() {
  const user = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.id) {
      loadMedia();
    }
  }, [user]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      // Load both media library and scheduled posts
      const [mediaResult, postsResult] = await Promise.all([
        supabase
          .from('media_library')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('scheduled_content')
          .select('*')
          .eq('user_id', user.id)
          .order('scheduled_for', { ascending: true })
      ]);

      if (mediaResult.error) throw mediaResult.error;
      
      // Transform media library items
      const mediaItems = (mediaResult.data || []).map(item => ({
        id: item.id,
        title: item.file_name,
        type: item.file_type?.startsWith('image/') ? 'image' : item.file_type?.startsWith('video/') ? 'video' : 'file',
        platform: 'Media Library',
        status: 'published',
        date: new Date(item.created_at).toLocaleDateString(),
        thumbnail: item.file_url,
        views: 0,
        engagement: 0,
        source: 'media'
      }));
      
      // Transform scheduled posts
      const postItems = (postsResult.data || []).map(item => ({
        id: item.id,
        title: item.content.substring(0, 50) + '...',
        type: 'post',
        platform: item.platform || 'social',
        status: item.status || 'scheduled',
        date: new Date(item.scheduled_for).toLocaleDateString(),
        scheduledFor: item.scheduled_for,
        content: item.content,
        thumbnail: '📝',
        views: 0,
        engagement: 0,
        source: 'autopilot'
      }));
      
      // Combine and sort by date
      const allItems = [...mediaItems, ...postItems].sort((a, b) => {
        const dateA = new Date(a.scheduledFor || a.date);
        const dateB = new Date(b.scheduledFor || b.date);
        return dateB - dateA;
      });
      
      setContentItems(allItems);
      console.log(`Loaded ${mediaItems.length} media items and ${postItems.length} scheduled posts`);
    } catch (error) {
      console.error('Error loading content:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, source) => {
    if (window.confirm(`Delete this ${source === 'autopilot' ? 'post' : 'media'}?`)) {
      try {
        const table = source === 'autopilot' ? 'scheduled_content' : 'media_library';
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);

        if (error) throw error;
        setMessage({ type: 'success', text: `${source === 'autopilot' ? 'Post' : 'Media'} deleted!` });
        loadMedia();
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }
  };

  const handleEdit = (item) => {
    if (item.source === 'autopilot') {
      // For scheduled posts, show content in alert (can be enhanced to modal)
      alert(`Edit Post:\n\nPlatform: ${item.platform}\nScheduled: ${item.date}\n\nContent:\n${item.content}`);
    } else {
      setMessage({ type: 'info', text: 'Media editing coming soon!' });
    }
  };

  const handleView = (item) => {
    if (item.source === 'autopilot') {
      alert(`Post Details:\n\nPlatform: ${item.platform}\nStatus: ${item.status}\nScheduled: ${item.date}\n\nContent:\n${item.content}`);
    } else if (item.thumbnail.startsWith('http')) {
      window.open(item.thumbnail, '_blank');
    } else {
      setMessage({ type: 'info', text: 'Preview not available' });
    }
  };


  const filteredContent = contentItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: 247,
    blogs: 89,
    images: 124,
    videos: 34
  };

  return (
    <div className="content-library-v2">
      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="cl-header">
        <div className="cl-header-content">
          <h1>Content Library</h1>
          <p>Manage all your marketing content in one place</p>
        </div>
        <button className="btn-primary">
          <span className="btn-icon">+</span>
          Upload Content
        </button>
      </div>

      {/* Stats Cards */}
      <div className="cl-stats">
        <div className="stat-card">
          <div className="stat-icon gradient-blue">📚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-purple">📝</div>
          <div className="stat-info">
            <div className="stat-value">{stats.blogs}</div>
            <div className="stat-label">Blog Posts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-pink">🖼️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.images}</div>
            <div className="stat-label">Images</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gradient-orange">🎥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.videos}</div>
            <div className="stat-label">Videos</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="cl-controls">
        <div className="cl-filters">
          <button 
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-chip ${filter === 'blog' ? 'active' : ''}`}
            onClick={() => setFilter('blog')}
          >
            Blogs
          </button>
          <button 
            className={`filter-chip ${filter === 'video' ? 'active' : ''}`}
            onClick={() => setFilter('video')}
          >
            Videos
          </button>
          <button 
            className={`filter-chip ${filter === 'image' ? 'active' : ''}`}
            onClick={() => setFilter('image')}
          >
            Images
          </button>
          <button 
            className={`filter-chip ${filter === 'template' ? 'active' : ''}`}
            onClick={() => setFilter('template')}
          >
            Templates
          </button>
        </div>

        <div className="cl-actions">
          <div className="search-input">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search content..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="view-switcher">
            <button 
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
              title="Grid view"
            >
              ◫
            </button>
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      {view === 'grid' ? (
        <div className="content-grid">
          {filteredContent.map(item => (
            <div key={item.id} className="content-item">
              <div className="content-thumbnail">
                <div className="thumbnail-bg">
                  <span className="thumbnail-emoji">{item.thumbnail}</span>
                </div>
                <div className="content-hover">
                  <button className="action-btn" onClick={() => handleView(item)} title="View">👁️</button>
                  <button className="action-btn" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                  <button className="action-btn" onClick={() => handleDelete(item.id, item.source)} title="Delete">🗑️</button>
                </div>
                <span className={`status-badge ${item.status}`}>{item.status}</span>
              </div>
              <div className="content-details">
                <h4>{item.title}</h4>
                <div className="content-meta">
                  <span className="platform-tag">{item.platform}</span>
                  <span className="content-date">{item.date}</span>
                </div>
                {item.status === 'published' && (
                  <div className="content-stats">
                    <span>👁️ {item.views}</span>
                    <span>❤️ {item.engagement}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-list">
          {filteredContent.map(item => (
            <div key={item.id} className="list-item">
              <div className="list-thumbnail">
                <span>{item.thumbnail}</span>
              </div>
              <div className="list-content">
                <h4>{item.title}</h4>
                <div className="list-meta">
                  <span className="platform-tag">{item.platform}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  {item.status === 'published' && (
                    <>
                      <span>•</span>
                      <span>👁️ {item.views} views</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`status-badge ${item.status}`}>{item.status}</span>
              <div className="list-actions">
                <button className="icon-btn" onClick={() => handleView(item)} title="View">👁️</button>
                <button className="icon-btn" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                <button className="icon-btn delete" onClick={() => handleDelete(item.id, item.source)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContent.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No content found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}

export default ContentLibrary;
