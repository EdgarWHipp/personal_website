import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KnockoutArena.css'; // Import the CSS file
// Import your Stripe checkout function
import startStripeCheckout from '../services/kimiAPI'; // Adjust path if needed

const PRICING_TIERS = [
  { price: 10, label: 'Basic' },
  { price: 20, label: 'Pro' },
  { price: 30, label: 'Elite' },
];

const KnockoutArena = () => {
  const navigate = useNavigate();
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

      {/* Start Learning Button at the bottom */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <button
          onClick={() => navigate('/training')}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default KnockoutArena; 