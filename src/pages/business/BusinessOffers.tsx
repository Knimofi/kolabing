import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import OfferCard from '@/components/OfferCard';
import OfferDetailsModal from '@/components/modals/OfferDetailsModal';
import { Plus, Eye, Edit, Send, ArrowLeft, Trash2, Copy } from 'lucide-react';

const BusinessOffers = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<any[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [offerToDelete, setOfferToDelete] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'published' | 'closed' | 'completed'>('all');

  useEffect(() => {
    if (profile) fetchData();
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch business_profile for current user
      const { data: bpData, error: bpError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('profile_id', profile.id)
        .single();

      if (bpError || !bpData) {
        throw new Error('Business profile not found. Please complete your business profile setup.');
      }

      setBusinessProfile(bpData);

      // Fetch offers using correct business_profile_id
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('business_profile_id', bpData.profile_id)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      setOffers(offersData || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load offers.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, newStatus: 'draft' | 'published' | 'closed' | 'completed') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);
      if (error) throw error;

      setOffers(offers.map((offer) =>
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      ));

      toast({
        title: 'Success',
        description: `Offer ${newStatus === 'published' ? 'published' : 'updated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update offer status',
        variant: 'destructive',
      });
    }
  };

  const handleViewOffer = (offer: any) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const handleDeleteOffer = async (offer: any) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offer.id);
      if (error) throw error;

      setOffers(offers.filter(o => o.id !== offer.id));
      setOfferToDelete(null);

      toast({
        title: 'Success',
        description: 'Offer deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete offer',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateOffer = async (offer: any) => {
    try {
      const { id, created_at, updated_at, published_at, ...offerData } = offer;
      const duplicatedOffer = {
        ...offerData,
        title: `${offer.title} (copy)`,
        status: 'draft',
        published_at: null,
      };

      const { data, error } = await supabase
        .from('offers')
        .insert([duplicatedOffer])
        .select()
        .single();

      if (error) throw error;

      setOffers([data, ...offers]);
      toast({
        title: 'Success',
        description: 'Offer duplicated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to duplicate offer',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredOffers = activeFilter === 'all'
    ? offers
    : offers.filter(offer => offer.status === activeFilter);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Offers</h1>
          <p className="text-muted-foreground">Create and manage your collaboration offers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/business/offers/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
          {/* Filter buttons etc can go here */}
        </div>
      </header>

      <div className="flex gap-2 flex-wrap">
        {['all', 'draft', 'published', 'closed', 'completed'].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter as any)}
          >
            {filter === 'all' ? 'All Offers' : filter.charAt(0).toUpperCase() + filter.slice(1)} ({filter === 'all' ? offers.length : offers.filter(o => o.status === filter).length})
          </Button>
        ))}
      </div>

      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold">No offers found</p>
            <Button onClick={() => navigate('/business/offers/new')} className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Create Offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <CardTitle>{offer.title}</CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleViewOffer(offer)}>
                    <Eye className="w-4 h-4 mr-2" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/business/offers/${offer.id}/edit`)} disabled={!['draft', 'published'].includes(offer.status)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateOffer(offer)} disabled={!businessProfile}>
                    <Copy className="w-4 h-4 mr-2" /> Duplicate
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setOfferToDelete(offer)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                  {offer.status === 'draft' && (
                    <Button size="sm" onClick={() => updateOfferStatus(offer.id, 'published')}>
                      <Send className="w-4 h-4 mr-2" /> Publish
                    </Button>
                  )}
                  {offer.status === 'published' && (
                    <Button variant="outline" size="sm" onClick={() => updateOfferStatus(offer.id, 'draft')}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Draft
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OfferDetailsModal open={showDetailsModal} onOpenChange={setShowDetailsModal} offer={selectedOffer} businessProfile={businessProfile} />

{offerToDelete && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <Card className="p-6 max-w-sm w-full">
      <CardHeader>
        <CardTitle>Delete Offer?</CardTitle>
        <CardDescription>
          Are you sure you want to delete "{offerToDelete.title}"?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOfferToDelete(null)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => handleDeleteOffer(offerToDelete)}>
          Confirm Delete
        </Button>
      </CardContent>
    </Card>
  </div>
)}
    </div>
  );
};

export default BusinessOffers;
