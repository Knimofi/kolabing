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

      {/* Featured/Intro Section - What your business needs */}
      <main>
        <section id="business-section" className="px-4 py-24 bg-muted/50">
          <div className="container mx-auto max-w-4xl text-center">
            <AnimatedHeroTitle />

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              We connect you to the best local communities for events that will bring content, sales and engagement with
              your local customers
            </p>

            {/* Main CTA - example as black variant */}
            <Link to="/auth/sign-up" className="inline-flex">
              <Button size="lg" variant="outline" borderColor="#000" textColor="#000" className="px-12 py-5">
                CREATE YOUR PROFILE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Video Carousel */}
        <VideoCarousel />

        {/* How It Works: if you have more buttons, style them similarly */}
        {/* Example for yellow button variant */}
        {/* 
        <Button
          size="lg"
          variant="outline"
          borderColor="#FFD861"
          textColor="#FFD861"
          className="px-12 py-5"
        >
          I'M A BUSINESS/BRAND
        </Button>
        */}

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Pricing Section */}
        <PricingSection />

        {/* Book Call CTA - style with any variant/color as needed */}
        <BookCallCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
