
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const testimonials = [
  {
    quote: "Query.io has completely transformed how our team interacts with our database. Non-technical team members can now get insights without bothering our data engineers.",
    name: "Sarah Johnson",
    role: "Product Manager at TechFlow",
    avatar: "SJ",
  },
  {
    quote: "The natural language interface is incredibly accurate. We've reduced the time spent on data analysis by 70% since implementing Query.io.",
    name: "Alex Chen",
    role: "CTO at DataDriven",
    avatar: "AC",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">What Our Users Say</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Join hundreds of companies already using Query.io
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <p className="text-lg mb-6 italic text-gray-300">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-queryio-purple">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
