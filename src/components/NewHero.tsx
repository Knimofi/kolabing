import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewHero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const videos = [
    '/videos/ugos-node.mp4',
    '/videos/community-event-success.mp4',
    '/videos/brand-partnership.mp4',
    '/videos/hotel-costa-brava-cafe.mp4',
    '/videos/creative-partnership.mp4',
    '/videos/business-growth.mp4',
    '/videos/local-impact.mp4',
    '/videos/mirador-glories.mp4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [videos.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {videos.map((video, index) => (
        <video
          key={video}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      ))}

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Menu Button - Top Left */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:text-white/80 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
        <span className="font-semibold text-sm tracking-wider">MENU</span>
      </button>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <img
            src="/logo.svg"
            alt="Kolabing"
            className="h-12 mx-auto opacity-90"
          />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-12 leading-tight font-serif">
          His business. Her community.
          <br />
          Kolabing makes the match!
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => scrollToSection('business-section')}
            size="lg"
            className="bg-[#fdd459] hover:bg-[#fdd459]/90 text-black font-semibold px-8 py-6 rounded-full text-lg min-w-[240px]"
            aria-label="I'm a business or brand - scroll to business section"
          >
            I'm a business/brand
          </Button>
          <Link to="/our-communities" className="inline-flex">
            <Button
              size="lg"
              className="bg-[#fdd459] hover:bg-[#fdd459]/90 text-black font-semibold px-8 py-6 rounded-full text-lg min-w-[240px]"
              aria-label="I'm a community - go to communities page"
            >
              I'm a community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
