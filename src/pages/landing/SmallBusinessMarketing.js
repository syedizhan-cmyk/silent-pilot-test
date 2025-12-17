import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../App.css';

const SmallBusinessMarketing = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Marketing Automation for Small Business | Affordable AI Tools - Silent Pilot"
        description="Affordable marketing automation for small businesses. Manage social media, email campaigns, and content creation in one platform. No agency needed. Start free."
        keywords="small business marketing automation, affordable marketing software, small business social media, email marketing for small business, marketing tools for startups"
        url="https://silentpilot.app/small-business-marketing-automation"
      />
      
      <div className="landing-page">
        {/* Hero */}
        <section style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', padding: '80px 20px', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '20px'}}>
              Marketing Automation Built for Small Businesses
            </h1>
            <p style={{fontSize: '24px', marginBottom: '40px', opacity: 0.95}}>
              No marketing team? No problem. Automate your social media, emails, and content creation for less than the cost of one employee.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#fa709a',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Start Free - No Credit Card
            </button>
          </div>
        </section>

        {/* Problems */}
        <section style={{padding: '80px 20px'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '20px'}}>
              Small Business Marketing Challenges
            </h2>
            <p style={{textAlign: 'center', color: '#666', fontSize: '18px', marginBottom: '60px', maxWidth: '800px', margin: '0 auto 60px'}}>
              Sound familiar?
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
              {[
                {icon: '😓', problem: 'No time to post consistently', solution: 'Schedule weeks of content in minutes'},
                {icon: '💸', problem: "Can't afford a marketing agency", solution: 'Get agency-level tools for a fraction of the cost'},
                {icon: '🤷', problem: "Don't know what to post", solution: 'AI generates content ideas and writes posts for you'},
                {icon: '📉', problem: 'Not getting enough leads', solution: 'Automated email campaigns nurture leads 24/7'},
                {icon: '😰', problem: 'Too many platforms to manage', solution: 'Manage everything from one dashboard'},
                {icon: '❓', problem: 'No marketing expertise', solution: 'AI guides you with best practices built-in'}
              ].map((item, i) => (
                <div key={i} style={{padding: '30px', background: '#f9fafb', borderRadius: '12px'}}>
                  <div style={{fontSize: '40px', marginBottom: '15px'}}>{item.icon}</div>
                  <h3 style={{fontSize: '18px', marginBottom: '10px', color: '#e74c3c'}}>{item.problem}</h3>
                  <p style={{color: '#27ae60', fontWeight: '500', lineHeight: '1.6'}}>✓ {item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features for Small Business */}
        <section style={{padding: '80px 20px', background: '#f9fafb'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', textAlign: 'center', marginBottom: '60px'}}>
              Everything a Small Business Needs
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px'}}>
              <div>
                <h3 style={{fontSize: '24px', marginBottom: '15px', color: '#fa709a'}}>Social Media Automation</h3>
                <ul style={{color: '#666', lineHeight: '2', fontSize: '16px'}}>
                  <li>Schedule posts to Twitter, LinkedIn, Facebook</li>
                  <li>AI-generated captions and hashtags</li>
                  <li>Visual content calendar</li>
                  <li>Best time to post recommendations</li>
                </ul>
              </div>
              <div>
                <h3 style={{fontSize: '24px', marginBottom: '15px', color: '#fa709a'}}>Email Marketing</h3>
                <ul style={{color: '#666', lineHeight: '2', fontSize: '16px'}}>
                  <li>Build and grow your email list</li>
                  <li>AI-written email campaigns</li>
                  <li>Automated follow-up sequences</li>
                  <li>Track opens and clicks</li>
                </ul>
              </div>
              <div>
                <h3 style={{fontSize: '24px', marginBottom: '15px', color: '#fa709a'}}>Content Creation</h3>
                <ul style={{color: '#666', lineHeight: '2', fontSize: '16px'}}>
                  <li>Generate blog posts with AI</li>
                  <li>Create ad copy in seconds</li>
                  <li>Never run out of ideas</li>
                  <li>Customized to your brand voice</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Highlight */}
        <section style={{padding: '80px 20px'}}>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '36px', marginBottom: '30px'}}>
              More Affordable Than You Think
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px'}}>
              <div style={{padding: '30px', background: '#fff3f3', borderRadius: '12px'}}>
                <h3 style={{fontSize: '20px', marginBottom: '10px', color: '#e74c3c'}}>Hiring a Marketer</h3>
                <p style={{fontSize: '32px', fontWeight: 'bold', color: '#e74c3c'}}>$4,000+/mo</p>
                <p style={{color: '#666', fontSize: '14px'}}>Plus benefits</p>
              </div>
              <div style={{padding: '30px', background: '#f0fff4', borderRadius: '12px', border: '2px solid #27ae60'}}>
                <h3 style={{fontSize: '20px', marginBottom: '10px', color: '#27ae60'}}>Silent Pilot</h3>
                <p style={{fontSize: '32px', fontWeight: 'bold', color: '#27ae60'}}>$49/mo</p>
                <p style={{color: '#666', fontSize: '14px'}}>Cancel anytime</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: '#fa709a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Try Free for 14 Days
            </button>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding: '80px 20px', background: '#fa709a', color: 'white', textAlign: 'center'}}>
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 style={{fontSize: '36px', marginBottom: '20px'}}>
              Grow Your Business Without Growing Your Team
            </h2>
            <p style={{fontSize: '20px', marginBottom: '40px'}}>
              Join 5,000+ small businesses automating their marketing with Silent Pilot
            </p>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#fa709a',
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

export default SmallBusinessMarketing;
