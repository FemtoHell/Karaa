import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        { text: '3 Resume templates', included: true },
        { text: '1 Active resume', included: true },
        { text: 'PDF download', included: true },
        { text: 'Basic customization', included: true },
        { text: 'Email support', included: false },
        { text: 'Custom branding', included: false },
        { text: 'Analytics', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For serious job seekers',
      features: [
        { text: '50+ Resume templates', included: true },
        { text: 'Unlimited resumes', included: true },
        { text: 'PDF & DOCX download', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'Email support', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Analytics', included: false },
        { text: 'Priority support', included: false }
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Business',
      price: { monthly: 29.99, yearly: 299.99 },
      description: 'For teams and recruiters',
      features: [
        { text: '50+ Resume templates', included: true },
        { text: 'Unlimited resumes', included: true },
        { text: 'PDF & DOCX download', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'Email support', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Analytics & tracking', included: true },
        { text: 'Priority support', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="pricing-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <div className="header-content">
            <Link to="/" className="logo-wrapper">
              <div className="logo-icon">
                <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
                  <path d="M0 0H11V14L5.5 11L0 14V0Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="logo-text">ResumeBuilder</span>
            </Link>

            <nav className="nav-menu">
              <Link to="/features" className="nav-link">Features</Link>
              <Link to="/pricing" className="nav-link active">Pricing</Link>
              <Link to="/templates" className="nav-link">Templates</Link>
              <Link to="/testimonials" className="nav-link">Testimonials</Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              ) : (
                <Link to="/login" className="nav-link">Login</Link>
              )}
            </nav>

            <div className="header-actions">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">Dashboard</Link>
              ) : (
                <Link to="/templates" className="btn-primary">Get Started</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-container">
          <h1 className="pricing-hero-title">Simple, Transparent Pricing</h1>
          <p className="pricing-hero-subtitle">
            Choose the plan that's right for you. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <button
              className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="save-badge">Save 17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="pricing-cards-container">
          <div className="pricing-cards-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}

                <div className="pricing-card-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">
                      {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="period">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="pricing-card-body">
                  <ul className="features-list">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={feature.included ? 'included' : 'not-included'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          {feature.included ? (
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#10B981"/>
                          ) : (
                            <path d="M6 6l8 8m0-8l-8 8" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                          )}
                        </svg>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pricing-card-footer">
                  <Link
                    to={plan.name === 'Free' ? '/templates' : '/login'}
                    className={`btn-plan ${plan.popular ? 'primary' : 'secondary'}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I switch plans later?</h4>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>Yes! Pro plan includes a 14-day free trial. No credit card required.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Absolutely! Cancel anytime with no questions asked. You'll still have access until your billing period ends.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer refunds?</h4>
              <p>Yes! We offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
            <div className="faq-item">
              <h4>Is my data secure?</h4>
              <p>Yes! We use bank-level encryption and never share your data with third parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Still Have Questions?</h2>
          <p className="cta-subtitle">Our team is here to help you choose the right plan</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-cta-primary">Contact Sales</Link>
            <Link to="/templates" className="btn-cta-secondary">Try For Free</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column">
              <h3 className="footer-heading">{t('product')}</h3>
              <ul className="footer-list">
                <li><Link to="/templates">{t('templates')}</Link></li>
                <li><Link to="/features">{t('features')}</Link></li>
                <li><Link to="/pricing">{t('pricing')}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">{t('support')}</h3>
              <ul className="footer-list">
                <li><Link to="/help">{t('helpCenter')}</Link></li>
                <li><Link to="/contact">{t('contact')}</Link></li>
                <li><Link to="/faq">{t('faq')}</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">{t('company')}</h3>
              <ul className="footer-list">
                <li><Link to="/about">{t('about')}</Link></li>
                <li><Link to="/privacy">{t('privacy')}</Link></li>
                <li><Link to="/terms">{t('terms')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2024 ResumeBuilder. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
