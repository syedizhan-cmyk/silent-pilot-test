import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Silent Pilot - AI-Powered Marketing Automation',
  description = 'Automate your social media marketing, email campaigns, and content creation with AI. Silent Pilot helps businesses scale their digital presence effortlessly.',
  keywords = 'AI marketing automation, social media management, email campaigns, content creation, AI copywriting',
  image = 'https://silentpilot.app/og-image.png',
  url = 'https://silentpilot.app',
  type = 'website'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
