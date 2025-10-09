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
            <img
              src="https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/sign/media/Logo_Kolabing-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mOWQ2MzU4NS1iNjc3LTQ1NGYtOTRhZS1iODg3NjU5MWU3OGIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9Mb2dvX0tvbGFiaW5nLXJlbW92ZWJnLXByZXZpZXcucG5nIiwiaWF0IjoxNzYwMDAwMjY3LCJleHAiOjE3OTE1MzYyNjd9.WlXIWFEuiQztblbyF1mWhhOva8mD5hcjKghi55y3jRo"
              alt="Kolabing Logo"
              className="w-8 h-8"
            />
            <span
              className="text-xl font-extrabold text-white tracking-wide"
              style={{ fontFamily: "'Rubik', sans-serif", textTransform: "uppercase" }}
            >
              KOLABING
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
