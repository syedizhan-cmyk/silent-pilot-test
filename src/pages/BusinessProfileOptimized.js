import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import { discoverBusinessInfo } from '../lib/businessDiscovery';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  Edit3, 
  RefreshCw,
  Target,
  Palette,
  ShoppingBag,
  Share2,
  Globe,
  TrendingUp,
  Users,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';
import './BusinessProfileOptimized.css';

export default function BusinessProfileOptimized() {
  const user = useAuthStore(state => state.user);
  const { profile, loading: storeLoading, loadProfile, saveProfile } = useBusinessProfileStore();

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1); // 0: Saved View, 1: Input, 2: Discovery, 3: Review
  
  // Basic inputs
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [hasWebsite, setHasWebsite] = useState(true);
  
  // Discovery state
  const [discovering, setDiscovering] = useState(false);
  const [discoveryProgress, setDiscoveryProgress] = useState({ stage: '', progress: 0, message: '' });
  const [discoveredData, setDiscoveredData] = useState(null);
  
  // Review/edit state
  const [editableData, setEditableData] = useState({
    description: '',
    products_services: [],
    target_audience: '',
    brand_voice: { tone: 'professional', style: 'informative' },
    platforms: ['facebook', 'instagram', 'linkedin', 'twitter']
  });
  
  const [saving, setSaving] = useState(false);

  // Load existing profile if available
  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    }
  }, [user, loadProfile]);

  // Track if we've already loaded the profile on mount
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  useEffect(() => {
    if (profile && !hasLoadedProfile) {
      console.log('📋 Profile loaded:', profile);
      
      // Pre-fill input fields from saved profile (only once on mount)
      setBusinessName(profile.business_name || '');
      setIndustry(profile.industry || '');
      setWebsite(profile.website || '');
      
      // Handle target_audience - it can be a string or object
      let targetAudienceText = '';
      if (typeof profile.target_audience === 'string') {
        targetAudienceText = profile.target_audience;
      } else if (profile.target_audience?.demographics) {
        targetAudienceText = profile.target_audience.demographics;
      }
      
      setEditableData({
        description: profile.description || '',
        products_services: profile.products_services || [],
        target_audience: targetAudienceText,
        brand_voice: profile.brand_voice || { tone: 'professional', style: 'informative' },
        platforms: profile.platforms || ['facebook', 'instagram', 'linkedin', 'twitter']
      });
      
      // Only show saved view if profile has meaningful data
      // Check if profile has description AND at least business name
      if (profile.description && profile.business_name) {
        setCurrentStep(0);
      } else {
        // New user or incomplete profile - start from step 1
        setCurrentStep(1);
      }
      
      // Mark as loaded so we don't keep resetting the form
      setHasLoadedProfile(true);
    }
  }, [profile, hasLoadedProfile]);

  // Handle discovery
  const handleDiscoverBusiness = async () => {
    if (!businessName || !industry) {
      alert('Please enter your business name and industry');
      return;
    }

    setDiscovering(true);
    setCurrentStep(2);

    try {
      const result = await discoverBusinessInfo(
        businessName,
        industry,
        hasWebsite ? website : null,
        (progress) => setDiscoveryProgress(progress)
      );

      if (result.success) {
        setDiscoveredData(result.data);
        
        // Pre-fill editable data with discovered info
        console.log('📊 Discovery Result:', result.data);
        
        setEditableData({
          description: result.data.description || '',
          products_services: [
            ...result.data.products.map(p => ({ 
              name: p, 
              description: '', 
              category: 'product' 
            })),
            ...result.data.services.map(s => ({ 
              name: s, 
              description: '', 
              category: 'service' 
            }))
          ].filter((item, index, self) => 
            // Remove duplicates based on name
            index === self.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
          ),
          target_audience: result.data.targetAudience || '',
          brand_voice: result.data.brandVoice || { tone: 'professional', style: 'informative' },
          platforms: ['facebook', 'instagram', 'linkedin', 'twitter']
        });
        
        console.log('✅ Editable Data Set:', {
          description: result.data.description,
          targetAudience: result.data.targetAudience,
          products: result.data.products?.length,
          services: result.data.services?.length
        });
        
        setCurrentStep(3);
      } else {
        alert('Discovery completed with limited data. Please review and add details.');
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Discovery error:', error);
      alert('Unable to discover business info. Please enter details manually.');
      setCurrentStep(3);
    } finally {
      setDiscovering(false);
    }
  };

  // Handle save
  const handleSaveProfile = async () => {
    if (!businessName || !industry || !editableData.description) {
      alert('Please fill in required fields: Business Name, Industry, and Description');
      return;
    }

    setSaving(true);
    
    try {
      const profileData = {
        business_name: businessName,
        industry: industry,
        website: hasWebsite ? website : null,
        description: editableData.description,
        products_services: editableData.products_services,
        // Store target_audience as string for simplicity
        target_audience: editableData.target_audience,
        brand_voice: editableData.brand_voice
      };

      // Add optional discovery metadata if available (requires migration)
      if (discoveredData?.sources) {
        profileData.discovery_sources = discoveredData.sources;
      }
      if (discoveredData) {
        profileData.discovery_confidence = calculateConfidence(discoveredData);
      }
      if (editableData.platforms?.length) {
        profileData.platforms = editableData.platforms;
      }

      const result = await saveProfile(user.id, profileData);
      
      if (result.success) {
        alert('✅ Business profile saved successfully!');
      } else {
        alert('Error saving profile: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Add product/service
  const handleAddProductService = () => {
    const name = prompt('Enter product or service name:');
    if (name) {
      setEditableData({
        ...editableData,
        products_services: [
          ...editableData.products_services,
          { name, description: '', category: 'product' }
        ]
      });
    }
  };

  // Remove product/service
  const handleRemoveProductService = (index) => {
    setEditableData({
      ...editableData,
      products_services: editableData.products_services.filter((_, i) => i !== index)
    });
  };

  // Calculate confidence score
  const calculateConfidence = (data) => {
    let score = 0;
    if (data.description) score += 20;
    if (data.services?.length || data.products?.length) score += 20;
    if (data.targetAudience) score += 15;
    if (data.brandVoice) score += 15;
    if (data.sources?.includes('website')) score += 20;
    if (data.sources?.includes('google') || data.sources?.includes('yelp')) score += 10;
    return Math.min(score, 100);
  };

  if (storeLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="business-profile-page">
      <div className="page-header">
        <h1><Building2 className="header-icon" size={40} /> Business Profile</h1>
        <p>Let AI discover your business information automatically</p>
      </div>

      {/* Step Indicator - Only show when in discovery flow */}
      {currentStep > 0 && (
        <div className="profile-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'complete' : ''}`}>
            <span className="step-number">
              {currentStep > 1 ? <span className="step-check">✓</span> : '1'}
            </span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'complete' : ''}`}>
            <span className="step-number">
              {currentStep > 2 ? <span className="step-check">✓</span> : '2'}
            </span>
            <span className="step-label">Discovery</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Review & Save</span>
          </div>
        </div>
      )}

      {/* Step 0: Saved Profile View */}
      {currentStep === 0 && (
        <div className="profile-step-content">
          <div className="saved-profile-view">
            <div className="profile-header">
              <h2><CheckCircle2 className="header-icon" /> Your Business Profile</h2>
              <p className="profile-subtitle">Here's your saved business information</p>
            </div>

            <div className="profile-summary-cards">
              {/* Business Info Card */}
              <div className="summary-card">
                <div className="summary-card-header">
                  <h3><Building2 size={20} className="card-icon" /> Business Information</h3>
                </div>
                <div className="summary-card-body">
                  <div className="summary-item">
                    <span className="summary-label">Name:</span>
                    <span className="summary-value">{businessName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Industry:</span>
                    <span className="summary-value">{industry}</span>
                  </div>
                  {website && (
                    <div className="summary-item">
                      <span className="summary-label">Website:</span>
                      <a href={website} target="_blank" rel="noopener noreferrer" className="summary-link">{website}</a>
                    </div>
                  )}
                  <div className="summary-item full-width">
                    <span className="summary-label">Description:</span>
                    <p className="summary-description">{editableData.description}</p>
                  </div>
                </div>
              </div>

              {/* Target Audience Card */}
              <div className="summary-card">
                <div className="summary-card-header">
                  <h3><Target size={20} className="card-icon" /> Target Audience</h3>
                </div>
                <div className="summary-card-body">
                  <p className="summary-text">{editableData.target_audience}</p>
                </div>
              </div>

              {/* Brand Voice Card */}
              <div className="summary-card">
                <div className="summary-card-header">
                  <h3><Palette size={20} className="card-icon" /> Brand Voice</h3>
                </div>
                <div className="summary-card-body">
                  <div className="summary-item">
                    <span className="summary-label">Tone:</span>
                    <span className="summary-value">{editableData.brand_voice?.tone}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Style:</span>
                    <span className="summary-value">{editableData.brand_voice?.style}</span>
                  </div>
                </div>
              </div>

              {/* Products/Services Card */}
              {editableData.products_services?.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <h3><ShoppingBag size={20} className="card-icon" /> Products & Services</h3>
                  </div>
                  <div className="summary-card-body">
                    <ul className="summary-list">
                      {editableData.products_services.map((item, index) => (
                        <li key={index}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Platforms Card */}
              {editableData.platforms?.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <h3><Share2 size={20} className="card-icon" /> Social Media Platforms</h3>
                  </div>
                  <div className="summary-card-body">
                    <div className="platform-badges">
                      {editableData.platforms.map((platform, index) => (
                        <span key={index} className="platform-badge">{platform}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-actions">
              <button className="btn btn-secondary btn-lg" onClick={() => setCurrentStep(3)}>
                <Edit3 size={20} /> Edit Profile
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => setCurrentStep(1)}>
                <RefreshCw size={20} /> Re-discover Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Basic Input */}
      {currentStep === 1 && (
        <div className="profile-step-content">
          <div className="form-section">
            <h2>📝 Tell Us About Your Business</h2>
            <p className="section-description">
              Just the basics - we'll automatically discover the rest!
            </p>

            <div className="form-group">
              <label style={{ color: 'var(--text-primary)' }}>Business Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                className="input-large"
              />
            </div>

            <div className="form-group">
              <label style={{ color: 'var(--text-primary)' }}>Industry *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="input-large"
              >
                <option value="">Select your industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="education">Education</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="real-estate">Real Estate</option>
                <option value="consulting">Consulting</option>
                <option value="marketing">Marketing & Advertising</option>
                <option value="hospitality">Hospitality & Tourism</option>
                <option value="food-beverage">Food & Beverage</option>
                <option value="fitness">Fitness & Wellness</option>
                <option value="automotive">Automotive</option>
                <option value="construction">Construction</option>
                <option value="legal">Legal Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hasWebsite}
                  onChange={(e) => setHasWebsite(e.target.checked)}
                />
                <span>I have a website</span>
              </label>
            </div>

            {hasWebsite && (
              <div className="form-group">
                <label style={{ color: 'var(--text-primary)' }}>Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="input-large"
                />
                <small className="input-hint">
                  We'll analyze your website to learn about your business
                </small>
              </div>
            )}

            {!hasWebsite && (
              <div className="info-box">
                <span className="info-icon">💡</span>
                <div>
                  <strong>No website? No problem!</strong>
                  <p>We'll search for your business on Google, Yelp, social media, and other platforms to gather information.</p>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button 
                className="btn-primary btn-large"
                onClick={handleDiscoverBusiness}
                disabled={!businessName || !industry}
              >
                <Sparkles size={20} />
                <span>Discover My Business</span>
              </button>
              {profile && profile.description && (
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentStep(3)}
                >
                  Skip to Edit Profile →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Discovery in Progress */}
      {currentStep === 2 && discovering && (
        <div className="profile-step-content">
          <div className="discovery-progress">
            <div className="discovery-animation">
              <div className="pulse-circle"></div>
              <div className="search-icon">
                <Search size={48} />
              </div>
            </div>
            
            <h2>Discovering Your Business...</h2>
            <p className="discovery-message">{discoveryProgress.message}</p>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${discoveryProgress.progress}%` }}
              ></div>
            </div>
            <div className="progress-text">{discoveryProgress.progress}%</div>

            <div className="discovery-stages">
              <div className={`stage ${discoveryProgress.stage === 'website' ? 'active' : discoveryProgress.progress > 20 ? 'complete' : ''}`}>
                <span className="stage-icon">🌐</span>
                <span>Analyzing Website</span>
              </div>
              <div className={`stage ${discoveryProgress.stage === 'online_presence' ? 'active' : discoveryProgress.progress > 40 ? 'complete' : ''}`}>
                <span className="stage-icon">🔎</span>
                <span>Searching Online</span>
              </div>
              <div className={`stage ${discoveryProgress.stage === 'ai_analysis' ? 'active' : discoveryProgress.progress > 60 ? 'complete' : ''}`}>
                <span className="stage-icon">🧠</span>
                <span>AI Analysis</span>
              </div>
              <div className={`stage ${discoveryProgress.stage === 'complete' ? 'complete' : ''}`}>
                <span className="stage-icon">✨</span>
                <span>Finalizing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review & Edit */}
      {currentStep === 3 && (
        <div className="profile-step-content">
          <div className="review-header">
            <h2>✨ Review Your Business Profile</h2>
            {discoveredData && (
              <div className="confidence-badge">
                <span className="confidence-label">Discovery Confidence:</span>
                <span className="confidence-score">{calculateConfidence(discoveredData)}%</span>
                {discoveredData.sources?.length > 0 && (
                  <small className="sources-used">
                    Sources: {discoveredData.sources.join(', ')}
                  </small>
                )}
              </div>
            )}
          </div>

          <div className="review-sections">
            {/* Description */}
            <div className="review-card">
              <div className="card-header">
                <h3>📝 Business Description</h3>
                {discoveredData?.description && (
                  <span className="auto-badge">Auto-filled</span>
                )}
              </div>
              <textarea
                value={editableData.description}
                onChange={(e) => setEditableData({ ...editableData, description: e.target.value })}
                placeholder="Describe your business..."
                rows="4"
                className="review-input"
              />
            </div>

            {/* Products & Services */}
            <div className="review-card">
              <div className="card-header">
                <h3>🛍️ Products & Services</h3>
                {discoveredData?.products?.length > 0 && (
                  <span className="auto-badge">Auto-discovered</span>
                )}
              </div>
              <div className="products-list">
                {editableData.products_services.map((item, index) => (
                  <div key={index} className="product-item">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...editableData.products_services];
                        updated[index].name = e.target.value;
                        setEditableData({ ...editableData, products_services: updated });
                      }}
                      className="product-name-input"
                    />
                    <button
                      className="btn-remove-small"
                      onClick={() => handleRemoveProductService(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="btn-add-item" onClick={handleAddProductService}>
                  + Add Product/Service
                </button>
              </div>
            </div>

            {/* Target Audience */}
            <div className="review-card">
              <div className="card-header">
                <h3>🎯 Target Audience</h3>
                {discoveredData?.targetAudience && (
                  <span className="auto-badge">AI-generated</span>
                )}
              </div>
              <textarea
                value={editableData.target_audience}
                onChange={(e) => setEditableData({ ...editableData, target_audience: e.target.value })}
                placeholder="Describe your ideal customers..."
                rows="3"
                className="review-input"
              />
            </div>

            {/* Brand Voice */}
            <div className="review-card">
              <div className="card-header">
                <h3>🎨 Brand Voice</h3>
                {discoveredData?.brandVoice && (
                  <span className="auto-badge">AI-suggested</span>
                )}
              </div>
              <div className="brand-voice-selectors">
                <div className="voice-group">
                  <label>Tone</label>
                  <select
                    value={editableData.brand_voice.tone}
                    onChange={(e) => setEditableData({
                      ...editableData,
                      brand_voice: { ...editableData.brand_voice, tone: e.target.value }
                    })}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="inspirational">Inspirational</option>
                    <option value="humorous">Humorous</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>
                <div className="voice-group">
                  <label>Style</label>
                  <select
                    value={editableData.brand_voice.style}
                    onChange={(e) => setEditableData({
                      ...editableData,
                      brand_voice: { ...editableData.brand_voice, style: e.target.value }
                    })}
                  >
                    <option value="informative">Informative</option>
                    <option value="storytelling">Storytelling</option>
                    <option value="direct">Direct & Concise</option>
                    <option value="conversational">Conversational</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social Platforms */}
            <div className="review-card">
              <div className="card-header">
                <h3>📱 Social Media Platforms</h3>
              </div>
              <div className="platforms-grid">
                {['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'].map(platform => (
                  <label key={platform} className="platform-checkbox">
                    <input
                      type="checkbox"
                      checked={editableData.platforms.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditableData({
                            ...editableData,
                            platforms: [...editableData.platforms, platform]
                          });
                        } else {
                          setEditableData({
                            ...editableData,
                            platforms: editableData.platforms.filter(p => p !== platform)
                          });
                        }
                      }}
                    />
                    <span className="platform-name">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back
            </button>
            <button 
              className="btn-primary btn-large"
              onClick={handleSaveProfile}
              disabled={saving || !editableData.description}
            >
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
