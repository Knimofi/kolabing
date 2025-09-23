import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-md shadow-sm bg-[slate-805] bg-inherit">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-foreground">Kolabing</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/success-stories" className="text-muted-foreground hover:text-foreground transition-colors">
              Success Stories
            </a>
              <a href="/our-communities" className="text-muted-foreground hover:text-foreground transition-colors">
              Our Communities
            </a>
            <Link to="/auth/sign-in" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="section-title mb-6">
            Our Communities
          </h1>
          <p className="section-subtitle mx-auto">
            Discover amazing communities that are making a difference and creating impact in their local areas.
          </p>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="pb-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading communities...</div>
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No featured communities found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurCommunities;