import React, { useState, useEffect, useRef } from 'react';

const rotatingTexts = ['More Clients', 'Better Content', 'Communities'];
const typingSpeed = 80; // milliseconds per letter
const pauseBeforeNext = 1200; // milliseconds pause after finishing sentence

const AnimatedHeroTitle = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (displayedText.length < rotatingTexts[currentTextIndex].length) {
        timeout = setTimeout(() => {
          setDisplayedText(
            rotatingTexts[currentTextIndex].substring(0, displayedText.length + 1)
          );
        }, typingSpeed);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsTyping(true);
          setDisplayedText('');
          setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        }, pauseBeforeNext);
      }
    }
    return () => clearTimeout(timeout);
  }, [isTyping, displayedText, currentTextIndex]);

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
        What your business needs
      </h1>
      {/* Tighter space between header & animated text: change mb-6 to mb-4 or mb-2 above */}
      <div className="h-20 flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div
            className="text-3xl md:text-5xl font-bold text-primary transition-all duration-500 flex items-center justify-center whitespace-nowrap"
            style={{ lineHeight: 1.05 }} // for even tighter spacing
          >
            {displayedText}
            {/* Optionally add a blinking cursor */}
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeroTitle;
