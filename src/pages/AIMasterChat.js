import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';
import { supabase } from '../lib/supabase';
import { generateContent } from '../lib/openai';
import './AIMasterChat.css';

function AIMasterChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "✈️ Welcome aboard! I'm your AI Pilot. I can help you create content, analyze websites, run SEO audits, manage posts, and more. What would you like to do today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const socialAccounts = useSocialStore((state) => state.accounts);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    
    const fileNames = files.map(f => f.name).join(', ');
    addMessage('user', `📎 Uploaded: ${fileNames}`);
    addMessage('assistant', `Got it! I've received your files. What would you like me to do with them?\n\n• Create social media posts\n• Schedule across platforms\n• Generate AI captions\n• Add to content library`);
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const executeCommand = async (userIntent, userMessage) => {
    const intent = userIntent.toLowerCase();

    try {
      if (intent.includes('create post') || intent.includes('write post') || intent.includes('make post')) {
        if (uploadedFiles.length > 0) {
          addMessage('assistant', '📝 Creating posts with your uploaded media...');
          await handleCreatePostWithMedia();
        } else {
          addMessage('assistant', '📝 Generating post content...');
          const content = await generateContent(userMessage, 'social-post');
          addMessage('assistant', `Here's your post:\n\n"${content}"\n\nShould I schedule this to your social accounts?`);
        }
      }
      else if (intent.includes('analyze') && (intent.includes('website') || intent.includes('url'))) {
        const urlMatch = userMessage.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          addMessage('assistant', `🔍 Analyzing website: ${urlMatch[0]}...`);
          await handleWebsiteAnalysis(urlMatch[0]);
        } else {
          addMessage('assistant', 'Please provide a website URL to analyze.');
        }
      }
      else if (intent.includes('seo') && (intent.includes('audit') || intent.includes('check') || intent.includes('analyze'))) {
        const urlMatch = userMessage.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          addMessage('assistant', `🎯 Running SEO audit on: ${urlMatch[0]}...`);
          await handleSEOAudit(urlMatch[0]);
        } else {
          addMessage('assistant', 'Please provide a website URL for SEO audit.');
        }
      }
      else if (intent.includes('upload') || intent.includes('add media')) {
        fileInputRef.current?.click();
        addMessage('assistant', '📤 Click the file selector or drag files directly into chat!');
      }
      else if (intent.includes('autopilot') || intent.includes('auto pilot')) {
        addMessage('assistant', '🤖 AutoPilot will automatically create and schedule posts. Go to the AutoPilot page to configure it, or tell me your preferences!');
      }
      else if (intent.includes('connect') && (intent.includes('social') || intent.includes('facebook') || intent.includes('twitter') || intent.includes('instagram'))) {
        addMessage('assistant', '🔗 Checking your connected accounts...');
        if (socialAccounts.length === 0) {
          addMessage('assistant', '📱 No social accounts connected yet. Visit Social Accounts to connect Facebook, Twitter, LinkedIn, and more!');
        } else {
          addMessage('assistant', `✅ You have ${socialAccounts.length} account(s) connected:\n${socialAccounts.map(a => `• ${a.platform}`).join('\n')}`);
        }
      }
      else if (intent.includes('schedule')) {
        addMessage('assistant', '📅 To schedule posts, I need:\n1. Content or media\n2. Target platforms\n3. Date and time\n\nTell me these details or upload media to start!');
      }
      else if (intent.includes('analytics') || intent.includes('performance') || intent.includes('stats')) {
        addMessage('assistant', '📊 Check the Analytics page for detailed metrics, or tell me what specific data you need!');
      }
      else {
        addMessage('assistant', '🤔 Processing...');
        const aiResponse = await generateAIResponse(userMessage);
        addMessage('assistant', aiResponse);
      }
    } catch (error) {
      console.error('Command error:', error);
      addMessage('assistant', `❌ Error: ${error.message}`);
    }
  };

  const handleWebsiteAnalysis = async (url) => {
    try {
      const { data, error } = await supabase.functions.invoke('website-crawler', {
        body: { url, userId: user.id }
      });

      if (error) throw error;

      const analysis = data.analysis;
      let response = `✅ Analysis complete!\n\n📊 **Summary:** ${analysis.summary}\n\n💡 **Content Ideas:**\n`;
      
      if (analysis.post_ideas && analysis.post_ideas.length > 0) {
        analysis.post_ideas.slice(0, 3).forEach((idea, idx) => {
          response += `\n${idx + 1}. **${idea.title}**\n   ${idea.content}\n`;
        });
        response += `\nWant me to create posts from these ideas?`;
      }
      
      addMessage('assistant', response);
    } catch (error) {
      throw new Error(`Website analysis failed: ${error.message}`);
    }
  };

  const handleSEOAudit = async (url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      
      let report = `✅ SEO Audit Complete!\n\n`;
      report += `📄 **Title:** ${titleMatch ? titleMatch[1] : '❌ Missing'}\n`;
      report += `📝 **Description:** ${descMatch ? descMatch[1].substring(0, 100) + '...' : '❌ Missing'}\n`;
      report += `🔒 **HTTPS:** ${url.startsWith('https://') ? '✅' : '❌'}\n`;
      report += `\nWant a full SEO report? Visit the SEO page!`;
      
      addMessage('assistant', report);
    } catch (error) {
      throw new Error(`SEO audit failed: ${error.message}`);
    }
  };

  const handleCreatePostWithMedia = async () => {
    if (uploadedFiles.length === 0) return;
    
    try {
      for (const file of uploadedFiles) {
        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('media').upload(fileName, file);
        if (error) throw error;
      }
      
      addMessage('assistant', `✅ Uploaded ${uploadedFiles.length} file(s)! Generating captions...`);
      
      const caption = await generateContent(
        `Create an engaging social media caption for ${uploadedFiles.length} images/videos`,
        'social-post'
      );
      
      addMessage('assistant', `📝 Generated caption:\n\n"${caption}"\n\nReady to schedule?`);
      setUploadedFiles([]);
    } catch (error) {
      throw new Error(`Media upload failed: ${error.message}`);
    }
  };

  const generateAIResponse = async (userMessage) => {
    try {
      const context = `You are the AI Pilot for Silent Pilot, a social media management platform. 
      Help users with: creating posts, analyzing websites, SEO audits, uploading media, scheduling content, 
      managing leads, and using AutoPilot. Be helpful, concise, and actionable.`;
      
      const response = await generateContent(
        `${context}\n\nUser: ${userMessage}\n\nProvide a helpful response:`,
        'general'
      );
      
      return response;
    } catch (error) {
      return "I can help you with:\n• Create social posts\n• Analyze websites\n• Run SEO audits\n• Upload media\n• Set up AutoPilot\n\nWhat would you like to do?";
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    
    const userMsg = inputMessage.trim();
    setInputMessage('');
    
    if (userMsg) {
      addMessage('user', userMsg);
    }
    
    setIsProcessing(true);
    
    try {
      await executeCommand(userMsg, userMsg);
    } catch (error) {
      console.error('Error:', error);
      addMessage('assistant', `❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: '✍️', label: 'Create Post', action: () => setInputMessage('Create a post about ') },
    { icon: '🔍', label: 'Research', action: () => setInputMessage('Analyze website https://') },
    { icon: '📊', label: 'SEO Audit', action: () => setInputMessage('Run SEO audit on https://') },
    { icon: '📸', label: 'Upload', action: () => fileInputRef.current?.click() },
    { icon: '✈️', label: 'AutoPilot', action: () => setInputMessage('Help me set up AutoPilot') },
    { icon: '📈', label: 'Analytics', action: () => setInputMessage('Show my analytics') }
  ];

  return (
    <div className="ai-chat-v2">
      <div className="chat-header">
        <div className="header-left">
          <div className="pilot-avatar">✈️</div>
          <div className="header-text">
            <h1>AI Pilot</h1>
            <p>Your intelligent marketing assistant</p>
          </div>
        </div>
        <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
          <span>📎</span>
          Upload Files
        </button>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-bubble ${msg.role}`}>
              <div className="bubble-avatar">
                {msg.role === 'assistant' ? '✈️' : '👤'}
              </div>
              <div className="bubble-content">
                <div className="bubble-text">{msg.content}</div>
                {msg.timestamp && (
                  <div className="bubble-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="message-bubble assistant">
              <div className="bubble-avatar">✈️</div>
              <div className="bubble-content">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="files-preview">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="file-tag">
                <span>📎 {file.name}</span>
                <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}>×</button>
              </div>
            ))}
          </div>
        )}

        <div className="quick-actions">
          {quickActions.map((action, idx) => (
            <button key={idx} className="quick-action-btn" onClick={action.action}>
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
          />
          <textarea
            className="message-input"
            placeholder="Ask me anything... Try 'Create a post', 'Analyze a website', or upload files"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            rows={1}
          />
          <button 
            className="send-button" 
            onClick={handleSend}
            disabled={isProcessing || (!inputMessage.trim() && uploadedFiles.length === 0)}
          >
            <span>{isProcessing ? '⏳' : '✈️'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIMasterChat;
