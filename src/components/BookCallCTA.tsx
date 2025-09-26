import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

const BookCallCTA = () => {
  const handleBookCall = () => {
    window.location.href = 'mailto:kolabingbcn@gmail.com?subject=Book a Discovery Call&body=Hi! I\'m interested in learning more about Kolabing\'s services. Please let me know your availability for a discovery call.';
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Book a free discovery call to learn how Kolabing can connect you with the perfect communities 
            for authentic partnerships that drive real results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center p-6 rounded-lg bg-card border border-border">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Discover Communities</h3>
            <p className="text-sm text-muted-foreground text-center">
              Find verified local communities that align with your brand values
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg bg-card border border-border">
            <Target className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Strategic Planning</h3>
            <p className="text-sm text-muted-foreground text-center">
              Get personalized recommendations for your collaboration strategy
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg bg-card border border-border">
            <TrendingUp className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Measurable Results</h3>
            <p className="text-sm text-muted-foreground text-center">
              Track performance and ROI with our comprehensive analytics
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-primary mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-foreground mb-4">Free Discovery Call</h3>
          <p className="text-muted-foreground mb-6">
            30-minute consultation to understand your needs and show you how Kolabing works
          </p>
          <Button 
            size="lg" 
            className="w-full text-lg font-semibold"
            onClick={handleBookCall}
          >
            Book Your Call Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            No commitment required • Free consultation
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookCallCTA;