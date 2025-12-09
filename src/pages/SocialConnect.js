import React, { useState, useEffect } from 'react';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { initiateOAuth, quickConnectDemo, isOAuthConfigured } from '../lib/socialAuth';
import SocialIcon from '../components/SocialIcon';
import './SocialConnect.css';

function SocialConnect() {
  const user = useAuthStore((state) => state.user);
  const { connectedAccounts, getConnectedAccounts, disconnectAccount, connectAccount, loading } = useSocialStore();
  const [connectingPlatform, setConnectingPlatform] = useState(null);

  const platforms = [
    { id: 'facebook', name: 'Facebook', connected: false, accounts: 0, followers: '0' },
    { id: 'instagram', name: 'Instagram', connected: false, accounts: 0, followers: '0' },
    { id: 'twitter', name: 'Twitter', connected: false, accounts: 0, followers: '0' },
    { id: 'linkedin', name: 'LinkedIn', connected: false, accounts: 0, followers: '0' }
  ];

  useEffect(() => {
    if (user?.id) {
      getConnectedAccounts(user.id);
    }
  }, [user, getConnectedAccounts]);

  const handleConnect = async (platform) => {
    setConnectingPlatform(platform);

    try {
      if (isOAuthConfigured(platform)) {
        // Initiate OAuth - will redirect to provider
        await initiateOAuth(platform, user?.id);
        // User will be redirected, so we don't reset connectingPlatform here
      } else {
        // Demo mode
        const demoAccount = quickConnectDemo(platform, user?.id);
        const result = await connectAccount(user?.id, demoAccount);
        
        if (result.error) {
          alert(`Connection failed: ${result.error}`);
        }
        
        if (user?.id) {
          await getConnectedAccounts(user.id);
        }
        setConnectingPlatform(null);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert(`Failed to connect ${platform}: ${error.message}`);
      setConnectingPlatform(null);
    }
  };

  const handleManage = async (accountId, platformName) => {
    if (window.confirm(`Disconnect ${platformName}?`)) {
      await disconnectAccount(accountId);
    }
  };

  // Update platform connection status from real data
  const updatedPlatforms = platforms.map(p => {
    const accounts = connectedAccounts.filter(acc => acc.platform.toLowerCase() === p.id.toLowerCase());
    return {
      ...p,
      connected: accounts.length > 0,
      accounts: accounts.length
    };
  });

  return (
    <div className="social-connect-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Social Accounts</h1>
          <p className="text-secondary mt-2">Connect and manage your social media accounts</p>
        </div>
      </div>

      <div className="platforms-grid">
        {updatedPlatforms.map(platform => (
          <div key={platform.id} className={`platform-connect-card ${platform.connected ? 'connected' : ''}`}>
            <div className="platform-header">
              <SocialIcon platform={platform.id} size={48} />
              <div className="platform-info">
                <h3>{platform.name}</h3>
                <span className={`status ${platform.connected ? 'connected' : 'disconnected'}`}>
                  {platform.connected ? '✓ Connected' : '○ Not Connected'}
                </span>
              </div>
            </div>
            {platform.connected && (
              <div className="platform-stats">
                <div className="stat"><span className="label">Accounts:</span> <span className="value">{platform.accounts}</span></div>
                <div className="stat"><span className="label">Followers:</span> <span className="value">{platform.followers}</span></div>
              </div>
            )}
            <button 
              className={`btn ${platform.connected ? 'btn-secondary' : 'btn-primary'} full-width`}
              onClick={() => platform.connected 
                ? handleManage(connectedAccounts.find(a => a.platform.toLowerCase() === platform.id)?.id, platform.name)
                : handleConnect(platform.id)
              }
              disabled={connectingPlatform === platform.id}
            >
              {connectingPlatform === platform.id ? 'Connecting...' : platform.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialConnect;
