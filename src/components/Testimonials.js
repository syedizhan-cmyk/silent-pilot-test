import React from 'react';
import './Testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      avatar: '👩‍💼',
      content: 'Silent Pilot has transformed how our team works. The AI automation saves us hours every day, and the insights are incredibly valuable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Founder & CEO',
      company: 'StartupHub',
      avatar: '👨‍💻',
      content: 'Best productivity tool I\'ve used in years. The seamless integration with our existing tools made adoption super easy.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'GrowthLabs',
      avatar: '👩‍🎨',
      content: 'The analytics dashboard gives us insights we never had before. It\'s like having a data analyst on our team 24/7.',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Software Engineer',
      company: 'DevForce',
      avatar: '👨‍🔬',
      content: 'I was skeptical at first, but Silent Pilot\'s AI is genuinely helpful. It learns from my workflow and adapts perfectly.',
      rating: 5
    },
    {
      name: 'Lisa Thompson',
      role: 'Operations Manager',
      company: 'EfficiencyCo',
      avatar: '👩‍💼',
      content: 'The automation features alone are worth it. We\'ve reduced manual tasks by 60% and can focus on strategic work.',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'CTO',
      company: 'InnovateTech',
      avatar: '👨‍💼',
      content: 'Security and privacy were our main concerns, but Silent Pilot exceeded our expectations. Great product and support!',
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
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Tasks Automated</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
