
import React from 'react';
import { Database, MessageCircle, BarChart } from 'lucide-react';

const steps = [
  {
    title: "Connect Your Database",
    description: "Quick and secure connection to your PostgreSQL, MySQL, or other databases without sharing credentials",
    icon: <Database className="h-12 w-12 text-queryio-purple" />,
  },
  {
    title: "Ask in Plain English",
    description: "Type your questions naturally like 'Show me top customers last month' without writing code",
    icon: <MessageCircle className="h-12 w-12 text-queryio-purple" />,
  },
  {
    title: "See Results & Insights",
    description: "Get instant results with auto-generated visualizations and actionable insights",
    icon: <BarChart className="h-12 w-12 text-queryio-purple" />,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-900">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How It Works</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
          Query your database in three simple steps
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center md:w-1/3">
              <div className="mb-6 rounded-full bg-gray-800 p-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-[-30px] top-1/2 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
