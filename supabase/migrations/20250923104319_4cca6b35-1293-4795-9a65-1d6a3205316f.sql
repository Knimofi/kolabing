-- Create success_stories table
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL, 
  company TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "success_stories_public_read" 
ON public.success_stories 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_success_stories_updated_at
BEFORE UPDATE ON public.success_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert sample success stories data based on GrowbyCommunity content
INSERT INTO public.success_stories (name, role, company, testimonial, image_url) VALUES
('Felipe', 'Owner', 'Ugo''s Corner', 'GrowbyCommunity helped us connect with amazing running clubs to launch a new type of iced coffee. We ran a great activation with very good engagement, content, and feedback. Now people in the neighbourhood want to try it too.', 'https://growbycommunity.com/lovable-uploads/2cd33ca4-a83e-4e41-b4ee-e0a770b0bb54.png'),
('Maria', 'Founder', 'Lilo''s Brunch', 'The coffee party event was incredible! We had over 200 people attend, created viral moments with our DJ, and built lasting relationships with our local community. The engagement was beyond our expectations.', 'https://growbycommunity.com/lovable-uploads/bb5ad4d5-0e01-4f25-b7b4-2db87b31b6c8.png'),
('Carlos', 'Community Manager', 'FitSpace Barcelona', 'Our HiiT & Coworking Day was a game-changer. We combined training, coworking, lunch and afterwork into one amazing community experience that boosted our brand engagement significantly.', 'https://growbycommunity.com/lovable-uploads/5b98c5f4-f52d-47b9-a63b-c9c82f93492c.png'),
('Anna', 'Marketing Director', 'CrossFit BCN', 'The Training & Brunch collaboration created lasting connections between our gym and the local community. We saw a 40% increase in new memberships following the event.', 'https://growbycommunity.com/lovable-uploads/b91b5d5c-42c1-499d-8253-2993b137938c.png'),
('David', 'Founder', 'BeachFit Barcelona', 'Our Beach Fitness Challenge brought together over 100 fitness enthusiasts. The authentic community engagement helped us establish our brand as the go-to for outdoor fitness in Barcelona.', 'https://growbycommunity.com/lovable-uploads/placeholder-beach.jpg'),
('Laura', 'Brand Manager', 'Local Coffee Co.', 'Working with GrowbyCommunity transformed our brand visibility. The authentic partnerships with local communities resulted in a 60% increase in foot traffic to our stores.', '/placeholder-coffee.jpg');