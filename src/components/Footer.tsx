
import React from 'react';
import Logo from './Logo';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-800">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo />
            <p className="text-gray-400 mt-2">Chat with your database in plain English</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-4 md:space-y-0 md:flex md:gap-6">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Docs</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            
            <div className="flex gap-4 mt-6 md:mt-0">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Query.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
