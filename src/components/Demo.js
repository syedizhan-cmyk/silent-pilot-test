import React, { useState } from 'react';
import './Demo.css';

function Demo() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <section id="demo" className="demo">
      <div className="container">
        <div className="demo-header">
          <div className="demo-header-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Live Demo
          </div>
          <h2 className="section-title">
            Watch Silent Pilot <span className="gradient-text">Transform</span> Your Workflow
          </h2>
          <p className="section-description">
            Experience the power of AI-driven social media automation
          </p>
        </div>

        <div className="demo-tabs-container">
          <div className="demo-tabs">
            <button 
              className={`demo-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <div className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 10h.01M12 10h.01M16 10h.01"/>
                </svg>
              </div>
              <div className="tab-content">
                <span className="tab-title">AI Content</span>
                <span className="tab-subtitle">Generate posts instantly</span>
              </div>
            </button>
            <button 
              className={`demo-tab ${activeTab === 'automation' ? 'active' : ''}`}
              onClick={() => setActiveTab('automation')}
            >
              <div className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="tab-content">
                <span className="tab-title">Scheduling</span>
                <span className="tab-subtitle">Auto-post across platforms</span>
              </div>
            </button>
            <button 
              className={`demo-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <div className="tab-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div className="tab-content">
                <span className="tab-title">Analytics</span>
                <span className="tab-subtitle">Track performance</span>
              </div>
            </button>
          </div>
        </div>

        <div className="demo-content">
          {activeTab === 'chat' && (
            <div className="demo-panel">
              <div className="chat-interface">
                <div className="chat-messages">
                  <div className="chat-message user">
                    <div className="message-content">Create a LinkedIn post about our new product launch</div>
                  </div>
                  <div className="chat-message ai">
                    <div className="message-content">
                      🚀 Here's your LinkedIn post:
                      <div style={{marginTop: '12px', padding: '16px', background: 'rgba(88,101,242,0.1)', borderRadius: '8px', borderLeft: '3px solid #5865F2'}}>
                        <p style={{margin: 0, lineHeight: '1.6'}}>
                          <strong>Exciting News! 🎉</strong><br/><br/>
                          We're thrilled to announce the launch of our revolutionary new product that's set to transform how businesses approach digital marketing.<br/><br/>
                          ✨ AI-powered automation<br/>
                          📊 Real-time analytics<br/>
                          🎯 Multi-platform integration<br/><br/>
                          Ready to elevate your marketing game? Link in comments! 👇
                        </p>
                      </div>
                      <div style={{marginTop: '12px', fontSize: '14px', color: '#888'}}>
                        Would you like me to schedule this or modify anything?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="demo-panel">
              <div className="automation-flow">
                <div className="flow-step">
                  <div className="step-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </div>
                  <div className="step-content">
                    <h4>Create Content</h4>
                    <p>AI generates engaging social media posts tailored to your brand voice and audience</p>
                  </div>
                </div>
                <div className="flow-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div className="flow-step">
                  <div className="step-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className="step-content">
                    <h4>Schedule Posts</h4>
                    <p>Automatically schedule at optimal times based on audience activity and engagement patterns</p>
                  </div>
                </div>
                <div className="flow-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div className="flow-step">
                  <div className="step-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <div className="step-content">
                    <h4>Auto-Publish</h4>
                    <p>Posts go live across Twitter, LinkedIn, Instagram, and Facebook simultaneously</p>
                  </div>
                </div>
              </div>
              <div style={{marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <span style={{fontSize: '24px'}}>📅</span>
                  <div>
                    <h4 style={{margin: 0, fontSize: '16px', color: '#fff'}}>Scheduled for Today</h4>
                    <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#888'}}>5 posts across Twitter, LinkedIn, and Instagram</p>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <span style={{padding: '4px 12px', background: 'rgba(29,155,240,0.2)', borderRadius: '6px', fontSize: '13px', color: '#1DA1F2'}}>Twitter • 9:00 AM</span>
                  <span style={{padding: '4px 12px', background: 'rgba(0,119,181,0.2)', borderRadius: '6px', fontSize: '13px', color: '#0077B5'}}>LinkedIn • 10:30 AM</span>
                  <span style={{padding: '4px 12px', background: 'rgba(225,48,108,0.2)', borderRadius: '6px', fontSize: '13px', color: '#E1306C'}}>Instagram • 2:00 PM</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="demo-panel">
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-value">127K</div>
                  <div className="metric-label">Total Reach</div>
                  <div className="metric-change positive">+24.8%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">8.4K</div>
                  <div className="metric-label">Engagements</div>
                  <div className="metric-change positive">+18.3%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">6.7%</div>
                  <div className="metric-label">Engagement Rate</div>
                  <div className="metric-change positive">+2.4%</div>
                </div>
              </div>
              <div style={{marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <h4 style={{margin: '0 0 20px 0', fontSize: '16px', color: '#fff'}}>📊 Platform Performance</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{fontSize: '14px', color: '#1DA1F2'}}>Twitter</span>
                      <span style={{fontSize: '14px', color: '#888'}}>45.2K impressions</span>
                    </div>
                    <div style={{height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: '85%', height: '100%', background: 'linear-gradient(90deg, #1DA1F2, #0d8bd9)', borderRadius: '4px'}}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{fontSize: '14px', color: '#0077B5'}}>LinkedIn</span>
                      <span style={{fontSize: '14px', color: '#888'}}>38.7K impressions</span>
                    </div>
                    <div style={{height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: '72%', height: '100%', background: 'linear-gradient(90deg, #0077B5, #005885)', borderRadius: '4px'}}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span style={{fontSize: '14px', color: '#E1306C'}}>Instagram</span>
                      <span style={{fontSize: '14px', color: '#888'}}>43.1K impressions</span>
                    </div>
                    <div style={{height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: '80%', height: '100%', background: 'linear-gradient(90deg, #E1306C, #C13584)', borderRadius: '4px'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Demo;
