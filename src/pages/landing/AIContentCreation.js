import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../App.css';

const AIContentCreation = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="AI Content Creation Tool | Generate Marketing Content in Seconds - Silent Pilot"
        description="Generate blog posts, social media content, emails, and ads with AI. Save hours on content creation. Perfect for marketers, entrepreneurs, and agencies."
        keywords="AI content creation, AI copywriting, automated content generation, AI writing tool, marketing content generator, AI blog writer"
        url="https://silentpilot.org/ai-content-creation"
      />
      
      <div className="landing-page">
        {/* Hero */}
        <section style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '80px 20px', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '20px'}}>
              Create Marketing Content with AI in Seconds
            </h1>
            <p style={{fontSize: '24px', marginBottom: '40px', opacity: 0.9}}>
              Generate blog posts, social media content, emails, and ads instantly. Never stare at a blank page again.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#4facfe',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Try AI Content Creation Free
            </button>
          </div>
        </section>

        {/* What You Can Create */}
        <section style={{padding: '80px 20px'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              What Can You Create with AI?
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
              {[
                {icon: '📱', title: 'Social Media Posts', desc: 'Engaging captions, hashtags, and content for all platforms'},
                {icon: '✉️', title: 'Email Campaigns', desc: 'Subject lines, body copy, and CTAs that convert'},
                {icon: '📝', title: 'Blog Articles', desc: 'SEO-optimized long-form content that ranks'},
                {icon: '📢', title: 'Ad Copy', desc: 'Compelling Facebook, Google, and LinkedIn ads'},
                {icon: '🎬', title: 'Video Scripts', desc: 'YouTube, TikTok, and Instagram video scripts'},
                {icon: '📄', title: 'Landing Pages', desc: 'High-converting sales page copy'}
              ].map((item, i) => (
                <div key={i} style={{padding: '30px', background: '#f9fafb', borderRadius: '12px', textAlign: 'center'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>{item.icon}</div>
                  <h3 style={{fontSize: '20px', marginBottom: '10px'}}>{item.title}</h3>
                  <p style={{color: '#666', lineHeight: '1.5'}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{padding: '80px 20px', background: '#f9fafb'}}>
          <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              How It Works - Simple as 1-2-3
            </h2>
            <div style={{display: 'grid', gap: '40px'}}>
              {[
                {step: '1', title: 'Tell Us What You Need', desc: 'Describe your business, audience, and content goal in plain English'},
                {step: '2', title: 'AI Generates Content', desc: 'Our AI creates multiple variations in your brand voice within seconds'},
                {step: '3', title: 'Edit & Publish', desc: 'Tweak if needed, then publish directly to your platforms'}
              ].map((item, i) => (
                <div key={i} style={{display: 'flex', gap: '30px', alignItems: 'start'}}>
                  <div style={{
                    minWidth: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{fontSize: '24px', marginBottom: '10px'}}>{item.title}</h3>
                    <p style={{color: '#666', fontSize: '18px', lineHeight: '1.6'}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding: '80px 20px', background: '#4facfe', color: 'white', textAlign: 'center'}}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', marginBottom: '20px'}}>
              Stop Wasting Time on Content Creation
            </h2>
            <p style={{fontSize: '20px', marginBottom: '40px'}}>
              Join thousands of marketers creating content 10x faster with AI
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#4facfe',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Start Creating with AI Free
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIContentCreation;
