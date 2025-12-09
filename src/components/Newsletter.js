import React, { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-icon">📧</div>
          <h3 className="newsletter-title">Stay in the loop</h3>
          <p className="newsletter-description">
            Get the latest updates, tips, and exclusive offers delivered to your inbox
          </p>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
                disabled={submitted}
              />
              <button
                type="submit"
                className="btn btn-newsletter"
                disabled={submitted}
              >
                {submitted ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </form>

          <p className="newsletter-privacy">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
