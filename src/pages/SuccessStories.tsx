import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoCarousel from '@/components/VideoCarousel';
import VideoModal from '@/components/VideoModal';

interface SuccessStory {
  id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  image_url?: string;
  video_url?: string;
  is_active?: boolean;
}

const SuccessStories = () => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; author: string } | null>(null);

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SuccessStory[];
    },
  });

  const backgroundImages = [
    '/background-section1.png',
    '/background-section2.png', 
    '/background-section3.png'
  ];

  const SuccessStoryCard = ({ story, index }: { story: SuccessStory; index: number }) => {
    const bgImage = backgroundImages[index % backgroundImages.length];
    
    return (
      <Card className="relative overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 group h-[600px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <CardContent className="relative z-10 p-8 h-full flex flex-col justify-start text-white">
          <div className="flex items-start space-x-6">
            {story.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={story.image_url}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30 group-hover:border-white/60 transition-colors"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <blockquote className="text-lg leading-relaxed mb-6 italic text-white">
                "{story.testimonial}"
              </blockquote>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-semibold text-white text-lg">{story.name}</p>
                <p className="text-white/80">
                  {story.role} at <span className="text-primary font-medium">{story.company}</span>
                </p>
              </div>
            </div>
          </div>
          
          {story.video_url && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => setSelectedVideo({ url: story.video_url!, author: story.name })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
              >
                Play Recap
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const SkeletonCard = () => (
    <Card className="bg-card border-border">
      <CardContent className="p-8">
        <div className="flex items-start space-x-6">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="mt-6 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-card mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Success Stories
              <span className="block w-24 h-1 bg-primary mx-auto mt-4"></span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Real partnerships that deliver results. Learn from proven strategies and authentic community collaborations that helped businesses make more sales, better content, and more engagement with the local audience.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500k+</div>
              <div className="text-muted-foreground">Views on Social Media</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,000+</div>
              <div className="text-muted-foreground">Event Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <div className="text-muted-foreground">Partner Activations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">80%</div>
              <div className="text-muted-foreground">Returning Partners</div>
            </div>
          </div>
        </div>
      </section>

           <VideoCarousel />

      {/* Success Stories Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real people, real results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how our community kolabs delivered measurable impact for local businesses across Barcelona
            </p>
          </div>

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">Failed to load success stories. Please try again later.</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center">
              <SkeletonCard />
            </div>
          ) : stories && stories.length > 0 ? (
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {stories.map((story, index) => (
                  <CarouselItem key={story.id}>
                    <div className="p-1">
                      <SuccessStoryCard story={story} index={index} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-foreground mb-4">No Success Stories Yet</h3>
              <p className="text-muted-foreground">Check back soon for inspiring community partnership stories.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Create Your Own Success Story?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Join hundreds of businesses already creating authentic connections through our platform
          </p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            Start Your First Event Kolab
          </button>
        </div>
      </section>
      <Footer />
      
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          testimonialAuthor={selectedVideo.author}
        />
      )}
    </div>
  );
};

export default SuccessStories;