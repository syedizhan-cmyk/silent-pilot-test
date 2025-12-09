import React, { useState } from 'react';
import './Pricing.css';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '5 AI requests per day',
        'Basic automation',
        'Email support',
        '1 GB storage',
        'Community access'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      description: 'For professionals who need more power',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Unlimited AI requests',
        'Advanced automation',
        'Priority support',
        '50 GB storage',
        'Custom integrations',
        'Analytics dashboard',
        'Team collaboration'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For large teams and organizations',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom AI training',
        'Unlimited storage',
        'Advanced security',
        'SLA guarantee',
        'On-premise deployment'
      ],
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <div className="pricing-header">
          <h2 className="section-title">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="section-description">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>

          <div className="billing-toggle">
            <button
              className={billingCycle === 'monthly' ? 'active' : ''}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={billingCycle === 'yearly' ? 'active' : ''}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="save-badge">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.highlighted && <div className="popular-badge">Most Popular</div>}
              
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">
                  {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="period">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.667 5L7.5 14.167L3.333 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`btn ${plan.highlighted ? 'btn-plan-primary' : 'btn-plan-secondary'}`}>
                {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <p>All plans include 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
