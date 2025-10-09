import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Button styles...
const BUTTON_STYLE = {
  /* ...your styles... */
};
const BUTTON_HOVER = {
  /* ...your hover styles... */
};

const NewHero = () => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const navigate = useNavigate(); // <-- FIX: Hook MUST be inside the component

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* ...your video and hero content... */}
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
            onMouseEnter={() => setHoverIndex(idx)} // FIX: idx, not index
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => {
              if (btn.id === "our-communities") {
                navigate("/our-communities");
              } else {
                scrollToSection(btn.id);
              }
            }}
            key={btn.id}
          >
            {btn.label}
          </Button>
        ))}
      </div>
      {/* ...rest of your component... */}
    </div>
  );
};

export default NewHero;
