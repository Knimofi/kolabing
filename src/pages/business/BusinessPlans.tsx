import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const BusinessPlans = () => {
  const handleStandardPlanClick = () => {
    // Redirect to Stripe (placeholder for now)
    window.location.href = 'https://buy.stripe.com/3cIfZhf5vfYh1HhgJ8d3i03';
  };

  const handleAgencyPlanClick = () => {
    window.location.href = 'mailto:kolabingbcn@gmail.com';
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the perfect plan for your business needs
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {/* Standard Plan */}
          <Card 
            className="flex-1 cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary"
            onClick={handleStandardPlanClick}
          >
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
                  <div className="inline-block bg-success/20 text-success px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    Limited time launch offer - 50% OFF
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl text-muted-foreground line-through">280 Euro/month</span>
                    <span className="text-4xl font-bold text-foreground">140 Euro/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">(discount codes apply in the next step)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Plan */}
          <Card 
            className="flex-1 cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary"
            onClick={handleAgencyPlanClick}
          >
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">Agency Plan</CardTitle>
              <CardDescription className="text-muted-foreground">
                Tailored solutions for agencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Exclusive custom solution for agencies</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Dedicated account management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-foreground">Custom integrations available</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-lg font-semibold"
                    onClick={handleAgencyPlanClick}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlans;