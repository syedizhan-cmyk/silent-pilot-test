import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { startScheduler } from '../../scheduler/scheduler';
import { 
  LayoutDashboard, 
  Bot, 
  Building2, 
  PenTool, 
  Palette, 
  Calendar, 
  TrendingUp, 
  Link2, 
  Mail, 
  Search, 
  BarChart3, 
  Users, 
  Target, 
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import './DashboardLayout.css';
import Logo from '../Logo';

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
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/dashboard/autopilot', icon: <Bot size={20} />, label: 'Auto-Pilot', isNew: true },
    { path: '/dashboard/business-profile', icon: <Building2 size={20} />, label: 'Business Profile' },
    { path: '/dashboard/create', icon: <PenTool size={20} />, label: 'Create Content' },
    { path: '/dashboard/media-studio', icon: <Palette size={20} />, label: 'AI Media Studio' },
    { path: '/dashboard/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { path: '/dashboard/ad-boost', icon: <TrendingUp size={20} />, label: 'Ad Boost' },
    { path: '/dashboard/social', icon: <Link2 size={20} />, label: 'Social Accounts' },
    { path: '/dashboard/email', icon: <Mail size={20} />, label: 'Email Campaigns' },
    { path: '/dashboard/seo', icon: <Search size={20} />, label: 'SEO & Research' },
    { path: '/dashboard/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/dashboard/leads', icon: <Users size={20} />, label: 'Leads' },
    { path: '/dashboard/campaigns', icon: <Target size={20} />, label: 'Campaigns' },
    { path: '/dashboard/content', icon: <BookOpen size={20} />, label: 'Content Library' }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/dashboard/ai-chat" className="logo-link">
            <div className="dashboard-logo">
              <Logo size="medium" variant="default" />
              {sidebarOpen && <span className="logo-text">Silent Pilot</span>}
            </div>
          </Link>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
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
              {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || <User size={20} />}
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
                navigate('/');
              }}
            >
              <LogOut size={18} />
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
            <Menu size={24} />
          </button>
          <div className="top-bar-right">
            <Link to="/dashboard/notifications" className="icon-btn" title="Notifications">
              <span className="notification-badge">3</span>
              <Bell size={20} />
            </Link>
            <Link to="/dashboard/settings" className="icon-btn" title="Settings">
              <Settings size={20} />
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
