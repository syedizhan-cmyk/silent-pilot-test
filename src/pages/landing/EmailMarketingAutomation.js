import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../App.css';

const EmailMarketingAutomation = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Email Marketing Automation Software | AI-Powered Campaigns - Silent Pilot"
        description="Create and automate email campaigns with AI. Build subscriber lists, design beautiful emails, and track performance. Perfect for small businesses and agencies."
        keywords="email marketing automation, automated email campaigns, email marketing software, email automation tool, drip campaigns, email newsletter automation"
        url="https://silentpilot.org/email-marketing-automation"
      />
      
      <div className="landing-page">
        {/* Hero */}
        <section style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '80px 20px', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '20px'}}>
              Email Marketing Automation Made Simple
            </h1>
            <p style={{fontSize: '24px', marginBottom: '40px', opacity: 0.9}}>
              Create AI-powered email campaigns that convert. Automate follow-ups, nurture leads, and grow your business.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#f5576c',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Start Free Trial
            </button>
          </div>
        </section>

        {/* Benefits */}
        <section style={{padding: '80px 20px'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              Why Choose Our Email Automation?
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>🤖</div>
                <h3 style={{fontSize: '24px', marginBottom: '15px'}}>AI-Generated Content</h3>
                <p style={{color: '#666', lineHeight: '1.6'}}>
                  Write compelling emails in seconds with AI. No copywriting skills needed.
                </p>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>🎯</div>
                <h3 style={{fontSize: '24px', marginBottom: '15px'}}>Smart Segmentation</h3>
                <p style={{color: '#666', lineHeight: '1.6'}}>
                  Target the right audience with personalized messages that drive action.
                </p>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>📊</div>
                <h3 style={{fontSize: '24px', marginBottom: '15px'}}>Real-Time Analytics</h3>
                <p style={{color: '#666', lineHeight: '1.6'}}>
                  Track opens, clicks, and conversions. Optimize campaigns for better ROI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section style={{padding: '80px 20px', background: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              Perfect for Every Business
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
              {[
                {title: 'E-commerce', desc: 'Send abandoned cart emails, product launches, and promotions'},
                {title: 'Agencies', desc: 'Manage multiple client campaigns from one dashboard'},
                {title: 'SaaS Companies', desc: 'Onboard users, nurture trials, and reduce churn'},
                {title: 'Coaches & Consultants', desc: 'Build your list and convert leads into clients'},
                {title: 'Real Estate', desc: 'Drip campaigns for leads and market updates for clients'},
                {title: 'Local Businesses', desc: 'Stay top-of-mind with newsletters and special offers'}
              ].map((useCase, i) => (
                <div key={i} style={{padding: '30px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                  <h3 style={{fontSize: '20px', marginBottom: '10px', color: '#f5576c'}}>{useCase.title}</h3>
                  <p style={{color: '#666', lineHeight: '1.6'}}>{useCase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding: '80px 20px', background: '#f5576c', color: 'white', textAlign: 'center'}}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', marginBottom: '20px'}}>
              Start Automating Your Email Marketing Today
            </h2>
            <p style={{fontSize: '20px', marginBottom: '40px'}}>
              Free trial. No credit card required. Cancel anytime.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#f5576c',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Get Started Free
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default EmailMarketingAutomation;
