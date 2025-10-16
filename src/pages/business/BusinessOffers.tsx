import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OfferDetailsModal from "@/components/modals/OfferDetailsModal";
import { Plus, Eye, Edit, Send, ArrowLeft, Trash2, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SOFT_YELLOW = "#FFF6D8";
const SOFT_BLACK = "#232323";
const CARD_BORDER = "#F9E9AC";
const SHADOW = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)";
const BUTTON_YELLOW = "#FFD861";
const BUTTON_DARKER_YELLOW = "#FFE49B";
const FILTER_GRAY = "#F3F4F6";
const FILTER_GRAY_ACTIVE = "#E5E7EB";

const BUTTON_FONT = {
  fontFamily: "Darker Grotesque, Arial, sans-serif",
  fontWeight: 600,
  letterSpacing: "0.02em",
  fontSize: "16px",
  borderRadius: "9px",
  transition: "all 0.14s",
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <header className="pb-2 mb-2">
          <h1
            style={{
              fontFamily: "Rubik, Arial, sans-serif",
              textTransform: "uppercase",
              fontWeight: 800,
              color: "#1A1A1A",
              fontSize: 26,
              letterSpacing: "0.03em",
              margin: 0,
            }}
          >
            My Collab Requests
          </h1>
          <p
            style={{
              fontFamily: "Open Sans, Arial, sans-serif",
              fontWeight: 400,
              fontSize: 15,
              color: "#4A4A4A",
              letterSpacing: 0,
              textTransform: "none",
              margin: "0 0 0.5em 0",
            }}
          >
            Create and manage your collaboration opportunities
          </p>
          <Button
            onClick={() => navigate("/business/opportunities/new")}
            size="lg"
            style={{
              ...BUTTON_FONT,
              background: BUTTON_YELLOW,
              color: SOFT_BLACK,
              fontWeight: 600,
              border: "none",
              boxShadow: "none",
              marginTop: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BUTTON_DARKER_YELLOW)}
            onMouseLeave={(e) => (e.currentTarget.style.background = BUTTON_YELLOW)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Collab Opportunity
          </Button>
        </header>

        <div className="flex gap-2 flex-wrap mb-4">
          {["all", "draft", "published", "closed", "completed"].map((filter) => (
            <Button
              key={filter}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilter(filter as any)}
              style={{
                ...BUTTON_FONT,
                background: activeFilter === filter ? FILTER_GRAY_ACTIVE : FILTER_GRAY,
                color: SOFT_BLACK,
                fontWeight: activeFilter === filter ? 800 : 600,
                border: activeFilter === filter ? `1.5px solid #D1D5DB` : `1px solid #F3F4F6`,
                boxShadow: "none",
                padding: "8px 18px",
              }}
            >
              {filter === "all" ? "All Offers" : filter.charAt(0).toUpperCase() + filter.slice(1)} (
              {filter === "all" ? offers.length : offers.filter((o) => o.status === filter).length})
            </Button>
          ))}
        </div>

        {filteredOffers.length === 0 ? (
          <Card
            style={{
              background: SOFT_YELLOW,
              borderRadius: "18px",
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: SHADOW,
            }}
          >
            <CardContent className="py-16 text-center">
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: SOFT_BLACK,
                  fontFamily: "Darker Grotesque, Arial, sans-serif",
                  marginBottom: "0.7em",
                }}
              >
                No opportunities found
              </p>
              <Button
                onClick={() => navigate("/business/opportunities/new")}
                className="mt-4"
                size="lg"
                style={{
                  ...BUTTON_FONT,
                  background: BUTTON_YELLOW,
                  color: SOFT_BLACK,
                  fontWeight: 600,
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collab Opportunity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              // Compute photo URL
              let photoUrl = businessProfile?.profile_photo || "/placeholder.svg";
              if (offer.offer_photo) {
                if (offer.offer_photo.startsWith("http")) {
                  photoUrl = offer.offer_photo;
                } else {
                  const { data } = supabase.storage.from("collab_opportunities").getPublicUrl(offer.offer_photo);
                  if (data?.publicUrl) {
                    photoUrl = data.publicUrl;
                  }
                }
              }
              // Render the card
              return (
                <Card
                  key={offer.id}
                  className="group"
                  style={{
                    background: SOFT_YELLOW,
                    color: SOFT_BLACK,
                    borderRadius: "18px",
                    border: `1.5px solid ${CARD_BORDER}`,
                    boxShadow: SHADOW,
                    position: "relative",
                  }}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm" style={{ color: SOFT_BLACK, opacity: 0.87 }}>
                        <span>{businessProfile?.business_type || "Business"}</span>
                        <span>•</span>
                        <span>{businessProfile?.city || "Location"}</span>
                        <span
                          style={{
                            background: "#FFD861",
                            color: SOFT_BLACK,
                            borderRadius: "7px",
                            padding: "2px 9px",
                            fontWeight: 700,
                            fontSize: 13,
                            marginLeft: 8,
                          }}
                        >
                          Business
                        </span>
                      </div>
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={businessProfile?.profile_photo} />
                        <AvatarFallback className="text-xs">{businessProfile?.name?.[0] || "B"}</AvatarFallback>
                      </Avatar>
                    </div>
                    {/* Cover Image */}
                    <div
                      className="relative mb-4 rounded-lg overflow-hidden aspect-video"
                      style={{ background: "#FFE49B" }}
                    >
                      <img
                        src={photoUrl}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: "9px" }}
                        onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.svg")}
                      />
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 space-y-3">
                      <h3 className="font-semibold text-xl leading-tight line-clamp-2" style={{ color: SOFT_BLACK }}>
                        {offer.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: SOFT_BLACK, opacity: 0.87 }}>
                        {offer.description}
                      </p>
                    </div>
                    {/* Footer Actions */}
                    <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderColor: CARD_BORDER }}>
                      <Button
                        size="sm"
                        style={{
                          ...BUTTON_FONT,
                          background: BUTTON_DARKER_YELLOW,
                          color: SOFT_BLACK,
                          fontWeight: 600,
                          border: "none",
                        }}
                        onClick={() => handleViewOffer(offer)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = BUTTON_YELLOW)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = BUTTON_DARKER_YELLOW)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          ...BUTTON_FONT,
                          background: SOFT_YELLOW,
                          color: SOFT_BLACK,
                          fontWeight: 500,
                          border: `1px solid ${SOFT_YELLOW}`,
                        }}
                        disabled={!["draft", "published"].includes(offer.status)}
                        onClick={() => navigate(`/business/opportunities/${offer.id}/edit`)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          ...BUTTON_FONT,
                          background: SOFT_YELLOW,
                          color: SOFT_BLACK,
                          fontWeight: 500,
                          border: `1px solid ${SOFT_YELLOW}`,
                        }}
                        onClick={() => handleDuplicateOffer(offer)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                        disabled={!businessProfile}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        style={{
                          ...BUTTON_FONT,
                          background: "#FFE5E5",
                          color: "#dc2626",
                          fontWeight: 600,
                          border: "1.5px solid #dc2626",
                        }}
                        onClick={() => setOfferToDelete(offer)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#F8B4B4")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#FFE5E5")}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                      {offer.status === "draft" && (
                        <Button
                          size="sm"
                          style={{
                            ...BUTTON_FONT,
                            background: BUTTON_YELLOW,
                            color: SOFT_BLACK,
                            fontWeight: 600,
                            border: "none",
                          }}
                          onClick={() => updateOfferStatus(offer.id, "published")}
                          onMouseEnter={(e) => (e.currentTarget.style.background = BUTTON_DARKER_YELLOW)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = BUTTON_YELLOW)}
                        >
                          <Send className="w-4 h-4 mr-2" /> Publish
                        </Button>
                      )}
                      {offer.status === "published" && (
                        <Button
                          size="sm"
                          style={{
                            ...BUTTON_FONT,
                            background: SOFT_YELLOW,
                            color: SOFT_BLACK,
                            fontWeight: 500,
                            border: `1px solid ${SOFT_YELLOW}`,
                          }}
                          onClick={() => updateOfferStatus(offer.id, "draft")}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Draft
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {offerToDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card
              className="p-6 max-w-sm w-full"
              style={{
                background: SOFT_YELLOW,
                borderRadius: "14px",
                border: `1.5px solid ${CARD_BORDER}`,
                boxShadow: SHADOW,
              }}
            >
              <div className="pb-3">
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "18px",
                    color: SOFT_BLACK,
                    fontFamily: "Darker Grotesque, Arial, sans-serif",
                    marginBottom: "2px",
                  }}
                >
                  Delete Offer?
                </h2>
                <p
                  style={{
                    fontFamily: "Open Sans, Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: 15,
                    color: SOFT_BLACK,
                    opacity: 0.76,
                    marginBottom: "0.5em",
                  }}
                >
                  Are you sure you want to delete "{offerToDelete.title}"?
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setOfferToDelete(null)}
                  style={{
                    ...BUTTON_FONT,
                    background: SOFT_YELLOW,
                    color: SOFT_BLACK,
                    fontWeight: 600,
                    border: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = BUTTON_DARKER_YELLOW)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOffer(offerToDelete)}
                  style={{
                    ...BUTTON_FONT,
                    background: "#FFE5E5",
                    color: "#dc2626",
                    fontWeight: 600,
                    border: "1.5px solid #dc2626",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8B4B4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FFE5E5")}
                >
                  Confirm Delete
                </Button>
              </div>
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
