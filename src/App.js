import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './theme.css';
import CustomCursor from './components/CustomCursor';

// Landing Page Components
import Header from './components/Header';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Features from './components/Features';
import Demo from './components/Demo';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Auth Components
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CreateContent from './pages/CreateContent';
import Calendar from './pages/Calendar';
import AIResearch from './pages/AIResearch';
import BulkMediaUpload from './pages/BulkMediaUpload';
import AIMasterChat from './pages/AIMasterChat';
import EmailCampaigns from './pages/EmailCampaigns';
import SEO from './pages/SEO';
import Analytics from './pages/Analytics';
import Leads from './pages/Leads';
import Campaigns from './pages/Campaigns';
import ContentLibrary from './pages/ContentLibrary';
import SocialConnect from './pages/SocialConnect';
import BusinessProfile from './pages/BusinessProfile';
import AIMediaStudio from './pages/AIMediaStudio';
import AutoPilot from './pages/AutoPilot';
import AdBoost from './pages/AdBoost';
import OAuthCallback from './pages/OAuthCallback';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

// Auth Store
import { useAuthStore } from './store/authStore';

// Landing Page
function LandingPage() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <TrustedBy />
      <Features />
      <Demo />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <CTA />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <CustomCursor />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Dashboard /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/create" 
          element={
            <ProtectedRoute>
              <DashboardLayout><CreateContent /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/calendar" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Calendar /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/email" 
          element={
            <ProtectedRoute>
              <DashboardLayout><EmailCampaigns /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/seo" 
          element={
            <ProtectedRoute>
              <DashboardLayout><SEO /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/analytics" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Analytics /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/leads" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Leads /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/campaigns" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Campaigns /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/content" 
          element={
            <ProtectedRoute>
              <DashboardLayout><ContentLibrary /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/social" 
          element={
            <ProtectedRoute>
              <DashboardLayout><SocialConnect /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/business-profile" 
          element={
            <ProtectedRoute>
              <DashboardLayout><BusinessProfile /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/media-studio" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AIMediaStudio /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/autopilot" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AutoPilot /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/ad-boost" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AdBoost /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/ai-research" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AIResearch /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/bulk-media" 
          element={
            <ProtectedRoute>
              <DashboardLayout><BulkMediaUpload /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/ai-chat" 
          element={
            <ProtectedRoute>
              <DashboardLayout><AIMasterChat /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/notifications" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Notifications /></DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/settings" 
          element={
            <ProtectedRoute>
              <DashboardLayout><Settings /></DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
