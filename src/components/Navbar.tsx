
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

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
    <header className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-md shadow-sm bg-[slate-805] bg-inherit">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div 
          onClick={scrollToTop}
          className="flex items-center space-x-2 cursor-pointer"
          aria-label="Kolabing"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">K</span>
          </div>
          <span className="text-xl font-bold text-foreground">Kolabing</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a 
            href="#" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            Home
          </a>
          <a href="/our-communities" className="text-muted-foreground hover:text-foreground transition-colors">
            Our Communities
          </a>
          <a href="/success-stories" className="text-muted-foreground hover:text-foreground transition-colors">
            Success Stories
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#details" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
          {user ? (
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
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
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigate('/auth/sign-in')}
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground p-2 focus:outline-none" 
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
            href="/our-communities" 
            className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Our Communities
          </a>
          <a 
            href="/success-stories" 
            className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all" 
            onClick={() => {
              setIsMenuOpen(false);
              document.body.style.overflow = '';
            }}
          >
            Success Stories
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
              className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all"
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
              className="text-xl font-medium py-4 px-8 w-full text-center rounded-xl bg-card border border-border text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all"
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
