import React from 'react';
import { Button } from '@/components/ui/button';

// Inline minimal video carousel component
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

const BUTTON_STYLE = {
  background: '#fdd459',
  color: '#232323',
  fontFamily: 'Inter, system-ui, sans-serif',
  textTransform: 'uppercase' as const,
  fontWeight: 400,
  fontSize: '1rem',
  letterSpacing: '0.06em',
  borderRadius: '0px', // perfectly sharp
  padding: '0.5rem 1.1rem', // small, fits content
  minWidth: 'unset',
  minHeight: '2.2rem',
  boxShadow: '0 2px 10px 0 rgba(253,212,89,0.10)',
  transition: 'background 0.14s, box-shadow 0.13s, transform 0.13s'
};

const BUTTON_HOVER = {
  background: '#eec700'
};

const NewHero = () => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

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
          style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
        />
      </div>
      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
          <div
            className="text-white text-center mb-9 max-w-3xl"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <span
              className="block font-bold leading-tight"
              style={{
                fontSize: '1.45rem', // smaller headline
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              His business. Her community.
            </span>
            <span
              className="block font-bold leading-tight mt-2"
              style={{
                fontSize: '1.45rem',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              Kolabing makes the match!
            </span>
          </div>
          {/* Sharp rectangular, small, centered buttons */}
          <div className="flex flex-row gap-2 mt-5 justify-center items-center w-full">
            {[{
              label: "I'm a business/brand",
              id: 'business-needs'
            }, {
              label: "I'm a community",
              id: 'our-communities'
            }].map((btn, idx) => (
              <Button
                key={btn.id}
                style={{
                  ...BUTTON_STYLE,
                  ...(hoverIndex === idx ? BUTTON_HOVER : {})
                }}
                className="select-none"
                aria-label={btn.label}
                onClick={() => scrollToSection(btn.id)}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHero;
