
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";

const supabaseClient = createClient(
  "https://qcmperlkuujhweikoyru.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbXBlcmxrdXVqaHdlaWtveXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM3MDIsImV4cCI6MjA3MTg3OTcwMn0.21KuICfPd2Gv2h_WNZJa8OhOhWzDI_Qe9ZArFCppU5U"
);

interface SuccessStory {
  id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  video_url?: string;
  image_url?: string;
}

const backgroundImages = [
  "/background-section1.png",
  "/background-section2.png", 
  "/background-section3.png"
];

const TestimonialCard = ({ 
  story, 
  backgroundImage,
  onPlayRecap 
}: { 
  story: SuccessStory; 
  backgroundImage: string;
  onPlayRecap: () => void;
}) => {
  return (
    <div 
      className="bg-cover bg-center rounded-lg p-8 h-[500px] flex flex-col justify-between text-white relative overflow-hidden"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white z-10"></div>
      
      <div className="relative z-0 flex flex-col h-full">
        <p className="text-xl mb-8 font-medium leading-relaxed pr-20 flex-1">
          "{story.testimonial}"
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-xl">{story.name}</h4>
            <p className="text-white/80">{story.role}</p>
            <p className="text-white/70 text-sm">{story.company}</p>
          </div>
          
          {story.video_url && (
            <Button
              onClick={onPlayRecap}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Play Recap
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; author: string } | null>(null);

  const { data: successStories, isLoading, error } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async (): Promise<SuccessStory[]> => {
      const { data, error } = await supabaseClient
        .from('success_stories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        company: item.company,
        testimonial: item.testimonial,
        video_url: item.video_url,
        image_url: item.image_url
      }));
    }
  });

  const handlePlayRecap = (videoUrl: string, author: string) => {
    setSelectedVideo({ url: videoUrl, author });
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white relative" id="testimonials" ref={sectionRef}>
        <div className="section-container">
          <div className="flex items-center gap-4 mb-6">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
              <span>Testimonials</span>
            </div>
          </div>
          
          <h2 className="text-5xl font-display font-bold mb-12 text-left">What others say</h2>
          
          <div className="flex justify-center">
            <div className="animate-pulse bg-muted h-[500px] w-full max-w-4xl rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !successStories || successStories.length === 0) {
    return (
      <section className="py-12 bg-white relative" id="testimonials" ref={sectionRef}>
        <div className="section-container">
          <div className="flex items-center gap-4 mb-6">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
              <span>Testimonials</span>
            </div>
          </div>
          
          <h2 className="text-5xl font-display font-bold mb-12 text-left">What others say</h2>
          
          <div className="flex justify-center text-muted-foreground">
            <p>No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white relative" id="testimonials" ref={sectionRef}>
      <div className="section-container opacity-0 animate-on-scroll">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
            <span>Testimonials</span>
          </div>
        </div>
        
        <h2 className="text-5xl font-display font-bold mb-12 text-left">What others say</h2>
        
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {successStories.map((story, index) => (
                <CarouselItem key={story.id}>
                  <TestimonialCard
                    story={story}
                    backgroundImage={backgroundImages[index % backgroundImages.length]}
                    onPlayRecap={() => story.video_url && handlePlayRecap(story.video_url, story.name)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ""}
        testimonialAuthor={selectedVideo?.author || ""}
      />
    </section>
  );
};

export default Testimonials;
