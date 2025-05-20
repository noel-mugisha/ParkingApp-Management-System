import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/50 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in-up">
                Smart Parking & Vehicle Management System
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 animate-fade-in-up animation-delay-200">
                Streamline your parking operations, reduce congestion, and enhance customer satisfaction with our intelligent parking management solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">Get Started</Button>
              <Button variant="outline" size="lg">Book a Demo</Button>
            </div>
            <div className="flex items-center space-x-4 text-sm animate-fade-in-up animation-delay-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-blue-${i*100} border-2 border-white flex items-center justify-center text-xs text-white`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-gray-500">
                Trusted by <span className="font-medium text-gray-900">2,000+</span> parking facilities
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] aspect-square z-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border animate-fade-in-up">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Downtown Garage</p>
                        <p className="text-xs text-gray-500">15 min ago</p>
                      </div>
                    </div>
                    <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      Available
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Total Spots</p>
                        <p className="font-semibold">250</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Available</p>
                        <p className="font-semibold text-blue-500">48</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <p className="text-xs font-medium">Occupancy Rate</p>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{width: '80%'}}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>80% Occupied</span>
                        <span className="text-blue-500">20% Free</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Reserve a Spot</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-1/4 -left-4 w-16 h-16 bg-green-500/80 rounded-2xl rotate-12 animate-float animation-delay-200"></div>
            <div className="absolute bottom-1/4 -right-4 w-20 h-20 bg-blue-500/80 rounded-full animate-float animation-delay-400 z-0"></div>
            <div className="absolute -bottom-6 left-1/3 w-12 h-12 bg-yellow-400/80 rounded-lg -rotate-12 animate-float animation-delay-600"></div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white"></div>
    </section>
  );
};

export default HeroSection;