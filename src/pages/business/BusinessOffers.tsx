import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

type OfferStatus = 'all' | 'draft' | 'published' | 'closed' | 'completed';

const BusinessOffers = () => {
  const { profile } = useAuth();
  const [offers, setOffers] = useState<any[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<OfferStatus>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchOffers();
    }
  }, [profile]);

  useEffect(() => {
    filterOffers();
  }, [offers, activeFilter]);

  const fetchOffers = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('business_profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    if (activeFilter === 'all') {
      setFilteredOffers(offers);
    } else {
      setFilteredOffers(offers.filter(offer => offer.status === activeFilter));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'closed':
        return 'outline';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getCollaborationGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      brand_awareness: 'Brand Awareness',
      lead_generation: 'Lead Generation',
      content_creation: 'Content Creation',
      event_partnership: 'Event Partnership',
      product_promotion: 'Product Promotion',
    };
    return labels[goal] || goal;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Offers
          </h1>
          <p className="text-muted-foreground">
            Create and manage your collaboration offers
          </p>
        </div>
        
        <Link to="/business/offers/new">
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create New Offer
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          All Offers ({offers.length})
        </Button>
        <Button 
          variant={activeFilter === 'draft' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('draft')}
        >
          Draft ({offers.filter(o => o.status === 'draft').length})
        </Button>
        <Button 
          variant={activeFilter === 'published' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('published')}
        >
          Published ({offers.filter(o => o.status === 'published').length})
        </Button>
        <Button 
          variant={activeFilter === 'closed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('closed')}
        >
          Closed ({offers.filter(o => o.status === 'closed').length})
        </Button>
        <Button 
          variant={activeFilter === 'completed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('completed')}
        >
          Completed ({offers.filter(o => o.status === 'completed').length})
        </Button>
      </div>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {offers.length === 0 ? 'No offers yet' : `No ${activeFilter === 'all' ? '' : activeFilter} offers`}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {offers.length === 0 
                  ? 'Create your first collaboration offer to start connecting with communities.'
                  : `You don't have any ${activeFilter === 'all' ? '' : activeFilter} offers at the moment.`
                }
              </p>
              {offers.length === 0 && (
                <Link to="/business/offers/new">
                  <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Offer
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Created on {format(new Date(offer.created_at), 'MMM d, yyyy')}
                      {offer.published_at && (
                        <span> • Published on {format(new Date(offer.published_at), 'MMM d, yyyy')}</span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(offer.status)}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {offer.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    {getCollaborationGoalLabel(offer.collaboration_goal)}
                  </Badge>
                  {offer.no_venue && (
                    <Badge variant="outline">Online</Badge>
                  )}
                  {offer.availability_start && (
                    <Badge variant="outline">
                      From {format(new Date(offer.availability_start), 'MMM d')}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    0 applications {/* TODO: Add application count */}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessOffers;