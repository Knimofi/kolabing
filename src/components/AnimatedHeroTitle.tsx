import React, { useState, useEffect } from 'react';

const AnimatedHeroTitle = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const rotatingTexts = ['More Clients', 'Better Content', 'Communities'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
        What your business needs
      </h1>
      <div className="h-20 flex items-center justify-center overflow-hidden">
        <div className="relative">
          {rotatingTexts.map((text, index) => (
            <div
              key={text}
              className={`text-3xl md:text-5xl font-bold text-primary transition-all duration-500 absolute inset-0 flex items-center justify-center ${
                index === currentTextIndex
                  ? 'opacity-100 transform translate-y-0'
                  : index < currentTextIndex
                  ? 'opacity-0 transform -translate-y-full'
                  : 'opacity-0 transform translate-y-full'
              }`}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeroTitle;