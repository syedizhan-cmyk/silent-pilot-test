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
            See how easy it is to create, schedule, and optimize your social media presence
          </p>
        </div>

        <div className="demo-showcase">
          <div className="demo-tabs">
            <button 
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <path d="M8 10h.01M12 10h.01M16 10h.01"/>
              </svg>
              AI Content Creation
            </button>
            <button 
              className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
              onClick={() => setActiveTab('automation')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Social Scheduling
            </button>
            <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Campaign Analytics
            </button>
          </div>

          <div className="demo-content">
            {activeTab === 'chat' && (
            <div className="demo-panel">
              <div className="content-generator">
                <div className="generator-input">
                  <div className="input-label">✨ AI Content Generator</div>
                  <div className="prompt-box">
                    <span className="prompt-text">"Create engaging posts about sustainable fashion for Instagram"</span>
                  </div>
                </div>
                
                <div className="generated-posts">
                  <div className="generated-post">
                    <div className="post-platform">
                      <span className="platform-badge instagram">📷 Instagram</span>
                      <span className="post-status">✓ Ready</span>
                    </div>
                    <div className="post-preview">
                      <p>🌿 Fashion that cares for our planet! ♻️</p>
                      <p>Discover our new sustainable collection - style meets responsibility. Every piece tells a story of eco-conscious design.</p>
                      <div className="hashtags">#SustainableFashion #EcoStyle #GreenLiving</div>
                    </div>
                    <div className="post-actions">
                      <button className="action-btn">📅 Schedule</button>
                      <button className="action-btn">✏️ Edit</button>
                      <button className="action-btn">🔄 Regenerate</button>
                    </div>
                  </div>
                  
                  <div className="generated-post">
                    <div className="post-platform">
                      <span className="platform-badge twitter">🐦 Twitter</span>
                      <span className="post-status">✓ Ready</span>
                    </div>
                    <div className="post-preview">
                      <p>Style shouldn't cost the Earth 🌍✨ Our sustainable fashion line proves you can look good AND do good. Join the movement! 👕♻️</p>
                    </div>
                    <div className="post-actions">
                      <button className="action-btn">📅 Schedule</button>
                      <button className="action-btn">✏️ Edit</button>
                      <button className="action-btn">🔄 Regenerate</button>
                    </div>
                  </div>
                </div>
                
                <div className="generator-footer">
                  <span className="generate-more">+ Generate 3 more variations</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="demo-panel">
              <div className="scheduling-calendar">
                <div className="calendar-header">
                  <h3>📅 Content Calendar - This Week</h3>
                  <div className="calendar-controls">
                    <span className="week-nav">← Week 42</span>
                    <span className="week-nav">Week 43 →</span>
                  </div>
                </div>
                
                <div className="calendar-grid">
                  <div className="calendar-day">
                    <div className="day-header">
                      <div className="day-name">Monday</div>
                      <div className="day-date">Oct 23</div>
                    </div>
                    <div className="scheduled-posts">
                      <div className="scheduled-post facebook">
                        <span className="time">9:00 AM</span>
                        <span className="platform">📘</span>
                        <span className="preview">Product launch announcement...</span>
                      </div>
                      <div className="scheduled-post instagram">
                        <span className="time">3:00 PM</span>
                        <span className="platform">📷</span>
                        <span className="preview">Behind the scenes content...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="calendar-day">
                    <div className="day-header">
                      <div className="day-name">Tuesday</div>
                      <div className="day-date">Oct 24</div>
                    </div>
                    <div className="scheduled-posts">
                      <div className="scheduled-post twitter">
                        <span className="time">10:00 AM</span>
                        <span className="platform">🐦</span>
                        <span className="preview">Industry insights thread...</span>
                      </div>
                      <div className="scheduled-post linkedin">
                        <span className="time">2:00 PM</span>
                        <span className="platform">💼</span>
                        <span className="preview">Thought leadership post...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="calendar-day highlighted">
                    <div className="day-header">
                      <div className="day-name">Wednesday</div>
                      <div className="day-date">Oct 25 • Today</div>
                    </div>
                    <div className="scheduled-posts">
                      <div className="scheduled-post facebook publishing">
                        <span className="time">2:00 PM</span>
                        <span className="platform">📘</span>
                        <span className="preview">Publishing now... 🚀</span>
                      </div>
                      <div className="scheduled-post instagram">
                        <span className="time">6:00 PM</span>
                        <span className="platform">📷</span>
                        <span className="preview">Evening engagement post...</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="automation-stats">
                  <div className="stat-badge">
                    <span className="stat-icon">📊</span>
                    <span>Best times automatically detected</span>
                  </div>
                  <div className="stat-badge">
                    <span className="stat-icon">🎯</span>
                    <span>15 posts scheduled this week</span>
                  </div>
                  <div className="stat-badge">
                    <span className="stat-icon">⚡</span>
                    <span>Auto-posting to 4 platforms</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="demo-panel">
              <div className="analytics-dashboard">
                <div className="analytics-header">
                  <h3>📊 Campaign Performance</h3>
                  <div className="time-filter">
                    <button className="filter-btn active">7 Days</button>
                    <button className="filter-btn">30 Days</button>
                    <button className="filter-btn">90 Days</button>
                  </div>
                </div>
                
                <div className="metrics-overview">
                  <div className="metric-card">
                    <div className="metric-icon">❤️</div>
                    <div className="metric-info">
                      <div className="metric-value">45.2K</div>
                      <div className="metric-label">Total Engagement</div>
                    </div>
                    <div className="metric-change positive">↑ 28.5%</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">👥</div>
                    <div className="metric-info">
                      <div className="metric-value">892</div>
                      <div className="metric-label">New Leads</div>
                    </div>
                    <div className="metric-change positive">↑ 15.3%</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">📈</div>
                    <div className="metric-info">
                      <div className="metric-value">8.4%</div>
                      <div className="metric-label">Conversion Rate</div>
                    </div>
                    <div className="metric-change positive">↑ 2.1%</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🎯</div>
                    <div className="metric-info">
                      <div className="metric-value">156K</div>
                      <div className="metric-label">Total Reach</div>
                    </div>
                    <div className="metric-change positive">↑ 34.8%</div>
                  </div>
                </div>
                
                <div className="platform-breakdown">
                  <h4>Platform Performance</h4>
                  <div className="platform-stats">
                    <div className="platform-stat">
                      <div className="platform-info">
                        <span className="platform-icon">📘</span>
                        <span className="platform-name">Facebook</span>
                      </div>
                      <div className="platform-bar">
                        <div className="bar-fill facebook" style={{width: '85%'}}></div>
                      </div>
                      <span className="platform-value">18.5K</span>
                    </div>
                    <div className="platform-stat">
                      <div className="platform-info">
                        <span className="platform-icon">📷</span>
                        <span className="platform-name">Instagram</span>
                      </div>
                      <div className="platform-bar">
                        <div className="bar-fill instagram" style={{width: '92%'}}></div>
                      </div>
                      <span className="platform-value">21.2K</span>
                    </div>
                    <div className="platform-stat">
                      <div className="platform-info">
                        <span className="platform-icon">🐦</span>
                        <span className="platform-name">Twitter</span>
                      </div>
                      <div className="platform-bar">
                        <div className="bar-fill twitter" style={{width: '65%'}}></div>
                      </div>
                      <span className="platform-value">12.8K</span>
                    </div>
                    <div className="platform-stat">
                      <div className="platform-info">
                        <span className="platform-icon">💼</span>
                        <span className="platform-name">LinkedIn</span>
                      </div>
                      <div className="platform-bar">
                        <div className="bar-fill linkedin" style={{width: '58%'}}></div>
                      </div>
                      <span className="platform-value">9.7K</span>
                    </div>
                  </div>
                </div>
                
                <div className="insights-section">
                  <div className="insight-card">
                    <span className="insight-icon">💡</span>
                    <span className="insight-text">Instagram posts at 3-5 PM get 2x more engagement</span>
                  </div>
                  <div className="insight-card">
                    <span className="insight-icon">🔥</span>
                    <span className="insight-text">Video content performs 45% better than images</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Demo;
