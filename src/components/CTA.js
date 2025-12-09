import React from 'react';
import './CTA.css';

function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <div className="cta-background">
            <div className="cta-gradient"></div>
          </div>
          
          <h2 className="cta-title">
            Ready to boost your productivity?
          </h2>
          <p className="cta-description">
            Join thousands of professionals who have already transformed their workflow with Silent Pilot
          </p>
          
          <div className="cta-actions">
            <button className="btn btn-cta-primary">
              Get Started Free
            </button>
            <button className="btn btn-cta-secondary">
              Schedule a Demo
            </button>
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#27C93F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="cta-feature">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#27C93F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="cta-feature">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#27C93F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
