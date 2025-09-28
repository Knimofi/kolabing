import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedCommunityHeroTitle from '@/components/AnimatedCommunityHeroTitle';

interface Community {
  profile_id: string;
  name: string | null;
  community_type: string | null;
  city: string | null;
  instagram: string | null;
  profile_photo: string | null;
  about: string | null;
}

const OurCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBookCall = () => {
    window.location.href = 'mailto:kolabingbcn@gmail.com?subject=Book a Discovery Call&body=Hi! I\'m interested in learning more about Kolabing\'s services for communities. Please let me know your availability for a discovery call.';
  };

  const handleCreateProfile = () => {
    navigate('/auth/sign-up');
  };

  useEffect(() => {
    const fetchFeaturedCommunities = async () => {
      try {
        // Use any to bypass TypeScript issue with Supabase types
        const { data, error } = await (supabase as any)
          .from('community_profiles')
          .select('profile_id, name, community_type, city, instagram, profile_photo, about')
          .eq('Featured', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching communities:', error);
          setCommunities([]);
        } else {
          setCommunities(data || []);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedCommunityHeroTitle />
        </div>
      </section>

      {/* Value Statement Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed">
            We work for the communities. From recurring venues, to sponsors & deals, we help you grow your community because communities are the future and we are here to stay
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-card border border-border rounded-2xl p-8">
            <Calendar className="w-12 h-12 text-primary mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Grow Your Community?</h2>
            <p className="text-muted-foreground mb-6">
              Book a free discovery call to learn how Kolabing can help you find venues, sponsors, and grow your community.
            </p>
            <Button 
              size="lg" 
              className="text-lg font-semibold"
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

      {/* Featured Communities Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Featured Communities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover amazing communities that are making a difference and creating impact in their local areas.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading communities...</div>
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No featured communities found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {communities.map((community) => (
                  <Card 
                    key={community.profile_id} 
                    className="premium-card group cursor-pointer hover:scale-[1.05] transition-all duration-300 aspect-square flex flex-col"
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
                      {/* Profile Photo */}
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-muted flex-shrink-0">
                        {community.profile_photo ? (
                          <img 
                            src={community.profile_photo} 
                            alt={`${community.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-2xl font-bold text-muted-foreground">
                              {community.name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow flex flex-col justify-center space-y-3">
                        {/* Name */}
                        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                          {community.name || 'Unnamed Community'}
                        </h3>

                        {/* Community Type Badge */}
                        {community.community_type && (
                          <Badge variant="default" className="bg-primary text-primary-foreground mx-auto">
                            {community.community_type}
                          </Badge>
                        )}

                        {/* City */}
                        {community.city && (
                          <p className="text-muted-foreground text-sm">
                            {community.city}
                          </p>
                        )}

                        {/* Instagram */}
                        {community.instagram && (
                          <p className="text-primary font-medium text-sm">
                            @{community.instagram.replace('@', '')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create Profile CTA */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg font-semibold"
                  onClick={handleCreateProfile}
                >
                  Create Your Community Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-semibold">
                What kinds of communities do you work with?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We partner with all types of purpose-driven groups: from activity-based communities, sports, art, hobbies, to private clubs and more.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-semibold">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Booking a call with our team is the first step. Or directly create your profile here (link with community type). We'll learn about your needs and help design the perfect partnership for your community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-semibold">
                What support do you offer?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our services range from venue scouting and event management to sponsorship matchmaking and digital tools for community growth.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-semibold">
                Is there a minimum size for communities you support?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We're flexible; whether you're just getting started or managing hundreds of members, we have solutions tailored for you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-semibold">
                How quickly can I onboard?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                After your discovery call, onboarding usually takes just a few days to get you up and running.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurCommunities;