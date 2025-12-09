import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import {
  generateAIImage,
  generateInfographicContent,
  generateVideoScript,
  generateCarouselContent,
  generateBlogOutline,
  generateNewsletterContent,
  generateAdCopy,
  generateContentBatch,
  repurposeContent
} from '../lib/mediaGenerator';
import './AIMediaStudio.css';

export default function AIMediaStudio() {
  const user = useAuthStore(state => state.user);
  const { profile, loadProfile } = useBusinessProfileStore();
  
  const [activeTab, setActiveTab] = useState('images');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form states for different media types
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('professional');
  
  const [infographicTopic, setInfographicTopic] = useState('');
  
  const [videoTopic, setVideoTopic] = useState('');
  const [videoDuration, setVideoDuration] = useState(30);
  
  const [carouselTopic, setCarouselTopic] = useState('');
  const [carouselSlides, setCarouselSlides] = useState(5);
  
  const [blogTopic, setBlogTopic] = useState('');
  const [blogLength, setBlogLength] = useState('medium');
  
  const [newsletterTopic, setNewsletterTopic] = useState('');
  const [newsletterSections, setNewsletterSections] = useState(3);
  
  const [adProduct, setAdProduct] = useState('');
  const [adPlatform, setAdPlatform] = useState('facebook');
  const [adGoal, setAdGoal] = useState('conversions');
  
  const [batchCount, setBatchCount] = useState(7);
  const [batchPlatforms, setBatchPlatforms] = useState(['linkedin', 'twitter']);
  const [batchTheme, setBatchTheme] = useState('');
  
  const [repurposeText, setRepurposeText] = useState('');
  const [repurposeFormats, setRepurposeFormats] = useState(['twitter', 'linkedin']);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    }
  }, [user]);

  const getBusinessContext = () => {
    return profile ? useBusinessProfileStore.getState().getContentContext() : '';
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAIImage(imagePrompt, getBusinessContext(), imageStyle);
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateInfographic = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateInfographicContent(infographicTopic, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateVideoScript(videoTopic, videoDuration, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateCarousel = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCarouselContent(carouselTopic, carouselSlides, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateBlogOutline(blogTopic, blogLength, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateNewsletter = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateNewsletterContent(newsletterTopic, newsletterSections, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateAd = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAdCopy(adProduct, adPlatform, adGoal, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGenerateBatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateContentBatch(batchCount, batchPlatforms, batchTheme, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRepurpose = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await repurposeContent(repurposeText, repurposeFormats, getBusinessContext());
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'images', label: '🎨 AI Images', icon: '🖼️' },
    { id: 'infographics', label: '📊 Infographics', icon: '📈' },
    { id: 'videos', label: '🎬 Video Scripts', icon: '🎥' },
    { id: 'carousels', label: '📱 Carousels', icon: '📲' },
    { id: 'blogs', label: '📝 Blog Posts', icon: '✍️' },
    { id: 'newsletters', label: '📧 Newsletters', icon: '✉️' },
    { id: 'ads', label: '💰 Ad Copy', icon: '📣' },
    { id: 'batch', label: '📅 Content Batch', icon: '🗓️' },
    { id: 'repurpose', label: '♻️ Repurpose', icon: '🔄' }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'images':
        return (
          <div className="media-form">
            <h3>Generate AI Images</h3>
            <p className="form-description">Create custom images for your social media posts, blog headers, and marketing materials.</p>
            
            <div className="form-group">
              <label>Image Description</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="E.g., A professional business person working on a laptop in a modern office, vibrant colors, inspiring atmosphere..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Style</label>
              <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)}>
                <option value="professional">Professional</option>
                <option value="creative">Creative & Artistic</option>
                <option value="minimalist">Minimalist</option>
                <option value="realistic">Photorealistic</option>
                <option value="illustration">Illustration</option>
                <option value="3d">3D Render</option>
              </select>
            </div>

            <button onClick={handleGenerateImage} disabled={loading || !imagePrompt} className="btn-generate">
              {loading ? '⏳ Generating...' : '✨ Generate Image'}
            </button>

            <div className="info-box">
              <strong>🎨 FREE AI Image Generation:</strong>
              <br/><br/>
              <strong>✅ Pollinations AI (Flux Model) - Primary</strong>
              <br/>• Uses advanced Flux model for better quality
              <br/>• Completely FREE, unlimited generations
              <br/>• No API key needed
              <br/>• Better than basic DeepAI
              <br/><br/>
              <strong>Backup Services:</strong>
              <br/>• Leonardo.ai - Best quality (150 free tokens/day, requires signup)
              <br/>• DeepAI - Stable Diffusion endpoint
              <br/>• Hugging Face - Free with rate limits
              <br/>• Stock photos - Always works
              <br/><br/>
              <strong>💡 Pro Tip:</strong> For best quality, sign up for FREE Leonardo.ai (30 images/day) at <a href="https://leonardo.ai" target="_blank" rel="noopener noreferrer">leonardo.ai</a>
            </div>
          </div>
        );

      case 'infographics':
        return (
          <div className="media-form">
            <h3>Generate Infographic Content</h3>
            <p className="form-description">Create data-driven infographics with statistics, facts, and visual layouts.</p>
            
            <div className="form-group">
              <label>Infographic Topic</label>
              <input
                type="text"
                value={infographicTopic}
                onChange={(e) => setInfographicTopic(e.target.value)}
                placeholder="E.g., Top 10 Marketing Statistics for 2024, Benefits of Remote Work..."
              />
            </div>

            <button onClick={handleGenerateInfographic} disabled={loading || !infographicTopic} className="btn-generate">
              {loading ? '⏳ Generating...' : '📊 Generate Infographic Content'}
            </button>
          </div>
        );

      case 'videos':
        return (
          <div className="media-form">
            <h3>Generate Video Scripts</h3>
            <p className="form-description">Create engaging scripts for TikTok, Instagram Reels, and YouTube Shorts.</p>
            
            <div className="form-group">
              <label>Video Topic</label>
              <input
                type="text"
                value={videoTopic}
                onChange={(e) => setVideoTopic(e.target.value)}
                placeholder="E.g., 3 productivity hacks for entrepreneurs..."
              />
            </div>

            <div className="form-group">
              <label>Duration (seconds)</label>
              <select value={videoDuration} onChange={(e) => setVideoDuration(Number(e.target.value))}>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90">90 seconds</option>
              </select>
            </div>

            <button onClick={handleGenerateVideo} disabled={loading || !videoTopic} className="btn-generate">
              {loading ? '⏳ Generating...' : '🎬 Generate Video Script'}
            </button>
          </div>
        );

      case 'carousels':
        return (
          <div className="media-form">
            <h3>Generate Carousel Posts</h3>
            <p className="form-description">Create multi-slide posts for Instagram and LinkedIn with engaging content.</p>
            
            <div className="form-group">
              <label>Carousel Topic</label>
              <input
                type="text"
                value={carouselTopic}
                onChange={(e) => setCarouselTopic(e.target.value)}
                placeholder="E.g., 5 steps to grow your business online..."
              />
            </div>

            <div className="form-group">
              <label>Number of Slides</label>
              <select value={carouselSlides} onChange={(e) => setCarouselSlides(Number(e.target.value))}>
                <option value="3">3 slides</option>
                <option value="5">5 slides</option>
                <option value="7">7 slides</option>
                <option value="10">10 slides</option>
              </select>
            </div>

            <button onClick={handleGenerateCarousel} disabled={loading || !carouselTopic} className="btn-generate">
              {loading ? '⏳ Generating...' : '📱 Generate Carousel'}
            </button>
          </div>
        );

      case 'blogs':
        return (
          <div className="media-form">
            <h3>Generate Blog Post Outlines</h3>
            <p className="form-description">Create comprehensive blog post structures with SEO optimization.</p>
            
            <div className="form-group">
              <label>Blog Topic</label>
              <input
                type="text"
                value={blogTopic}
                onChange={(e) => setBlogTopic(e.target.value)}
                placeholder="E.g., Complete guide to social media marketing in 2024..."
              />
            </div>

            <div className="form-group">
              <label>Target Length</label>
              <select value={blogLength} onChange={(e) => setBlogLength(e.target.value)}>
                <option value="short">Short (800-1200 words)</option>
                <option value="medium">Medium (1500-2000 words)</option>
                <option value="long">Long (2500-3500 words)</option>
              </select>
            </div>

            <button onClick={handleGenerateBlog} disabled={loading || !blogTopic} className="btn-generate">
              {loading ? '⏳ Generating...' : '📝 Generate Blog Outline'}
            </button>
          </div>
        );

      case 'newsletters':
        return (
          <div className="media-form">
            <h3>Generate Email Newsletters</h3>
            <p className="form-description">Create engaging email content that drives opens and clicks.</p>
            
            <div className="form-group">
              <label>Newsletter Topic</label>
              <input
                type="text"
                value={newsletterTopic}
                onChange={(e) => setNewsletterTopic(e.target.value)}
                placeholder="E.g., Weekly marketing tips, Product updates..."
              />
            </div>

            <div className="form-group">
              <label>Number of Sections</label>
              <select value={newsletterSections} onChange={(e) => setNewsletterSections(Number(e.target.value))}>
                <option value="2">2 sections</option>
                <option value="3">3 sections</option>
                <option value="4">4 sections</option>
                <option value="5">5 sections</option>
              </select>
            </div>

            <button onClick={handleGenerateNewsletter} disabled={loading || !newsletterTopic} className="btn-generate">
              {loading ? '⏳ Generating...' : '📧 Generate Newsletter'}
            </button>
          </div>
        );

      case 'ads':
        return (
          <div className="media-form">
            <h3>Generate Ad Copy</h3>
            <p className="form-description">Create high-converting ad copy for multiple platforms.</p>
            
            <div className="form-group">
              <label>Product/Service</label>
              <input
                type="text"
                value={adProduct}
                onChange={(e) => setAdProduct(e.target.value)}
                placeholder="E.g., Marketing automation software, Online course..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Platform</label>
                <select value={adPlatform} onChange={(e) => setAdPlatform(e.target.value)}>
                  <option value="facebook">Facebook/Instagram</option>
                  <option value="google">Google Ads</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter/X</option>
                </select>
              </div>

              <div className="form-group">
                <label>Campaign Goal</label>
                <select value={adGoal} onChange={(e) => setAdGoal(e.target.value)}>
                  <option value="conversions">Conversions/Sales</option>
                  <option value="leads">Lead Generation</option>
                  <option value="awareness">Brand Awareness</option>
                  <option value="engagement">Engagement</option>
                  <option value="traffic">Website Traffic</option>
                </select>
              </div>
            </div>

            <button onClick={handleGenerateAd} disabled={loading || !adProduct} className="btn-generate">
              {loading ? '⏳ Generating...' : '💰 Generate Ad Copy'}
            </button>
          </div>
        );

      case 'batch':
        return (
          <div className="media-form">
            <h3>Generate Content Batch</h3>
            <p className="form-description">Create multiple posts at once for your content calendar.</p>
            
            <div className="form-group">
              <label>Content Theme</label>
              <input
                type="text"
                value={batchTheme}
                onChange={(e) => setBatchTheme(e.target.value)}
                placeholder="E.g., Productivity week, Product launch campaign..."
              />
            </div>

            <div className="form-group">
              <label>Number of Posts</label>
              <select value={batchCount} onChange={(e) => setBatchCount(Number(e.target.value))}>
                <option value="5">5 posts</option>
                <option value="7">7 posts (week)</option>
                <option value="14">14 posts (2 weeks)</option>
                <option value="30">30 posts (month)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Platforms</label>
              <div className="checkbox-group">
                {['linkedin', 'twitter', 'facebook', 'instagram'].map(platform => (
                  <label key={platform} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={batchPlatforms.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBatchPlatforms([...batchPlatforms, platform]);
                        } else {
                          setBatchPlatforms(batchPlatforms.filter(p => p !== platform));
                        }
                      }}
                    />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleGenerateBatch} disabled={loading || !batchTheme || batchPlatforms.length === 0} className="btn-generate">
              {loading ? '⏳ Generating...' : '📅 Generate Content Batch'}
            </button>
          </div>
        );

      case 'repurpose':
        return (
          <div className="media-form">
            <h3>Repurpose Content</h3>
            <p className="form-description">Transform one piece of content into multiple formats for different platforms.</p>
            
            <div className="form-group">
              <label>Original Content</label>
              <textarea
                value={repurposeText}
                onChange={(e) => setRepurposeText(e.target.value)}
                placeholder="Paste your blog post, article, or long-form content here..."
                rows="6"
              />
            </div>

            <div className="form-group">
              <label>Target Formats</label>
              <div className="checkbox-group">
                {['twitter', 'linkedin', 'instagram', 'tiktok', 'email', 'blog'].map(format => (
                  <label key={format} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={repurposeFormats.includes(format)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRepurposeFormats([...repurposeFormats, format]);
                        } else {
                          setRepurposeFormats(repurposeFormats.filter(f => f !== format));
                        }
                      }}
                    />
                    {format.charAt(0).toUpperCase() + format.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleRepurpose} disabled={loading || !repurposeText || repurposeFormats.length === 0} className="btn-generate">
              {loading ? '⏳ Repurposing...' : '♻️ Repurpose Content'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="ai-media-studio">
      <div className="page-header">
        <h1>🎨 AI Media Studio</h1>
        <p>Generate images, videos, infographics, and more with AI</p>
        {!profile && (
          <div className="warning-banner">
            ⚠️ Complete your <a href="/dashboard/business-profile">Business Profile</a> for personalized content
          </div>
        )}
      </div>

      <div className="studio-container">
        <div className="tabs-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setResult(null);
                setError(null);
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="studio-content">
          <div className="content-generator">
            {renderTabContent()}
          </div>

          {error && (
            <div className="error-message">
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="result-container">
              <div className="result-header">
                <h3>✨ Generated Content</h3>
                <button 
                  className="btn-copy"
                  onClick={() => {
                    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                    navigator.clipboard.writeText(text);
                    alert('Copied to clipboard!');
                  }}
                >
                  📋 Copy
                </button>
              </div>

              <div className="result-content">
                {result.imageUrl && (
                  <div className="image-result">
                    <div className="generated-image-container">
                      <img src={result.imageUrl} alt="AI Generated" className="generated-image" />
                      {result.downloadable && (
                        <a 
                          href={result.imageUrl} 
                          download="ai-generated-image.png"
                          className="btn-download-image"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📥 Download Image
                        </a>
                      )}
                    </div>
                    
                    <div className="image-info">
                      <p className="success-note"><strong>✅ {result.note}</strong></p>
                      {result.service && (
                        <p className="service-badge">🎨 Service: {result.service}</p>
                      )}
                      
                      <div className="prompt-details">
                        <div className="prompt-section">
                          <h4>📝 Your Original Prompt:</h4>
                          <p className="prompt-text">{result.prompt}</p>
                        </div>
                        
                        {result.enhancedPrompt && result.enhancedPrompt !== result.prompt && (
                          <div className="prompt-section">
                            <h4>✨ Enhanced Prompt (used for generation):</h4>
                            <p className="prompt-text">{result.enhancedPrompt}</p>
                          </div>
                        )}
                        
                        {result.recommendation && (
                          <div className="prompt-section recommendation">
                            <h4>💡 Want Better AI Images?</h4>
                            <p className="prompt-text">{result.recommendation}</p>
                          </div>
                        )}
                        
                        {result.errors && result.errors.length > 0 && (
                          <div className="prompt-section errors">
                            <h4>ℹ️ Services Attempted:</h4>
                            <ul>
                              {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="image-actions">
                        <button 
                          className="btn-regenerate"
                          onClick={() => handleGenerateImage()}
                        >
                          🔄 Generate Another
                        </button>
                        <button 
                          className="btn-copy"
                          onClick={() => {
                            navigator.clipboard.writeText(result.imageUrl);
                            alert('Image URL copied to clipboard!');
                          }}
                        >
                          📋 Copy URL
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {result.script && (
                  <pre className="content-preview">{result.script}</pre>
                )}
                
                {result.content && (
                  <pre className="content-preview">{result.content}</pre>
                )}
                
                {result.outline && (
                  <pre className="content-preview">{result.outline}</pre>
                )}
                
                {result.copy && (
                  <pre className="content-preview">{result.copy}</pre>
                )}
                
                {result.rawText && (
                  <pre className="content-preview">{result.rawText}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}