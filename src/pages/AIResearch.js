import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import './AIResearch.css';

function AIResearch() {
  const user = useAuthStore((state) => state.user);
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'Please enter a URL' });
      return;
    }

    setAnalyzing(true);
    setMessage({ type: '', text: '' });

    try {
      // Try to use edge function if available, otherwise do basic analysis
      const { data, error } = await supabase.functions.invoke('website-crawler', {
        body: { url, userId: user?.id }
      });

      if (error) {
        // Fallback to basic fetch
        const response = await fetch(url);
        const html = await response.text();
        
        // Extract basic info
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
        const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
        const paragraphs = html.match(/<p[^>]*>([^<]+)<\/p>/gi) || [];
        
        // Generate basic post ideas
        const postIdeas = [
          {
            title: `Key Insights from ${new URL(url).hostname}`,
            content: `Discovered interesting content about ${titleMatch ? titleMatch[1] : 'this topic'}. Here's what stood out...`,
            type: 'educational'
          },
          {
            title: `What We Can Learn from ${new URL(url).hostname}`,
            content: `After analyzing their approach, here are the top takeaways...`,
            type: 'insights'
          },
          {
            title: `Industry Trends: Analysis of ${new URL(url).hostname}`,
            content: `Latest trends and strategies observed...`,
            type: 'trends'
          }
        ];

        setResults({
          summary: `Analyzed ${new URL(url).hostname}. Found ${h1Matches.length} main headings and ${paragraphs.length} content sections.`,
          title: titleMatch ? titleMatch[1] : 'No title found',
          headings: h1Matches.length + h2Matches.length,
          post_ideas: postIdeas,
          topics: extractTopics(html)
        });
      } else {
        setResults(data.analysis);
      }

      setMessage({ type: 'success', text: 'Analysis complete!' });
    } catch (error) {
      setMessage({ type: 'error', text: `Analysis failed: ${error.message}` });
    } finally {
      setAnalyzing(false);
    }
  };

  const extractTopics = (html) => {
    const words = html.replace(/<[^>]*>/g, ' ').toLowerCase().split(/\s+/);
    const common = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were'];
    const filtered = words.filter(w => w.length > 4 && !common.includes(w));
    const counts = {};
    filtered.forEach(w => counts[w] = (counts[w] || 0) + 1);
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);
  };

  return (
    <div className="ai-research-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">AI Research</h1>
          <p className="text-secondary mt-2">Analyze websites and generate content ideas</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="section-card">
        <h2 className="text-2xl font-semibold mb-6">Analyze Website</h2>
        <div className="url-input-section">
          <input
            type="url"
            className="url-input"
            placeholder="Enter website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="btn btn-primary" onClick={analyzeWebsite} disabled={analyzing}>
            {analyzing ? '🔍 Analyzing...' : '🔍 Analyze'}
          </button>
        </div>
      </div>

      {results && (
        <>
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Summary</h2>
            <p>{results.summary}</p>
            <div className="metrics-grid">
              <div className="metric"><strong>Title:</strong> {results.title}</div>
              <div className="metric"><strong>Headings:</strong> {results.headings}</div>
            </div>
          </div>

          {results.topics && results.topics.length > 0 && (
            <div className="section-card">
              <h2 className="text-2xl font-semibold mb-6">Key Topics</h2>
              <div className="topics-list">
                {results.topics.map((topic, i) => (
                  <span key={i} className="topic-tag">{topic}</span>
                ))}
              </div>
            </div>
          )}

          {results.post_ideas && results.post_ideas.length > 0 && (
            <div className="section-card">
              <h2 className="text-2xl font-semibold mb-6">Content Ideas</h2>
              <div className="ideas-list">
                {results.post_ideas.map((idea, i) => (
                  <div key={i} className="idea-card">
                    <h3>{idea.title}</h3>
                    <p>{idea.content}</p>
                    <span className="badge">{idea.type}</span>
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

export default AIResearch;
