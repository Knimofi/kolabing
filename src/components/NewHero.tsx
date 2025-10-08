import React from "react";
import { Button } from "@/components/ui/button";

const BUTTON_STYLE = {
  background: "#fdd459",
  color: "#fff",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase",
  fontWeight: 500,
  fontSize: "1.17rem",
  letterSpacing: "0.05em",
  borderRadius: "0px",
  border: "none",
  padding: "0.58rem 1.38rem",
  minWidth: "unset",
  minHeight: "2.2rem",
  boxShadow: "0 2px 10px 0 rgba(253,212,89,0.10)",
  transition: "background 0.14s, box-shadow 0.13s, transform 0.13s, color 0.14s",
};

const BUTTON_HOVER = {
  background: "#eec700",
  color: "#232323",
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
        <video src="/videos/ugos-node.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.28), rgba(0,0,0,0.67))",
          }}
        />
      </div>
      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
          <div className="mb-7 max-w-3xl">
            {/* Subheadline */}
            <div
              style={{
                color: "#F9F7E8",
                fontFamily: "'Darker Grotesque', Arial, sans-serif",
                fontWeight: 300,
                fontSize: "2rem",
                letterSpacing: "0.01em",
                marginBottom: "0.14em",
                textAlign: "left",
                lineHeight: 1.1,
                paddingLeft: "12px",
                width: "fit-content",
              }}
            >
              His business. Her community.
            </div>
            {/* Main headline */}
            <div
              style={{
                color: "#F9F7E8",
                fontFamily: "'Rubik', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "2.47rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.01,
                marginTop: "0.12em",
              }}
            >
              KOLABING MAKES THE
              <br />
              <span style={{ display: "block", marginTop: "0.05em" }}>
                MATCH <span style={{ fontStyle: "italic" }}>!</span>
              </span>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex flex-row gap-2 mt-6 justify-center items-center w-full">
            {[
              { label: "I'm a business/brand", id: "business-needs" },
              { label: "I'm a community", id: "our-communities" },
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
