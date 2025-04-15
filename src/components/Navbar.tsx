import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await logout();
        // Navigation is handled in AuthContext
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="w-full py-4 border-b border-gray-800">
      <div className="container flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">
            Features
          </a>
          <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
            Testimonials
          </a>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white"
            onClick={handleAuthAction}
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
          {!isAuthenticated && (
            <Link to="/register">
              <Button variant="secondary" size="sm" className="bg-queryio-purple text-white hover:bg-queryio-darkpurple">
                Get Started
              </Button>
            </Link>
          )}
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
