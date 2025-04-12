
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Check } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonLink, 
  highlighted = false 
}: { 
  title: string; 
  price: string; 
  description: string; 
  features: string[]; 
  buttonText: string; 
  buttonLink: string;
  highlighted?: boolean;
}) => {
  return (
    <Card className={`flex flex-col h-full ${highlighted ? 'border-queryio-white/30 bg-gradient-to-b from-secondary to-card' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-4 flex items-baseline text-white">
          <span className="text-4xl font-extrabold tracking-tight">{price}</span>
          {price !== 'Free' && <span className="ml-1 text-xl text-muted-foreground">/month</span>}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link to={buttonLink} className="w-full">
          <Button 
            variant={highlighted ? "default" : "outline"} 
            size="lg" 
            className={`w-full ${highlighted ? 'bg-queryio-white text-queryio-background' : 'border-queryio-white/40'}`}
          >
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-queryio-background text-white flex flex-col">
      <Helmet>
        <title>Query.io Pricing – Choose Your Plan</title>
        <meta 
          name="description" 
          content="Compare our Free, Pro ($49/mo), and Enterprise ($99/mo) plans and unlock powerful AI‑powered database chat features." 
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your needs and start chatting with your databases today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <PricingCard 
            title="Free"
            price="Free"
            description="Perfect for getting started and exploring Query.io."
            features={[
              "Basic chat with one database",
              "100 queries per month",
              "Community support",
              "Core features"
            ]}
            buttonText="Get Started"
            buttonLink="/register"
          />
          
          {/* Pro Plan */}
          <PricingCard 
            title="Pro"
            price="$49"
            description="Everything you need for professional database management."
            features={[
              "Unlimited databases",
              "10,000 queries per month",
              "Priority email support",
              "Advanced analytics",
              "Team collaboration"
            ]}
            buttonText="Choose Pro"
            buttonLink="/register?plan=pro"
            highlighted={true}
          />
          
          {/* Enterprise Plan */}
          <PricingCard 
            title="Enterprise"
            price="$99"
            description="Maximum power and control for large organizations."
            features={[
              "Unlimited everything",
              "Custom SLAs",
              "Dedicated account manager",
              "Premium support",
              "Custom integrations",
              "Advanced security features"
            ]}
            buttonText="Contact Sales"
            buttonLink="/contact"
          />
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">All Plans Include</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Natural language database queries",
              "SQL query generation",
              "Data visualization",
              "Query history and sharing",
              "Secure database connections",
              "Multiple database types support",
              "Regular feature updates",
              "Cross-platform compatibility"
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
