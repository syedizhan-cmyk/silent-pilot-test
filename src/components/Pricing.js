import React, { useState } from 'react';
import './Pricing.css';
import CheckoutButton from './billing/CheckoutButton';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for solopreneurs and small businesses',
      monthlyPrice: 0,
      yearlyPrice: 0,
      price_monthly: 0,
      price_yearly: 0,
      features: [
        '10 posts per month',
        '2 social media accounts',
        'Basic AI content generation',
        'Email support',
        'Content calendar'
      ],
      highlighted: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For growing businesses and teams',
      monthlyPrice: 29,
      yearlyPrice: 290,
      price_monthly: 29,
      price_yearly: 290,
      features: [
        'Unlimited posts',
        '10 social media accounts',
        'Advanced AI content creation',
        'Email marketing campaigns',
        'Analytics & insights',
        'Priority support',
        'Team collaboration'
      ],
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large teams and agencies',
      monthlyPrice: 99,
      yearlyPrice: 990,
      price_monthly: 99,
      price_yearly: 990,
      features: [
        'Everything in Professional',
        'Unlimited social accounts',
        'White-label solution',
        'Custom AI training',
        'Dedicated account manager',
        'Advanced security & compliance',
        'API access'
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

              <CheckoutButton 
                plan={plan} 
                billingCycle={billingCycle}
                className={`btn ${plan.highlighted ? 'btn-plan-primary' : 'btn-plan-secondary'}`}
              />
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
