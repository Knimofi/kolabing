import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
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
      <Navbar />
      
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