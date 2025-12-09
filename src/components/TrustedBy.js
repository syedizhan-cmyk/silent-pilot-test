import React from 'react';
import './TrustedBy.css';

function TrustedBy() {
  const companies = [
    { name: 'TechCorp', logo: '🏢' },
    { name: 'StartupHub', logo: '🚀' },
    { name: 'DataFlow', logo: '📊' },
    { name: 'CloudNet', logo: '☁️' },
    { name: 'DevForce', logo: '💻' },
    { name: 'InnovateLabs', logo: '🔬' }
  ];

  return (
    <section className="trusted-by">
      <div className="container">
        <p className="trusted-by-label">Trusted by teams at</p>
        <div className="companies-grid">
          {companies.map((company, index) => (
            <div key={index} className="company-item">
              <span className="company-logo">{company.logo}</span>
              <span className="company-name">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
