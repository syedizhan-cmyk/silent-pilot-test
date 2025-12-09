import React, { useState } from 'react';
import './Demo.css';

function Demo() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <section id="demo" className="demo">
      <div className="container">
        <div className="demo-header">
          <h2 className="section-title">
            See it in <span className="gradient-text">action</span>
          </h2>
          <p className="section-description">
            Experience the power of Silent Pilot with our interactive demo
          </p>
        </div>

        <div className="demo-tabs">
          <button 
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            AI Chat
          </button>
          <button 
            className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
            onClick={() => setActiveTab('automation')}
          >
            Automation
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        <div className="demo-content">
          {activeTab === 'chat' && (
            <div className="demo-panel">
              <div className="chat-interface">
                <div className="chat-messages">
                  <div className="chat-message user">
                    <div className="message-content">Help me schedule meetings for next week</div>
                  </div>
                  <div className="chat-message ai">
                    <div className="message-content">
                      I'll help you schedule meetings. I found 3 available slots:
                      <ul>
                        <li>Monday 10:00 AM - 11:00 AM</li>
                        <li>Wednesday 2:00 PM - 3:00 PM</li>
                        <li>Friday 9:00 AM - 10:00 AM</li>
                      </ul>
                      Would you like me to send invites?
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
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Trigger</h4>
                    <p>New email received</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Process</h4>
                    <p>AI analyzes content</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Action</h4>
                    <p>Auto-categorize & respond</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="demo-panel">
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-value">2,547</div>
                  <div className="metric-label">Tasks Completed</div>
                  <div className="metric-change positive">+12.5%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">18h</div>
                  <div className="metric-label">Time Saved</div>
                  <div className="metric-change positive">+8.3%</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">94%</div>
                  <div className="metric-label">Accuracy Rate</div>
                  <div className="metric-change positive">+2.1%</div>
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
