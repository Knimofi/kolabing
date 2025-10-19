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
import NewHero from "@/components/NewHero";
import "@/styles/landing.css";
import { landingStyles } from "@/styles/landing-tokens";

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
        <section id="business-needs" className="px-4 py-24" style={{ backgroundColor: "#FFD861" }}>
          <div className="container mx-auto max-w-4xl text-center">
            <h1
              className="text-3xl md:text-5xl mb-2 leading-tight lowercase"
              style={landingStyles.body}
            >
              what your business needs
            </h1>
            <AnimatedHeroTitle />
            <p
              className="text-xl mb-12 max-w-2xl mx-auto"
              style={landingStyles.body}
            >
              we connect you to the best local communities for events that will bring content, sales and engagement with
              your local customers
            </p>
            <Link to="/auth/sign-up" className="inline-flex">
              <Button
                size="lg"
                className="landing-button-secondary"
              >
                CREATE YOUR PROFILE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="landing-heading text-3xl md:text-5xl text-center mb-16">
              how it works
            </h2>
            <div className="w-full">
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
                    <h3 className="landing-subheading text-sm mb-2">
                      {item.title}
                    </h3>
                    <p className="landing-body text-md leading-snug uppercase">
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
            <h2 className="landing-heading text-3xl md:text-5xl mb-5">
              <span style={{ fontStyle: "italic" }}>why</span> CHOOSE KOLABING
              <span style={{ fontStyle: "italic" }}>?</span>
            </h2>
            <p className="landing-body text-xl mb-3">
              Why Kolabing stands out for brands and communities seeking real connections, measurable growth, and
              authentic local engagement.
            </p>
            {/* Comparison table goes immediately below, with minimal spacing */}
            <div>
              <ComparisonTable />
            </div>
          </div>
        </section>

        <BookCallCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
