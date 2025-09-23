
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 md:py-4 transition-all duration-300",
        isScrolled 
          ? "bg-background/90 backdrop-blur-md shadow-lg border-b border-border" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <a 
          href="#" 
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Pulse Robot"
        >
          <img 
            src="/logo.svg" 
            alt="Pulse Robot Logo" 
            className="h-8 sm:h-10" 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a 
            href="#" 
            className="nav-link text-lg"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            Home
          </a>
          <a href="#features" className="nav-link text-lg">About</a>
          <a href="#details" className="nav-link text-lg">Contact</a>
          {user ? (
            <button 
              className="button-primary text-sm"
              onClick={() => {
                if (profile?.user_type === 'business') {
                  navigate('/business');
                } else if (profile?.user_type === 'community') {
                  navigate('/community');
                }
              }}
            >
              Dashboard
            </button>
          ) : (
            <button 
              className="button-primary text-sm"
              onClick={() => navigate('/auth/sign-in')}
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground p-3 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-40 bg-background flex flex-col pt-20 px-6 md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-6 items-center mt-8">
          <a 
            href="#" 
            className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all" 
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Home
          </a>
          <a 
            href="#features" 
            className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            About
          </a>
          <a 
            href="#details" 
            className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Contact
          </a>
          {user ? (
            <button 
              className="button-primary text-xl w-full"
              onClick={() => {
                if (profile?.user_type === 'business') {
                  navigate('/business');
                } else if (profile?.user_type === 'community') {
                  navigate('/community');
                }
                setIsMenuOpen(false);
                document.body.style.overflow = '';
              }}
            >
              Dashboard
            </button>
          ) : (
            <button 
              className="button-primary text-xl w-full"
              onClick={() => {
                navigate('/auth/sign-in');
                setIsMenuOpen(false);
                document.body.style.overflow = '';
              }}
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
