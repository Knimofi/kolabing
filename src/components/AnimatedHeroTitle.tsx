import React, { useState, useEffect } from "react";

// Animated text options
const rotatingTexts = ["More Clients", "Better Content", "Communities"];
const typingSpeed = 80;
const pauseBeforeNext = 300;

const AnimatedHeroTitle = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (displayedText.length < rotatingTexts[currentTextIndex].length) {
        timeout = setTimeout(() => {
          setDisplayedText(rotatingTexts[currentTextIndex].substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseBeforeNext);
      }
    } else {
      timeout = setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setDisplayedText("");
        setIsTyping(true);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [isTyping, displayedText, currentTextIndex]);

  return (
    <div className="text-center">
      {/* Main headline */}
      <h1
        className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
        style={{
          fontFamily: "Darker Grotesque, sans-serif",
          color: "#000",
        }}
      >
        What your business needs
      </h1>
      {/* Animated text */}
      <div className="h-20 flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div
            className="text-3xl md:text-5xl font-bold transition-all duration-500 flex items-center justify-center whitespace-nowrap"
            style={{
              lineHeight: 1.0,
              fontFamily: "Rubik, sans-serif",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            {displayedText}
            <span className="animate-pulse" style={{ color: "#fff" }}>
              |
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeroTitle;
