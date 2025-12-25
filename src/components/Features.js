import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      icon: '📱',
      title: 'Social Media Automation',
      description: 'Schedule and publish content across all major platforms automatically. Never miss a posting opportunity.'
    },
    {
      icon: '✨',
      title: 'AI Content Creation',
      description: 'Generate engaging posts, captions, and visuals with AI. Create months of content in minutes.'
    },
    {
      icon: '📧',
      title: 'Email Marketing',
      description: 'Design, automate, and track email campaigns that convert. Build lasting relationships with your audience.'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Track performance across all channels. Get actionable insights to optimize your marketing strategy.'
    },
    {
      icon: '🎨',
      title: 'AI Media Studio',
      description: 'Create and edit stunning visuals with AI-powered tools. Professional content without the designer price tag.'
    },
    {
      icon: '🚀',
      title: 'AutoPilot Marketing',
      description: 'Set it and forget it. Let AI run your entire marketing strategy while you focus on growing your business.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">
            Everything you need to
            <span className="gradient-text"> grow your business</span>
          </h2>
          <p className="section-description">
            Powerful marketing automation tools designed to save time, increase engagement, and drive results
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
