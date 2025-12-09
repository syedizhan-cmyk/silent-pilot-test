import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Automation',
      description: 'Let AI handle repetitive tasks while you focus on what matters most.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Experience instant responses and real-time processing with our optimized infrastructure.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted end-to-end and never shared with third parties.'
    },
    {
      icon: '🎯',
      title: 'Smart Insights',
      description: 'Get actionable insights and recommendations powered by advanced analytics.'
    },
    {
      icon: '🔄',
      title: 'Seamless Integration',
      description: 'Connect with your favorite tools and platforms effortlessly.'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track your productivity and gain deep insights into your workflow.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">
            Everything you need to
            <span className="gradient-text"> succeed</span>
          </h2>
          <p className="section-description">
            Powerful features designed to supercharge your productivity and streamline your workflow
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
