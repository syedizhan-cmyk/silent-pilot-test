import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import './OnboardingSplit.css';

// Industry options
const INDUSTRIES = [
  'E-commerce', 'Healthcare', 'Technology', 'Real Estate', 
  'Food & Beverage', 'Finance', 'Education', 'Entertainment',
  'Fashion', 'Fitness', 'Home Services', 'Legal', 
  'Marketing', 'Retail', 'Travel', 'Other'
];

// Marketing goals options with SVG icons
const MARKETING_GOALS = [
  { id: 'brand_awareness', label: 'Increase Brand Awareness', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg> },
  { id: 'generate_leads', label: 'Generate Leads', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  { id: 'drive_traffic', label: 'Drive Website Traffic', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> },
  { id: 'boost_sales', label: 'Boost Sales/Conversions', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'social_presence', label: 'Build Social Media Presence', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'launch_products', label: 'Launch New Products', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> },
];

// Budget ranges
const BUDGET_RANGES = [
  'Less than $500/month',
  '$500 - $1,000/month',
  '$1,000 - $2,500/month',
  '$2,500 - $5,000/month',
  '$5,000 - $10,000/month',
  'More than $10,000/month'
];

// Brand voice options with SVG icons
const BRAND_VOICES = [
  { id: 'professional', label: 'Professional', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, description: 'Formal and authoritative' },
  { id: 'casual', label: 'Casual', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, description: 'Relaxed and approachable' },
  { id: 'friendly', label: 'Friendly', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, description: 'Warm and welcoming' },
  { id: 'authoritative', label: 'Authoritative', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, description: 'Expert and confident' },
  { id: 'playful', label: 'Playful', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, description: 'Fun and energetic' },
  { id: 'inspirational', label: 'Inspirational', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, description: 'Motivating and uplifting' },
];

// Platform options with SVG icons
const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id: 'instagram', label: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { id: 'twitter', label: 'Twitter/X', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id: 'linkedin', label: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  { id: 'tiktok', label: 'TikTok', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg> },
  { id: 'youtube', label: 'YouTube', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
];

// Preset color palettes
const COLOR_PALETTES = [
  { primary: '#667eea', secondary: '#764ba2', name: 'Purple Haze' },
  { primary: '#f093fb', secondary: '#f5576c', name: 'Sunset' },
  { primary: '#4facfe', secondary: '#00f2fe', name: 'Ocean Blue' },
  { primary: '#43e97b', secondary: '#38f9d7', name: 'Fresh Green' },
  { primary: '#fa709a', secondary: '#fee140', name: 'Warm Coral' },
  { primary: '#30cfd0', secondary: '#330867', name: 'Deep Sea' },
  { primary: '#a8edea', secondary: '#fed6e3', name: 'Soft Pastels' },
  { primary: '#ff9a56', secondary: '#ff6a88', name: 'Vibrant Orange' },
];

function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { saveProfile } = useBusinessProfileStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Business Basics
    business_name: '',
    industry: '',
    description: '',
    website: '',

    // Step 2: Goals
    marketing_goals: [],
    monthly_budget: '',
    marketing_challenges: '',

    // Step 3: Target Audience
    customer_age_range: '',
    customer_location: '',
    customer_interests: [],
    pain_points: [],
    preferred_platforms: [],

    // Step 4: Brand Identity
    brand_voice: '',
    brand_colors: {},
    brand_values: [],
  });

  const [interestInput, setInterestInput] = useState('');
  const [painPointInput, setPainPointInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  useEffect(() => {
    // Redirect if no user
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const addTag = (field, value, setInput) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setInput('');
    }
  };

  const removeTag = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      // Save progress after each step
      await saveProgress();
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveProgress = async () => {
    if (!user) return;

    try {
      await saveProfile(user.id, {
        ...formData,
        onboarding_step: currentStep,
        onboarding_completed: false,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const completeOnboarding = async () => {
    if (!user) {
      console.error('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const result = await saveProfile(user.id, {
        ...formData,
        onboarding_step: 5,
        onboarding_completed: true,
      });

      console.log('Onboarding save result:', result);

      // Always navigate to dashboard after attempting to save
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Navigate to dashboard anyway - user can update profile later
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.business_name.trim() && formData.industry;
      case 2:
        return formData.marketing_goals.length > 0;
      case 3:
        return formData.preferred_platforms.length > 0;
      case 4:
        return formData.brand_voice;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="onboarding-header">
              <h1 style={{ color: '#000000' }}>Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}!</h1>
              <p style={{ color: '#555555' }}>Let's get your business set up in just a few minutes</p>
            </div>

            <div className="onboarding-form">
              <div className="form-group">
                <label htmlFor="business_name" style={{ color: '#000000' }}>
                  Business Name <span className="required">*</span>
                </label>
                <input
                  id="business_name"
                  type="text"
                  placeholder="e.g., Acme Marketing Agency"
                  value={formData.business_name}
                  onChange={(e) => updateFormData('business_name', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry" style={{ color: '#000000' }}>
                  Industry <span className="required">*</span>
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, transparent 50%, #667eea 50%), linear-gradient(135deg, #667eea 50%, transparent 50%)',
                    backgroundPosition: 'calc(100% - 20px) center, calc(100% - 15px) center',
                    backgroundSize: '6px 6px, 6px 6px',
                    backgroundRepeat: 'no-repeat',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    paddingRight: '40px'
                  }}
                >
                  <option value="">Select your industry...</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description" style={{ color: '#000000' }}>
                  Brief Description
                </label>
                <textarea
                  id="description"
                  placeholder="Tell us a bit about your business..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="website" style={{ color: '#000000' }}>
                  Website URL (Optional)
                </label>
                <input
                  id="website"
                  type="url"
                  placeholder="https://yourbusiness.com"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="onboarding-header">
              <h1 style={{ color: '#000000' }}>What are your goals?</h1>
              <p style={{ color: '#555555' }}>Select all that apply - we'll help you achieve them</p>
            </div>

            <div className="onboarding-form">
              <div className="form-group">
                <label style={{ color: '#000000' }}>Primary Marketing Goals <span className="required">*</span></label>
                <div className="options-grid">
                  {MARKETING_GOALS.map(goal => (
                    <div
                      key={goal.id}
                      className={`option-card ${formData.marketing_goals.includes(goal.id) ? 'selected' : ''}`}
                      onClick={() => toggleArrayItem('marketing_goals', goal.id)}
                    >
                      <div className="option-checkbox"></div>
                      <div>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{goal.icon}</div>
                        <div className="option-label">{goal.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="monthly_budget" style={{ color: '#000000' }}>Monthly Marketing Budget</label>
                <select
                  id="monthly_budget"
                  value={formData.monthly_budget}
                  onChange={(e) => updateFormData('monthly_budget', e.target.value)}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, transparent 50%, #667eea 50%), linear-gradient(135deg, #667eea 50%, transparent 50%)',
                    backgroundPosition: 'calc(100% - 20px) center, calc(100% - 15px) center',
                    backgroundSize: '6px 6px, 6px 6px',
                    backgroundRepeat: 'no-repeat',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    paddingRight: '40px'
                  }}
                >
                  <option value="">Select your budget range...</option>
                  {BUDGET_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="marketing_challenges" style={{ color: '#000000' }}>
                  Current Marketing Challenges (Optional)
                </label>
                <textarea
                  id="marketing_challenges"
                  placeholder="What challenges are you facing with marketing? (e.g., time constraints, content creation, analytics)"
                  value={formData.marketing_challenges}
                  onChange={(e) => updateFormData('marketing_challenges', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="onboarding-header">
              <h1 style={{ color: '#000000' }}>Who's your audience?</h1>
              <p style={{ color: '#555555' }}>Help us understand who you're trying to reach</p>
            </div>

            <div className="onboarding-form">
              <div className="form-group">
                <label htmlFor="customer_age_range" style={{ color: '#000000' }}>Target Age Range</label>
                <input
                  id="customer_age_range"
                  type="text"
                  placeholder="e.g., 25-45"
                  value={formData.customer_age_range}
                  onChange={(e) => updateFormData('customer_age_range', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer_location" style={{ color: '#000000' }}>Target Location/Region</label>
                <input
                  id="customer_location"
                  type="text"
                  placeholder="e.g., United States, Europe, Global"
                  value={formData.customer_location}
                  onChange={(e) => updateFormData('customer_location', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ color: '#000000' }}>Customer Interests</label>
                <div 
                  className="tag-input-container"
                  onClick={() => document.getElementById('interest-input').focus()}
                >
                  {formData.customer_interests.map(interest => (
                    <span key={interest} className="tag">
                      {interest}
                      <span 
                        className="tag-remove" 
                        onClick={() => removeTag('customer_interests', interest)}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  <input
                    id="interest-input"
                    type="text"
                    className="tag-input"
                    placeholder="Type and press Enter..."
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('customer_interests', interestInput, setInterestInput);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ color: '#000000' }}>Customer Pain Points</label>
                <div 
                  className="tag-input-container"
                  onClick={() => document.getElementById('pain-point-input').focus()}
                >
                  {formData.pain_points.map(point => (
                    <span key={point} className="tag">
                      {point}
                      <span 
                        className="tag-remove" 
                        onClick={() => removeTag('pain_points', point)}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  <input
                    id="pain-point-input"
                    type="text"
                    className="tag-input"
                    placeholder="Type and press Enter..."
                    value={painPointInput}
                    onChange={(e) => setPainPointInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('pain_points', painPointInput, setPainPointInput);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ color: '#000000' }}>Preferred Marketing Platforms <span className="required">*</span></label>
                <div className="options-grid">
                  {PLATFORMS.map(platform => (
                    <div
                      key={platform.id}
                      className={`option-card ${formData.preferred_platforms.includes(platform.id) ? 'selected' : ''}`}
                      onClick={() => toggleArrayItem('preferred_platforms', platform.id)}
                    >
                      <div className="option-checkbox"></div>
                      <div>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{platform.icon}</div>
                        <div className="option-label">{platform.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="onboarding-header">
              <h1 style={{ color: '#000000' }}>Define your brand</h1>
              <p style={{ color: '#555555' }}>Let's establish your brand identity and voice</p>
            </div>

            <div className="onboarding-form">
              <div className="form-group">
                <label style={{ color: '#000000' }}>Brand Voice & Tone <span className="required">*</span></label>
                <div className="voice-options">
                  {BRAND_VOICES.map(voice => (
                    <div
                      key={voice.id}
                      className={`voice-option ${formData.brand_voice === voice.id ? 'selected' : ''}`}
                      onClick={() => updateFormData('brand_voice', voice.id)}
                    >
                      <div className="voice-icon">{voice.icon}</div>
                      <div className="voice-label">{voice.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ color: '#000000' }}>Brand Color Palette (Optional)</label>
                <div className="color-picker-grid">
                  {COLOR_PALETTES.map((palette, index) => (
                    <div
                      key={index}
                      className={`color-option ${formData.brand_colors.primary === palette.primary ? 'selected' : ''}`}
                      style={{
                        background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`
                      }}
                      onClick={() => updateFormData('brand_colors', palette)}
                      title={palette.name}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ color: '#000000' }}>Brand Values (Optional)</label>
                <div 
                  className="tag-input-container"
                  onClick={() => document.getElementById('value-input').focus()}
                >
                  {formData.brand_values.map(value => (
                    <span key={value} className="tag">
                      {value}
                      <span 
                        className="tag-remove" 
                        onClick={() => removeTag('brand_values', value)}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  <input
                    id="value-input"
                    type="text"
                    className="tag-input"
                    placeholder="e.g., Innovation, Quality, Trust..."
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('brand_values', valueInput, setValueInput);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <div className="completion-content">
              <div className="success-animation">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2>Your Workspace is Ready!</h2>
              <p>We've personalized everything based on your preferences</p>

              <div className="dashboard-preview">
                <div className="preview-features">
                  <div className="preview-feature">
                    <div className="preview-icon">✓</div>
                    <div className="preview-text">Business profile created</div>
                  </div>
                  <div className="preview-feature">
                    <div className="preview-icon">✓</div>
                    <div className="preview-text">Goals configured</div>
                  </div>
                  <div className="preview-feature">
                    <div className="preview-icon">✓</div>
                    <div className="preview-text">Audience defined</div>
                  </div>
                  <div className="preview-feature">
                    <div className="preview-icon">✓</div>
                    <div className="preview-text">Brand identity set</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // SVG Icons as components
  const RocketIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.25-2 5-2 5s3.75-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  );

  const SparklesIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );

  const ChartIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  );

  const TargetIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );

  const MegaphoneIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
    </svg>
  );

  const TrendingIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  );

  const DollarIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  const UsersIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const MessageIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );

  const GlobeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  const PaletteIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );

  const ZapIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );

  const AwardIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  // Get visual content for left panel based on current step
  const getVisualContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Welcome to Silent Pilot",
          subtitle: "Your AI-powered marketing automation platform",
          features: [
            { icon: <RocketIcon />, text: "Launch campaigns in minutes" },
            { icon: <SparklesIcon />, text: "AI-powered content generation" },
            { icon: <ChartIcon />, text: "Real-time analytics dashboard" },
            { icon: <TargetIcon />, text: "Smart audience targeting" }
          ],
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        };
      case 2:
        return {
          title: "Define Your Success",
          subtitle: "We'll help you achieve your marketing goals",
          features: [
            { icon: <MegaphoneIcon />, text: "Build brand awareness" },
            { icon: <DollarIcon />, text: "Increase conversions" },
            { icon: <TrendingIcon />, text: "Drive more traffic" },
            { icon: <UsersIcon />, text: "Grow social presence" }
          ],
          gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        };
      case 3:
        return {
          title: "Know Your Audience",
          subtitle: "Create content that resonates",
          features: [
            { icon: <TargetIcon />, text: "Target the right people" },
            { icon: <MessageIcon />, text: "Speak their language" },
            { icon: <GlobeIcon />, text: "Reach them everywhere" },
            { icon: <HeartIcon />, text: "Build lasting connections" }
          ],
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        };
      case 4:
        return {
          title: "Express Your Brand",
          subtitle: "Stand out with authentic voice",
          features: [
            { icon: <PaletteIcon />, text: "Unique brand identity" },
            { icon: <ZapIcon />, text: "Consistent messaging" },
            { icon: <AwardIcon />, text: "Premium positioning" },
            { icon: <StarIcon />, text: "Memorable presence" }
          ],
          gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        };
      case 5:
        return {
          title: "You're All Set!",
          subtitle: "Your personalized workspace is ready",
          features: [
            { icon: <CheckIcon />, text: "Profile configured" },
            { icon: <CheckIcon />, text: "Goals established" },
            { icon: <CheckIcon />, text: "Audience defined" },
            { icon: <CheckIcon />, text: "Brand identity set" }
          ],
          gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        };
      default:
        return null;
    }
  };

  const visualContent = getVisualContent();

  return (
    <div className="onboarding-page-split">
      {/* Left Panel - Visual Content */}
      <div className="onboarding-left-panel" style={{ background: visualContent?.gradient }}>
        <div className="left-panel-content">
          {/* Logo/Brand */}
          <div className="onboarding-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
            <div className="logo-text">Silent Pilot</div>
          </div>

          {/* Main Visual Content */}
          <div className="visual-content-wrapper" key={currentStep}>
            <h1 className="visual-title">{visualContent?.title}</h1>
            <p className="visual-subtitle">{visualContent?.subtitle}</p>

            <div className="visual-features">
              {visualContent?.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="visual-feature"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-text">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="progress-dots">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`progress-dot ${currentStep >= step ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="onboarding-right-panel">
        <div className="right-panel-content">
          {/* Step Indicator */}
          <div className="step-indicator">
            <span className="step-number">Step {currentStep} of 5</span>
          </div>

          {/* Form Content */}
          <div className="form-content-wrapper" key={currentStep}>
            {renderStep()}
          </div>

          {/* Action Buttons */}
          <div className="onboarding-actions-split">
            {currentStep > 1 && currentStep < 5 && (
              <button className="btn-back-split" onClick={handleBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            )}
            
            {currentStep < 5 ? (
              <button 
                className="btn-next-split" 
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                {currentStep === 4 ? 'Complete Setup' : 'Continue'}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <button 
                className="btn-next-split" 
                onClick={completeOnboarding}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>Go to Dashboard</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
