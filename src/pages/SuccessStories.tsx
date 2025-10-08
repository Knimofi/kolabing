import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCarousel from "@/components/VideoCarousel";
import VideoModal from "@/components/VideoModal";

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

  const {
    data: stories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["success-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SuccessStory[];
    },
  });

  const backgroundImages = ["/background-section1.png", "/background-section2.png", "/background-section3.png"];

  const SuccessStoryCard = ({ story, index }: { story: SuccessStory; index: number }) => {
    const bgImage = backgroundImages[index % backgroundImages.length];
    return (
      <Card className="relative overflow-hidden bg-white border border-black hover:shadow-lg transition-all duration-300 group rounded-2xl">
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})`, opacity: 0.1, zIndex: 0 }}
        />
        <CardContent className="relative z-10 p-8 flex flex-col">
          <div className="flex items-start space-x-6 mb-4">
            {story.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={story.image_url}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-black/10 group-hover:border-black/50 transition-colors"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
            <div className="flex-1 flex flex-col">
              {/* Testimonial in yellow box */}
              <blockquote
                className="text-lg leading-relaxed mb-6 font-darker-grotesque rounded-xl px-6 py-4"
                style={{
                  backgroundColor: "#FFD861",
                  color: "#000",
                  fontFamily: "'Darker Grotesque', sans-serif",
                  fontWeight: 500,
                }}
              >
                "{story.testimonial}"
              </blockquote>
              <div className="border-l-4 border-[#FFD861] pl-4">
                <p
                  className="font-bold text-black text-lg"
                  style={{
                    fontFamily: "'Darker Grotesque', sans-serif",
                  }}
                >
                  {story.name}
                </p>
                <p className="text-black/80" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  {story.role} at <span style={{ color: "#FFD861", fontWeight: 600 }}>{story.company}</span>
                </p>
              </div>
            </div>
          </div>
          {story.video_url && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setSelectedVideo({ url: story.video_url!, author: story.name })}
                style={{
                  backgroundColor: "#FFD861",
                  color: "#000",
                  fontFamily: "'Darker Grotesque', sans-serif",
                  fontWeight: 600,
                  borderRadius: 12,
                  paddingLeft: 32,
                  paddingRight: 32,
                }}
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
    <Card className="bg-white border border-black rounded-2xl">
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
      <section className="py-24 px-4 bg-[#FFD861]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4">
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
              style={{
                fontFamily: "'Rubik', sans-serif",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Success Stories
            </h1>
          </div>
          <p
            className="text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
            style={{
              fontFamily: "'Darker Grotesque', sans-serif",
              color: "#000",
              fontWeight: 400,
            }}
          >
            Real partnerships that deliver results. Learn from proven strategies and authentic community collaborations
            that helped businesses make more sales, better content, and more engagement with the local audience.
          </p>
        </div>
      </section>

      <VideoCarousel />

      {/* Success Stories Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                fontFamily: "'Rubik', sans-serif",
                fontWeight: 800,
                textTransform: "uppercase",
                color: "#000",
              }}
            >
              Real people, real results
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{
                fontFamily: "'Darker Grotesque', sans-serif",
                color: "#000",
              }}
            >
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
              <h3
                className="text-2xl font-semibold text-foreground mb-4"
                style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
              >
                No Success Stories Yet
              </h3>
              <p className="text-muted-foreground">Check back soon for inspiring community partnership stories.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{
              fontFamily: "'Rubik', sans-serif",
              fontWeight: 800,
              color: "#FFD861",
              textTransform: "uppercase",
            }}
          >
            Ready to Create Your Own Success Story?
          </h2>
          <p
            className="text-xl mb-10 leading-relaxed"
            style={{
              fontFamily: "'Darker Grotesque', sans-serif",
              color: "#222",
            }}
          >
            Join hundreds of businesses already creating authentic connections through our platform
          </p>
          <Button
            style={{
              backgroundColor: "#000",
              color: "#FFD861",
              fontFamily: "'Darker Grotesque', sans-serif",
              fontWeight: 700,
              borderRadius: 16,
              padding: "18px 56px",
              fontSize: "1.25rem",
              textTransform: "uppercase",
            }}
          >
            Start Your First Event Kolab
          </Button>
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
