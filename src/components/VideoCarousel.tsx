import React from "react";

const VideoCarousel = () => {
  const videos = [
    {
      id: 1,
      title: "Community Event Success",
      videoSrc: "/videos/ugos-node.mp4",
      description: "Local restaurant partnership with fitness community",
    },
    {
      id: 2,
      title: "Ugos Corner x Node",
      videoSrc: "/videos/community-event-success.mp4",
      description: "Tech startup building developer community",
    },
    {
      id: 3,
      title: "Casa Seat",
      videoSrc: "/videos/brand-partnership.mp4",
      description: "Fashion brand working with lifestyle influencers",
    },
    {
      id: 4,
      title: "Hotel Costa Brava x Cafe",
      videoSrc: "/videos/hotel-costa-brava-cafe.mp4",
      description: "Small business connecting with neighborhood groups",
    },
    {
      id: 5,
      title: "Creative Partnership",
      videoSrc: "/videos/creative-partnership.mp4",
      description: "Art gallery collaborating with creative communities",
    },
    {
      id: 6,
      title: "Business Growth",
      videoSrc: "/videos/business-growth.mp4",
      description: "Scaling business through strategic community partnerships",
    },
    {
      id: 7,
      title: "Museum",
      videoSrc: "/videos/local-impact.mp4",
      description: "Hospitality and cafe collaboration",
    },
    {
      id: 8,
      title: "Mirador Glories",
      videoSrc: "/videos/mirador-glories.mp4",
      description: "Urban development partnership",
    },
  ];

  // Duplicate videos for seamless infinite scroll
  const duplicatedVideos = [...videos, ...videos, ...videos];

  return (
    <>
      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-266.664%); }
        }
        .carousel-animate {
          animation: carousel-scroll 30s linear infinite;
        }
        .carousel-card:hover {
          transform: scale(1.02);
        }
        @media (max-width: 768px) {
          .carousel-animate {
            animation-duration: 10s;
          }
        }
      `}</style>
      <section className="py-20 px-4 bg-muted/30 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                fontFamily: "Rubik, sans-serif",
                color: "#FFD861",
                textTransform: "uppercase",
              }}
            >
              Success Stories in Action
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto mb-2"
              style={{
                fontFamily: "Darker Grotesque, sans-serif",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              See how businesses and communities create amazing partnerships through Kolabing
            </p>
          </div>
          <div className="overflow-hidden">
            <div className="flex carousel-animate">
              {duplicatedVideos.map((video, index) => (
                <div key={`${video.id}-${index}`} className="flex-[0_0_33.333%] px-2 min-w-0">
                  <div className="group cursor-pointer carousel-card transition-transform duration-300 ease-out">
                    <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                      <video
                        src={video.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        aria-label={video.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoCarousel;
