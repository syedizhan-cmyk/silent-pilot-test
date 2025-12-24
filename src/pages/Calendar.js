import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContentStore } from '../store/contentStore';
import { useAuthStore } from '../store/authStore';
import SocialIcon from '../components/SocialIcon';
import './Calendar.css';

function Calendar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const { posts, getPosts, updatePost, deletePost, loading } = useContentStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch posts on component mount
  useEffect(() => {
    if (user?.id) {
      getPosts(user.id);
    }
  }, [user, getPosts]);

  // Handle deep-link from AutoPilot
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId && posts.length > 0) {
      // Find the original post (not the transformed scheduledPosts version)
      const originalPost = posts.find(p => p.id === postId);
      if (originalPost) {
        // Transform to match the format expected by the modal
        const transformedPost = {
          id: originalPost.id,
          platform: originalPost.platform,
          content: originalPost.content,
          date: originalPost.scheduled_for ? new Date(originalPost.scheduled_for).toLocaleDateString() : null,
          time: originalPost.scheduled_for ? new Date(originalPost.scheduled_for).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null,
          status: originalPost.status,
          media: originalPost.image_url,
          // Keep original fields for actions
          scheduled_for: originalPost.scheduled_for,
          image_url: originalPost.image_url
        };
        setSelectedPost(transformedPost);
        setShowModal(true);
      }
    }
  }, [searchParams, posts]);

  // Convert posts to scheduled format
  const scheduledPosts = posts
    .filter(post => post.status === 'scheduled' || post.status === 'draft')
    .map(post => ({
      id: post.id,
      platform: post.platform,
      content: post.content,
      date: post.scheduled_for ? new Date(post.scheduled_for).toISOString().split('T')[0] : null,
      time: post.scheduled_for ? new Date(post.scheduled_for).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null,
      status: post.status,
      media: post.image_url,
      // Keep original fields for modal
      scheduled_for: post.scheduled_for,
      image_url: post.image_url
    }))
    .filter(post => post.date); // Only show posts with dates

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPostsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledPosts.filter(post => post.date === dateStr);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Handle edit post
  const handleEditPost = () => {
    if (selectedPost) {
      navigate(`/dashboard/create?edit=${selectedPost.id}`);
    }
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(selectedPost.id);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Post deleted successfully!' });
        setShowModal(false);
        setSelectedPost(null);
      }
    }
  };

  // Handle post now
  const handlePostNow = async () => {
    if (!selectedPost) return;
    
    if (window.confirm('Are you sure you want to post this now?')) {
      const result = await updatePost(selectedPost.id, {
        status: 'published',
        published_at: new Date().toISOString()
      });
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Post published successfully!' });
        setShowModal(false);
        setSelectedPost(null);
      }
    }
  };

  return (
    <div className="calendar-v2">
      {/* Message Alert */}
      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            <CalendarIcon className="header-icon" size={32} />
            Content Calendar
          </h1>
          <p className="text-secondary mt-2">Plan and schedule your content across all platforms</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard/analytics')}>
            <span>📊</span>
            <span>Analytics</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/create')}>
            <span>+</span>
            <span>New Post</span>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Left Column - Calendar */}
        <div className="calendar-main">
          <div className="section-card">
            {/* Calendar Controls */}
            <div className="calendar-controls">
              <div className="calendar-nav">
                <button className="nav-btn" onClick={previousMonth}>‹</button>
                <h2 className="current-month">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button className="nav-btn" onClick={nextMonth}>›</button>
              </div>
              
              <div className="view-toggles">
                <button 
                  className={`view-btn ${view === 'month' ? 'active' : ''}`}
                  onClick={() => setView('month')}
                >
                  Month
                </button>
                <button 
                  className={`view-btn ${view === 'week' ? 'active' : ''}`}
                  onClick={() => setView('week')}
                >
                  Week
                </button>
                <button 
                  className={`view-btn ${view === 'day' ? 'active' : ''}`}
                  onClick={() => setView('day')}
                >
                  Day
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-container">
              {/* Day Headers */}
              <div className="calendar-weekdays">
                {dayNames.map(day => (
                  <div key={day} className="weekday-header">{day}</div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="calendar-days">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="calendar-day empty"></div>
                ))}

                {/* Actual days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const postsForDay = getPostsForDate(day);
                  const isToday = day === new Date().getDate() && 
                                  currentDate.getMonth() === new Date().getMonth() &&
                                  currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div 
                      key={day} 
                      className={`calendar-day ${isToday ? 'today' : ''} ${postsForDay.length > 0 ? 'has-posts' : ''}`}
                      onClick={() => {
                        if (postsForDay.length > 0) {
                          setSelectedDate({ day, posts: postsForDay });
                          setShowDateModal(true);
                        }
                      }}
                      style={{ cursor: postsForDay.length > 0 ? 'pointer' : 'default' }}
                    >
                      <div className="day-number">{day}</div>
                      {postsForDay.length > 0 && (
                        <div className="day-posts">
                          {postsForDay.slice(0, 3).map(post => (
                            <button
                              key={post.id}
                              className={`day-post-item status-${post.status}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPost(post);
                                setShowModal(true);
                              }}
                              title={`${post.platform} - ${post.status}`}
                            >
                              <SocialIcon platform={post.platform} size={16} />
                              <span className="post-time">{post.time}</span>
                            </button>
                          ))}
                          {postsForDay.length > 3 && (
                            <div className="more-posts">+{postsForDay.length - 3} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-dot scheduled"></div>
                <span>Scheduled</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot published"></div>
                <span>Published</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot draft"></div>
                <span>Draft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Posts */}
        <div className="calendar-sidebar">
          <div className="section-card">
            <div className="section-header">
              <h3 className="text-xl font-semibold">Upcoming Posts</h3>
              <span className="badge badge-primary">{scheduledPosts.length}</span>
            </div>

            <div className="upcoming-list">
              {scheduledPosts.map(post => (
                <div 
                  key={post.id} 
                  className="upcoming-post-card"
                  onClick={() => {
                    setSelectedPost(post);
                    setShowModal(true);
                  }}
                >
                  <div className="post-header">
                    <SocialIcon platform={post.platform} size={24} />
                    <div className="post-meta">
                      <div className="post-date">{post.date}</div>
                      <div className="post-time">{post.time}</div>
                    </div>
                  </div>
                  <p className="post-preview">{post.content}</p>
                  <div className="post-footer">
                    <span className={`status-badge ${post.status}`}>
                      {post.status}
                    </span>
                    {post.media && <span className="media-indicator">📷</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="section-card">
            <h3 className="text-xl font-semibold mb-4">This Month</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-value">24</div>
                <div className="stat-label">Scheduled</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">18</div>
                <div className="stat-label">Published</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">6</div>
                <div className="stat-label">Drafts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Detail Modal - Shows all posts for a selected date */}
      {showDateModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="modal-content date-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Posts for {monthNames[currentDate.getMonth()]} {selectedDate.day}, {currentDate.getFullYear()}</h3>
              <button className="modal-close" onClick={() => setShowDateModal(false)}>×</button>
            </div>
            
            <div className="date-posts-list">
              {selectedDate.posts.length === 0 ? (
                <p className="no-posts">No posts scheduled for this date</p>
              ) : (
                selectedDate.posts.map(post => (
                  <div key={post.id} className={`date-post-item status-${post.status}`}>
                    <div className="post-icon-time">
                      <SocialIcon platform={post.platform} size={24} />
                      <span className="post-time-detail">{post.time}</span>
                      <span className={`status-badge ${post.status}`}>{post.status}</span>
                    </div>
                    <div className="post-content-preview">
                      {post.content.substring(0, 150)}
                      {post.content.length > 150 && '...'}
                    </div>
                    <div className="post-actions">
                      <button 
                        className="btn-small btn-secondary"
                        onClick={() => {
                          setSelectedPost(post);
                          setShowDateModal(false);
                          setShowModal(true);
                        }}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn-small btn-danger"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this post?')) {
                            const result = await deletePost(post.id);
                            if (result.error) {
                              setMessage({ type: 'error', text: result.error });
                            } else {
                              setMessage({ type: 'success', text: 'Post deleted successfully!' });
                              setShowDateModal(false);
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <SocialIcon platform={selectedPost.platform} size={32} />
                <div>
                  <h3>Scheduled Post</h3>
                  <p className="text-secondary">{selectedPost.date} at {selectedPost.time}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="post-content">
                <h4>Content</h4>
                <p>{selectedPost.content}</p>
              </div>

              {selectedPost.media && (
                <div className="post-media">
                  <h4>Media</h4>
                  <div className="media-preview">
                    <img src={selectedPost.media} alt="Post media" />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeletePost}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={handleEditPost}>
                Edit Post
              </button>
              <button className="btn btn-primary" onClick={handlePostNow}>
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
