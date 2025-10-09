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

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
    menuButtonRef.current?.focus();
  };
  const toggleMenu = () => {
    setIsMenuOpen((x) => {
      if (!x) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
      return !x;
    });
  };
  const scrollToTop = () => {
    if (location.pathname !== "/") navigate("/");
    setTimeout(
      () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      location.pathname !== "/" ? 100 : 0,
    );
    if (isMenuOpen) closeMenu();
  };
  const isActivePage = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) closeMenu();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMenuOpen]);
  useEffect(() => {
    if (isMenuOpen) {
      const firstMenuItem = menuRef.current?.querySelector("a, button");
      (firstMenuItem as HTMLElement)?.focus();
    }
  }, [isMenuOpen]);
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <header
      style={{
        backgroundColor: "rgba(0,0,0,0.05)", // 5% black
        backdropFilter: "blur(4px)",
      }}
      className="fixed top-0 left-0 right-0 z-50 py-4 shadow-sm"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div onClick={scrollToTop} className="flex items-center space-x-2 cursor-pointer" aria-label="Kolabing">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img
              src="https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/sign/media/Logo_Kolabing-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mOWQ2MzU4NS1iNjc3LTQ1NGYtOTRhZS1iODg3NjU5MWU3OGIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9Mb2dvX0tvbGFiaW5nLXJlbW92ZWJnLXByZXZpZXcucG5nIiwiaWF0IjoxNzU5OTk4NzAxLCJleHAiOjE3OTE1MzQ3MDF9.CH3or8O3VNDxzdh8xEir7xHPqqj6u-mgnXyXPyrnIIw"
              alt="Kolabing Logo"
              className="w-8 h-8"
            />
          </div>
          <span style={LOGO_FONT} className="text-[1.28rem] select-none tracking-wide">
            KOLABING
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
          <button
            onClick={scrollToTop}
            style={NAV_FONT}
            className={cn(
              "transition-colors duration-300 text-base px-1 tracking-wide",
              isActivePage("/") ? "text-primary" : "text-foreground",
            )}
          >
            How It Works
          </button>
          <button
            onClick={() => navigate("/success-stories")}
            style={NAV_FONT}
            className={cn(
              "transition-colors duration-300 text-base px-1 tracking-wide",
              isActivePage("/success-stories") ? "text-primary" : "text-foreground",
            )}
          >
            Success Stories
          </button>
          <button
            onClick={() => navigate("/our-communities")}
            style={NAV_FONT}
            className={cn(
              "transition-colors duration-300 text-base px-1 tracking-wide",
              isActivePage("/our-communities") ? "text-primary" : "text-foreground",
            )}
          >
            For Communities
          </button>
          {user ? (
            <button
              style={NAV_FONT}
              className="text-foreground transition-colors duration-300 text-base px-1 tracking-wide"
              onClick={() => {
                if (profile?.user_type === "business") navigate("/business");
                else if (profile?.user_type === "community") navigate("/community");
              }}
            >
              Dashboard
            </button>
          ) : (
            <button
              style={NAV_FONT}
              className="text-foreground transition-colors duration-300 text-base px-1 tracking-wide"
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

      {/* Mobile Overlay */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        className={cn(
          "fixed inset-0 z-[100] md:hidden transition-all duration-300 ease-in-out flex flex-col",
          isMenuOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none",
        )}
        style={{
          backgroundColor: "#FFD861", // solid yellow overlay
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Menu header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <img
              src="https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/sign/media/Logo_Kolabing-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mOWQ2MzU4NS1iNjc3LTQ1NGYtOTRhZS1iODg3NjU5MWU3OGIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9Mb2dvX0tvbGFiaW5nLXJlbW92ZWJnLXByZXZpZXcucG5nIiwiaWF0IjoxNzU5OTk4NzAxLCJleHAiOjE3OTE1MzQ3MDF9.CH3or8O3VNDxzdh8xEir7xHPqqj6u-mgnXyXPyrnIIw"
              alt="Kolabing Logo"
              className="w-8 h-8"
            />
            <span style={LOGO_FONT} className="text-[1.28rem] text-black">
              KOLABING
            </span>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 text-black hover:text-primary transition-colors duration-200 focus:outline-none rounded-lg"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        {/* Mobile menu items */}
        <nav role="navigation" aria-label="Mobile navigation" className="flex flex-col p-6 space-y-2">
          <button
            onClick={scrollToTop}
            style={{ ...NAV_FONT, color: "#111" }}
            className={cn(
              "flex items-center py-4 px-4 text-lg transition-all duration-200 text-left w-full",
              isActivePage("/") ? "border-l-4 border-black font-bold" : "",
            )}
          >
            How It Works
          </button>
          <button
            onClick={() => {
              navigate("/success-stories");
              closeMenu();
            }}
            style={{ ...NAV_FONT, color: "#111" }}
            className={cn(
              "flex items-center py-4 px-4 text-lg transition-all duration-200 text-left w-full",
              isActivePage("/success-stories") ? "border-l-4 border-black font-bold" : "",
            )}
          >
            Success Stories
          </button>
          <button
            onClick={() => {
              navigate("/our-communities");
              closeMenu();
            }}
            style={{ ...NAV_FONT, color: "#111" }}
            className={cn(
              "flex items-center py-4 px-4 text-lg transition-all duration-200 text-left w-full",
              isActivePage("/our-communities") ? "border-l-4 border-black font-bold" : "",
            )}
          >
            Our Communities
          </button>
          <div className="h-px bg-border my-4" />
          {user ? (
            <button
              onClick={() => {
                if (profile?.user_type === "business") navigate("/business");
                else if (profile?.user_type === "community") navigate("/community");
                closeMenu();
              }}
              style={{ ...NAV_FONT, color: "#111" }}
              className="flex items-center py-4 px-4 text-lg transition-all duration-200 text-left w-full"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/auth/sign-in");
                closeMenu();
              }}
              style={{ ...NAV_FONT, color: "#111" }}
              className="flex items-center py-4 px-4 text-lg transition-all duration-200 text-left w-full"
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
