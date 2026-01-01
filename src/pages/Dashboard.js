import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';
import { useLeadsStore } from '../store/leadsStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Users,
  PenSquare,
  Calendar,
  Sparkles,
  Image as ImageIcon,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingDown
} from 'lucide-react';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { posts } = useContentStore();
  const { leads } = useLeadsStore();

  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    totalEngagement: 0,
    growthRate: 0
  });

  useEffect(() => {
    if (user) {
      const totalPosts = posts.length;
      const scheduledPosts = posts.filter(p => p.scheduled_for && new Date(p.scheduled_for) > new Date()).length;
      
      setAnalytics({
        totalPosts,
        scheduledPosts,
        totalEngagement: 12458,
        growthRate: 15.3
      });
    }
  }, [user, posts]);

  const stats = [
    {
      title: 'Total Posts',
      value: analytics.totalPosts,
      icon: <BarChart3 size={24} />,
      trend: 8.2,
      color: 'blue'
    },
    {
      title: 'Scheduled',
      value: analytics.scheduledPosts,
      icon: <Clock size={24} />,
      trend: 12.5,
      color: 'purple'
    },
    {
      title: 'Total Engagement',
      value: analytics.totalEngagement,
      icon: <TrendingUp size={24} />,
      trend: analytics.growthRate,
      color: 'green'
    },
    {
      title: 'Growth Rate',
      value: `${analytics.growthRate}%`,
      icon: <Users size={24} />,
      trend: 3.1,
      color: 'pink'
    }
  ];

  const quickActions = [
    {
      icon: <PenSquare size={24} />,
      title: 'Create Post',
      description: 'Write and publish new content',
      color: 'blue',
      route: '/dashboard/create'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'AI Generate',
      description: 'Let AI create content for you',
      color: 'purple',
      route: '/dashboard/create'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Schedule Post',
      description: 'Plan your content calendar',
      color: 'green',
      route: '/dashboard/calendar'
    },
    {
      icon: <ImageIcon size={24} />,
      title: 'Media Library',
      description: 'Browse your media assets',
      color: 'pink',
      route: '/dashboard/content-library'
    }
  ];

  const recentPosts = posts
    .filter(p => p.published_at || p.created_at)
    .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
    .slice(0, 3)
    .map(post => ({
      id: post.id,
      content: post.content,
      platforms: [post.platform],
      publishedAt: new Date(post.published_at || post.created_at),
      analytics: {
        views: Math.floor(Math.random() * 15000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 150)
      }
    }));

  const upcomingPosts = posts
    .filter(p => p.scheduled_for && new Date(p.scheduled_for) > new Date())
    .sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for))
    .slice(0, 3)
    .map(post => ({
      id: post.id,
      content: post.content,
      platforms: [post.platform],
      scheduledFor: new Date(post.scheduled_for)
    }));

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatDateTime = (date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `in ${hours}h`;
    const days = Math.floor(hours / 24);
    return `in ${days}d`;
  };

  const platformIcons = {
    twitter: { icon: <Twitter size={16} />, class: 'platform-twitter' },
    linkedin: { icon: <Linkedin size={16} />, class: 'platform-linkedin' },
    facebook: { icon: <Facebook size={16} />, class: 'platform-facebook' },
    instagram: { icon: <Instagram size={16} />, class: 'platform-instagram' }
  };

  return (
    <div className="dashboard-v3">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back! 👋</h1>
        <p>Here's what's happening with your social media today</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-v3">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card-v3 stat-card-${stat.color}`}>
            <div className="stat-card-header">
              <div className={`stat-icon-wrapper stat-icon-${stat.color}`}>
                {stat.icon}
              </div>
              {stat.trend !== undefined && (
                <div className={`stat-trend ${stat.trend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {stat.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-v3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className={`action-card action-card-${action.color}`}
            onClick={() => navigate(action.route)}
          >
            <div className="action-icon">{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </button>
        ))}
      </div>

      {/* Charts and Upcoming Posts */}
      <div className="content-grid-v3">
        <div className="chart-section">
          <AnalyticsChart posts={posts} />
        </div>
        <div className="upcoming-section">
          <div className="section-card">
            <div className="section-header">
              <h2>Upcoming Posts</h2>
              <Clock size={20} className="header-icon" />
            </div>
            <div className="upcoming-list">
              {upcomingPosts.length > 0 ? (
                upcomingPosts.map((post) => (
                  <div key={post.id} className="upcoming-item">
                    <p className="upcoming-content">{post.content.substring(0, 80)}...</p>
                    <div className="upcoming-footer">
                      <div className="platform-icons">
                        {post.platforms.map((platform) => (
                          <div key={platform} className={`platform-icon ${platformIcons[platform]?.class || ''}`}>
                            {platformIcons[platform]?.icon}
                          </div>
                        ))}
                      </div>
                      <span className="upcoming-time">{formatDateTime(post.scheduledFor)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No upcoming posts scheduled</p>
              )}
            </div>
            <button className="view-all-btn" onClick={() => navigate('/dashboard/calendar')}>
              View All Scheduled Posts
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="section-card">
        <div className="section-header">
          <h2>Recent Posts</h2>
          <button className="view-all-link" onClick={() => navigate('/dashboard/analytics')}>
            View All
          </button>
        </div>
        <div className="recent-posts-grid">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <div key={post.id} className="recent-post-card">
                <p className="post-content">{post.content}</p>
                <div className="post-platforms">
                  {post.platforms.map((platform) => (
                    <div key={platform} className={`platform-badge ${platformIcons[platform]?.class || ''}`}>
                      {platformIcons[platform]?.icon}
                    </div>
                  ))}
                  <span className="post-date">{formatDate(post.publishedAt)}</span>
                </div>
                <div className="post-analytics">
                  <div className="analytics-item">
                    <Eye size={16} />
                    <span>{formatNumber(post.analytics.views)}</span>
                  </div>
                  <div className="analytics-item">
                    <Heart size={16} />
                    <span>{formatNumber(post.analytics.likes)}</span>
                  </div>
                  <div className="analytics-item">
                    <MessageCircle size={16} />
                    <span>{formatNumber(post.analytics.comments)}</span>
                  </div>
                  <div className="analytics-item">
                    <Share2 size={16} />
                    <span>{formatNumber(post.analytics.shares)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No recent posts to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
