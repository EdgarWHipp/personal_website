import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Premium",
      price: "€10",
      period: "/ month",
      description: "Complete AI language learning experience",
      features: [
        "All languages (French, Chinese, Spanish, German)",
        "AI-powered lessons with real-time feedback",
        "Progress tracking and analytics",
        "Offline lesson downloads",
        "Personalized difficulty levels",
        "Priority customer support",
        "7-day free trial"
      ],
      priceId: "premium_monthly",
      popular: true
    }
  ];

  const handleCheckout = async (plan) => {
    // In a real implementation, this would integrate with Stripe
    // For now, we'll simulate the checkout process
    console.log(`Starting checkout for ${plan.name} plan`);
    
    // Simulate Stripe checkout redirect
    // In production, this would call your backend to create a Stripe checkout session
    alert(`Redirecting to Stripe checkout for ${plan.name} plan at ${plan.price}${plan.period}`);
    
    // For demo purposes, we can simulate success
    setTimeout(() => {
      alert("Payment successful! You now have access to the " + plan.name + " plan.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-yellow-500 relative overflow-hidden">
      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-300/20 via-transparent to-red-400/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/knockout-image.png" 
              alt="Knockout Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <div className="text-white font-bold text-2xl">Knockout</div>
          </div>
          <button 
            onClick={() => navigate('/knockout-main')}
            className="text-white/80 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Pricing Header */}
      <div className="relative z-10 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Choose Your Plan
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Start your language learning journey today with our AI-powered lessons
        </p>
      </div>

      {/* Pricing Card */}
      <div className="relative z-10 px-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-orange-400/50">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-white/70 mb-4">Complete AI language learning experience</p>
              <div className="text-5xl font-bold text-white mb-1">
                €10
                <span className="text-lg text-white/60">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plans[0].features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plans[0])}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-bold transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:scale-105"
            >
              Start Learning - €10/month
            </button>

            <p className="text-center text-white/60 mt-4 text-sm">
              7-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Can I cancel anytime?</h3>
              <p className="text-white/80">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Is there a free trial?</h3>
              <p className="text-white/80">Yes! All plans come with a 7-day free trial. No credit card required to start.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-white/80">We accept all major credit cards, PayPal, and various local payment methods through Stripe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/60">
            © 2024 FluencyPunch. Master languages with AI-powered training.
          </p>
        </div>
      </footer>
    </div>
  );
}