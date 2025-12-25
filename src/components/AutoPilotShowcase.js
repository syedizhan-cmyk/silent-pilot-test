import React, { useState, useEffect } from 'react';
import './AutoPilotShowcase.css';

function AutoPilotShowcase() {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive && progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 1), 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, progress]);

  const handleToggle = () => {
    if (!isActive) {
      setProgress(0);
      setIsActive(true);
    } else {
      setIsActive(false);
      setProgress(0);
    }
  };

  return (
    <section className="autopilot-showcase">
      <div className="container">
        <div className="autopilot-content">
          <div className="autopilot-text">
            <div className="badge-container">
              <div className="feature-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Our Secret Weapon
              </div>
            </div>
            
            <h2 className="autopilot-title">
              Set It. Forget It. <br/>
              <span className="gradient-text">Grow Automatically.</span>
            </h2>
            
            <p className="autopilot-description">
              AutoPilot is your 24/7 marketing team. It analyzes your audience, creates content, 
              schedules posts at optimal times, and adjusts strategy based on performance—all 
              without lifting a finger.
            </p>

            <div className="autopilot-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M8 10h.01M12 10h.01M16 10h.01"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>AI Content Generation</h4>
                  <p>Creates engaging posts tailored to your brand voice</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <line x1="8" y1="14" x2="8" y2="14.01"/>
                    <line x1="12" y1="14" x2="12" y2="14.01"/>
                    <line x1="16" y1="14" x2="16" y2="14.01"/>
                    <line x1="8" y1="18" x2="8" y2="18.01"/>
                    <line x1="12" y1="18" x2="12" y2="18.01"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Smart Scheduling</h4>
                  <p>Posts when your audience is most active</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Performance Optimization</h4>
                  <p>Learns from data and improves over time</p>
                </div>
              </div>
            </div>

            <button className="autopilot-cta">
              <span>Try AutoPilot Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          <div className="autopilot-visual">
            <div className="control-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                  AutoPilot Control Center
                </div>
                <div className={`status-indicator ${isActive ? 'active' : ''}`}>
                  <span className="status-dot"></span>
                  {isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="power-toggle">
                <button 
                  className={`toggle-button ${isActive ? 'active' : ''}`}
                  onClick={handleToggle}
                >
                  <div className="toggle-track">
                    <div className="toggle-thumb"></div>
                  </div>
                  <span>{isActive ? 'Deactivate' : 'Activate'} AutoPilot</span>
                </button>
              </div>

              {isActive && (
                <>
                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Setting up your campaign...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${progress}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="activity-feed">
                    <div className="activity-header">Recent Activity</div>
                    <div className="activity-items">
                      {progress > 20 && (
                        <div className="activity-item fade-in">
                          <div className="activity-icon analyzing">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                          </div>
                          <div className="activity-text">
                            <div className="activity-title">Analyzed audience insights</div>
                            <div className="activity-time">Just now</div>
                          </div>
                        </div>
                      )}
                      
                      {progress > 40 && (
                        <div className="activity-item fade-in">
                          <div className="activity-icon creating">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="12" y1="18" x2="12" y2="12"/>
                              <line x1="9" y1="15" x2="15" y2="15"/>
                            </svg>
                          </div>
                          <div className="activity-text">
                            <div className="activity-title">Generated 15 post variations</div>
                            <div className="activity-time">2 seconds ago</div>
                          </div>
                        </div>
                      )}
                      
                      {progress > 60 && (
                        <div className="activity-item fade-in">
                          <div className="activity-icon scheduling">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                          </div>
                          <div className="activity-text">
                            <div className="activity-title">Scheduled across 4 platforms</div>
                            <div className="activity-time">5 seconds ago</div>
                          </div>
                        </div>
                      )}
                      
                      {progress > 80 && (
                        <div className="activity-item fade-in">
                          <div className="activity-icon success">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                          <div className="activity-text">
                            <div className="activity-title">Campaign optimized & ready!</div>
                            <div className="activity-time">Just now</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {progress === 100 && (
                    <div className="success-message fade-in">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <h3>AutoPilot is Running!</h3>
                      <p>Your marketing is now on full automation</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="stats-preview">
              <div className="stat-card">
                <div className="stat-value">85%</div>
                <div className="stat-label">Time Saved</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">3x</div>
                <div className="stat-label">More Posts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Always Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AutoPilotShowcase;
