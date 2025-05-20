"use client"
import React, { useEffect } from 'react';
import ContactSection from '@/components/landing/contact';
import FeaturesSection from '@/components/landing/feature';
import Footer from '@/components/landing/footer';
import HeroSection from '@/components/landing/hero';
import HowItWorksSection from '@/components/landing/how-it-works';
import Navbar from '@/components/landing/navbar';
import PricingSection from '@/components/landing/pricing';
import TestimonialsSection from '@/components/landing/testimonials';

const Index = () => {
  useEffect(() => {
    document.title = "ParkMaster - Smart Parking & Vehicle Management";
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;