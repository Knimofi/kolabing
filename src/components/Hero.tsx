
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import LottieAnimation from "./LottieAnimation";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [lottieData, setLottieData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and when window resizes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/loop-header.lottie')
      .then(response => response.json())
      .then(data => setLottieData(data))
      .catch(error => console.error("Error loading Lottie animation:", error));
  }, []);

  useEffect(() => {
    // Skip effect on mobile
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      
      const {
        left,
        top,
        width,
        height
      } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMobile]);
  
  useEffect(() => {
    // Skip parallax on mobile
    if (isMobile) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(el => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || '0.1');
        const yPos = -scrollY * speed;
        element.style.setProperty('--parallax-y', `${yPos}px`);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  return (
    <section 
      className="hero-section overflow-hidden relative min-h-screen bg-background text-foreground" 
      id="hero" 
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-90"></div>
      
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground mr-3 text-sm font-bold">01</span>
              <span className="text-sm font-medium">Purpose</span>
            </div>
            
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.3s" }}
            >
              Atlas: Where Code<br />
              <span className="text-primary">Meets Motion</span>
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed opacity-0 animate-fade-in max-w-2xl mx-auto lg:mx-0"
            >
              The humanoid companion that learns and adapts alongside you.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-6 opacity-0 animate-fade-in justify-center lg:justify-start" 
              style={{ animationDelay: "0.7s" }}
            >
              <a 
                href="#get-access" 
                className="button-primary inline-flex items-center justify-center group text-lg font-bold"
              >
                Request Access
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              
              <a 
                href="#features" 
                className="button-secondary inline-flex items-center justify-center text-lg font-bold"
              >
                Learn More
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            {lottieData ? (
              <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.9s" }}>
                <LottieAnimation 
                  animationPath={lottieData} 
                  className="w-full h-auto max-w-lg mx-auto"
                  loop={true}
                  autoplay={true}
                />
              </div>
            ) : (
              <div className="relative animate-fade-in" style={{ animationDelay: "0.9s" }}>
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl transform scale-110"></div>
                <div className="premium-card relative overflow-hidden">
                  <img 
                    ref={imageRef} 
                    src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png" 
                    alt="Atlas Robot" 
                    className="w-full h-auto object-cover transition-transform duration-500 ease-out" 
                    style={{ transformStyle: 'preserve-3d' }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
