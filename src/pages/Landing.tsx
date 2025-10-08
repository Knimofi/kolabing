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
        {/* FIRST SECTION - original muted background */}
        <section id="business-section" className="px-4 py-24 bg-muted/50">
          <div className="container mx-auto max-w-4xl text-center">
            <AnimatedHeroTitle />

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              We connect you to the best local communities for events that will bring content, sales and engagement with
              your local customers
            </p>

            {/* Black Button CTA */}
            <Link to="/auth/sign-up" className="inline-flex">
              <Button
                size="lg"
                variant="outline"
                borderColor="#000"
                textColor="#000"
                className="px-12 py-5" // Padding as desired
              >
                CREATE YOUR PROFILE
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* SECOND SECTION (yellow background) - keep as is! */}
        <section id="featured-section" className="py-20 px-4" style={{ backgroundColor: "#FFD861" }}>
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">Featured Opportunities</h2>
            <Link to="/featured" className="inline-flex">
              <Button size="lg" variant="outline" borderColor="#FFD861" textColor="#FFD861" className="px-12 py-5">
                I'M A BUSINESS/BRAND
              </Button>
            </Link>
            {/* ...other content/buttons */}
          </div>
        </section>

        {/* Video Carousel */}
        <VideoCarousel />

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">How It Works</h2>
            {/* No button changes needed here unless you want more CTAs */}
          </div>
        </section>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Pricing Section */}
        <PricingSection />

        {/* Book Call CTA - style as you want */}
        <BookCallCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
