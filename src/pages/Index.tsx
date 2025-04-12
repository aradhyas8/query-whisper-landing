
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

const Index = () => {
  return (
    <div className="min-h-screen bg-queryio-background text-white overflow-x-hidden">
      <Navbar />
      
      <FadeIn>
        <Hero />
      </FadeIn>
      
      <FadeIn delay={100}>
        <Features />
      </FadeIn>
      
      <FadeIn delay={200}>
        <HowItWorks />
      </FadeIn>
      
      <FadeIn delay={300}>
        <Testimonials />
      </FadeIn>
      
      <Footer />
    </div>
  );
};

export default Index;
