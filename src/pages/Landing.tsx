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

const Landing = () => {
  return (
    <div className="min-h-screen background">
      <Navbar />

      {/* New Hero Section with Video Background */}
      <NewHero />

      {/* WHAT YOUR BUSINESS NEEDS - YELLOW SECTION */}
      <main>
        <section
          id="business-section"
          className="px-4 py-24"
          style={{ backgroundColor: "#FFD861" }} // Yellow background
        >
          <div className="container mx-auto max-w-4xl text-center">
            {/* Headline: all lowercase, Rubik bold */}
            <h1
              className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
              style={{
                fontFamily: "Rubik, sans-serif",
                color: "#000",
                textTransform: "lowercase",
              }}
            >
              what your business needs
            </h1>
            {/* Animated rotating text */}
            <AnimatedHeroTitle />

            {/* Subtitle: darker grotesque, light, black */}
            <p
              className="text-xl mb-12 max-w-2xl mx-auto"
              style={{
                fontFamily: "Darker Grotesque, sans-serif",
                fontWeight: 300,
                color: "#000",
              }}
            >
              we connect you to the best local communities for events that will bring content, sales and engagement with
              your local customers
            </p>

            {/* CTA: Black outlined button */}
            <Link to="/auth/sign-up" className="inline-flex">
              <Button size="lg" variant="outline" className="px-12 py-5 border-black text-black hover:bg-black hover:text-white">
                CREATE YOUR PROFILE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Other sections remain unchanged */}
        <VideoCarousel />

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">How It Works</h2>
            {/* ... */}
          </div>
        </section>

        <ComparisonTable />
        <PricingSection />
        <BookCallCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
