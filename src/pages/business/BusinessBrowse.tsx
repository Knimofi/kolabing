import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OfferDetailsModal from "@/components/modals/OfferDetailsModal";
import ApplyOfferModal from "@/components/modals/ApplyOfferModal";
import { format } from "date-fns";

const OPEN_SANS_BOLD_MAYUS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#222",
  letterSpacing: "0.03em",
  fontSize: 30,
  margin: "0 0 8px 0",
};
const OPEN_SANS_REGULAR = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  color: "#444",
  fontSize: 15,
};

const CARD_OFFER_BG = ["#FF8354", "#FFD861", "#31C4D1"];

const BusinessBrowse = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data: offersData, error: offersError } = await supabase
        .from("collab_opportunities")
        .select(
          `
          id, title, description, status, published_at, availability_start, availability_end,
          offer_photo, business_offer, community_deliverables, categories, address, timeline_days,
          creator_profile_id, creator_profile_type
        `,
        )
        .eq("status", "published")
        .eq("creator_profile_type", "community")
        .order("published_at", { ascending: false });

      if (offersError) {
        console.error("Error fetching offers:", offersError);
        toast({ title: "Error", description: "Failed to load collab requests.", variant: "destructive" });
        return;
      }

      const communityIds = [...new Set((offersData || []).map((o) => o.creator_profile_id))];
      const { data: communityProfilesData } = await supabase
        .from("community_profiles")
        .select("profile_id, name, community_type, city, profile_photo, website, instagram")
        .in("profile_id", communityIds);

      const communityProfilesMap = new Map(
        (communityProfilesData || []).map((cp) => [cp.profile_id, { ...cp, profile_type: "community" }]),
      );

      const enrichedOffers = (offersData || []).map((offer) => ({
        ...offer,
        creator_profile: communityProfilesMap.get(offer.creator_profile_id) || null,
      }));

      setOffers(enrichedOffers.filter((offer) => offer.creator_profile));
    } catch (error: any) {
      console.error("Error fetching offers:", error);
      toast({ title: "Error", description: "Failed to load collab requests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSeeDetails = (offer: any) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
  };

  const handleApply = (offer: any) => {
    setSelectedOffer(offer);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (applicationData: { availability: string; message: string }) => {
    if (!profile || !selectedOffer) return;
    setIsSubmittingApplication(true);

    try {
      const { data: existingApplication, error: checkError } = await supabase
        .from("applications")
        .select("id")
        .eq("collab_opportunity_id", selectedOffer.id)
        .eq("applicant_profile_id", profile.id)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") throw checkError;
      if (existingApplication) {
        toast({ title: "Error", description: "You already applied to this collab request!" });
        return;
      }

      const { error } = await supabase.from("applications").insert([
        {
          collab_opportunity_id: selectedOffer.id,
          applicant_profile_id: profile.id,
          community_profile_id: selectedOffer.creator_profile_id,
          applicant_profile_type: "business",
          message: applicationData.message,
          availability: applicationData.availability,
          status: "pending",
        },
      ]);

      if (error) throw error;

      toast({ title: "Success", description: "Your application has been submitted!" });
      fetchOffers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Error submitting application.", variant: "destructive" });
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (!offer.creator_profile) return false;

    const matchesSearch =
      (offer.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.creator_profile.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto py-8 px-2 md:px-4 space-y-8">
        {/* Header Section */}
        <div>
          <h1 style={OPEN_SANS_BOLD_MAYUS}>FIND A COLLAB</h1>
          <p style={OPEN_SANS_REGULAR}>Discover collaboration opportunities from communities</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search collabs by title, community, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 py-2 text-base"
            style={{
              borderRadius: "7px",
              border: "1.5px solid #ECECEC",
              fontFamily: "'Open Sans', Arial, sans-serif",
              background: "#FAFAFB",
            }}
          />
        </div>

        {/* Offers grid */}
        {filteredOffers.length === 0 ? (
          <Card
            style={{
              background: "#FFFBF0",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <CardContent className="py-16 text-center">
              <Search className="w-12 h-12 mx-auto mb-4" style={{ color: "#FFD861" }} />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#1A1A1A" }}
              >
                {offers.length === 0
                  ? "No community collab requests available yet"
                  : "No matching collab requests found"}
              </h3>
              <p
                className="mb-6 max-w-md mx-auto"
                style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}
              >
                {offers.length === 0
                  ? "New collab requests will appear here soon."
                  : "Try adjusting your search terms."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer, i) => {
              const offerBg = CARD_OFFER_BG[i % CARD_OFFER_BG.length];
              return (
                <div
                  key={offer.id}
                  style={{
                    background: offerBg,
                    borderRadius: "18px",
                    boxShadow: "0 2px 10px rgba(30,30,40,0.07)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: 15, color: "#FFF", fontFamily: "'Open Sans', Arial, sans-serif" }}>
                        {offer.categories?.[0] || "Collaboration"}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 27,
                        color: "#fff",
                        fontFamily: "'Open Sans', Arial, sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        lineHeight: 1.0,
                        marginBottom: 12,
                        marginTop: 7,
                      }}
                    >
                      {offer.title}
                    </div>
                    <div className="flex items-center" style={{ gap: "10px" }}>
                      <span
                        className="px-3 py-1 rounded-lg bg-[#222c] text-white text-xs font-semibold"
                        style={{ fontFamily: "'Open Sans', Arial, sans-serif" }}
                      >
                        {offer.availability_start
                          ? `${format(new Date(offer.availability_start), "MMM d")}${
                              offer.availability_end ? `–${format(new Date(offer.availability_end), "d")}` : ""
                            }`
                          : "Ongoing"}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex justify-between items-center px-6 py-2"
                    style={{
                      background: "#FFF9E6",
                      borderRadius: "0 0 18px 18px",
                    }}
                  >
                    <span
                      style={{
                        color: "#555",
                        fontFamily: "'Open Sans', Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {offer.creator_profile?.name}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSeeDetails(offer)}
                      style={{
                        fontFamily: "'Darker Grotesque', Arial, sans-serif",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        fontSize: 14,
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Offer Details Modal */}
        <OfferDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          offer={selectedOffer}
          creatorProfile={selectedOffer?.creator_profile}
        />

        {/* Apply Modal */}
        <ApplyOfferModal
          open={showApplyModal}
          onOpenChange={setShowApplyModal}
          offer={selectedOffer}
          businessProfile={selectedOffer?.creator_profile}
          onSubmit={handleSubmitApplication}
          isSubmitting={isSubmittingApplication}
        />
      </div>
    </div>
  );
};

export default BusinessBrowse;
