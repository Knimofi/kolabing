import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoCarouselBg = () => {
  const videos = [
    { id: 1, videoSrc: '/videos/ugos-node.mp4' },
    { id: 2, videoSrc: '/videos/community-event-success.mp4' },
    { id: 3, videoSrc: '/videos/brand-partnership.mp4' },
    { id: 4, videoSrc: '/videos/hotel-costa-brava-cafe.mp4' },
    { id: 5, videoSrc: '/videos/creative-partnership.mp4' },
    { id: 6, videoSrc: '/videos/business-growth.mp4' },
    { id: 7, videoSrc: '/videos/local-impact.mp4' },
    { id: 8, videoSrc: '/videos/mirador-glories.mp4' }
  ];
  const duplicatedVideos = [...videos, ...videos, ...videos];
  return (
    <>
      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-266.664%); }
        }
        .carousel-animate {
          animation: carousel-scroll 30s linear infinite;
        }
      `}</style>
      <div className="overflow-hidden w-full h-full">
        <div className="carousel-animate flex gap-4 h-full items-center">
          {duplicatedVideos.map((video, index) => (
            <div key={`${video.id}-${index}`} className="flex-shrink-0 w-[400px] h-full">
              <video
                src={video.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const NewHero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Carousel Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <VideoCarouselBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.17)' }}
        />
      </div>

      {/* Hero Content Overlay */}


        {/* Main content (Centered) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-white text-center mb-12 max-w-4xl">
            <span className="block text-5xl md:text-7xl lg:text-8xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              His business. Her community.
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mt-4" style={{ fontFamily: 'Georgia, serif' }}>
              Kolabing makes the match!
            </span>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              style={{ background: '#fdd459', color: '#161616' }}
              className="rounded-full px-10 py-4 text-lg font-bold"
              onClick={() => scrollToSection('business-needs')}
              aria-label="I'm a business/brand"
            >
              I'm a business/brand
            </Button>
            <Button
              style={{ background: '#fdd459', color: '#161616' }}
              className="rounded-full px-10 py-4 text-lg font-bold"
              onClick={() => scrollToSection('our-communities')}
              aria-label="I'm a community"
            >
              I'm a community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHero;
