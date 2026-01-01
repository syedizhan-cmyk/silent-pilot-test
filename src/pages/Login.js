import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBusinessProfileStore } from '../store/businessProfileStore';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const signIn = useAuthStore((state) => state.signIn);
  const { loadProfile } = useBusinessProfileStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        // Check if user has completed onboarding
        const profile = await loadProfile(data.user.id);
        
        if (profile && profile.onboarding_completed) {
          // User has completed onboarding, go to dashboard
          navigate('/dashboard');
        } else {
          // User hasn't completed onboarding, redirect there
          navigate('/onboarding');
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">✈️</span>
              <span className="logo-text">Silent Pilot</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              <span>
                {loading && <span className="spinner"></span>}
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth">
            <button className="social-button google">
              <span>🔍</span>
              <span>Google</span>
            </button>
            <button className="social-button github">
              <span>📱</span>
              <span>GitHub</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-features">
          <h2>Transform Your Marketing</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <div>
                <h3>AI-Powered Content</h3>
                <p>Generate engaging content with AI assistance</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Analytics Dashboard</h3>
                <p>Track performance across all platforms</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h3>Automation</h3>
                <p>Schedule and automate your campaigns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
