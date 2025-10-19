import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OfferCard from "@/components/OfferCard";
import OfferDetailsModal from "@/components/modals/OfferDetailsModal";
import { Plus, Eye, Edit, Send, ArrowLeft, Trash2, Copy } from "lucide-react";

const CommunityMyOpportunities = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<any[]>([]);
  const [communityProfile, setCommunityProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [offerToDelete, setOfferToDelete] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "draft" | "published" | "closed" | "completed">("all");

  useEffect(() => {
    if (profile) fetchData();
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch community_profile for current user
      const { data: cpData, error: cpError } = await supabase
        .from("community_profiles")
        .select("*")
        .eq("profile_id", profile.id)
        .single();

      if (cpError || !cpData) {
        throw new Error("Community profile not found. Please complete your profile setup.");
      }

      setCommunityProfile(cpData);

      // Fetch opportunities created by this community
      const { data: offersData, error: offersError } = await supabase
        .from("collab_opportunities")
        .select("*")
        .eq("creator_profile_id", cpData.profile_id)
        .eq("creator_profile_type", "community")
        .order("created_at", { ascending: false });

      if (offersError) throw offersError;

      setOffers(offersData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load collab requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOfferStatus = async (offerId: string, newStatus: "draft" | "published" | "closed" | "completed") => {
    try {
      const { error } = await supabase.from("collab_opportunities").update({ status: newStatus }).eq("id", offerId);
      if (error) throw error;

      setOffers(offers.map((offer) => (offer.id === offerId ? { ...offer, status: newStatus } : offer)));

      toast({
        title: "Success",
        description: `Collab request ${newStatus === "published" ? "published" : "updated"} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update opportunity status",
        variant: "destructive",
      });
    }
  };

  const handleViewOffer = (offer: any) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const handleDeleteOffer = async (offer: any) => {
    try {
      const { error } = await supabase.from("collab_opportunities").delete().eq("id", offer.id);
      if (error) throw error;

      setOffers(offers.filter((o) => o.id !== offer.id));
      setOfferToDelete(null);

      toast({
        title: "Success",
        description: "Collab request deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete opportunity",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateOffer = async (offer: any) => {
    try {
      const { id, created_at, updated_at, published_at, ...offerData } = offer;
      const duplicatedOffer = {
        ...offerData,
        title: `${offer.title} (copy)`,
        status: "draft",
        published_at: null,
        creator_profile_type: "community",
      };

      const { data, error } = await supabase.from("collab_opportunities").insert([duplicatedOffer]).select().single();

      if (error) throw error;

      setOffers([data, ...offers]);
      toast({
        title: "Success",
        description: "Collab request duplicated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate opportunity",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredOffers = activeFilter === "all" ? offers : offers.filter((offer) => offer.status === activeFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA", padding: "32px 0" }}>
      <div className="container mx-auto px-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              style={{
                fontFamily: "'Rubik', Arial, sans-serif",
                textTransform: "uppercase" as const,
                fontWeight: 700,
                fontSize: 30,
                color: "#000",
                letterSpacing: "0.03em",
              }}
            >
              MY COLLAB REQUESTS
            </h1>
            <p className="text-muted-foreground">Create and manage your collaboration opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/community/my-opportunities/new")}
              style={{
                background: "#FFD861",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "8px",
                boxShadow: "0 1.5px 4px 0 rgba(55, 73, 87, 0.11)",
                border: "none",
              }}
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create a Collab Request
            </Button>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap">
          {["all", "draft", "published"].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Button
                key={filter}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter as any)}
                style={
                  isActive
                    ? undefined
                    : {
                        background: "#f5f5f5",
                        borderColor: "#c3c3c3",
                        color: "#636363",
                        fontWeight: 700,
                      }
                }
              >
                {filter === "all" ? "All my collab requests" : filter.charAt(0).toUpperCase() + filter.slice(1)} (
                {filter === "all" ? offers.length : offers.filter((o) => o.status === filter).length})
              </Button>
            );
          })}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Collab requests in 'Draft' mode are only visible to you. Published collab requests
            are visible to businesses. You can switch between draft and published at any time.
          </p>
        </div>

        {filteredOffers.length === 0 ? (
          <Card
            style={{
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #EBEBEB",
              boxShadow: "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)",
            }}
          >
            <CardContent className="py-16 text-center">
              <p className="text-lg font-semibold">No collab requests found</p>
              <Button
                onClick={() => navigate("/community/my-opportunities/new")}
                style={{
                  background: "#FFD861",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "8px",
                  boxShadow: "0 1.5px 4px 0 rgba(55, 73, 87, 0.11)",
                  border: "none",
                  marginTop: "16px",
                }}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" /> Create a Collab Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card
                key={offer.id}
                style={{
                  background: "#fff",
                  border: "1px solid #EBEBEB",
                  borderRadius: "14px",
                  boxShadow: "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px 0 rgba(55, 73, 87, 0.15), 1px 1px 3px rgba(55,73,87,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)";
                }}
              >
                <CardHeader>
                  <CardTitle style={{ color: "#000" }}>{offer.title}</CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => handleViewOffer(offer)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/community/my-opportunities/${offer.id}/edit`)}
                      disabled={!["draft", "published"].includes(offer.status)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateOffer(offer)}
                      disabled={!communityProfile}
                      style={{ color: "#636363", borderColor: "#c3c3c3" }}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOfferToDelete(offer)}
                      style={{ color: "#636363", borderColor: "#c3c3c3" }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    {offer.status === "draft" && (
                      <Button
                        size="sm"
                        style={{
                          background: "#FFD861",
                          color: "#fff",
                          fontWeight: 700,
                          borderRadius: "8px",
                          boxShadow: "0 1.5px 4px 0 rgba(55, 73, 87, 0.11)",
                          border: "none",
                        }}
                        onClick={() => updateOfferStatus(offer.id, "published")}
                      >
                        <Send className="w-4 h-4 mr-2" /> Publish
                      </Button>
                    )}
                    {offer.status === "published" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOfferStatus(offer.id, "draft")}
                        style={{ color: "#636363", borderColor: "#c3c3c3" }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Draft
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <OfferDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          offer={selectedOffer}
          creatorProfile={communityProfile}
        />

        {offerToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="p-6 max-w-sm w-full">
              <CardHeader>
                <CardTitle>Delete Collab Request?</CardTitle>
                <CardDescription>Are you sure you want to delete "{offerToDelete.title}"?</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOfferToDelete(null)}
                  style={{ color: "#636363", borderColor: "#c3c3c3" }}
                >
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
    </div>
  );
};

export default CommunityMyOpportunities;
