import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CollaborationCard from '@/components/CollaborationCard';
import CollaborationDetailsModal from '@/components/modals/CollaborationDetailsModal';
import { Search } from 'lucide-react';

const BusinessCollaborations = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollaboration, setSelectedCollaboration] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (profile) {
      fetchCollaborations();
    }
  }, [profile]);

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          *,
          offer:offers(
            id,
            title,
            description,
            offer_photo,
            business_offer,
            community_deliverables,
            timeline_days,
            address
          ),
          community_profile:community_profiles(
            name,
            community_type,
            city,
            profile_photo,
            website,
            instagram,
            tiktok
          ),
          application:applications(
            message,
            availability
          )
        `)
        .eq('business_profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollaborations(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load collaborations.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (collaborationId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('collaborations')
        .update(updateData)
        .eq('id', collaborationId);

      if (error) throw error;

      setCollaborations(collaborations.map(collaboration =>
        collaboration.id === collaborationId 
          ? { ...collaboration, ...updateData }
          : collaboration
      ));

      toast({
        title: 'Success',
        description: `Collaboration ${newStatus === 'completed' ? 'marked as fulfilled' : 'cancelled'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${newStatus === 'completed' ? 'fulfill' : 'cancel'} collaboration`,
        variant: 'destructive',
      });
    }
  };

  const handleViewCollaboration = (collaboration: any) => {
    setSelectedCollaboration(collaboration);
    setShowDetailsModal(true);
  };

  if (loading) return <div>Loading...</div>;

  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesSearch = !searchTerm || 
      collaboration.offer?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaboration.community_profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || collaboration.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Collaborations</h1>
          <p className="text-muted-foreground">View and manage your active collaborations</p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'scheduled', 'active', 'completed', 'cancelled'].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(filter as any)}
          >
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} ({filter === 'all' ? collaborations.length : collaborations.filter(c => c.status === filter).length})
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search collaborations by offer title or community name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collaborations Grid */}
      {filteredCollaborations.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold">No collaborations found</p>
            <p className="text-muted-foreground mt-2">
              {searchTerm ? 'Try adjusting your search terms.' : 'Your active collaborations will appear here.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollaborations.map((collaboration) => (
            <CollaborationCard
              key={collaboration.id}
              collaboration={collaboration}
              onView={() => handleViewCollaboration(collaboration)}
              onStatusUpdate={(status) => handleStatusUpdate(collaboration.id, status)}
              userType="business"
            />
          ))}
        </div>
      )}

      <CollaborationDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        collaboration={selectedCollaboration}
        onStatusUpdate={(status) => selectedCollaboration && handleStatusUpdate(selectedCollaboration.id, status)}
        userType="business"
      />
    </div>
  );
};

export default BusinessCollaborations;