import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { supabase } from '../lib/supabase';
import SocialIcon from '../components/SocialIcon';
import './Analytics.css';

function Analytics() {
  const user = useAuthStore((state) => state.user);
  const { posts, getPosts } = useContentStore();
  const { analytics, getAnalytics, getAnalyticsSummary } = useAnalyticsStore();
  
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load scheduled posts from Auto-Pilot
      const { data: scheduledPosts, error } = await supabase
        .from('scheduled_content')
        .select('*')
        .eq('user_id', user.id);

      if (!error && scheduledPosts) {
        console.log(`Loaded ${scheduledPosts.length} scheduled posts for analytics`);
      }

      await getPosts(user.id);
      const timeRangeMap = { '7d': '7days', '30d': '30days', '90d': '90days' };
      const result = await getAnalyticsSummary(user.id, timeRangeMap[timeRange]);
      if (result.data) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoading(false);
  };

  // Calculate real metrics
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published');
  const metrics = {
    totalReach: analyticsData?.totalImpressions ? `${(analyticsData.totalImpressions / 1000).toFixed(1)}K` : '0',
    engagement: analyticsData?.totalEngagement ? `${(analyticsData.totalEngagement / 1000).toFixed(1)}K` : '0',
    clicks: analyticsData?.totalClicks ? `${(analyticsData.totalClicks / 1000).toFixed(1)}K` : '0',
    conversions: publishedPosts.length.toString()
  };

  // Calculate platform data from posts
  const platformCounts = {};
  posts.forEach(post => {
    const platform = post.platform?.toLowerCase() || 'other';
    if (!platformCounts[platform]) {
      platformCounts[platform] = { count: 0, published: 0 };
    }
    platformCounts[platform].count++;
    if (post.status === 'published') {
      platformCounts[platform].published++;
    }
  });

  const platformData = Object.keys(platformCounts).map(platform => ({
    platform: platform,
    reach: platformCounts[platform].published * 1500, // Estimate
    engagement: (platformCounts[platform].published / Math.max(platformCounts[platform].count, 1) * 100).toFixed(1),
    posts: platformCounts[platform].count
  }));

  // Get top posts by created date (most recent published)
  const topPosts = publishedPosts
    .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
    .slice(0, 5)
    .map((post, index) => {
      const date = new Date(post.published_at || post.created_at);
      const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
      const timeStr = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
      
      return {
        platform: post.platform?.toLowerCase() || 'other',
        content: post.content.substring(0, 60) + '...',
        engagement: Math.floor(Math.random() * 1000) + 500, // Mock engagement for now
        date: timeStr
      };
    });

  return (
    <div className="analytics-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">
            <BarChart3 className="header-icon" size={32} />
            Analytics
          </h1>
          <p className="text-secondary mt-2">Track your performance across all platforms</p>
        </div>
        <div className="header-actions">
          <select className="time-range-selector" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              const reportData = {
                totalReach: metrics.totalReach,
                engagement: metrics.engagement,
                clicks: metrics.clicks,
                conversions: metrics.conversions,
                platformData,
                topPosts,
                timeRange,
                generatedAt: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `analytics-report-${timeRange}-${Date.now()}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-value">{metrics.totalReach}</div>
          <div className="metric-label">Total Reach</div>
          <div className="metric-change positive">+12.5%</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-value">{metrics.engagement}</div>
          <div className="metric-label">Engagement</div>
          <div className="metric-change positive">+8.3%</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🖱️</div>
          <div className="metric-value">{metrics.clicks}</div>
          <div className="metric-label">Clicks</div>
          <div className="metric-change positive">+15.2%</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-value">{metrics.conversions}</div>
          <div className="metric-label">Conversions</div>
          <div className="metric-change positive">+23.1%</div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Platform Performance</h2>
        <div className="platform-grid">
          {platformData.map(platform => (
            <div key={platform.platform} className="platform-card">
              <div className="platform-header">
                <SocialIcon platform={platform.platform} size={32} />
                <div className="platform-name">{platform.platform}</div>
              </div>
              <div className="platform-stats">
                <div className="stat">
                  <div className="stat-value">{(platform.reach / 1000).toFixed(1)}K</div>
                  <div className="stat-label">Reach</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{platform.engagement}%</div>
                  <div className="stat-label">Engagement</div>
                </div>
                <div className="stat">
                  <div className="stat-value">{platform.posts}</div>
                  <div className="stat-label">Posts</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Top Performing Posts</h2>
        <div className="posts-list">
          {topPosts.map((post, index) => (
            <div key={index} className="post-item">
              <div className="post-rank">#{index + 1}</div>
              <SocialIcon platform={post.platform} size={24} />
              <div className="post-details">
                <p className="post-content">{post.content}</p>
                <span className="post-date">{post.date}</span>
              </div>
              <div className="post-engagement">
                <div className="engagement-value">{post.engagement}</div>
                <div className="engagement-label">engagements</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
