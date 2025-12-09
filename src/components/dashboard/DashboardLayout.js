import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { startScheduler } from '../../scheduler/scheduler';
import './DashboardLayout.css';
import ThemeToggle from '../ThemeToggle';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const socialStore = useSocialStore();
  const [stopScheduler, setStopScheduler] = useState(null);

  React.useEffect(() => {
    // Temporarily disabled - scheduler will be started by Auto-Pilot when activated
    // This fixes the "load failed" login issue caused by querying empty scheduled_content table
    /*
    if (user && !stopScheduler) {
      const stop = startScheduler(socialStore, user);
      setStopScheduler(() => stop);
    }
    return () => {
      if (stopScheduler) stopScheduler();
    };
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/dashboard/autopilot', icon: '🤖', label: 'Auto-Pilot', isNew: true },
    { path: '/dashboard/business-profile', icon: '🏢', label: 'Business Profile' },
    { path: '/dashboard/create', icon: '✍️', label: 'Create Content' },
    { path: '/dashboard/media-studio', icon: '🎨', label: 'AI Media Studio' },
    { path: '/dashboard/calendar', icon: '📅', label: 'Calendar' },
    { path: '/dashboard/ad-boost', icon: '📢', label: 'Ad Boost' },
    { path: '/dashboard/social', icon: '🔗', label: 'Social Accounts' },
    { path: '/dashboard/email', icon: '📧', label: 'Email Campaigns' },
    { path: '/dashboard/seo', icon: '🔍', label: 'SEO & Research' },
    { path: '/dashboard/analytics', icon: '📈', label: 'Analytics' },
    { path: '/dashboard/leads', icon: '👥', label: 'Leads' },
    { path: '/dashboard/campaigns', icon: '🎯', label: 'Campaigns' },
    { path: '/dashboard/content', icon: '📚', label: 'Content Library' }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/dashboard/ai-chat" className="logo-link">
            <div className="dashboard-logo">
              <span className="logo-icon">✈️</span>
              {sidebarOpen && <span className="logo-text">Silent Pilot</span>}
            </div>
          </Link>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◁' : '▷'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && (
                  <span className="nav-label">
                    {item.label}
                    {item.isNew && <span className="new-badge">NEW</span>}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || '👤'}
            </div>
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">
                  {user?.user_metadata?.full_name || 'User'}
                </div>
                <div className="user-email">
                  {user?.email || ''}
                </div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button 
              className="logout-btn"
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="top-bar-right">
            <ThemeToggle />
            <Link to="/dashboard/notifications" className="icon-btn" title="Notifications">
              <span className="notification-badge">3</span>
              🔔
            </Link>
            <Link to="/dashboard/settings" className="icon-btn" title="Settings">⚙️</Link>
            <Link to="/" className="back-to-home-btn">
              ← Back to Home
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
