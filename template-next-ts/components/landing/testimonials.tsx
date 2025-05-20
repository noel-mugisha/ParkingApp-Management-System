
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay: string;
}

const Testimonial = ({ quote, author, role, company, delay }: TestimonialProps) => (
  <Card className={`border-none shadow-lg opacity-0 translate-y-4 animate-fade-in-up ${delay}`}>
    <CardHeader className="pb-2">
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        ))}
      </div>
      <blockquote className="text-lg italic font-medium">"{quote}"</blockquote>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
          {author[0]}
        </div>
        <div className="ml-4">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}, {company}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.observe');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (sectionRef.current) {
        const elements = sectionRef.current.querySelectorAll('.observe');
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  const testimonials = [
    {
      quote: "ParkMaster has revolutionized how we manage our mall parking. Customer complaints have dropped by 60% and revenue has increased significantly.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "Westfield Mall",
      delay: "animation-delay-200"
    },
    {
      quote: "The real-time analytics provided by ParkMaster help us make data-driven decisions for staffing and capacity planning. It's been a game-changer.",
      author: "Michael Chen",
      role: "Facility Manager",
      company: "City Central Parking",
      delay: "animation-delay-400"
    },
    {
      quote: "We've reduced our operating costs by 30% while improving security and customer satisfaction. The ROI on this system has been exceptional.",
      author: "Jessica Williams",
      role: "CEO",
      company: "Park Solutions Inc.",
      delay: "animation-delay-600"
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container px-4 md:px-6" ref={sectionRef}>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 opacity-0 observe">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-500 md:text-xl">
            See why parking managers worldwide choose our solution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              delay={testimonial.delay}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center opacity-0 observe animation-delay-400">
          <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
            {["Toyota", "Shell", "Marriott", "Target", "Boeing"].map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <span className="text-xl font-bold text-gray-400">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;