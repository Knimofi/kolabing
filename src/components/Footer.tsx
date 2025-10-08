import React from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black py-12 px-4 border-t border-[#222]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#FFD861] rounded-lg flex items-center justify-center">
              <span className="text-black font-extrabold text-lg" style={{ fontFamily: "'Rubik', sans-serif" }}>
                K
              </span>
            </div>
            <span
              className="text-xl font-extrabold text-white tracking-wide"
              style={{ fontFamily: "'Rubik', sans-serif" }}
            >
              Kolabing
            </span>
          </div>

          {/* Navigation Links */}
          <div
            className="flex flex-wrap items-center justify-center space-x-6 text-sm font-medium"
            style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
          >
            <Link to="/#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link to="/success-stories" className="text-neutral-400 hover:text-white transition-colors">
              Success Stories
            </Link>
            <Link to="/our-communities" className="text-neutral-400 hover:text-white transition-colors">
              Communities
            </Link>
            <Link to="/auth/sign-in" className="text-neutral-400 hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://instagram.com/kolabingbcn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-[#222] text-center">
          <p
            className="text-sm text-neutral-500 tracking-wide"
            style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
          >
            © 2025 Kolabing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
