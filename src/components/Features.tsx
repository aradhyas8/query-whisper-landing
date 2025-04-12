
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Shield, MessageSquare, Cpu, BarChart3 } from "lucide-react";

const featureData = [
  {
    title: "Secure Connections",
    description: "Connect to any database securely without exposing credentials",
    icon: <Shield className="h-12 w-12 text-queryio-purple" />,
  },
  {
    title: "Natural Language Queries",
    description: "Ask questions in plain English instead of writing complex SQL",
    icon: <MessageSquare className="h-12 w-12 text-queryio-purple" />,
  },
  {
    title: "AI-Powered Query Generation",
    description: "Our AI translates your questions into optimized SQL queries instantly",
    icon: <Cpu className="h-12 w-12 text-queryio-purple" />,
  },
  {
    title: "Interactive Visualizations",
    description: "Automatically create charts and graphs based on your query results",
    icon: <BarChart3 className="h-12 w-12 text-queryio-purple" />,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Features</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Everything you need to interact with your database without writing SQL
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((feature, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
