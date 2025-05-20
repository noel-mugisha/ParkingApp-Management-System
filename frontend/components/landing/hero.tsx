import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Main heading and subtext */}
          <div className="space-y-8 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-fade-in">
              Parking & Vehicle Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              Streamline your parking operations, reduce congestion, and enhance customer satisfaction with our intelligent parking management solution.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16 animate-fade-in animation-delay-300">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="border-blue-200 hover:bg-blue-50 px-8 py-6 text-lg">
              Book a Demo
            </Button>
          </div>
          
          {/* Trusted by section */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-6 animate-fade-in animation-delay-400">
            <div className="flex -space-x-3 mr-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-sm text-white">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                Trusted by <span className="font-bold text-blue-600">2,000+</span> parking facilities worldwide
              </p>
            </div>
          </div>
          
          {/* Statistics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-12 animate-fade-in animation-delay-500">
            <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100">
              <p className="text-3xl font-bold text-gray-900">125+</p>
              <p className="text-gray-600">Cities</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100">
              <p className="text-3xl font-bold text-blue-600">12.5K</p>
              <p className="text-gray-600">Parking Spots</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100">
              <p className="text-3xl font-bold text-green-600">98%</p>
              <p className="text-gray-600">Satisfaction</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm text-center border border-gray-100">
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-5 md:left-10 w-16 h-16 md:w-24 md:h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-5 md:right-10 w-20 h-20 md:w-32 md:h-32 bg-green-400/20 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/2 left-1/2 w-12 h-12 md:w-16 md:h-16 bg-yellow-400/20 rounded-full blur-xl animate-float animation-delay-300"></div>
      
      {/* Gradient fade to white at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;