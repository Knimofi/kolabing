import React from 'react';
import { Button } from '@/components/ui/button';

const BUTTON_STYLE = {
  background: '#fdd459',
  color: '#232323',
  fontFamily: 'Inter, system-ui, sans-serif',
  textTransform: 'uppercase' as const,
  fontWeight: 400,
  fontSize: '1rem',
  letterSpacing: '0.06em',
  borderRadius: '0px',
  padding: '0.5rem 1.1rem',
  minWidth: 'unset',
  minHeight: '2.2rem',
  boxShadow: '0 2px 10px 0 rgba(253,212,89,0.10)',
  transition: 'background 0.14s, box-shadow 0.13s, transform 0.13s'
};

const BUTTON_HOVER = { background: '#eec700' };

const NewHero = () => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.offsetTop - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Single Fullscreen Video Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          src="/videos/ugos-node.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(253,212,89,0.10), rgba(0,0,0,0.47))'
          }}
        />
      </div>
      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
          <div className="mb-9 max-w-3xl">
            {/* Left-aligned first line */}
            <div
              style={{
                color: '#F9F7E8',
                fontFamily: "'Darker Grotesque', Arial, sans-serif",
                fontWeight: 300,
                fontSize: '2.1rem',
                letterSpacing: '0.01em',
                marginBottom: '0.44em',
                textAlign: 'left',
                lineHeight: 1.14,
                paddingLeft: '18px', // visually aligns left inside block
                width: 'fit-content',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              His business. Her community.
            </div>
            {/* Bold/block Rubik two-row headline */}
            <div
              style={{
                color: '#F9F
