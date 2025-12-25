import React from 'react';
import './Testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechStyle Co',
      avatar: '👩‍💼',
      content: 'Silent Pilot transformed our social media strategy. We went from posting 3 times a week to daily content across 5 platforms. Engagement is up 200%!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Founder & CEO',
      company: 'GrowLocal',
      avatar: '👨‍💻',
      content: 'As a small business owner, I don\'t have time for social media. Silent Pilot handles everything - from content creation to scheduling. It\'s like having a full marketing team!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Social Media Manager',
      company: 'Brand Boost',
      avatar: '👩‍🎨',
      content: 'The AI content creation is incredible. I can generate a month\'s worth of posts in under an hour. The analytics help me understand what works best.',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'E-commerce Owner',
      company: 'ShopSmart',
      avatar: '👨‍🔬',
      content: 'Our email campaigns have never performed better. The automation and targeting features helped us triple our conversion rate in just 2 months.',
      rating: 5
    },
    {
      name: 'Lisa Thompson',
      role: 'Marketing Consultant',
      company: 'Growth Agency',
      avatar: '👩‍💼',
      content: 'I manage social media for 8 clients. Silent Pilot makes it effortless. The bulk scheduling and AI assistance save me 20+ hours per week.',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Digital Strategist',
      company: 'Impact Digital',
      avatar: '👨‍💼',
      content: 'The AutoPilot feature is game-changing. Set your strategy once and let AI handle the rest. Our clients are seeing consistent growth month over month.',
      rating: 5
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">
            Loved by <span className="gradient-text">thousands</span>
          </h2>
          <p className="section-description">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              
              <p className="testimonial-content">"{testimonial.content}"</p>
              
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Businesses Growing</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8/5</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10M+</div>
            <div className="stat-label">Posts Scheduled</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
