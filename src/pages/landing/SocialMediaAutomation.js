import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../App.css';

const SocialMediaAutomation = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Social Media Automation Software | Schedule & Auto-Post Content - Silent Pilot"
        description="Automate your social media marketing with AI-powered scheduling, content creation, and analytics. Post to Twitter, LinkedIn, and more platforms automatically. Free trial available."
        keywords="social media automation, social media scheduler, auto post social media, social media management software, automated social posting, content scheduling tool"
        url="https://silentpilot.org/social-media-automation"
      />
      
      <div className="landing-page">
        {/* Hero Section */}
        <section className="hero-section" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '80px 20px', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '20px'}}>
              Automate Your Social Media Marketing in Minutes
            </h1>
            <p style={{fontSize: '24px', marginBottom: '40px', opacity: 0.9}}>
              Schedule posts, create content with AI, and manage all your social platforms from one dashboard
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              Start Free Trial
            </button>
          </div>
        </section>

        {/* Benefits Section */}
        <section style={{padding: '80px 20px', background: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              Why Automate Your Social Media?
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>⏱️</div>
                <h3 style={{fontSize: '24px', marginBottom: '15px'}}>Save 10+ Hours Per Week</h3>
                <p style={{color: '#1f2937', lineHeight: '1.6'}}>
                  Schedule a month of content in under an hour. No more daily posting stress.
                </p>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>📈</div>
                <h3 style={{fontSize: '24px', marginBottom: '15px'}}>Grow Your Audience</h3>
                <p style={{color: '#1f2937', lineHeight: '1.6'}}>
                  Consistent posting builds engagement. Our AI helps you post at optimal times.
                </p>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>🤖</div>
                <h3 style={{fontSize: '24px', marginBottom: '15px'}}>AI Content Creation</h3>
                <p style={{color: '#1f2937', lineHeight: '1.6'}}>
                  Generate engaging posts in seconds. Never run out of content ideas again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{padding: '80px 20px'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              Everything You Need to Automate Social Media
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
              {[
                {icon: '📅', title: 'Smart Scheduling', desc: 'Queue posts and auto-publish at the best times'},
                {icon: '✍️', title: 'AI Writing Assistant', desc: 'Generate captions, hashtags, and content ideas'},
                {icon: '🔄', title: 'Multi-Platform Support', desc: 'Post to Twitter, LinkedIn, Facebook, Instagram'},
                {icon: '📊', title: 'Analytics Dashboard', desc: 'Track engagement, reach, and growth metrics'},
                {icon: '🎨', title: 'Content Calendar', desc: 'Visualize your posting schedule at a glance'},
                {icon: '👥', title: 'Team Collaboration', desc: 'Work together with approval workflows'}
              ].map((feature, i) => (
                <div key={i} style={{padding: '30px', background: '#f9fafb', borderRadius: '12px'}}>
                  <div style={{fontSize: '36px', marginBottom: '15px'}}>{feature.icon}</div>
                  <h3 style={{fontSize: '20px', marginBottom: '10px'}}>{feature.title}</h3>
                  <p style={{color: '#1f2937', lineHeight: '1.5'}}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{padding: '80px 20px', background: '#667eea', color: 'white', textAlign: 'center'}}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', marginBottom: '20px'}}>
              Ready to Automate Your Social Media?
            </h2>
            <p style={{fontSize: '20px', marginBottom: '40px', opacity: 0.9}}>
              Join thousands of businesses saving time and growing their audience with Silent Pilot
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
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

export default SocialMediaAutomation;
