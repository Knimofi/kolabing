import React from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-foreground">Kolabing</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
            <Link 
              to="/#how-it-works" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/success-stories" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Success Stories
            </Link>
            <Link 
              to="/our-communities" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Communities
            </Link>
            <Link 
              to="/auth/sign-in" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://instagram.com/kolabingbcn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Kolabing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;