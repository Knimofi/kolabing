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

// --- FONT STYLES ---
const RUBIK_EXTRA_BOLD_TITLE = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  color: "#1A1A1A",
  fontSize: 30,
  letterSpacing: "0.03em",
  margin: 0,
};
const OPEN_SANS_BOLD_CARD_SMALL = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 600,
  color: "#1A1A1A",
  fontSize: 13,
  letterSpacing: "0.08em",
  margin: 0,
};
const OPEN_SANS_SUBTITLE = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 15,
  color: "#4A4A4A",
  letterSpacing: 0,
  textTransform: "none" as const,
  margin: 0,
};
const OPEN_SANS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 14,
  color: "#4A4A4A",
};
const BUTTON_YELLOW = {
  background: "#FFD861",
  border: "2px solid #FFD861",
  color: "#000",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 600,
  letterSpacing: "0.03em",
  fontSize: 17,
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(255, 216, 97, 0.3)",
  transition: "all 0.2s ease-in-out",
};
const BUTTON_OUTLINE_FILTER = {
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 500,
  letterSpacing: "0.03em",
  fontSize: 14,
  borderRadius: "8px",
  transition: "all 0.2s ease-in-out",
};

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

      // Fetch offers using creator_profile_id
      const { data: offersData, error: offersError } = await supabase
        .from('collab_opportunities')
        .select('*')
        .eq('creator_profile_id', bpData.profile_id)
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
        .from('collab_opportunities')
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
        .from('collab_opportunities')
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
        .from('collab_opportunities')
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
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={RUBIK_EXTRA_BOLD_TITLE}>MY COLLAB REQUESTS</h1>
              <p style={OPEN_SANS_SUBTITLE}>Create and manage your collaboration opportunities</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate('/business/opportunities/new')}
                size="lg"
                style={BUTTON_YELLOW}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collab Opportunity
              </Button>
            </div>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap">
          {['all', 'draft', 'published', 'closed', 'completed'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter as any)}
              style={BUTTON_OUTLINE_FILTER}
            >
              {filter === 'all' ? 'All Offers' : filter.charAt(0).toUpperCase() + filter.slice(1)} ({filter === 'all' ? offers.length : offers.filter(o => o.status === filter).length})
            </Button>
          ))}
        </div>

        {filteredOffers.length === 0 ? (
          <Card style={{ background: "#FFF6D8", borderRadius: "18px", border: "1.5px solid #F9E9AC", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)" }}>
            <CardContent className="py-16 text-center">
              <p className="text-lg font-semibold" style={{ ...OPEN_SANS, fontWeight: 600, fontSize: "18px", color: "#1A1A1A" }}>No opportunities found</p>
              <Button 
                onClick={() => navigate('/business/opportunities/new')} 
                className="mt-4"
                size="lg"
                style={BUTTON_YELLOW}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Plus className="w-5 h-5 mr-2" /> Create Collab Opportunity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(231, 192, 58, 0.18), 0 2px 12px 0 rgba(60, 44, 0, 0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)"; }}
              >
                <CardHeader>
                  <CardTitle style={{ ...OPEN_SANS_BOLD_CARD_SMALL, fontSize: 18 }}>{offer.title}</CardTitle>
                  <CardDescription style={OPEN_SANS}>{offer.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => handleViewOffer(offer)} style={{ ...BUTTON_OUTLINE_FILTER, borderRadius: "8px" }}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/business/opportunities/${offer.id}/edit`)} disabled={!['draft', 'published'].includes(offer.status)} style={{ ...BUTTON_OUTLINE_FILTER, borderRadius: "8px" }}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicateOffer(offer)} disabled={!businessProfile} style={{ ...BUTTON_OUTLINE_FILTER, borderRadius: "8px" }}>
                      <Copy className="w-4 h-4 mr-2" /> Duplicate
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setOfferToDelete(offer)} style={{ ...BUTTON_OUTLINE_FILTER, borderRadius: "8px" }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    {offer.status === 'draft' && (
                      <Button size="sm" onClick={() => updateOfferStatus(offer.id, 'published')} style={BUTTON_YELLOW}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        <Send className="w-4 h-4 mr-2" /> Publish
                      </Button>
                    )}
                    {offer.status === 'published' && (
                      <Button variant="outline" size="sm" onClick={() => updateOfferStatus(offer.id, 'draft')} style={{ ...BUTTON_OUTLINE_FILTER, borderRadius: "8px" }}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Draft
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}


        {offerToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="p-6 max-w-sm w-full" style={{ background: "#fff" }}>
              <CardHeader>
                <CardTitle style={OPEN_SANS_BOLD_CARD_SMALL}>Delete Offer?</CardTitle>
                <CardDescription style={OPEN_SANS}>
                  Are you sure you want to delete "{offerToDelete.title}"?
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOfferToDelete(null)} style={BUTTON_OUTLINE_FILTER}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteOffer(offerToDelete)} style={{ ...BUTTON_OUTLINE_FILTER, background: "#dc2626" }}>
                  Confirm Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <OfferDetailsModal open={showDetailsModal} onOpenChange={setShowDetailsModal} offer={selectedOffer} businessProfile={businessProfile} />
      </div>
    </div>
  );
};

export default BusinessOffers;
