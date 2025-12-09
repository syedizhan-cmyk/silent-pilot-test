import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContentStore } from '../store/contentStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import SocialIcon from '../components/SocialIcon';
import './CreateContent.css';

function CreateContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const user = useAuthStore((state) => state.user);
  const { generateAIContent, savePost, updatePost, getPosts, posts } = useContentStore();
  
  const [step, setStep] = useState(1); // 1: Platform, 2: Content, 3: Schedule
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  // Load post if editing
  useEffect(() => {
    if (editId && user?.id) {
      getPosts(user.id).then(() => {
        const post = posts.find(p => p.id === parseInt(editId));
        if (post) {
          setSelectedPlatforms([post.platform]);
          setContent(post.content);
          if (post.image_url) setMediaUrls([post.image_url]);
          if (post.scheduled_for) {
            const date = new Date(post.scheduled_for);
            setScheduleDate(date.toISOString().split('T')[0]);
            setScheduleTime(date.toTimeString().slice(0, 5));
          }
          setStep(2);
        }
      });
    }
  }, [editId, user, getPosts, posts]);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F' },
    { id: 'twitter', name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' }
  ];

  const contentTemplates = [
    { id: 'promotional', name: 'Promotional', icon: '🎯', description: 'Promote products or services' },
    { id: 'educational', name: 'Educational', icon: '📚', description: 'Share knowledge and tips' },
    { id: 'engagement', name: 'Engagement', icon: '💬', description: 'Ask questions and start conversations' },
    { id: 'announcement', name: 'Announcement', icon: '📢', description: 'Share news and updates' },
    { id: 'testimonial', name: 'Testimonial', icon: '⭐', description: 'Customer reviews and success stories' },
    { id: 'behindscenes', name: 'Behind the Scenes', icon: '🎬', description: 'Show your process and team' }
  ];

  const aiTones = [
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'casual', name: 'Casual', icon: '😊' },
    { id: 'friendly', name: 'Friendly', icon: '🤝' },
    { id: 'humorous', name: 'Humorous', icon: '😄' },
    { id: 'inspiring', name: 'Inspiring', icon: '✨' }
  ];

  const togglePlatform = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a prompt for AI generation' });
      return;
    }
    
    setAiGenerating(true);
    setMessage({ type: '', text: '' });
    
    const prompt = `${selectedTemplate ? `Create a ${selectedTemplate} post. ` : ''}${aiPrompt}. Tone: ${selectedTone}.`;
    const platform = selectedPlatforms[0] || 'general';
    
    const result = await generateAIContent(prompt, platform);
    
    if (result.error) {
      setMessage({ type: 'error', text: `AI generation failed: ${result.error}` });
      setAiGenerating(false);
    } else {
      setContent(result.content);
      setMessage({ type: 'success', text: 'Content generated successfully!' });
      setTimeout(() => {
      setContent(`🚀 Exciting news! We're thrilled to announce our latest innovation that will transform the way you work.

✨ Key features:
• Automated workflows
• Real-time analytics
• Seamless integration

Ready to boost your productivity? Try it today!

#Innovation #ProductLaunch #Technology`);
      setAiGenerating(false);
      setMessage({ type: '', text: '' });
    }, 2000);
    }
  };

  const handleMediaUpload = async (files) => {
    if (!user?.id) return;
    
    const uploadedUrls = [];
    for (const file of files) {
      try {
        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Upload error:', error);
        setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
      }
    }
    
    setMediaUrls([...mediaUrls, ...uploadedUrls]);
    setMediaFiles([...mediaFiles, ...Array.from(files)]);
  };

  const handleSaveDraft = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select platform(s) and add content' });
      return;
    }

    setSaving(true);
    const postData = {
      platform: selectedPlatforms[0], // Use first platform
      content: content.trim(),
      mediaUrls: mediaUrls,
      status: 'draft',
    };

    let result;
    if (editId) {
      result = await updatePost(parseInt(editId), postData);
    } else {
      result = await savePost(user?.id, postData);
    }

    setSaving(false);
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: '✅ Draft saved successfully!' });
      setTimeout(() => navigate('/dashboard/calendar'), 2500);
    }
  };

  const handleSchedule = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select platform(s) and add content' });
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      setMessage({ type: 'error', text: 'Please select date and time' });
      return;
    }

    setSaving(true);
    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    
    const postData = {
      platform: selectedPlatforms[0],
      content: content.trim(),
      mediaUrls: mediaUrls,
      scheduledFor: scheduledFor,
      status: 'scheduled',
    };

    let result;
    if (editId) {
      result = await updatePost(parseInt(editId), postData);
    } else {
      result = await savePost(user?.id, postData);
    }

    setSaving(false);
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: '✅ Post scheduled successfully!' });
      setTimeout(() => navigate('/dashboard/calendar'), 2500);
    }
  };

  const handlePublishNow = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select platform(s) and add content' });
      return;
    }

    setSaving(true);
    console.log('🚀 Publishing post...', { content, platforms: selectedPlatforms });
    
    try {
      // First, save to database
      const postData = {
        platform: selectedPlatforms[0],
        content: content.trim(),
        mediaUrls: mediaUrls,
        scheduledFor: new Date().toISOString(),
        status: 'published',
      };

      console.log('💾 Saving to database...', postData);
      const result = await savePost(user?.id, postData);
      console.log('💾 Save result:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Then, attempt to post to social media immediately
      const platform = selectedPlatforms[0].toLowerCase();
      console.log('🔍 Looking for connected account for:', platform);
      
      // Get connected account for this platform
      const { data: accounts, error: accountError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .eq('is_active', true);

      console.log('📱 Found accounts:', accounts);
      if (accountError) {
        console.error('❌ Account error:', accountError);
        throw accountError;
      }

      if (accounts && accounts.length > 0) {
        console.log('✅ Account found, attempting to post to', platform);
        // Import social media API
        const { postToSocialMedia } = await import('../lib/socialMediaAPI');
        
        // Try to post to the social platform
        const socialResult = await postToSocialMedia(accounts[0].id, content.trim(), {
          mediaUrls: mediaUrls
        });

        console.log('📤 Post result:', socialResult);

        if (socialResult.success) {
          setMessage({ type: 'success', text: `✅ Posted to ${platform.toUpperCase()} successfully!` });
          console.log('✅ SUCCESS! Posted to', platform);
        } else {
          setMessage({ type: 'warning', text: `⚠️ Saved to database but ${platform} posting failed: ${socialResult.error}` });
          console.warn('⚠️ Posting failed:', socialResult.error);
        }
      } else {
        const msg = `⚠️ Post saved to database! To post to ${platform.toUpperCase()}, connect your account in Social Connect.`;
        setMessage({ type: 'warning', text: msg });
        console.warn('⚠️ No connected account for', platform);
      }
      
      console.log('⏱️ Waiting 4 seconds before redirect...');
      // Keep saving state active during message display
      setTimeout(() => {
        console.log('➡️ Redirecting to calendar');
        setSaving(false);
        navigate('/dashboard/calendar');
      }, 4000);
    } catch (error) {
      console.error('❌ Error in handlePublishNow:', error);
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleMediaUpload(files);
  };

  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (action) => {
    if (action === 'draft') {
      handleSaveDraft();
    } else if (action === 'schedule') {
      handleSchedule();
    } else if (action === 'publish') {
      handlePublishNow();
    }
  };

  return (
    <div className="create-content-v2">
      {/* Message Alert */}
      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="alert-icon">{message.type === 'success' ? '✅' : message.type === 'warning' ? '⚠️' : '❌'}</span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Create Content</h1>
          <p className="text-secondary mt-2">Create engaging posts for your social media platforms</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-info">
            <div className="step-label">Platform</div>
            <div className="step-desc">Select where to post</div>
          </div>
        </div>
        <div className="step-divider"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-info">
            <div className="step-label">Content</div>
            <div className="step-desc">Write your message</div>
          </div>
        </div>
        <div className="step-divider"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-info">
            <div className="step-label">Schedule</div>
            <div className="step-desc">Set publish time</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="create-content-grid">
        {/* Left Column - Main Form */}
        <div className="main-column">
          {/* Step 1: Platform Selection */}
          {step === 1 && (
            <div className="section-card">
              <div className="section-header">
                <h2 className="text-2xl font-semibold">Select Platforms</h2>
                <p className="text-secondary">Choose where you want to post your content</p>
              </div>
              
              <div className="platforms-grid">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    className={`platform-card ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="platform-icon-large">
                      <SocialIcon platform={platform.id} size={48} />
                    </div>
                    <div className="platform-name">{platform.name}</div>
                    {selectedPlatforms.includes(platform.id) && (
                      <div className="selected-badge">✓</div>
                    )}
                  </button>
                ))}
              </div>

              <div className="step-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setStep(2)}
                  disabled={selectedPlatforms.length === 0}
                >
                  Continue to Content →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Content Creation */}
          {step === 2 && (
            <>
              <div className="section-card">
                <div className="section-header">
                  <h2 className="text-2xl font-semibold">Create Your Content</h2>
                  <p className="text-secondary">Write your message or use AI to generate it</p>
                </div>

                {/* AI Templates */}
                <div className="templates-section">
                  <h3 className="text-lg font-semibold mb-4">Content Templates</h3>
                  <div className="templates-grid">
                    {contentTemplates.map(template => (
                      <button key={template.id} className="template-card">
                        <span className="template-icon">{template.icon}</span>
                        <div>
                          <div className="template-name">{template.name}</div>
                          <div className="template-desc">{template.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Editor */}
                <div className="editor-section">
                  <div className="editor-toolbar">
                    <button className="toolbar-btn" title="Bold">
                      <strong>B</strong>
                    </button>
                    <button className="toolbar-btn" title="Italic">
                      <em>I</em>
                    </button>
                    <button className="toolbar-btn" title="Link">🔗</button>
                    <button className="toolbar-btn" title="Emoji">😊</button>
                    <button className="toolbar-btn" title="Hashtag">#</button>
                    <div className="toolbar-divider"></div>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={handleAIGenerate}
                      disabled={aiGenerating}
                    >
                      {aiGenerating ? '✨ Generating...' : '✨ AI Generate'}
                    </button>
                  </div>
                  
                  <textarea
                    className="content-editor"
                    placeholder="What's on your mind? Share your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                  
                  <div className="editor-footer">
                    <span className="char-count">{content.length} / 2000</span>
                  </div>
                </div>

                {/* Media Upload */}
                <div className="media-section">
                  <h3 className="text-lg font-semibold mb-4">Add Media</h3>
                  <div className="media-upload-area">
                    <input
                      type="file"
                      id="media-upload"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="media-upload" className="upload-label">
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">
                        <strong>Click to upload</strong> or drag and drop
                      </div>
                      <div className="upload-hint">PNG, JPG, GIF or MP4 (MAX. 50MB)</div>
                    </label>
                  </div>

                  {mediaFiles.length > 0 && (
                    <div className="media-preview-grid">
                      {mediaFiles.map((file, index) => (
                        <div key={index} className="media-preview">
                          <img src={URL.createObjectURL(file)} alt={file.name} />
                          <button 
                            className="remove-media"
                            onClick={() => removeMedia(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setStep(3)}
                  disabled={!content.trim()}
                >
                  Continue to Schedule →
                </button>
              </div>
            </>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <>
              <div className="section-card">
                <div className="section-header">
                  <h2 className="text-2xl font-semibold">Schedule Your Post</h2>
                  <p className="text-secondary">Choose when to publish your content</p>
                </div>

                <div className="schedule-options">
                  <button className="schedule-option-card active">
                    <div className="option-icon">🚀</div>
                    <div className="option-content">
                      <div className="option-title">Post Now</div>
                      <div className="option-desc">Publish immediately</div>
                    </div>
                  </button>

                  <button className="schedule-option-card">
                    <div className="option-icon">📅</div>
                    <div className="option-content">
                      <div className="option-title">Schedule for Later</div>
                      <div className="option-desc">Choose date and time</div>
                    </div>
                  </button>

                  <button className="schedule-option-card">
                    <div className="option-icon">🎯</div>
                    <div className="option-content">
                      <div className="option-title">Best Time</div>
                      <div className="option-desc">AI suggests optimal time</div>
                    </div>
                  </button>
                </div>

                <div className="datetime-picker">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Date</label>
                      <input 
                        type="date" 
                        className="input"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Time</label>
                      <input 
                        type="time" 
                        className="input"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <div className="action-buttons">
                  <button 
                    className="btn btn-ghost btn-lg"
                    onClick={() => handleSubmit('draft')}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : '💾 Save as Draft'}
                  </button>
                  <button 
                    className="btn btn-secondary btn-lg"
                    onClick={() => handleSubmit('publish')}
                    disabled={saving}
                  >
                    {saving ? 'Publishing...' : '🚀 Post Now'}
                  </button>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => handleSubmit('schedule')}
                    disabled={saving}
                  >
                    {saving ? 'Scheduling...' : '📅 Schedule Post'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column - Preview & Info */}
        <div className="sidebar-column">
          {/* Preview Card */}
          <div className="section-card">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>
            {selectedPlatforms.length > 0 ? (
              <div className="preview-cards">
                {selectedPlatforms.map(platformId => {
                  const platform = platforms.find(p => p.id === platformId);
                  return (
                    <div key={platformId} className="platform-preview">
                      <div className="preview-header">
                        <SocialIcon platform={platformId} size={24} />
                        <span className="preview-platform-name">{platform.name}</span>
                      </div>
                      <div className="preview-content">
                        {content || 'Your content will appear here...'}
                      </div>
                      {mediaFiles.length > 0 && (
                        <div className="preview-media">
                          <img src={URL.createObjectURL(mediaFiles[0])} alt="Preview" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-preview">
                <div className="empty-icon">📱</div>
                <p className="text-secondary">Select platforms to see preview</p>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="section-card">
            <h3 className="text-xl font-semibold mb-4">💡 Tips for Better Engagement</h3>
            <ul className="tips-list">
              <li>✓ Use emojis to add personality</li>
              <li>✓ Include a clear call-to-action</li>
              <li>✓ Add relevant hashtags</li>
              <li>✓ Post during peak hours</li>
              <li>✓ Keep it concise and scannable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateContent;
