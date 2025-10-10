import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CollaborationCard from '@/components/CollaborationCard';
import CollaborationDetailsModal from '@/components/modals/CollaborationDetailsModal';
import SurveyModal from '@/components/modals/SurveyModal';
import PendingFeedbackCard from '@/components/PendingFeedbackCard';
import { Search } from 'lucide-react';

const CommunityCollaborations = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollaboration, setSelectedCollaboration] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'active' | 'completed' | 'cancelled'>('all');
  const [pendingSurveys, setPendingSurveys] = useState<any[]>([]);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      fetchCollaborations();
      fetchPendingSurveys();
    }
    // eslint-disable-next-line
  }, [profile]);

  const fetchPendingSurveys = async () => {
    try {
      const { data: surveys, error } = await supabase
        .from('surveys')
        .select(`
          id,
          collaboration_id,
          submitted_at,
          collaborations!inner(
            id,
            offer_id,
            business_profile_id,
            offers(title),
            business_profiles(name)
          )
        `)
        .eq('filled_by_profile_id', profile.id)
        .is('submitted_at', null);

      if (error) throw error;

      const pending = (surveys || []).map((s: any) => ({
        id: s.id,
        collaboration_id: s.collaboration_id,
        partnerName: s.collaborations?.business_profiles?.name || 'Unknown Partner',
        offerTitle: s.collaborations?.offers?.title || 'Untitled Offer',
      }));

      setPendingSurveys(pending);
    } catch (error: any) {
      console.error('Error fetching pending surveys:', error);
    }
  };

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      // 1) Fetch base collaborations without embedded joins
      const { data: baseRows, error: baseError } = await supabase
        .from('collaborations')
        .select(
          'id,status,created_at,scheduled_date,completed_at,offer_id,business_profile_id,community_profile_id,application_id,contact_methods'
        )
        .eq('community_profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (baseError) throw baseError;

      const offerIds = Array.from(
        new Set((baseRows || []).map((r: any) => r.offer_id).filter(Boolean))
      );
      const businessProfileIds = Array.from(
        new Set((baseRows || []).map((r: any) => r.business_profile_id).filter(Boolean))
      );
      const applicationIds = Array.from(
        new Set((baseRows || []).map((r: any) => r.application_id).filter(Boolean))
      );

      // 2) Fetch related entities in parallel
      const [offersRes, businessProfilesRes, applicationsRes] = await Promise.all([
        offerIds.length
          ? supabase
              .from('collab_opportunities')
              .select(
                'id,title,description,offer_photo,business_offer,community_deliverables,timeline_days,address,status'
              )
              .in('id', offerIds)
          : Promise.resolve({ data: [], error: null } as any),
        businessProfileIds.length
          ? supabase
              .from('business_profiles')
              .select(
                'profile_id,name,business_type,city,profile_photo,website,instagram'
              )
              .in('profile_id', businessProfileIds)
          : Promise.resolve({ data: [], error: null } as any),
        applicationIds.length
          ? supabase
              .from('applications')
              .select('id,message,availability')
              .in('id', applicationIds)
          : Promise.resolve({ data: [], error: null } as any),
      ]);

      if (offersRes.error) {
        // Offers may fail due to RLS when offers are closed; that's OK, we'll fallback
        console.warn('Offers fetch warning (possibly due to RLS):', offersRes.error);
      }
      if (businessProfilesRes.error) throw businessProfilesRes.error;
      if (applicationsRes.error) throw applicationsRes.error;

      const offersMap = new Map<string, any>(
        ((offersRes.data as any[]) || []).map((o: any) => [o.id, o])
      );
      const businessProfilesMap = new Map<string, any>(
        ((businessProfilesRes.data as any[]) || []).map((b: any) => [b.profile_id, b])
      );
      const applicationsMap = new Map<string, any>(
        ((applicationsRes.data as any[]) || []).map((a: any) => [a.id, a])
      );

      // 3) Enrich base rows with related data and safe fallbacks
      const enriched = (baseRows || []).map((c: any) => {
        const offer = offersMap.get(c.offer_id);
        const business = businessProfilesMap.get(c.business_profile_id) || null;
        const application = applicationsMap.get(c.application_id) || null;

        return {
          ...c,
          offer: offer
            ? {
                ...offer,
                offer_photo: offer.offer_photo || null,
                title: offer.title || 'Untitled Offer',
                description: offer.description || '',
                business_offer: offer.business_offer || null,
                community_deliverables: offer.community_deliverables || null,
                timeline_days: offer.timeline_days || 0,
                address: offer.address || '',
              }
            : {
                id: c.offer_id,
                title: 'Untitled Offer',
                description: '',
                offer_photo: null,
                business_offer: null,
                community_deliverables: null,
                timeline_days: 0,
                address: '',
              },
          business_profile: business
            ? {
                ...business,
                name: business.name || 'Unknown Business',
                business_type: business.business_type || '',
                city: business.city || '',
                profile_photo: business.profile_photo || null,
                website: business.website || '',
                instagram: business.instagram || '',
              }
            : null,
          application,
        };
      });

      setCollaborations(enriched);
    } catch (error: any) {
      console.error('Error fetching collaborations:', error);
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
        description: `Collaboration ${newStatus === 'completed' ? 'completed' : 'cancelled'} successfully`,
      });

      await fetchCollaborations();
      await fetchPendingSurveys();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${newStatus === 'completed' ? 'complete' : 'cancel'} collaboration`,
        variant: 'destructive',
      });
    }
  };

  const handleOpenFeedbackModal = async (collaborationId: string) => {
    const collab = collaborations.find(c => c.id === collaborationId);
    if (!collab) return;

    const partnerName = collab.business_profile?.name || 'Partner';
    setCurrentSurvey({ collaborationId, partnerName });
    setShowSurveyModal(true);
  };

  const handleViewCollaboration = (collaboration: any) => {
    setSelectedCollaboration(collaboration);
    setShowDetailsModal(true);
  };

  const handleFillFeedback = (surveyId: string, collaborationId: string, partnerName: string) => {
    setCurrentSurvey({ surveyId, collaborationId, partnerName });
    setShowSurveyModal(true);
  };

  const handleSurveySubmitSuccess = () => {
    fetchPendingSurveys();
    fetchCollaborations();
  };

  if (loading) return <div>Loading...</div>;

  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesSearch = !searchTerm ||
      (collaboration.offer?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (collaboration.business_profile?.name?.toLowerCase().includes(searchTerm.toLowerCase())));
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

      {/* Pending Feedback */}
      <PendingFeedbackCard 
        pendingSurveys={pendingSurveys}
        onFillFeedback={handleFillFeedback}
      />

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
          placeholder="Search collaborations by offer title or business name..."
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
              onOpenFeedbackModal={handleOpenFeedbackModal}
              userType="community"
            />
          ))}
        </div>
      )}

      <CollaborationDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        collaboration={selectedCollaboration}
        onStatusUpdate={(status) => selectedCollaboration && handleStatusUpdate(selectedCollaboration.id, status)}
        onOpenFeedbackModal={handleOpenFeedbackModal}
        userType="community"
        currentUserProfileId={profile?.id}
      />

      {currentSurvey && (
        <SurveyModal
          open={showSurveyModal}
          onOpenChange={setShowSurveyModal}
          surveyId={currentSurvey.surveyId}
          collaborationId={currentSurvey.collaborationId}
          userType="community"
          partnerName={currentSurvey.partnerName}
          onSubmitSuccess={handleSurveySubmitSuccess}
          currentUserProfileId={profile?.id}
        />
      )}
    </div>
  );
};

export default CommunityCollaborations;