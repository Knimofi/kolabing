import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OfferCard from '@/components/OfferCard';
import OfferDetailsModal from '@/components/modals/OfferDetailsModal';
import ApplyOfferModal from '@/components/modals/ApplyOfferModal';

interface Offer {
  id: string;
  title: string;
  description: string;
  availability_start?: string;
  availability_end?: string;
  offer_photo?: string;
  business_offer?: any;
  community_deliverables: Record<string, any>;
  categories?: string[];
  business_profiles?: {
    profile_id: string;
    name?: string;
    business_type?: string;
    city?: string;
    profile_photo?: string;
  } | null;
}

const categories = [
  'all',
  'Brand Awareness',
  'Content Creation',
  'Events',
  'Product Promotion',
  'Lead Generation',
];

const CommunityOffers = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          business_profiles (
            profile_id,
            name,
            business_type,
            city,
            profile_photo
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setOffers(Array.isArray(data) ? (data as any as Offer[]) : []);
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load offers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeeDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const handleApply = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (applicationData: { availability: string; message: string; }) => {
    if (!profile || !selectedOffer) return;
    setIsSubmittingApplication(true);

    try {
      const { data: existingApp, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('offer_id', selectedOffer.id)
        .eq('community_profile_id', profile.id)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingApp) throw new Error('You have already applied to this offer');

      const { error } = await supabase.from('applications').insert([{
        offer_id: selectedOffer.id,
        community_profile_id: profile.id,
        message: applicationData.message,
        availability: applicationData.availability,
        status: 'pending',
      }]);

      if (error) throw error;

      toast({ title: 'Success', description: 'Application submitted successfully!' });
      fetchOffers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to submit application', variant: 'destructive' });
      throw error;
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.business_profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' ||
      (offer.categories && offer.categories.includes(activeCategory));

    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="flex items-center justify-center min-h-48"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Browse Offers</h1>
        <p className="text-muted-foreground">Discover collaboration opportunities that match your community</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
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

      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">{offers.length === 0 ? 'No offers yet' : 'No matching offers found'}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              businessProfile={offer.business_profiles || {}}
              showActions={true}
              onSeeDetails={() => handleSeeDetails(offer)}
              onApply={() => handleApply(offer)}
            />
          ))}
        </div>
      )}

      <OfferDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        offer={selectedOffer}
        businessProfile={selectedOffer?.business_profiles || undefined}
      />

      <ApplyOfferModal
        open={showApplyModal}
        onOpenChange={setShowApplyModal}
        offer={selectedOffer}
        businessProfile={selectedOffer?.business_profiles || undefined}
        onSubmit={handleSubmitApplication}
        isSubmitting={isSubmittingApplication}
      />
    </div>
  );
};

export default CommunityOffers;
