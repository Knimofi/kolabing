import React from "react";
import { Button } from "@/components/ui/button";

// Button styles: less rounded, Darker Grotesque Light, black uppercase
const BUTTON_STYLE: React.CSSProperties = {
  background: "#FFD861", // Yellow fill
  color: "#111", // Black text
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 500,
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  borderRadius: "0.6em", // Less rounded
  border: "none",
  padding: "0.5rem 1.8rem",
  minWidth: "unset",
  minHeight: "2.2rem",
  transition: "all 0.17s cubic-bezier(.4,1.1,.7,1)",
  cursor: "pointer",
  boxShadow: "0 2px 14px 0 rgba(0,0,0,0.05)", // Subtle shadow
};

const BUTTON_HOVER = {
  filter: "brightness(0.96)",
  transform: "scale(1.05)",
  boxShadow: "0 2px 22px 0 rgba(0,0,0,0.11)",
};

const NewHero = () => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
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
          <div className="mb-9 max-w-3xl">
            {/* Left-aligned first line */}
            <div
              style={{
                color: "#F9F7E8",
                fontFamily: "'Darker Grotesque', Arial, sans-serif",
                fontWeight: 300,
                fontSize: "2.1rem",
                letterSpacing: "0.01em",
                marginBottom: "0.44em",
                textAlign: "left",
                lineHeight: 1.14,
                paddingLeft: "18px", // visually aligns left inside block
                width: "fit-content",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              His business. Her community.
            </div>
            {/* Bold/block Rubik two-row headline */}
            <div
              style={{
                color: "#F9F7E8",
                fontFamily: "'Rubik', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "2.6rem",
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
          {/* Pill-shaped, yellow, centered buttons */}
          <div className="flex flex-row gap-2 mt-5 justify-center items-center w-full">
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
                style={BUTTON_STYLE}
                onMouseEnter={() => setHoverIndex(index)}
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
