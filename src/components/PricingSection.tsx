import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
const PricingSection = () => {
  const handleBookCall = () => {
    window.location.href = 'https://cal.com/maria-perez/community-platform';
  };
  return <section className="py-20 px-4 bg-muted/30">
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
              <CardTitle className="text-2xl font-bold text-foreground">Standard Plan</CardTitle>
              <CardDescription className="text-muted-foreground">
                Ready to create events & invite communities to experience your brand?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-foreground">
                    <span className="font-bold">Publish unlimited campaign offers</span>
                    <span className="text-sm"> — reach as many communities as you want without limits</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-foreground">
                    <span className="font-bold">Track your performance</span>
                    <span className="text-sm"> — clear analytics to measure impact and results</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-foreground">
                    <span className="font-bold">Gain full visibility</span>
                    <span className="text-sm"> — your offers showcased to all our curated communities</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-foreground">
                    <span className="font-bold">Enjoy priority support</span>
                    <span className="text-sm"> — fast, hands-on assistance whenever you need it</span>
                  </span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <div className="text-center">
                  <button onClick={handleBookCall} className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 text-white cursor-pointer hover:opacity-90 transition-opacity" style={{
                  backgroundColor: '#d12419'
                }}>
                    Limited time launch offer - 50% OFF
                  </button>
                <div className="flex flex-col items-center justify-center mb-2">
                  <span className="text-sm text-muted-foreground line-through">280 Euro/month</span>
                  <span className="text-4xl font-bold text-foreground">140 Euro/month</span>
                </div>
                  
                  <Button size="lg" className="w-full text-lg font-semibold" onClick={handleBookCall}>
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
                  <Button size="lg" className="w-full text-lg font-semibold" onClick={handleBookCall}>
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
    </section>;
};
export default PricingSection;