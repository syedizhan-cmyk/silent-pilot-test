import React, { useState } from 'react';
import './FAQ.css';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Silent Pilot?',
      answer: 'Silent Pilot is an AI-powered productivity tool that helps automate tasks, provide insights, and streamline your workflow. It works quietly in the background, learning from your patterns to offer intelligent assistance when you need it.'
    },
    {
      question: 'How does the free trial work?',
      answer: 'You get full access to all Professional features for 14 days, no credit card required. You can cancel anytime during the trial period without being charged. After the trial, you can choose to upgrade to a paid plan or continue with our free Starter plan.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges or credits based on your billing cycle.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, security is our top priority. All data is encrypted end-to-end using industry-standard encryption. We never sell your data to third parties, and you maintain complete ownership of your information. We\'re SOC 2 Type II compliant and GDPR compliant.'
    },
    {
      question: 'What integrations do you support?',
      answer: 'We integrate with over 100+ popular tools including Slack, Google Workspace, Microsoft 365, Salesforce, Jira, Asana, Trello, and many more. We also offer a REST API for custom integrations. New integrations are added regularly based on user requests.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with Silent Pilot for any reason, contact our support team within 30 days of purchase for a full refund, no questions asked.'
    },
    {
      question: 'How does the AI work?',
      answer: 'Our AI uses advanced machine learning models trained on productivity patterns. It analyzes your workflow, learns your preferences, and provides contextual suggestions. The AI improves over time as it learns more about your specific needs and work style.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all users, priority support for Professional plans, and dedicated account managers for Enterprise customers. Our average response time is under 2 hours for priority support. We also have extensive documentation and video tutorials.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq">
      <div className="container">
        <div className="faq-header">
          <h2 className="section-title">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="section-description">
            Have questions? We've got answers. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="faq-icon"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p>Still have questions?</p>
          <button className="btn btn-faq">Contact Support</button>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
