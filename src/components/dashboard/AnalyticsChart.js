import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import './AnalyticsChart.css';

function AnalyticsChart({ posts }) {
  const [timeRange, setTimeRange] = useState('7days');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    generateChartData();
  }, [posts, timeRange]);

  const generateChartData = () => {
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic data with some variance
      const baseValue = 50 + Math.random() * 100;
      const engagement = Math.floor(baseValue + (Math.random() - 0.5) * 40);
      const views = Math.floor((baseValue + 50) * 3 + (Math.random() - 0.5) * 100);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        engagement,
        views,
        maxValue: Math.max(engagement, views)
      });
    }
    
    setChartData(data);
  };

  const maxValue = Math.max(...chartData.map(d => Math.max(d.engagement, d.views)), 1);

  const metrics = [
    {
      icon: <Eye size={20} />,
      label: 'Total Views',
      value: chartData.reduce((sum, d) => sum + d.views, 0).toLocaleString(),
      color: '#667eea'
    },
    {
      icon: <Heart size={20} />,
      label: 'Total Engagement',
      value: chartData.reduce((sum, d) => sum + d.engagement, 0).toLocaleString(),
      color: '#10b981'
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Engagement Rate',
      value: '8.5%',
      color: '#ec4899'
    }
  ];

  return (
    <div className="analytics-chart-container">
      <div className="chart-header">
        <div>
          <h2>Performance Overview</h2>
          <p className="chart-subtitle">Track your social media growth</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7days' ? 'active' : ''}
            onClick={() => setTimeRange('7days')}
          >
            7 Days
          </button>
          <button 
            className={timeRange === '30days' ? 'active' : ''}
            onClick={() => setTimeRange('30days')}
          >
            30 Days
          </button>
          <button 
            className={timeRange === '90days' ? 'active' : ''}
            onClick={() => setTimeRange('90days')}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="metrics-row">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-item">
            <div className="metric-icon" style={{ color: metric.color }}>
              {metric.icon}
            </div>
            <div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-wrapper">
        <div className="chart-y-axis">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        <div className="chart-area">
          <div className="chart-grid">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="grid-line" />
            ))}
          </div>
          
          <div className="chart-bars">
            {chartData.map((item, idx) => (
              <div key={idx} className="bar-group">
                <div 
                  className="bar bar-engagement"
                  style={{ height: `${(item.engagement / maxValue) * 100}%` }}
                  title={`Engagement: ${item.engagement}`}
                />
                <div 
                  className="bar bar-views"
                  style={{ height: `${(item.views / maxValue) * 100}%` }}
                  title={`Views: ${item.views}`}
                />
              </div>
            ))}
          </div>
          
          <div className="chart-x-axis">
            {chartData.map((item, idx) => {
              // Show every nth label based on data length
              const showLabel = timeRange === '7days' || idx % (timeRange === '30days' ? 5 : 15) === 0;
              return showLabel ? (
                <span key={idx} style={{ left: `${(idx / chartData.length) * 100}%` }}>
                  {item.date}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#10b981' }}></span>
          <span>Engagement</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#667eea' }}></span>
          <span>Views</span>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsChart;
