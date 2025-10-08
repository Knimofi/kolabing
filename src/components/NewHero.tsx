import React from "react";
import { Button } from "@/components/ui/button";

const BUTTON_STYLE = {
  background: "transparent",
  color: "#F9F7E8",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  borderRadius: "0px",
  border: "1px solid #F9F7E8",
  padding: "0.5rem 1.2rem",
  minWidth: "unset",
  minHeight: "2.2rem",
  transition: "all 0.2s ease",
};

const BUTTON_HOVER = {
  background: "rgba(249, 247, 232, 0.1)",
  borderColor: "#fdd459",
  color: "#fdd459",
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
          {/* Sharp rectangular, small, centered buttons */}
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
                key={btn.id}
                style={{
                  ...BUTTON_STYLE,
                  ...(hoverIndex === idx ? BUTTON_HOVER : {}),
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
