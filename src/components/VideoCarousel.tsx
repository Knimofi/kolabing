import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const animationFrameRef = useRef();
  const offsetRef = useRef(0);

  useEffect(() => {
    if (!emblaApi) return;

    const SPEED = 0.8; // pixels per frame, adjust for smoothness

    const scroll = () => {
      if (!emblaApi) return;

      offsetRef.current += SPEED;
      const totalScroll = emblaApi.scrollSnapList().slice(-1)[0] || 0;
      
      // Loop effect: wrap offset back to 0 if over max
      if (offsetRef.current > totalScroll) {
        offsetRef.current = 0;
      }

      emblaApi.scrollTo(offsetRef.current);

      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    animationFrameRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [emblaApi]);

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
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
              >
