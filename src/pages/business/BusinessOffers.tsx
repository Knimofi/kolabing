import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, MoreVertical, Calendar, MapPin, Users, Star, Send, ArrowLeft, Trash2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import OfferCard from '@/components/OfferCard';

type OfferStatus = 'all' | 'draft' | 'published' | 'closed' | 'completed';

const BusinessOffers = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('list');
  const [businessProfile, setBusinessProfile] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      fetchOffers();
    }
  }, [profile]);

  const fetchOffers = async () => {
    if (!profile) return;

    try {
      const [offersResponse, businessProfileResponse] = await Promise.all([
        supabase
          .from('offers')
          .select('*')
          .eq('business_profile_id', profile.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('business_profiles')
          .select('*')
          .eq('profile_id', profile.id)
          .single()
      ]);

      if (offersResponse.error) throw offersResponse.error;
      if (businessProfileResponse.error) throw businessProfileResponse.error;

      setOffers(offersResponse.data || []);
      setBusinessProfile(businessProfileResponse.data);
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

  const filteredOffers = activeFilter === 'all' 
    ? offers 
    : offers.filter(offer => offer.status === activeFilter);

  const updateOfferStatus = async (offerId: string, newStatus: 'draft' | 'published' | 'closed' | 'completed') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) throw error;

      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      ));

      toast({
        title: 'Success',
        description: `Offer ${newStatus === 'published' ? 'published' : 'moved to draft'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update offer status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      published: { variant: 'default' as const, label: 'Published' },
      closed: { variant: 'destructive' as const, label: 'Closed' },
      completed: { variant: 'outline' as const, label: 'Completed' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Offers
          </h1>
          <p className="text-muted-foreground">
            Create and manage your collaboration offers
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/business/offers/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('preview')}
              >
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Offers' },
          { key: 'draft', label: 'Draft' },
          { key: 'published', label: 'Published' },
          { key: 'closed', label: 'Closed' },
          { key: 'completed', label: 'Completed' }
        ].map(filter => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label} ({filter.key === 'all' ? offers.length : offers.filter(o => o.status === filter.key).length})
          </Button>
        ))}
      </div>

      {/* Offers Display */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No offers found</h3>
              <p className="text-muted-foreground mb-6">
                {offers.length === 0 ? 'Create your first offer to get started' : `No ${activeFilter} offers yet`}
              </p>
              <Button onClick={() => navigate('/business/offers/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'preview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                businessProfile={businessProfile || {}}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {offer.title}
                        {getStatusBadge(offer.status)}
                      </CardTitle>
                      <CardDescription>
                        {offer.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/business/offers/${offer.id}/edit`)}
                      disabled={!['draft', 'published'].includes(offer.status)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {offer.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => updateOfferStatus(offer.id, 'published')}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Publish
                      </Button>
                    )}
                    {offer.status === 'published' && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => updateOfferStatus(offer.id, 'draft')}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Draft
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default BusinessOffers;