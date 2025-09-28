import React from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const videos = [
  // ...your video data as above
];

const VideoCarousel = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 3, spacing: 16 },
    breakpoints: {
      "(max-width: 1024px)": { perView: 2 },
      "(max-width: 640px)": { perView: 1 }
    },
    drag: true,
    mode: "snap",
    renderMode: "performance",
    autoplay: {
      delay: 2000, // Autoplay delay in ms
      stopOnInteraction: true,
    },
  });

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Success Stories in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how businesses and communities create amazing partnerships through Kolabing
          </p>
        </div>
        <div ref={sliderRef} className="keen-slider w-full max-w-5xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="keen-slider__slide">
              {/* ...your slide content here... */}
              <div className="group cursor-pointer">
                <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-primary transition-colors">
                      <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
