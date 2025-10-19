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
      // Fetch published offers ONLY from businesses (communities only see business-created collabs)
      const { data: offersData, error: offersError } = await supabase
        .from('collab_opportunities')
        .select(`
          id,
          title,
          description,
          status,
          published_at,
          availability_start,
          availability_end,
          offer_photo,
          business_offer,
          community_deliverables,
          categories,
          address,
          timeline_days,
          creator_profile_id,
          creator_profile_type
        `)
        .eq('status', 'published')
        .eq('creator_profile_type', 'business')
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

      // Separate offers by creator type
      const businessCreatedOffers = (offersData || []).filter(o => o.creator_profile_type === 'business');
      const communityCreatedOffers = (offersData || []).filter(o => o.creator_profile_type === 'community');

      // Fetch business profiles
      const businessIds = [...new Set(businessCreatedOffers.map(o => o.creator_profile_id))];
      const { data: businessProfilesData } = await supabase
        .from('business_profiles')
        .select('profile_id, name, business_type, city, profile_photo, website, instagram')
        .in('profile_id', businessIds);

      // Fetch community profiles
      const communityIds = [...new Set(communityCreatedOffers.map(o => o.creator_profile_id))];
      const { data: communityProfilesData } = await supabase
        .from('community_profiles')
        .select('profile_id, name, community_type, city, profile_photo, website, instagram')
        .in('profile_id', communityIds);

      // Create maps for quick lookup
      const businessProfilesMap = new Map(
        (businessProfilesData || []).map(bp => [bp.profile_id, { ...bp, profile_type: 'business' }])
      );
      const communityProfilesMap = new Map(
        (communityProfilesData || []).map(cp => [cp.profile_id, { ...cp, profile_type: 'community' }])
      );

      // Enrich offers with creator profiles
      const enrichedOffers = (offersData || []).map(offer => {
        const creatorProfile = offer.creator_profile_type === 'business'
          ? businessProfilesMap.get(offer.creator_profile_id)
          : communityProfilesMap.get(offer.creator_profile_id);

        return {
          ...offer,
          creator_profile: creatorProfile || null,
          // Keep business_profiles for backward compatibility
          business_profiles: creatorProfile || null
        };
      });

      // Filter out offers without creator profiles
      const validOffers = enrichedOffers.filter(offer => offer.creator_profile);

      setOffers(validOffers);
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

  /*
  const fetchOffers = async () => {
  setLoading(true);

  try {
    // Fetch published offers with business profile
    const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          id,
          title,
          description,
          status,
          published_at,
          availability_start,
          availability_end,
          offer_photo,
          business_offer,
          community_deliverables,
          categories,
          creator_profile_id
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
  
      // Ensure offersData is an array
      const offersArray = Array.isArray(offersData) ? offersData : [];
  
      // Optional: fetch subscription status for each business (if needed)
      // Example: fetch active subscriptions to maybe highlight premium offers
      // const businessIds = offersArray.map(o => o.business_profile_id).filter(Boolean);
      // const { data: subscriptions } = await supabase
      //   .from('subscriptions')
      //   .select('id, subscription_status, billing_info')
      //   .in('id', businessIds);
  
      setOffers(offersArray);
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
  ;*/


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
        .eq('collab_opportunity_id', selectedOffer.id)
        .eq('applicant_profile_id', profile.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      if (existingApplication) {
        toast({
          title: 'Error',
          description: 'You already applied to this offer!',
          });
        return;
        //throw new Error('You have already applied to this offer');
      }

      const { error } = await supabase
        .from('applications')
        .insert([{
          collab_opportunity_id: selectedOffer.id,
          applicant_profile_id: profile.id,
          community_profile_id: profile.id,
          applicant_profile_type: 'community',
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

  const filteredOffers = offers.filter(offer => {
    if (!offer.creator_profile) return false;
    
    const matchesSearch = (offer.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (offer.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (offer.creator_profile.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  /*
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.business_profiles.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
                           (offer.categories && offer.categories.includes(activeCategory));
    
    return matchesSearch && matchesCategory;
  });
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", padding: "32px 0" }}>
      <div className="container mx-auto px-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-[700] text-[30px] uppercase text-[#232323] tracking-tight mb-2">
            FIND A COLLAB
          </h1>
        <p className="text-[15px] text-[#999] mb-6">
          Discover collaboration opportunities from businesses
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none" />
          <Input
            placeholder="Search collabs by title, business, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F5F5] text-[#222] border-none rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border focus:border-[#E8D7A0] focus:shadow-[0_0_0_3px_rgba(255,246,216,0.4)]"
          />
        </div>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <Card className="bg-white border border-[#EBEBEB] rounded-[14px] shadow-[0_1.5px_8px_0_rgba(55,73,87,0.10),0.5px_0.5px_1.5px_rgba(55,73,87,0.13)] p-12 text-center text-[#606060]">
          <CardContent className="py-16">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-[#FFD861] opacity-50" />
              <h3 className="text-lg font-bold text-[#232323] mb-2">
                {offers.length === 0 ? 'No collabs available yet' : 'No matching collabs found'}
              </h3>
              <p className="text-[#606060] mb-6 max-w-md mx-auto">
                {offers.length === 0 
                  ? 'New collabs will appear here. Check back soon!'
                  : 'Try adjusting your search terms.'
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
              creatorProfile={offer.creator_profile}
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
        creatorProfile={selectedOffer?.creator_profile}
      />

      {/* Apply Modal */}
      <ApplyOfferModal
        open={showApplyModal}
        onOpenChange={setShowApplyModal}
        offer={selectedOffer}
        businessProfile={selectedOffer?.creator_profile}
        onSubmit={handleSubmitApplication}
        isSubmitting={isSubmittingApplication}
      />
      </div>
    </div>
  );
};

export default CommunityOffers;