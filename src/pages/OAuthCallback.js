import React, { useEffect, useState } from 'react';
import { handleOAuthCallback } from '../lib/socialAuth';

export default function OAuthCallback() {
  const [status, setStatus] = useState('connecting');
  const [message, setMessage] = useState('Connecting your account...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for errors in URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          setTimeout(() => {
            window.location.href = '/dashboard/social-connect';
          }, 3000);
          return;
        }

        // Process OAuth callback
        setMessage('Exchanging authorization code...');
        await handleOAuthCallback();
        
        // Success - callback handler will redirect
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(`Failed to connect: ${error.message}`);
        setTimeout(() => {
          window.location.href = '/dashboard/social-connect';
        }, 3000);
      }
    };

    processCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
    }}>
      {status === 'connecting' ? (
        <>
          <div style={{
            fontSize: '48px',
            animation: 'spin 1s linear infinite',
          }}>⚙️</div>
          <h2>Connecting your account...</h2>
          <p>{message}</p>
          <div style={{
            marginTop: '20px',
            fontSize: '14px',
            opacity: 0.8,
          }}>
            This may take a few seconds. Please don't close this window.
          </div>
        </>
      ) : status === 'error' ? (
        <>
          <div style={{
            fontSize: '48px',
          }}>❌</div>
          <h2>Connection Failed</h2>
          <p>{message}</p>
          <div style={{
            marginTop: '20px',
            fontSize: '14px',
            opacity: 0.8,
          }}>
            Redirecting back to Social Connect...
          </div>
        </>
      ) : null}
      
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
