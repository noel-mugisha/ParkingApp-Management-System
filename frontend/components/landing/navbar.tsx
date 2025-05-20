import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white font-bold">P</div>
          <span className="text-xl font-bold text-gray-800">ParkMaster</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors">How it Works</Link>
          <Link href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors">Testimonials</Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors">Pricing</Link>
          <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="ghost" className="text-gray-700">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <Link href="#features" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md">How it Works</Link>
            <Link href="#testimonials" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md">Testimonials</Link>
            <Link href="#pricing" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md">Pricing</Link>
            <Link href="#contact" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md">Contact</Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;