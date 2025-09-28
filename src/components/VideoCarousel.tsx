import React from 'react';

const VideoCarousel = () => {
  const videos = [
    {
      id: 1,
      title: 'Community Event Success',
      thumbnail: '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png',
      description: 'Local restaurant partnership with fitness community'
    },
    {
      id: 2,
      title: 'Brand Collaboration',
      thumbnail: '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png',
      description: 'Fashion brand working with lifestyle influencers'
    },
    {
      id: 3,
      title: 'Community Growth',
      thumbnail: '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png',
      description: 'Tech startup building developer community'
    },
    {
      id: 4,
      title: 'Local Impact',
      thumbnail: '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png',
      description: 'Small business connecting with neighborhood groups'
    },
    {
      id: 5,
      title: 'Creative Partnership',
      thumbnail: '/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png',
      description: 'Art gallery collaborating with creative communities'
    }
  ];

  // Duplicate videos for seamless infinite scroll
  const duplicatedVideos = [...videos, ...videos, ...videos];

  return (
    <>
      <style>{`
        @keyframes carousel-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .carousel-animate {
          animation: carousel-scroll 15s linear infinite;
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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how businesses and communities create amazing partnerships through Kolabing
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="flex carousel-animate">
              {duplicatedVideos.map((video, index) => (
                <div 
                  key={`${video.id}-${index}`} 
                  className="flex-[0_0_33.333%] px-2 min-w-0"
                >
                  <div className="group cursor-pointer carousel-card transition-transform duration-300 ease-out">
                    <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-primary transition-colors duration-300">
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
        </div>
      </section>
    </>
  );
};

export default VideoCarousel;
