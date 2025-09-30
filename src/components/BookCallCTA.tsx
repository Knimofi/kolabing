import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Users, Target, TrendingUp } from 'lucide-react';
const BookCallCTA = () => {
  const handleBookCall = () => {
    window.location.href = 'https://cal.com/maria-perez/community-platform';
  };
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center p-6 rounded-lg bg-card">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-muted-foreground">Get personalized advice from our team of business growth experts</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Strategic Planning</h3>
            <p className="text-muted-foreground">Develop a customized roadmap for your business success</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Growth Acceleration</h3>
            <p className="text-muted-foreground">Implement proven strategies to scale your business faster</p>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Book a free discovery call to learn how Kolabing can help you achieve your growth goals.
          </p>
          <Button
            onClick={handleBookCall}
            size="lg"
            className="text-lg px-8 py-4"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Free Discovery Call
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default BookCallCTA;