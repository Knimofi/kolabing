import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Calendar, Building2, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OfferCard from '@/components/OfferCard';
import OfferDetailsModal from '@/components/modals/OfferDetailsModal';
import ApplyOfferModal from '@/components/modals/ApplyOfferModal';

const CommunityOffers = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Fetch published offers with business profile data (left join)
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          *,
          business_profiles(
            profile_id,
            name,
            business_type,
            city,
            profile_photo,
            website,
            instagram
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
  
      if (offersError) {
        console.error('Supabase error fetching offers:', offersError);
        toast({
          title: 'Error',
          description: 'Failed to load offers. Please try again.',
          variant: 'destructive',
        });
        return;
      }
  
      // Optional: ensure offersData is an array
      setOffers(Array.isArray(offersData) ? offersData : []);
    } catch (error: any) {
      console.error('Unexpected error fetching offers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load offers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSeeDetails = (offer: any) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const handleApply = (offer: any) => {
    setSelectedOffer(offer);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (applicationData: {
    availability: string;
    message: string;
  }) => {
    if (!profile || !selectedOffer) return;

    setIsSubmittingApplication(true);
    try {
      // Check for duplicate applications first
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('offer_id', selectedOffer.id)
        .eq('community_profile_id', profile.id)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      if (existingApplication) {
        throw new Error('You have already applied to this offer');
      }

      const { error } = await supabase
        .from('applications')
        .insert([{
          offer_id: selectedOffer.id,
          community_profile_id: profile.id,
          message: applicationData.message,
          availability: applicationData.availability,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your application has been submitted successfully!',
      });

      // Refresh offers to update application counts
      fetchOffers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const categories = [
    'all',
    'Brand Awareness',
    'Content Creation',
    'Events',
    'Product Promotion',
    'Lead Generation'
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.business_profiles.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
                           (offer.categories && offer.categories.includes(activeCategory));
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Browse Offers
        </h1>
        <p className="text-muted-foreground">
          Discover collaboration opportunities that match your community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search offers by title, business, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button 
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {offers.length === 0 ? 'No offers available yet' : 'No matching offers found'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {offers.length === 0 
                  ? 'New collaboration opportunities will appear here. Check back soon!'
                  : 'Try adjusting your search terms or selected category.'
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              businessProfile={offer.business_profiles}
              showActions={true}
              onSeeDetails={() => handleSeeDetails(offer)}
              onApply={() => handleApply(offer)}
            />
          ))}
        </div>
      )}

      {/* Offer Details Modal */}
      <OfferDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        offer={selectedOffer}
        businessProfile={selectedOffer?.business_profiles}
      />

      {/* Apply Modal */}
      <ApplyOfferModal
        open={showApplyModal}
        onOpenChange={setShowApplyModal}
        offer={selectedOffer}
        businessProfile={selectedOffer?.business_profiles}
        onSubmit={handleSubmitApplication}
        isSubmitting={isSubmittingApplication}
      />
    </div>
  );
};

export default CommunityOffers;