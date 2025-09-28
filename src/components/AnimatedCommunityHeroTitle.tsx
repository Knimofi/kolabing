import React, { useState, useEffect } from 'react';

const rotatingTexts = ['More Venues', 'More People', 'More Sponsors'];
const typingSpeed = 80;
const pauseBeforeNext = 300;

const AnimatedCommunityHeroTitle = () => {
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
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseBeforeNext);
      }
    } else {
      timeout = setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setDisplayedText('');
        setIsTyping(true);
      }, 500); // Short pause before new word starts typing
    }
    return () => clearTimeout(timeout);
  }, [isTyping, displayedText, currentTextIndex]);

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
        The partner to grow your community...
      </h1>
      <div className="h-20 flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div
            className="text-3xl md:text-5xl font-bold text-primary transition-all duration-500 flex items-center justify-center whitespace-nowrap"
            style={{ lineHeight: 1.0 }}
          >
            {displayedText}
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCommunityHeroTitle;