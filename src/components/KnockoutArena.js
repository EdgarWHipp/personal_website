import React from 'react';
import './KnockoutArena.css'; // Import the CSS file
// Import your Stripe checkout function
import startStripeCheckout from '../services/kimiAPI'; // Adjust path if needed

const PRICING_TIERS = [
  { price: 10, label: 'Basic' },
  { price: 20, label: 'Pro' },
  { price: 30, label: 'Elite' },
];

const KnockoutArena = () => {
  // Handler for Stripe checkout
  const handleCheckout = (amount) => {
    // Call your existing Stripe checkout logic
    // You may need to pass a priceId or amount, depending on your implementation
    startStripeCheckout(amount);
  };

  return (
    <div>
      <div className="knockout-header">
        <img
          src="/knockout-image.png" // Path to the image in the public folder
          alt="Knockout Logo"
          className="knockout-image"
        />
        <h1 className="framer-style-heading">
          Knockout
        </h1>
      </div>

      {/* Pricing Section */}
      <div className="pricing-section">
        {PRICING_TIERS.map((tier) => (
          <div className="pricing-tier" key={tier.price}>
            <h2>{tier.label}</h2>
            <p>${tier.price}</p>
            <button onClick={() => handleCheckout(tier.price)}>
              Choose {tier.label}
            </button>
          </div>
        ))}
      </div>

      {/* REMOVE the following block if it exists at the bottom: */}
      {/*
      <div className="cta-section">
        <h1>Start Your Language Journey Today</h1>
        <p>Join thousands of learners who are already mastering new languages with AI-powered training.</p>
        <button>Start Learning</button>
      </div>
      */}
    </div>
  );
};

export default KnockoutArena; 