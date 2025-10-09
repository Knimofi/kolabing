import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Responsive button styles
const getButtonStyle = (): React.CSSProperties => {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  
  return {
    background: "#FFD861",
    color: "#111",
    fontFamily: "'Darker Grotesque', Arial, sans-serif",
    textTransform: "uppercase" as const,
    fontWeight: 500,
    fontSize: isMobile ? "0.9rem" : isTablet ? "1rem" : "1.1rem",
    letterSpacing: "0.05em",
    borderRadius: "0.6em",
    border: "none",
    padding: isMobile ? "0.4rem 1.2rem" : isTablet ? "0.45rem 1.5rem" : "0.5rem 1.8rem",
    minWidth: isMobile ? "100%" : "unset",
    minHeight: isMobile ? "2rem" : "2.2rem",
    transition: "all 0.17s cubic-bezier(.4,1.1,.7,1)",
    cursor: "pointer",
    boxShadow: "0 2px 14px 0 rgba(0,0,0,0.05)",
  };
};

const BUTTON_HOVER = {
  filter: "brightness(0.96)",
  transform: "scale(1.05)",
  boxShadow: "0 2px 22px 0 rgba(0,0,0,0.11)",
};

const NewHero = () => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [buttonStyle, setButtonStyle] = React.useState(getButtonStyle());
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => setButtonStyle(getButtonStyle());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Single Fullscreen Video Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video src="/videos/ugosnotext.MOV" autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.25), rgba(0,0,0,0.65))",
          }}
        />
      </div>
      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
          <div className="mb-6 md:mb-9 max-w-3xl px-4">
            {/* Centered responsive first line */}
            <div
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3"
              style={{
                color: "#F9F7E8",
                fontFamily: "'Darker Grotesque', Arial, sans-serif",
                fontWeight: 300,
                letterSpacing: "0.01em",
                textAlign: "center",
                lineHeight: 1.14,
              }}
            >
              His business. Her community.
            </div>
            {/* Bold/block Rubik responsive headline */}
            <div
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{
                color: "#F9F7E8",
                fontFamily: "'Rubik', Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.01,
              }}
            >
              KOLABING MAKES THE
              <br />
              MATCH
              <span style={{ fontStyle: "italic" }}>!</span>
            </div>
          </div>
          {/* Responsive buttons - stack on mobile, horizontal on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 md:mt-5 justify-center items-center w-full px-4">
            {[
              {
                label: "I'm a business/brand",
                id: "business-needs",
              },
              {
                label: "I'm a community",
                id: "our-communities",
              },
            ].map((btn, idx) => (
              <Button
                key={btn.id}
                style={{
                  ...buttonStyle,
                  ...(hoverIndex === idx ? BUTTON_HOVER : {}),
                }}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() => {
                  if (btn.id === "our-communities") {
                    navigate("/our-communities");
                  } else {
                    scrollToSection(btn.id);
                  }
                }}
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
