import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Font styles
const NAV_FONT = {
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  fontWeight: 400,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const LOGO_FONT = {
  fontFamily: "'Rubik', Arial, sans-serif",
  fontWeight: 900,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Close menu with enhanced UX features
  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
    menuButtonRef.current?.focus();
  };

  // Toggle menu open/closed with scroll lock
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? "hidden" : "";
  };

  // Enhanced scroll to top
  const scrollToTop = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    setTimeout(
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
      location.pathname !== "/" ? 100 : 0,
    );
    if (isMenuOpen) closeMenu();
  };

  // Section anchor scroll
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (isMenuOpen) closeMenu();
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMenuOpen]);

  // Focus first menu item on mobile open
  useEffect(() => {
    if (isMenuOpen) {
      const firstMenuItem = menuRef.current?.querySelector("a, button");
      (firstMenuItem as HTMLElement)?.focus();
    }
  }, [isMenuOpen]);

  // Restore scroll after unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Page active helper
  const isActivePage = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 shadow-sm bg-background">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div onClick={scrollToTop} className="flex items-center space-x-2 cursor-pointer" aria-label="Kolabing">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img
              src="https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/sign/media/Logo%20Kolabing.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mOWQ2MzU4NS1iNjc3LTQ1NGYtOTRhZS1iODg3NjU5MWU3OGIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9Mb2dvIEtvbGFiaW5nLnBuZyIsImlhdCI6MTc1OTI0NDEyNSwiZXhwIjoxNzkwNzgwMTI1fQ.VF8cudTlK1B-3KPZ8iiL0VqUvo-yYejBgrH_o7X6IJQ"
              alt="Kolabing Logo"
              className="w-8 h-8"
            />
          </div>
          <span style={LOGO_FONT} className="text-xl font-bold text-foreground">
            Kolabing
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6" role="navigation" aria-label="Main navigation">
          <button
            onClick={scrollToTop}
            style={NAV_FONT}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors duration-300",
              isActivePage("/") && "text-primary font-medium",
            )}
          >
            How it Works
          </button>
          <button
            onClick={() => navigate("/success-stories")}
            style={NAV_FONT}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors duration-300",
              isActivePage("/success-stories") && "text-primary font-medium",
            )}
          >
            Success Stories
          </button>
          <button
            onClick={() => navigate("/our-communities")}
            style={NAV_FONT}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors duration-300",
              isActivePage("/our-communities") && "text-primary font-medium",
            )}
          >
            For Communities
          </button>
          {user ? (
            <button
              style={NAV_FONT}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              onClick={() => {
                if (profile?.user_type === "business") {
                  navigate("/business");
                } else if (profile?.user_type === "community") {
                  navigate("/community");
                }
              }}
            >
              Dashboard
            </button>
          ) : (
            <button
              style={NAV_FONT}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              onClick={() => navigate("/auth/sign-in")}
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile hamburger button */}
        <button
          ref={menuButtonRef}
          className="md:hidden text-foreground p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg transition-colors duration-200"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Modern Mobile Navigation Overlay */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        className={cn(
          "fixed inset-0 z-60 md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none",
        )}
        style={{ backgroundColor: "#142148" }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Menu header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <img
              src="https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/sign/media/Logo%20Kolabing.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mOWQ2MzU4NS1iNjc3LTQ1NGYtOTRhZS1iODg3NjU5MWU3OGIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9Mb2dvIEtvbGFiaW5nLnBuZyIsImlhdCI6MTc1OTI0NDEyNSwiZXhwIjoxNzkwNzgwMTI1fQ.VF8cudTlK1B-3KPZ8iiL0VqUvo-yYejBgrH_o7X6IJQ"
              alt="Kolabing Logo"
              className="w-8 h-8"
            />
            <span style={LOGO_FONT} className="text-xl font-bold text-foreground">
              Kolabing
            </span>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile menu items */}
        <nav role="navigation" aria-label="Mobile navigation" className="flex flex-col p-6 space-y-2">
          <button
            onClick={scrollToTop}
            style={NAV_FONT}
            className={cn(
              "flex items-center py-4 px-4 text-lg font-medium rounded-xl transition-all duration-200 text-left w-full",
              "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              isActivePage("/")
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-foreground hover:text-primary",
            )}
          >
            How it Works
            {isActivePage("/") && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
          </button>

          <button
            onClick={() => {
              navigate("/success-stories");
              closeMenu();
            }}
            style={NAV_FONT}
            className={cn(
              "flex items-center py-4 px-4 text-lg font-medium rounded-xl transition-all duration-200 text-left w-full",
              "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              isActivePage("/success-stories")
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-foreground hover:text-primary",
            )}
          >
            Success Stories
            {isActivePage("/success-stories") && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
          </button>

          <button
            onClick={() => {
              navigate("/our-communities");
              closeMenu();
            }}
            style={NAV_FONT}
            className={cn(
              "flex items-center py-4 px-4 text-lg font-medium rounded-xl transition-all duration-200 text-left w-full",
              "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              isActivePage("/our-communities")
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-foreground hover:text-primary",
            )}
          >
            Our Communities
            {isActivePage("/our-communities") && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
          </button>

          {/* Divider */}
          <div className="h-px bg-border my-4" />

          {user ? (
            <button
              onClick={() => {
                if (profile?.user_type === "business") {
                  navigate("/business");
                } else if (profile?.user_type === "community") {
                  navigate("/community");
                }
                closeMenu();
              }}
              style={NAV_FONT}
              className="flex items-center py-4 px-4 text-lg font-medium rounded-xl transition-all duration-200 text-left w-full bg-primary/10 text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/auth/sign-in");
                closeMenu();
              }}
              style={NAV_FONT}
              className="flex items-center py-4 px-4 text-lg font-medium rounded-xl transition-all duration-200 text-left w-full bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
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
