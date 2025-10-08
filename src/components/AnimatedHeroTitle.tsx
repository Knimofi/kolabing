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
      {/* Subtitle (only one, delete the duplicate) */}
      <div
        style={{
          fontFamily: "Darker Grotesque, sans-serif",
          color: "#000",
          fontSize: "1.5rem",
          marginTop: "24px",
        }}
      >
        We connect you to the best local communities for events that will bring content, sales and engagement with your
        local customers
      </div>
      {/* Button */}
      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
        <a
          href="https://00e81e6d-06a6-49dc-89c8-bcb1efbb16df.lovableproject.com/auth/sign-up"
          className="px-8 py-3 rounded-full font-bold text-white bg-black transition duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
          style={{
            fontSize: "1.25rem",
            fontFamily: "Rubik, sans-serif",
          }}
        >
          Create your Profile &rarr;
        </a>
      </div>
    </div>
  );
};

export default AnimatedHeroTitle;
