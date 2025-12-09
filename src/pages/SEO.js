import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import './SEO.css';

function SEO() {
  const user = useAuthStore((state) => state.user);
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const analyzeSEO = async () => {
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'Please enter a URL' });
      return;
    }

    setAnalyzing(true);
    setMessage({ type: '', text: '' });

    try {
      // Fetch the page
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse basic SEO metrics
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const imgCount = (html.match(/<img/gi) || []).length;
      const imgAltCount = (html.match(/<img[^>]+alt=/gi) || []).length;
      
      // Calculate score
      let score = 0;
      const issues = [];
      const recommendations = [];

      if (titleMatch) {
        score += 20;
        if (titleMatch[1].length < 30 || titleMatch[1].length > 60) {
          recommendations.push('Title length should be between 30-60 characters');
        }
      } else {
        issues.push('Missing page title');
      }

      if (descMatch) {
        score += 20;
        if (descMatch[1].length < 120 || descMatch[1].length > 160) {
          recommendations.push('Meta description should be 120-160 characters');
        }
      } else {
        issues.push('Missing meta description');
      }

      if (h1Match) {
        score += 15;
      } else {
        issues.push('Missing H1 tag');
      }

      if (url.startsWith('https://')) {
        score += 15;
      } else {
        issues.push('Not using HTTPS');
      }

      if (imgCount > 0) {
        const altPercentage = (imgAltCount / imgCount) * 100;
        if (altPercentage > 80) {
          score += 15;
        } else {
          issues.push(`Only ${altPercentage.toFixed(0)}% of images have alt text`);
        }
      }

      score += 15; // Base score for having content

      setResults({
        score,
        title: titleMatch ? titleMatch[1] : 'No title found',
        description: descMatch ? descMatch[1] : 'No description found',
        h1: h1Match ? h1Match[1] : 'No H1 found',
        images: imgCount,
        imagesWithAlt: imgAltCount,
        https: url.startsWith('https://'),
        issues,
        recommendations
      });

      setMessage({ type: 'success', text: 'Analysis complete!' });
    } catch (error) {
      setMessage({ type: 'error', text: `Analysis failed: ${error.message}` });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="seo-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">SEO Tools</h1>
          <p className="text-secondary mt-2">Analyze and optimize your content for search engines</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Analyze Website</h2>
        <div className="url-input-section">
          <input
            type="url"
            className="url-input"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            className="btn btn-primary"
            onClick={analyzeSEO}
            disabled={analyzing}
          >
            {analyzing ? '🔍 Analyzing...' : '🔍 Analyze'}
          </button>
        </div>
      </div>

      {results && (
        <>
          <div className="seo-score">
            <div className="score-circle" style={{
              background: `conic-gradient(#10b981 ${results.score * 3.6}deg, #e5e7eb ${results.score * 3.6}deg)`
            }}>
              <div className="score-inner">
                <div className="score-value">{results.score}</div>
                <div className="score-label">SEO Score</div>
              </div>
            </div>
            <div className="score-info">
              <h3>Overall Rating: {results.score >= 80 ? 'Excellent' : results.score >= 60 ? 'Good' : 'Needs Improvement'}</h3>
              <p>Your website has {results.issues.length} issues to fix</p>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Page Analysis</h2>
            <div className="analysis-grid">
              <div className="analysis-item">
                <strong>Title:</strong>
                <p>{results.title}</p>
              </div>
              <div className="analysis-item">
                <strong>Description:</strong>
                <p>{results.description}</p>
              </div>
              <div className="analysis-item">
                <strong>H1 Tag:</strong>
                <p>{results.h1}</p>
              </div>
              <div className="analysis-item">
                <strong>Images:</strong>
                <p>{results.images} total, {results.imagesWithAlt} with alt text</p>
              </div>
              <div className="analysis-item">
                <strong>HTTPS:</strong>
                <p>{results.https ? '✅ Secure' : '❌ Not secure'}</p>
              </div>
            </div>
          </div>

          {results.issues.length > 0 && (
            <div className="section-card">
              <h2 className="text-2xl font-semibold mb-6">Issues Found</h2>
              <div className="issues-list">
                {results.issues.map((issue, i) => (
                  <div key={i} className="issue-item error">
                    <span className="issue-icon">❌</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.recommendations.length > 0 && (
            <div className="section-card">
              <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>
              <div className="issues-list">
                {results.recommendations.map((rec, i) => (
                  <div key={i} className="issue-item warning">
                    <span className="issue-icon">⚠️</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SEO;
