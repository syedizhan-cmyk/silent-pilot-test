import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SEO.css';

function SEO() {
  const [selectedSite, setSelectedSite] = useState('main');

  const seoScore = {
    overall: 78,
    technical: 85,
    content: 72,
    backlinks: 68,
    mobile: 92
  };

  const keywords = [
    { keyword: 'digital marketing automation', position: 3, volume: 12000, difficulty: 65, trend: 'up' },
    { keyword: 'AI marketing tools', position: 7, volume: 8500, difficulty: 72, trend: 'up' },
    { keyword: 'social media scheduler', position: 12, volume: 15000, difficulty: 58, trend: 'down' },
    { keyword: 'email marketing platform', position: 5, volume: 22000, difficulty: 78, trend: 'stable' },
    { keyword: 'content automation', position: 9, volume: 6700, difficulty: 54, trend: 'up' }
  ];

  const issues = [
    { severity: 'high', type: 'Missing meta descriptions', count: 12, impact: 'High' },
    { severity: 'medium', type: 'Slow page load time', count: 5, impact: 'Medium' },
    { severity: 'low', type: 'Missing alt tags', count: 23, impact: 'Low' },
    { severity: 'medium', type: 'Broken links', count: 8, impact: 'Medium' }
  ];

  const competitors = [
    { name: 'Competitor A', domain: 'competitor-a.com', score: 82, keywords: 1547 },
    { name: 'Competitor B', domain: 'competitor-b.com', score: 75, keywords: 1203 },
    { name: 'Competitor C', domain: 'competitor-c.com', score: 71, keywords: 987 }
  ];

  return (
    <div className="seo-page">
      <div className="page-header">
        <div>
          <h1><Search className="header-icon" size={32} /> SEO Dashboard</h1>
          <p>Monitor and improve your search engine optimization</p>
        </div>
        <button className="btn btn-primary">🔍 Run Full Audit</button>
      </div>

      {/* SEO Score Overview */}
      <div className="seo-score-section">
        <div className="score-main-card">
          <h2>Overall SEO Score</h2>
          <div className="score-circle">
            <svg viewBox="0 0 200 200" className="score-svg">
              <circle cx="100" cy="100" r="90" className="score-bg" />
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                className="score-progress"
                style={{
                  strokeDasharray: `${seoScore.overall * 5.65} 565`,
                  stroke: seoScore.overall >= 80 ? '#27C93F' : seoScore.overall >= 60 ? '#FFBD2E' : '#FF5F56'
                }}
              />
            </svg>
            <div className="score-value">{seoScore.overall}</div>
          </div>
          <div className="score-label">
            {seoScore.overall >= 80 ? 'Excellent' : seoScore.overall >= 60 ? 'Good' : 'Needs Work'}
          </div>
        </div>

        <div className="score-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>⚙️ Technical SEO</span>
              <span className="breakdown-score">{seoScore.technical}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${seoScore.technical}%` }}></div>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>📝 Content Quality</span>
              <span className="breakdown-score">{seoScore.content}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${seoScore.content}%` }}></div>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>🔗 Backlinks</span>
              <span className="breakdown-score">{seoScore.backlinks}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${seoScore.backlinks}%` }}></div>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>📱 Mobile</span>
              <span className="breakdown-score">{seoScore.mobile}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${seoScore.mobile}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Tracking */}
      <div className="seo-section">
        <div className="section-header">
          <h2>Keyword Rankings</h2>
          <button className="btn btn-secondary">+ Add Keywords</button>
        </div>

        <div className="keywords-table">
          <div className="table-header">
            <div className="table-cell">Keyword</div>
            <div className="table-cell">Position</div>
            <div className="table-cell">Search Volume</div>
            <div className="table-cell">Difficulty</div>
            <div className="table-cell">Trend</div>
          </div>
          {keywords.map((kw, index) => (
            <div key={index} className="table-row">
              <div className="table-cell keyword-cell">
                <span className="keyword-text">{kw.keyword}</span>
              </div>
              <div className="table-cell">
                <span className={`position-badge ${kw.position <= 3 ? 'top' : kw.position <= 10 ? 'good' : 'moderate'}`}>
                  #{kw.position}
                </span>
              </div>
              <div className="table-cell">{kw.volume.toLocaleString()}/mo</div>
              <div className="table-cell">
                <span className={`difficulty-badge ${kw.difficulty >= 70 ? 'hard' : kw.difficulty >= 50 ? 'medium' : 'easy'}`}>
                  {kw.difficulty}
                </span>
              </div>
              <div className="table-cell">
                <span className={`trend-indicator ${kw.trend}`}>
                  {kw.trend === 'up' ? '📈' : kw.trend === 'down' ? '📉' : '➡️'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues & Recommendations */}
      <div className="seo-section">
        <div className="section-header">
          <h2>Issues & Recommendations</h2>
          <div className="issue-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">High</button>
            <button className="filter-btn">Medium</button>
            <button className="filter-btn">Low</button>
          </div>
        </div>

        <div className="issues-grid">
          {issues.map((issue, index) => (
            <div key={index} className="issue-card">
              <div className="issue-header">
                <span className={`severity-badge ${issue.severity}`}>
                  {issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢'}
                  {issue.severity.toUpperCase()}
                </span>
                <span className="issue-count">{issue.count} issues</span>
              </div>
              <h4 className="issue-type">{issue.type}</h4>
              <div className="issue-impact">Impact: {issue.impact}</div>
              <button className="fix-btn">Fix Issues →</button>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="seo-section">
        <div className="section-header">
          <h2>Competitor Analysis</h2>
          <button className="btn btn-secondary">+ Add Competitor</button>
        </div>

        <div className="competitors-grid">
          {competitors.map((comp, index) => (
            <div key={index} className="competitor-card">
              <div className="competitor-header">
                <h4>{comp.name}</h4>
                <span className="competitor-domain">{comp.domain}</span>
              </div>
              <div className="competitor-stats">
                <div className="competitor-stat">
                  <div className="competitor-stat-label">SEO Score</div>
                  <div className="competitor-stat-value">{comp.score}</div>
                </div>
                <div className="competitor-stat">
                  <div className="competitor-stat-label">Keywords</div>
                  <div className="competitor-stat-value">{comp.keywords.toLocaleString()}</div>
                </div>
              </div>
              <button className="analyze-btn">Analyze</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools */}
      <div className="quick-tools">
        <h3>SEO Tools</h3>
        <div className="tools-grid">
          <button className="tool-card">
            <span className="tool-icon">🔍</span>
            <div className="tool-info">
              <div className="tool-name">Keyword Research</div>
              <div className="tool-desc">Find new keywords</div>
            </div>
          </button>
          <button className="tool-card">
            <span className="tool-icon">📊</span>
            <div className="tool-info">
              <div className="tool-name">Site Audit</div>
              <div className="tool-desc">Full technical audit</div>
            </div>
          </button>
          <button className="tool-card">
            <span className="tool-icon">🔗</span>
            <div className="tool-info">
              <div className="tool-name">Backlink Analysis</div>
              <div className="tool-desc">Check backlinks</div>
            </div>
          </button>
          <button className="tool-card">
            <span className="tool-icon">📝</span>
            <div className="tool-info">
              <div className="tool-name">Content Optimizer</div>
              <div className="tool-desc">Optimize content</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SEO;
