import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Building2 } from 'lucide-react';
const Landing = () => {
  const [userType, setUserType] = useState<'business' | 'community'>('business');
  return <div className="min-h-screen background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-md shadow-sm bg-[slate-805] bg-inherit">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-foreground">Kolabing</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/success-stories" className="text-muted-foreground hover:text-foreground transition-colors">
              Success Stories
            </a>
              <a href="/our-communities" className="text-muted-foreground hover:text-foreground transition-colors">
              Our Communities
            </a>
            <Link to="/auth/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Connect Businesses with Communities
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              The marketplace where businesses find authentic community partnerships 
              and communities discover meaningful collaboration opportunities.
            </p>

            {/* User Type Toggle */}
            <div className="mb-12">
              <div className="inline-flex p-1 bg-muted rounded-lg mb-8" role="radiogroup" aria-labelledby="user-type-label">
                <span id="user-type-label" className="sr-only">Choose your account type</span>
                <button onClick={() => setUserType('business')} className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${userType === 'business' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} role="radio" aria-checked={userType === 'business'} aria-label="Business account">
                  <Building2 className="w-5 h-5" />
                  <span>I'm a Business</span>
                </button>
                <button onClick={() => setUserType('community')} className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${userType === 'community' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} role="radio" aria-checked={userType === 'community'} aria-label="Community account">
                  <Users className="w-5 h-5" />
                  <span>I'm a Community</span>
                </button>
              </div>

              {/* Dynamic Content */}
              <div className="min-h-[120px] flex flex-col justify-center">
                {userType === 'business' ? <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                      For Businesses
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                      Create compelling offers, connect with authentic communities, 
                      and build meaningful partnerships that drive real results.
                    </p>
                  </div> : <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                      For Communities
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                      Discover exciting collaboration opportunities, apply to offers that 
                      align with your values, and monetize your community engagement.
                    </p>
                  </div>}
              </div>

              {/* CTA Button */}
              <Link to={`/auth/sign-up?type=${userType}`} className="inline-flex">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

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

        {/* Features */}
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              Why Choose Kolabing?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-3">Verified Communities</h3>
                <p className="text-muted-foreground">
                  Connect with authentic, engaged communities that match your brand values.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-3">Smart Matching</h3>
                <p className="text-muted-foreground">
                  AI-powered recommendations ensure the best collaboration matches.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-3">Built-in Analytics</h3>
                <p className="text-muted-foreground">
                  Track performance and measure the success of your collaborations.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-3">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Integrated payment system ensures secure and timely transactions.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-3">Collaboration Tools</h3>
                <p className="text-muted-foreground">
                  Built-in project management and communication tools.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-3">Quality Assurance</h3>
                <p className="text-muted-foreground">
                  Rating and review system maintains high-quality partnerships.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-foreground">Kolabing</span>
          </div>
          <p className="text-muted-foreground">
            Connecting businesses with communities for meaningful collaborations.
          </p>
        </div>
      </footer>
    </div>;
};
export default Landing;