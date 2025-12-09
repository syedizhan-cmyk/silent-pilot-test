import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import './BusinessProfile.css';

export default function BusinessProfile() {
  const user = useAuthStore(state => state.user);
  const { profile, loading, loadProfile, saveProfile, addProductService, removeProductService } = useBusinessProfileStore();

  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    description: '',
    website: '',
    brand_values: [],
    target_audience: {
      demographics: '',
      pain_points: [],
      interests: []
    },
    brand_voice: {
      tone: 'professional',
      style: 'informative',
      keywords: []
    }
  });

  const [newProduct, setNewProduct] = useState({ name: '', description: '', category: '' });
  const [newValue, setNewValue] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || '',
        industry: profile.industry || '',
        description: profile.description || '',
        website: profile.website || '',
        brand_values: profile.brand_values || [],
        target_audience: {
          demographics: profile.target_audience?.demographics || '',
          pain_points: profile.target_audience?.pain_points || [],
          interests: profile.target_audience?.interests || []
        },
        brand_voice: {
          tone: profile.brand_voice?.tone || 'professional',
          style: profile.brand_voice?.style || 'informative',
          keywords: profile.brand_voice?.keywords || []
        }
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await saveProfile(user.id, formData);
    if (result.success) {
      alert('Business profile saved successfully!');
    } else {
      alert('Error saving profile: ' + result.error);
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.description) {
      await addProductService(user.id, newProduct);
      setNewProduct({ name: '', description: '', category: '' });
    }
  };

  const handleAddValue = () => {
    if (newValue && !formData.brand_values.includes(newValue)) {
      setFormData({
        ...formData,
        brand_values: [...formData.brand_values, newValue]
      });
      setNewValue('');
    }
  };

  const handleRemoveValue = (value) => {
    setFormData({
      ...formData,
      brand_values: formData.brand_values.filter(v => v !== value)
    });
  };

  const handleAddPainPoint = () => {
    if (newPainPoint && !formData.target_audience.pain_points.includes(newPainPoint)) {
      setFormData({
        ...formData,
        target_audience: {
          ...formData.target_audience,
          pain_points: [...formData.target_audience.pain_points, newPainPoint]
        }
      });
      setNewPainPoint('');
    }
  };

  const handleAddInterest = () => {
    if (newInterest && !formData.target_audience.interests.includes(newInterest)) {
      setFormData({
        ...formData,
        target_audience: {
          ...formData.target_audience,
          interests: [...formData.target_audience.interests, newInterest]
        }
      });
      setNewInterest('');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword && !formData.brand_voice.keywords.includes(newKeyword)) {
      setFormData({
        ...formData,
        brand_voice: {
          ...formData.brand_voice,
          keywords: [...formData.brand_voice.keywords, newKeyword]
        }
      });
      setNewKeyword('');
    }
  };

  if (loading) {
    return <div className="loading">Loading business profile...</div>;
  }

  return (
    <div className="business-profile-page">
      <div className="page-header">
        <h1>🏢 Business Profile</h1>
        <p>Help our AI understand your business for personalized content</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Basic Information */}
        <section className="form-section">
          <h2>📋 Basic Information</h2>
          <div className="form-group">
            <label>Business Name *</label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              placeholder="Your Company Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Industry *</label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              required
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail & E-commerce</option>
              <option value="education">Education</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="real-estate">Real Estate</option>
              <option value="consulting">Consulting</option>
              <option value="marketing">Marketing & Advertising</option>
              <option value="hospitality">Hospitality</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Business Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what your business does, your mission, and what makes you unique..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </section>

        {/* Products & Services */}
        <section className="form-section">
          <h2>🛍️ Products & Services</h2>
          <p className="section-description">Add your products/services so AI can create relevant content</p>
          
          <div className="add-item-group">
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product/Service Name"
            />
            <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Description"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              <option value="">Category</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="solution">Solution</option>
            </select>
            <button type="button" onClick={handleAddProduct} className="btn-add">+ Add</button>
          </div>

          <div className="items-list">
            {profile?.products_services?.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-content">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <span className="item-category">{item.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeProductService(user.id, item.id)}
                  className="btn-remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Target Audience */}
        <section className="form-section">
          <h2>🎯 Target Audience</h2>
          
          <div className="form-group">
            <label>Demographics</label>
            <textarea
              value={formData.target_audience.demographics}
              onChange={(e) => setFormData({
                ...formData,
                target_audience: { ...formData.target_audience, demographics: e.target.value }
              })}
              placeholder="E.g., Small business owners aged 30-50, B2B decision makers, tech-savvy millennials..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Pain Points</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                placeholder="What problems do they face?"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPainPoint())}
              />
              <button type="button" onClick={handleAddPainPoint} className="btn-add-small">Add</button>
            </div>
            <div className="tags-container">
              {formData.target_audience?.pain_points?.map((point, index) => (
                <span key={index} className="tag">
                  {point}
                  <button type="button" onClick={() => {
                    setFormData({
                      ...formData,
                      target_audience: {
                        ...formData.target_audience,
                        pain_points: formData.target_audience.pain_points.filter((_, i) => i !== index)
                      }
                    });
                  }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Interests</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="What are they interested in?"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
              />
              <button type="button" onClick={handleAddInterest} className="btn-add-small">Add</button>
            </div>
            <div className="tags-container">
              {formData.target_audience?.interests?.map((interest, index) => (
                <span key={index} className="tag">
                  {interest}
                  <button type="button" onClick={() => {
                    setFormData({
                      ...formData,
                      target_audience: {
                        ...formData.target_audience,
                        interests: formData.target_audience.interests.filter((_, i) => i !== index)
                      }
                    });
                  }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Voice */}
        <section className="form-section">
          <h2>🎨 Brand Voice & Style</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Tone</label>
              <select
                value={formData.brand_voice.tone}
                onChange={(e) => setFormData({
                  ...formData,
                  brand_voice: { ...formData.brand_voice, tone: e.target.value }
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

            <div className="form-group">
              <label>Style</label>
              <select
                value={formData.brand_voice.style}
                onChange={(e) => setFormData({
                  ...formData,
                  brand_voice: { ...formData.brand_voice, style: e.target.value }
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

          <div className="form-group">
            <label>Brand Keywords</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Keywords to include in content"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              />
              <button type="button" onClick={handleAddKeyword} className="btn-add-small">Add</button>
            </div>
            <div className="tags-container">
              {formData.brand_voice?.keywords?.map((keyword, index) => (
                <span key={index} className="tag">
                  {keyword}
                  <button type="button" onClick={() => {
                    setFormData({
                      ...formData,
                      brand_voice: {
                        ...formData.brand_voice,
                        keywords: formData.brand_voice.keywords.filter((_, i) => i !== index)
                      }
                    });
                  }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Values */}
        <section className="form-section">
          <h2>💎 Brand Values</h2>
          <p className="section-description">What does your brand stand for?</p>
          
          <div className="tag-input-group">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="E.g., Innovation, Sustainability, Customer-First..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddValue())}
            />
            <button type="button" onClick={handleAddValue} className="btn-add-small">Add</button>
          </div>
          <div className="tags-container">
            {formData.brand_values.map((value, index) => (
              <span key={index} className="tag">
                {value}
                <button type="button" onClick={() => handleRemoveValue(value)}>×</button>
              </span>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Business Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}