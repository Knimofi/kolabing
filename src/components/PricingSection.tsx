import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const handleBookCall = () => {
    window.location.href = 'https://cal.com/maria-perez/community-platform';
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your business needs and start connecting with communities today
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {/* Standard Plan */}
          <Card className="flex-1 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary relative">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">Basic Plan</CardTitle>
              <CardDescription className="text-muted-foreground">
                Perfect for growing businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Publish collaboration offers to all communities in your city</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Priority support and assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Performance analytics and tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Recommendations & Personalised help on community strategy</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">280 Euro/month</div>
                  <p className="text-sm text-muted-foreground mb-6">(Special offers may apply)</p>
                  <Button 
                    size="lg" 
                    className="w-full text-lg font-semibold"
                    onClick={handleBookCall}
                  >
                    Book a Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Plan */}
          <Card className="flex-1 hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">Agency Plan</CardTitle>
              <CardDescription className="text-muted-foreground">
                Personalised services for businesses already familiar with communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">
                   We find the collaborations for you and select the best matches </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Priority Account Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Advanced Performance analytics and ROI</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Consulting on Marketing Strategy (Content, Products & Offers, Communities, More)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Personalised Content Creation</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-2">Custom Pricing</div>
                  <p className="text-sm text-muted-foreground mb-6">Based on your specific needs</p>
                  <Button 
                    size="lg" 
                    className="w-full text-lg font-semibold"
                    onClick={handleBookCall}
                  >
                    Book a Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All plans include verified community access, secure payment processing, and comprehensive support. 
            Book a call to discuss which plan is right for your business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;