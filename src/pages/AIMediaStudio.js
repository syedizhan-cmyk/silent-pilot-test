import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import './AIMediaStudio.css';

function AIMediaStudio() {
  const user = useAuthStore((state) => state.user);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const styles = [
    { id: 'realistic', name: 'Realistic', emoji: '📷' },
    { id: 'artistic', name: 'Artistic', emoji: '🎨' },
    { id: 'cartoon', name: 'Cartoon', emoji: '🎭' },
    { id: 'abstract', name: 'Abstract', emoji: '🌈' }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a prompt' });
      return;
    }

    setGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      // For now, use placeholder images - in production, integrate with:
      // - OpenAI DALL-E
      // - Stable Diffusion
      // - Midjourney API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockImage = {
        id: Date.now(),
        prompt: prompt,
        style: style,
        url: `https://picsum.photos/512/512?random=${Date.now()}`,
        created_at: new Date().toISOString()
      };

      // Save to database
      const { error } = await supabase
        .from('generated_media')
        .insert([{
          user_id: user?.id,
          ...mockImage
        }]);

      if (error) throw error;

      setGeneratedImages([mockImage, ...generatedImages]);
      setMessage({ type: 'success', text: 'Image generated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: `Generation failed: ${error.message}` });
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.substring(0, 30)}.jpg`;
      a.click();
    } catch (error) {
      setMessage({ type: 'error', text: 'Download failed' });
    }
  };

  return (
    <div className="ai-media-studio-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">AI Media Studio</h1>
          <p className="text-secondary mt-2">Generate images with AI for your marketing campaigns</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="studio-layout">
        <div className="generation-panel">
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Generate Image</h2>
            
            <div className="form-field">
              <label>Describe what you want to create</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows="4"
                placeholder="A futuristic city at sunset with flying cars..."
              ></textarea>
            </div>

            <div className="form-field">
              <label>Style</label>
              <div className="style-grid">
                {styles.map(s => (
                  <button
                    key={s.id}
                    className={`style-btn ${style === s.id ? 'active' : ''}`}
                    onClick={() => setStyle(s.id)}
                  >
                    <span className="style-emoji">{s.emoji}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn btn-primary btn-lg"
              onClick={generateImage}
              disabled={generating}
            >
              {generating ? '✨ Generating...' : '✨ Generate Image'}
            </button>
          </div>

          <div className="info-card">
            <h3>💡 Tips for Better Results</h3>
            <ul>
              <li>Be specific and descriptive</li>
              <li>Mention colors, mood, and style</li>
              <li>Include context and setting</li>
              <li>Specify composition (close-up, wide shot, etc.)</li>
            </ul>
          </div>
        </div>

        <div className="gallery-panel">
          <div className="section-card">
            <h2 className="text-2xl font-semibold mb-6">Generated Images</h2>
            {generatedImages.length === 0 ? (
              <div className="empty-gallery">
                <div className="empty-icon">🎨</div>
                <p>No images generated yet</p>
                <p className="text-secondary">Start by creating your first image!</p>
              </div>
            ) : (
              <div className="images-grid">
                {generatedImages.map(img => (
                  <div key={img.id} className="image-card">
                    <img src={img.url} alt={img.prompt} />
                    <div className="image-overlay">
                      <p className="image-prompt">{img.prompt}</p>
                      <button 
                        className="btn btn-sm"
                        onClick={() => downloadImage(img.url, img.prompt)}
                      >
                        ⬇️ Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIMediaStudio;
