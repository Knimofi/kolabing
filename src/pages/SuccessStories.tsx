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
      <Card className="relative overflow-hidden bg-transparent border border-black group rounded-2xl p-0">
        {/* Faint background pattern */}
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})`, opacity: 0.09, zIndex: 0 }}
        />
        <CardContent className="relative z-10 p-6 flex flex-col">
          <div className="flex items-start space-x-4 mb-2">
            {story.image_url && (
              <div className="flex-shrink-0">
                <img
                  src={story.image_url}
                  alt={story.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-black/10 group-hover:border-black/60 transition-colors"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              {/* Testimonial in yellow box */}
              <blockquote
                className="text-md md:text-lg mb-4 font-darker-grotesque rounded-xl px-5 py-3"
                style={{
                  backgroundColor: "#FFD861",
                  color: "#000",
                  fontFamily: "'Darker Grotesque', sans-serif",
                  fontWeight: 500,
                }}
              >
                "{story.testimonial}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex-1 border-l-4 border-[#FFD861] pl-3">
                  <p
                    className="font-bold text-black text-base md:text-lg m-0"
                    style={{
                      fontFamily: "'Darker Grotesque', sans-serif",
                    }}
                  >
                    {story.name}
                  </p>
                  <p className="text-black/80 m-0" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    {story.role} at <span style={{ color: "#FFD861", fontWeight: 600 }}>{story.company}</span>
                  </p>
                </div>
                {story.video_url && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVideo({ url: story.video_url!, author: story.name })}
                    style={{
                      borderColor: "#000",
                      color: "#000",
                      background: "transparent",
                      borderWidth: 2,
                      fontFamily: "'Darker Grotesque', sans-serif",
                      fontWeight: 600,
                      borderRadius: 10,
                      padding: "7px 18px",
                      fontSize: "1rem",
                      marginLeft: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Play Recap
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SkeletonCard = () => (
    <Card className="bg-transparent border border-black rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
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
      <section className="py-14 px-4 bg-[#FFD861]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-2">
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight"
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
            className="text-xl max-w-3xl mx-auto mb-5 leading-relaxed"
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

      <div className="mb-0">
        <VideoCarousel />
      </div>

      {/* Success Stories Grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
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
              className="text-lg max-w-2xl mx-auto mb-4"
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
            <div className="text-center py-12">
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
      <section className="py-14 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-5"
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
            className="text-xl mb-7 leading-relaxed"
            style={{
              fontFamily: "'Darker Grotesque', sans-serif",
              color: "#fff",
            }}
          >
            Join hundreds of businesses already creating authentic connections through our platform
          </p>
          <Button
            style={{
              backgroundColor: "#FFD861",
              color: "#000",
              fontFamily: "'Darker Grotesque', sans-serif",
              fontWeight: 700,
              borderRadius: 16,
              padding: "18px 56px",
              fontSize: "1.25rem",
              textTransform: "uppercase",
              border: "none",
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
