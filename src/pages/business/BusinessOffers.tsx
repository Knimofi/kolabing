// src/pages/business/BusinessOffers.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OfferDetailsModal from "@/components/modals/OfferDetailsModal";
import { Plus, Eye, Edit, Send, ArrowLeft, Trash2, Copy } from "lucide-react";

// --- Visual Style Variables from OfferCard ---
const SOFT_YELLOW = "#FFF6D8";
const SOFT_BLACK = "#232323";
const CARD_BORDER = "#F9E9AC";
const SHADOW = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)";
const BUTTON_YELLOW = "#FFD861";

// --- Button Style ---
const BUTTON_STYLE_GHOST = {
  background: SOFT_YELLOW,
  color: SOFT_BLACK,
  fontWeight: 500,
  border: `1px solid ${SOFT_YELLOW}`,
  borderRadius: "9px",
  fontSize: "16px",
  fontFamily: "Darker Grotesque, Arial, sans-serif",
  boxShadow: "none",
  transition: "all 0.18s",
};

const BUTTON_STYLE_SOLID = {
  background: BUTTON_YELLOW,
  color: SOFT_BLACK,
  fontWeight: 600,
  border: "none",
  borderRadius: "9px",
  fontSize: "16px",
  fontFamily: "Darker Grotesque, Arial, sans-serif",
  boxShadow: "none",
  transition: "all 0.18s",
};

// --- Card Style ---
const OFFER_CARD_STYLE = {
  background: SOFT_YELLOW,
  color: SOFT_BLACK,
  borderRadius: "18px",
  border: `1.5px solid ${CARD_BORDER}`,
  boxShadow: SHADOW,
  position: "relative",
  transition: "all 0.22s",
};

// --- Card Header Style ---
const TITLE_STYLE = {
  fontFamily: "Darker Grotesque, Arial, sans-serif",
  fontWeight: 600,
  fontSize: "21px",
  color: SOFT_BLACK,
  marginBottom: "6px",
  lineHeight: "1.17",
  textTransform: "none",
};

// --- Subtitle Style ---
const SUBTITLE_STYLE = {
  fontFamily: "Open Sans, Arial, sans-serif",
  fontWeight: 400,
  fontSize: "15px",
  color: SOFT_BLACK,
  opacity: 0.76,
  marginBottom: "0px",
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
  const [activeFilter, setActiveFilter] = useState<"all" | "draft" | "published" | "closed" | "completed">("all");

  useEffect(() => {
    if (profile) fetchData();
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: bpData, error: bpError } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("profile_id", profile.id)
        .single();

      if (bpError || !bpData) throw new Error("Business profile not found.");

      setBusinessProfile(bpData);

      const { data: offersData, error: offersError } = await supabase
        .from("collab_opportunities")
        .select("*")
        .eq("creator_profile_id", bpData.profile_id)
        .order("created_at", { ascending: false });

      if (offersError) throw offersError;

      setOffers(offersData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load offers.",
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
        description: "Offer status updated!",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update offer status", variant: "destructive" });
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
        description: "Offer deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer",
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
      };

      const { data, error } = await supabase.from("collab_opportunities").insert([duplicatedOffer]).select().single();

      if (error) throw error;
      setOffers([data, ...offers]);
      toast({
        title: "Success",
        description: "Offer duplicated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate offer",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredOffers = activeFilter === "all" ? offers : offers.filter((offer) => offer.status === activeFilter);

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header
          style={{
            background: SOFT_YELLOW,
            borderRadius: "14px",
            padding: "16px",
            border: `1.5px solid ${CARD_BORDER}`,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 style={{ ...TITLE_STYLE, fontSize: 26, textTransform: "uppercase" }}>My Collab Requests</h1>
              <p style={SUBTITLE_STYLE}>Create and manage your collaboration opportunities</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/business/opportunities/new")}
                size="lg"
                style={BUTTON_STYLE_SOLID}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                onMouseLeave={(e) => (e.currentTarget.style.background = BUTTON_YELLOW)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collab Opportunity
              </Button>
            </div>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap">
          {["all", "draft", "published", "closed", "completed"].map((filter) => (
            <Button
              key={filter}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(filter as any)}
              style={{
                ...BUTTON_STYLE_GHOST,
                background: activeFilter === filter ? "#FFE49B" : SOFT_YELLOW,
                border: `1.5px solid ${CARD_BORDER}`,
                fontWeight: activeFilter === filter ? 600 : 500,
              }}
            >
              {filter === "all" ? "All Offers" : filter.charAt(0).toUpperCase() + filter.slice(1)} (
              {filter === "all" ? offers.length : offers.filter((o) => o.status === filter).length})
            </Button>
          ))}
        </div>

        {filteredOffers.length === 0 ? (
          <Card style={{ ...OFFER_CARD_STYLE, borderRadius: "14px", background: "#FFF9E6" }}>
            <CardContent className="py-16 text-center">
              <p style={{ ...TITLE_STYLE, fontSize: "18px" }}>No opportunities found</p>
              <Button
                onClick={() => navigate("/business/opportunities/new")}
                className="mt-4"
                size="lg"
                style={BUTTON_STYLE_SOLID}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                onMouseLeave={(e) => (e.currentTarget.style.background = BUTTON_YELLOW)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collab Opportunity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} style={OFFER_CARD_STYLE} className="group">
                <CardHeader>
                  <CardTitle style={TITLE_STYLE}>{offer.title}</CardTitle>
                  <CardDescription style={SUBTITLE_STYLE}>{offer.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap pt-2 border-t" style={{ borderColor: CARD_BORDER }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOffer(offer)}
                      style={BUTTON_STYLE_GHOST}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/business/opportunities/${offer.id}/edit`)}
                      disabled={!["draft", "published"].includes(offer.status)}
                      style={BUTTON_STYLE_GHOST}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateOffer(offer)}
                      disabled={!businessProfile}
                      style={BUTTON_STYLE_GHOST}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Duplicate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setOfferToDelete(offer)}
                      style={{
                        ...BUTTON_STYLE_GHOST,
                        border: "1.5px solid #dc2626",
                        color: "#dc2626",
                        background: "#FFE5E5",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8B4B4")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#FFE5E5")}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    {offer.status === "draft" && (
                      <Button
                        size="sm"
                        onClick={() => updateOfferStatus(offer.id, "published")}
                        style={BUTTON_STYLE_SOLID}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = BUTTON_YELLOW)}
                      >
                        <Send className="w-4 h-4 mr-2" /> Publish
                      </Button>
                    )}
                    {offer.status === "published" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateOfferStatus(offer.id, "draft")}
                        style={BUTTON_STYLE_GHOST}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
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

        {offerToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card
              className="p-6 max-w-sm w-full"
              style={{ background: SOFT_YELLOW, borderRadius: "14px", border: `1.5px solid ${CARD_BORDER}` }}
            >
              <CardHeader>
                <CardTitle style={TITLE_STYLE}>Delete Offer?</CardTitle>
                <CardDescription style={SUBTITLE_STYLE}>
                  Are you sure you want to delete "{offerToDelete.title}"?
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setOfferToDelete(null)}
                  style={BUTTON_STYLE_GHOST}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOffer(offerToDelete)}
                  style={{
                    ...BUTTON_STYLE_GHOST,
                    border: "1.5px solid #dc2626",
                    color: "#dc2626",
                    background: "#FFE5E5",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8B4B4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FFE5E5")}
                >
                  Confirm Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <OfferDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          offer={selectedOffer}
          businessProfile={businessProfile}
        />
      </div>
    </div>
  );
};

export default BusinessOffers;
