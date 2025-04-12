
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
          Chat with Your Database in <span className="text-gradient">Plain English</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl">
          No SQL skills required—just ask
        </p>
        <Button className="bg-white hover:bg-gray-200 text-queryio-background px-8 py-6 text-lg h-auto rounded-lg" asChild>
          <Link to="/app">Get Started</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
