import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || getMockNotifications());
      } else {
        setNotifications(getMockNotifications());
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = () => {
    return [
      {
        id: 1,
        type: 'success',
        title: 'Post Published Successfully',
        message: 'Your LinkedIn post "Marketing Tips for 2024" has been published.',
        time: '5 minutes ago',
        read: false,
        icon: '✅'
      },
      {
        id: 2,
        type: 'info',
        title: 'Scheduled Post Reminder',
        message: 'You have 3 posts scheduled for tomorrow.',
        time: '1 hour ago',
        read: false,
        icon: '📅'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Twitter Connection Expired',
        message: 'Please reconnect your Twitter account to continue posting.',
        time: '3 hours ago',
        read: true,
        icon: '⚠️'
      },
      {
        id: 4,
        type: 'success',
        title: 'Campaign Performance Update',
        message: 'Your email campaign reached 45% open rate - above average!',
        time: '1 day ago',
        read: true,
        icon: '📊'
      },
      {
        id: 5,
        type: 'info',
        title: 'New Feature Available',
        message: 'AI Media Studio now supports video generation! Try it out.',
        time: '2 days ago',
        read: true,
        icon: '🎥'
      },
      {
        id: 6,
        type: 'success',
        title: 'Engagement Milestone Reached',
        message: 'Your Instagram post reached 10,000 likes! Great work!',
        time: '3 days ago',
        read: true,
        icon: '🎉'
      }
    ];
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-v2">
      <div className="notif-header">
        <div className="notif-header-content">
          <h1>Notifications</h1>
          <p>Stay updated with your marketing activities</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-primary" onClick={markAllAsRead}>
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      <div className="notif-filters">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span>All</span>
          <span className="tab-count">{notifications.length}</span>
        </button>
        <button 
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          <span>Unread</span>
          {unreadCount > 0 && <span className="tab-count badge">{unreadCount}</span>}
        </button>
        <button 
          className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          <span>Read</span>
          <span className="tab-count">{notifications.length - unreadCount}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : (
        <div className="notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No notifications</h3>
              <p>You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notif-card ${notif.read ? 'read' : 'unread'} ${notif.type}`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                {!notif.read && <div className="unread-dot"></div>}
                <div className="notif-icon-wrapper">
                  <div className={`notif-icon type-${notif.type}`}>
                    {notif.icon}
                  </div>
                </div>
                <div className="notif-content">
                  <div className="notif-top">
                    <h4>{notif.title}</h4>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                  <p>{notif.message}</p>
                </div>
                <button 
                  className="notif-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  title="Delete notification"
                >
                  <span>×</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
