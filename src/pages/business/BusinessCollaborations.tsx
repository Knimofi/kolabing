import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CollaborationCard from "@/components/CollaborationCard";
import CollaborationDetailsModal from "@/components/modals/CollaborationDetailsModal";
import SurveyModal from "@/components/modals/SurveyModal";
import PendingFeedbackCard from "@/components/PendingFeedbackCard";
import { Search } from "lucide-react";

const BusinessCollaborations = () => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollaboration, setSelectedCollaboration] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "scheduled" | "active" | "completed" | "cancelled">("all");
  const [pendingSurveys, setPendingSurveys] = useState<any[]>([]);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      fetchCollaborations();
      fetchPendingSurveys();
    }
  }, [profile]);

  const fetchPendingSurveys = async () => {
    try {
      const { data: surveys, error } = await supabase
        .from("surveys")
        .select(
          `
          id,
          collaboration_id,
          submitted_at,
          collaborations!inner(
            id,
            collab_opportunity_id,
            applicant_profile_id,
            collab_opportunities(title),
            community_profiles(name)
          )
        `,
        )
        .eq("filled_by_profile_id", profile.id)
        .is("submitted_at", null);

      if (error) throw error;

      const pending = (surveys || []).map((s: any) => ({
        id: s.id,
        collaboration_id: s.collaboration_id,
        partnerName: s.collaborations?.community_profiles?.name || "Unknown Partner",
        offerTitle: s.collaborations?.collab_opportunities?.title || "Untitled Offer",
      }));

      setPendingSurveys(pending);
    } catch (error: any) {
      console.error("Error fetching pending surveys:", error);
    }
  };

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("collaborations")
        .select(
          `
          *,
          offer:collab_opportunities(
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
        `,
        )
        .eq("creator_profile_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCollaborations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load collaborations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (collaborationId: string, newStatus: "completed" | "cancelled") => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase.from("collaborations").update(updateData).eq("id", collaborationId);

      if (error) throw error;

      setCollaborations(
        collaborations.map((collaboration) =>
          collaboration.id === collaborationId ? { ...collaboration, ...updateData } : collaboration,
        ),
      );

      toast({
        title: "Success",
        description: `Collaboration ${newStatus === "completed" ? "completed" : "cancelled"} successfully`,
      });

      await fetchCollaborations();
      await fetchPendingSurveys();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${newStatus === "completed" ? "complete" : "cancel"} collaboration`,
        variant: "destructive",
      });
    }
  };

  const handleOpenFeedbackModal = async (collaborationId: string) => {
    const collab = collaborations.find((c) => c.id === collaborationId);
    if (!collab) return;

    const partnerName = collab.community_profile?.name || "Partner";
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

  const filteredCollaborations = collaborations.filter((collaboration) => {
    const matchesSearch =
      !searchTerm ||
      collaboration.offer?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaboration.community_profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === "all" || collaboration.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const RUBIK_EXTRA_BOLD_TITLE = {
    fontFamily: "'Rubik', Arial, sans-serif",
    textTransform: "uppercase" as const,
    fontWeight: 800,
    color: "#000",
    fontSize: 26,
    letterSpacing: 0.03,
    margin: 0,
  };
  const OPEN_SANS_SUBTITLE = {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 400,
    fontSize: 15,
    color: "#222",
    letterSpacing: 0,
    textTransform: "none" as const,
    margin: 0,
  };

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header style={{ background: "#FFF9E6", borderRadius: "12px", padding: "16px" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={RUBIK_EXTRA_BOLD_TITLE}>My Collaborations</h1>
              <p style={OPEN_SANS_SUBTITLE}>View and manage your active collaborations</p>
            </div>
          </div>
        </header>

      {/* Pending Feedback */}
      <PendingFeedbackCard pendingSurveys={pendingSurveys} onFillFeedback={handleFillFeedback} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "scheduled", "active", "completed", "cancelled"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter as any)}
          >
            {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)} (
            {filter === "all" ? collaborations.length : collaborations.filter((c) => c.status === filter).length})
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
          <Card style={{ background: "#FFFBF0", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}>
            <CardContent className="py-16 text-center">
              <p className="text-lg font-semibold" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#1A1A1A" }}>No collaborations found</p>
              <p className="mt-2" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                {searchTerm ? "Try adjusting your search terms." : "Your active collaborations will appear here."}
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
        onOpenFeedbackModal={handleOpenFeedbackModal}
        userType="business"
        currentUserProfileId={profile?.id}
      />

        {currentSurvey && (
          <SurveyModal
            open={showSurveyModal}
            onOpenChange={setShowSurveyModal}
            surveyId={currentSurvey.surveyId}
            collaborationId={currentSurvey.collaborationId}
            userType="business"
            partnerName={currentSurvey.partnerName}
            onSubmitSuccess={handleSurveySubmitSuccess}
            currentUserProfileId={profile?.id}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessCollaborations;
