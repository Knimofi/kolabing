import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedHeroTitle from "@/components/AnimatedHeroTitle";
import VideoCarousel from "@/components/VideoCarousel";
import ComparisonTable from "@/components/ComparisonTable";
import BookCallCTA from "@/components/BookCallCTA";
import PricingSection from "@/components/PricingSection";
import NewHero from "@/components/NewHero";

/* Make sure you load Rubik Bold+ExtraBold and Darker Grotesque in your global CSS or via Tailwind config */

const howItWorksSteps = [
  {
    step: "1",
    title: (
      <>
        CREATE A COLLAB <span style={{ fontStyle: "italic" }}>OFFER</span>
      </>
    ),
    text: "Businesses or communities post what they offer and what they want in return.",
    icon: "💡",
  },
  {
    step: "2",
    title: (
      <>
        RECEIVE <span style={{ fontStyle: "italic" }}>APPLICATIONS</span>
      </>
    ),
    text: "Other side applies and suggests a date for the event.",
    icon: "💬",
  },
  {
    step: "3",
    title: (
      <>
        CHOOSE & RUN THE <span style={{ fontStyle: "italic" }}>EVENT</span>
      </>
    ),
    text: "Pick the best fit and host the experience together.",
    icon: "🎉",
  },
  {
    step: "4",
    title: (
      <>
        RATE & TRACK <span style={{ fontStyle: "italic" }}>RESULTS</span>
      </>
    ),
    text: "Both rate the collab and see analytics and insights.",
    icon: "⭐",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen background">
      <Navbar />
      <NewHero />
      <main>
        {/* WHAT YOUR BUSINESS NEEDS */}
        <section id="business-section" className="px-4 py-24" style={{ backgroundColor: "#FFD861" }}>
          <div className="container mx-auto max-w-4xl text-center">
            <h1
              className="text-4xl md:text-6xl mb-4 leading-tight"
              style={{
                fontFamily: "'Darker Grotesque', sans-serif",
                fontWeight: 300,
                color: "#000",
                textTransform: "lowercase",
              }}
            >
              what your business needs
            </h1>
            <AnimatedHeroTitle />
            <p
              className="text-xl mb-12 max-w-2xl mx-auto"
              style={{
                fontFamily: "'Darker Grotesque', sans-serif",
                fontWeight: 300,
                color: "#000",
              }}
            >
              we connect you to the best local communities for events that will bring content, sales and engagement with
              your local customers
            </p>
            <Link to="/auth/sign-up" className="inline-flex">
              <Button
                size="lg"
                className="px-12 py-5 bg-black text-white border-black hover:text-[#FFD861] hover:bg-black"
                style={{
                  fontFamily: "'Darker Grotesque', sans-serif",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                CREATE YOUR PROFILE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (moved up before any action sections) */}
        <section id="how-it-works" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2
              className="text-3xl md:text-5xl text-center mb-16"
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontWeight: 800, // Rubik Extra Bold
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              how it works
            </h2>
            <div className="w-full">
              {/* Responsive grid: 1 column on mobile, 2 on sm, 4 on md+ */}
              <div
                className="
                  grid gap-6 md:gap-8
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-4
                "
              >
                {howItWorksSteps.map((item, index) => (
                  <div
                    key={index}
                    className="
                      flex flex-col items-center justify-center
                      bg-[#FFD861] text-black rounded-2xl shadow-md
                      p-8 min-w-[220px] text-center
                      transition-transform hover:scale-105
                    "
                    style={{
                      minHeight: 230,
                    }}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3
                      className="text-sm mb-2"
                      style={{
                        fontFamily: "'Rubik', sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "#000",
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-md leading-snug"
                      style={{
                        fontFamily: "'Darker Grotesque', sans-serif",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        color: "#222",
                        margin: 0,
                        marginTop: 2,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <VideoCarousel />

        {/* WHY CHOOSE KOLABING */}
        <section id="why-choose-kolabing" className="bg-white py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h2
              className="text-3xl md:text-5xl mb-5"
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "#000",
              }}
            >
              <span style={{ fontStyle: "italic" }}>why</span> CHOOSE KOLABING
              <span style={{ fontStyle: "italic" }}>?</span>
            </h2>
            <p
              className="text-xl mb-12"
              style={{
                fontFamily: "'Darker Grotesque', sans-serif",
                fontWeight: 300,
                color: "#222",
              }}
            >
              Why Kolabing stands out for brands and communities seeking real connections, measurable growth, and
              authentic local engagement.
            </p>
            {/* Comparison table goes next */}
            <div>
              {/* Ensure your ComparisonTable uses Darker Grotesque for all its font styling */}
              <ComparisonTable />
            </div>
          </div>
        </section>

        <PricingSection />
        <BookCallCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
