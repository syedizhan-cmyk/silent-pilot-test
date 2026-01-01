import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';
import { useLeadsStore } from '../store/leadsStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { LayoutDashboard } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { posts, getPosts } = useContentStore();
  const { leads, getLeads } = useLeadsStore();
  const { getAnalyticsSummary } = useAnalyticsStore();
  
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user, timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      getPosts(user.id),
      getLeads(user.id),
      loadAnalytics()
    ]);
    setLoading(false);
  };

  const loadAnalytics = async () => {
    const result = await getAnalyticsSummary(user.id, timeRange === '7d' ? '7days' : timeRange === '30d' ? '30days' : '90days');
    if (result.data) {
      setAnalyticsData(result.data);
    }
  };

  // Calculate real stats
  const totalPosts = posts.length;
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const totalLeads = leads.length;
  const engagementRate = analyticsData?.avgEngagementRate || 0;

  const stats = [
    { 
      label: 'Total Posts', 
      value: totalPosts.toString(), 
      change: scheduledPosts > 0 ? `+${scheduledPosts} scheduled` : 'No scheduled posts', 
      trend: 'up',
      icon: '📝',
      color: 'primary'
    },
    { 
      label: 'Engagement Rate', 
      value: `${engagementRate.toFixed(1)}%`, 
      change: engagementRate > 5 ? 'Above average' : 'Building momentum', 
      trend: engagementRate > 5 ? 'up' : 'neutral',
      icon: '💬',
      color: 'success'
    },
    { 
      label: 'Published', 
      value: publishedPosts.toString(), 
      change: `${((publishedPosts/Math.max(totalPosts, 1))*100).toFixed(0)}% of total`, 
      trend: 'up',
      icon: '🚀',
      color: 'info'
    },
    { 
      label: 'Leads Generated', 
      value: totalLeads.toString(), 
      change: leads.filter(l => l.status === 'hot').length + ' hot leads', 
      trend: 'up',
      icon: '👥',
      color: 'accent'
    }
  ];

  // Get real recent activity from posts and leads
  const recentActivity = [];
  
  // Add recent posts
  const recentPosts = posts
    .filter(p => p.published_at || p.created_at)
    .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
    .slice(0, 2);
  
  recentPosts.forEach(post => {
    const date = new Date(post.published_at || post.created_at);
    const timeAgo = getTimeAgo(date);
    recentActivity.push({
      type: 'post',
      platform: post.platform.charAt(0).toUpperCase() + post.platform.slice(1),
      content: post.content.substring(0, 50) + '...',
      time: timeAgo,
      avatar: getPlatformIcon(post.platform),
      color: 'info'
    });
  });

  // Add recent leads
  const recentLeads = leads
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);
  
  recentLeads.forEach(lead => {
    const date = new Date(lead.created_at);
    const timeAgo = getTimeAgo(date);
    recentActivity.push({
      type: 'lead',
      platform: 'Lead',
      content: `New lead: ${lead.name}${lead.company ? ` from ${lead.company}` : ''}`,
      time: timeAgo,
      avatar: '👤',
      color: 'accent'
    });
  });

  // Helper function
  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  function getPlatformIcon(platform) {
    const icons = {
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      linkedin: '💼',
      tiktok: '🎵',
      youtube: '📹'
    };
    return icons[platform?.toLowerCase()] || '📝';
  }

  // Get real upcoming posts
  const upcomingPosts = posts
    .filter(p => p.status === 'scheduled' && p.scheduled_for)
    .sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for))
    .slice(0, 5)
    .map(post => {
      const scheduledDate = new Date(post.scheduled_for);
      const formattedDate = scheduledDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
      
      return {
        platform: post.platform.charAt(0).toUpperCase() + post.platform.slice(1),
        content: post.content.substring(0, 50) + '...',
        scheduled: formattedDate,
        icon: getPlatformIcon(post.platform),
        color: 'info'
      };
    });

  const quickActions = [
    { icon: '✍️', label: 'Create Post', route: '/dashboard/create', color: 'primary' },
    { icon: '📧', label: 'Send Email', route: '/dashboard/email-campaigns', color: 'success' },
    { icon: '📊', label: 'Analytics', route: '/dashboard/analytics', color: 'info' },
    { icon: '🔍', label: 'SEO Audit', route: '/dashboard/seo', color: 'warning' },
    { icon: '🤖', label: 'AI Studio', route: '/dashboard/ai-media', color: 'accent' },
    { icon: '🚀', label: 'Auto Pilot', route: '/dashboard/autopilot', color: 'primary' }
  ];

  return (
    <div className="dashboard-v2">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            <LayoutDashboard className="header-icon" size={32} />
            Dashboard
          </h1>
          <p className="text-secondary mt-2">Welcome back! Here's what's happening with your marketing.</p>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            className="time-range-selector"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard/create')}>
            <span>✨</span>
            <span>Create Content</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-card-${stat.color}`}>
            <div className="stat-card-header">
              <div className="stat-icon">{stat.icon}</div>
              <div className={`stat-change ${stat.trend}`}>
                <span className="change-arrow">{stat.trend === 'up' ? '↑' : '↓'}</span>
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-sparkline"></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="text-2xl font-semibold">Quick Actions</h2>
          <p className="text-secondary">Get started with these common tasks</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button 
              key={index} 
              className="quick-action-card"
              onClick={() => navigate(action.route)}
            >
              <div className={`action-icon-wrapper icon-${action.color}`}>
                <span className="action-icon">{action.icon}</span>
              </div>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="section-card">
          <div className="section-header">
            <div>
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
              <p className="text-secondary">Latest updates from your channels</p>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/dashboard/analytics')}
            >
              View All →
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-avatar avatar-${activity.color}`}>
                  {activity.avatar}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-platform font-semibold">{activity.platform}</span>
                    <span className="activity-time text-tertiary">{activity.time}</span>
                  </div>
                  <p className="activity-text text-secondary">{activity.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="section-card">
          <div className="section-header">
            <div>
              <h2 className="text-2xl font-semibold">Upcoming Posts</h2>
              <p className="text-secondary">Scheduled content pipeline</p>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/dashboard/calendar')}
            >
              View Calendar →
            </button>
          </div>
          <div className="upcoming-posts-list">
            {upcomingPosts.map((post, index) => (
              <div key={index} className="upcoming-post-item">
                <div className={`post-icon-wrapper icon-${post.color}`}>
                  {post.icon}
                </div>
                <div className="post-content">
                  <div className="post-platform font-semibold">{post.platform}</div>
                  <p className="post-text text-secondary">{post.content}</p>
                  <div className="post-scheduled">
                    <span className="scheduled-icon">📅</span>
                    <span className="text-tertiary">{post.scheduled}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h2 className="text-2xl font-semibold">Performance Overview</h2>
            <p className="text-secondary">Your marketing metrics at a glance</p>
          </div>
          <button className="btn btn-secondary btn-sm">
            <span>📊</span>
            <span>Detailed Report</span>
          </button>
        </div>
        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-label">Reach</div>
            <div className="performance-value">124.5K</div>
            <div className="performance-bar">
              <div className="performance-bar-fill" style={{width: '75%'}}></div>
            </div>
          </div>
          <div className="performance-card">
            <div className="performance-label">Impressions</div>
            <div className="performance-value">456.2K</div>
            <div className="performance-bar">
              <div className="performance-bar-fill" style={{width: '85%'}}></div>
            </div>
          </div>
          <div className="performance-card">
            <div className="performance-label">Clicks</div>
            <div className="performance-value">12.8K</div>
            <div className="performance-bar">
              <div className="performance-bar-fill" style={{width: '60%'}}></div>
            </div>
          </div>
          <div className="performance-card">
            <div className="performance-label">Conversions</div>
            <div className="performance-value">892</div>
            <div className="performance-bar">
              <div className="performance-bar-fill" style={{width: '45%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
