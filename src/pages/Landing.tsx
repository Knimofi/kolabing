import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedHeroTitle from '@/components/AnimatedHeroTitle';
import VideoCarousel from '@/components/VideoCarousel';
import ComparisonTable from '@/components/ComparisonTable';
import BookCallCTA from '@/components/BookCallCTA';
import PricingSection from '@/components/PricingSection';
const Landing = () => {
  return <div className="min-h-screen background">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <AnimatedHeroTitle />
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              We connect you to the best local communities for events that will bring content, sales and engagement with your local customers
            </p>

            {/* CTA Button */}
            <Link to="/auth/sign-up" className="inline-flex">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Video Carousel */}
        <VideoCarousel />

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Create & Browse</h3>
                <p className="text-muted-foreground">
                  Businesses create collaboration offers. Communities browse and discover opportunities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-foreground">2</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Apply & Connect</h3>
                <p className="text-muted-foreground">
                  Communities apply to relevant offers. Businesses review and accept the best matches.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-foreground">3</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Collaborate & Succeed</h3>
                <p className="text-muted-foreground">
                  Execute successful collaborations with built-in tracking and feedback systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Pricing Section */}
        <PricingSection />

        {/* Book Call CTA */}
        <BookCallCTA />
      </main>

      <Footer />
    </div>;
};
export default Landing;