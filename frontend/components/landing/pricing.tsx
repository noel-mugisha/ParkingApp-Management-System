
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: "Basic",
      monthlyPrice: 199,
      annualPrice: 1990,
      description: "Perfect for small parking lots and garages",
      features: [
        "Up to 100 parking spaces",
        "Real-time occupancy monitoring",
        "Basic reporting",
        "Mobile app access",
        "Email support",
      ],
      isPopular: false,
      cta: "Get Started"
    },
    {
      name: "Standard",
      monthlyPrice: 399,
      annualPrice: 3990,
      description: "Ideal for medium-sized facilities and businesses",
      features: [
        "Up to 500 parking spaces",
        "Advanced analytics & reporting",
        "License plate recognition",
        "Reservation system",
        "Payment processing",
        "24/7 phone & email support",
      ],
      isPopular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      monthlyPrice: 799,
      annualPrice: 7990,
      description: "For large facilities and campus environments",
      features: [
        "Unlimited parking spaces",
        "Custom integrations",
        "Advanced security features",
        "Multi-location management",
        "White-labeled mobile app",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      isPopular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Transparent Pricing Plans
          </h2>
          <p className="text-gray-500 md:text-xl">
            Choose the perfect plan for your parking facility needs
          </p>
        </div>
        
        <div className="flex justify-center mb-12 opacity-0 animate-fade-in-up animation-delay-200">
          <div className="bg-gray-100 p-1 rounded-full flex items-center">
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              Annual (Save 20%)
            </button>
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border opacity-0 animate-fade-in-up ${
                plan.isPopular ? "shadow-lg relative border-blue-500" : "shadow-sm"
              } animation-delay-${(index + 2) * 200}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                  {isAnnual && <p className="text-sm text-gray-500">Billed annually (${plan.annualPrice})</p>}
                </div>
                <CardDescription className="mt-4">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 shrink-0 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${plan.isPopular ? "bg-blue-500 hover:bg-blue-600" : ""}`}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center max-w-xl mx-auto opacity-0 animate-fade-in-up animation-delay-800">
          <p className="text-gray-500">
            All plans include a 14-day free trial. No credit card required. Need a custom solution? Contact our sales team for a tailored quote.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;