import React, { useState, useEffect } from "react";

const rotatingTexts = ["More Venues", "More People", "More Sponsors"];
const typingSpeed = 80;
const pauseBeforeNext = 300;

const AnimatedCommunityHeroTitle = () => {
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
      {/* Only animated text, no headline */}
      <div className="flex items-center justify-center overflow-hidden">
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

export default AnimatedCommunityHeroTitle;
