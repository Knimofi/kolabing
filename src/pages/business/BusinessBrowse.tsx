import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OfferCard from "@/components/OfferCard";
import OfferDetailsModal from "@/components/modals/OfferDetailsModal";
import ApplyOfferModal from "@/components/modals/ApplyOfferModal";

const RUBIK_BOLD_TITLE = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#1A1A1A",
  letterSpacing: "0.03em",
  fontSize: 30,
  margin: "0 0 8px 0",
};

const OPEN_SANS_SUBTITLE = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 15,
  color: "#4A4A4A",
  letterSpacing: 0,
  textTransform: "none",
  margin: 0,
};

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
  const [inputState, setInputState] = useState<"normal" | "hover" | "focus">("normal");

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
          id,
          title,
          description,
          status,
          published_at,
          availability_start,
          availability_end,
          offer_photo,
          business_offer,
          community_deliverables,
          categories,
          address,
          timeline_days,
          creator_profile_id,
          creator_profile_type
        `,
        )
        .eq("status", "published")
        .eq("creator_profile_type", "community")
        .order("published_at", { ascending: false });

      if (offersError) {
        console.error("Supabase error fetching offers:", offersError);
        toast({
          title: "Error",
          description: "Failed to load collab requests. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Fetch community profiles
      const communityIds = [...new Set((offersData || []).map((o) => o.creator_profile_id))];
      const { data: communityProfilesData } = await supabase
        .from("community_profiles")
        .select("profile_id, name, community_type, city, profile_photo, website, instagram")
        .in("profile_id", communityIds);

      // Map for quick lookup
      const communityProfilesMap = new Map(
        (communityProfilesData || []).map((cp) => [cp.profile_id, { ...cp, profile_type: "community" }]),
      );

      // Enrich offers with creator profiles
      const enrichedOffers = (offersData || []).map((offer) => {
        const creatorProfile = communityProfilesMap.get(offer.creator_profile_id);

        return {
          ...offer,
          creator_profile: creatorProfile || null,
        };
      });

      // Filter out offers without creator profiles
      const validOffers = enrichedOffers.filter((offer) => offer.creator_profile);

      setOffers(validOffers);
    } catch (error: any) {
      console.error("Unexpected error fetching offers:", error);
      toast({
        title: "Error",
        description: "Failed to load collab requests. Please try again.",
        variant: "destructive",
      });
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
      // Check for duplicate applications first
      const { data: existingApplication, error: checkError } = await supabase
        .from("applications")
        .select("id")
        .eq("collab_opportunity_id", selectedOffer.id)
        .eq("applicant_profile_id", profile.id)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }
      if (existingApplication) {
        toast({
          title: "Error",
          description: "You already applied to this collab request!",
        });
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

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      fetchOffers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      throw error;
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

  let borderColor = "#ECECEC";
  let borderWidth = "1.5px";
  if (inputState === "hover") {
    borderColor = "#CCCCCC";
    borderWidth = "1.5px";
  }
  if (inputState === "focus") {
    borderColor = "#BBBBBB";
    borderWidth = "2px";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 style={RUBIK_BOLD_TITLE}>FIND A COLLAB</h1>
          <p style={OPEN_SANS_SUBTITLE}>Discover collaboration opportunities from communities</p>
        </div>
        {/* Search */}
        <div className="my-4">
          <div className="relative flex-1 w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search collabs by title, community, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 py-2 text-base focus:ring-0 focus:outline-none"
              style={{
                borderRadius: "7px",
                border: `${borderWidth} solid ${borderColor}`,
                fontFamily: "'Open Sans', Arial, sans-serif",
                background: "#FAFAFB",
                boxShadow: "none",
                outline: "none",
                transition: "border-color 0.13s, border-width 0.13s",
              }}
              onFocus={() => setInputState("focus")}
              onBlur={() => setInputState("normal")}
              onMouseEnter={() => inputState !== "focus" && setInputState("hover")}
              onMouseLeave={() => inputState !== "focus" && setInputState("normal")}
            />
          </div>
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
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                creatorProfile={offer.creator_profile}
                showActions={true}
                onSeeDetails={() => handleSeeDetails(offer)}
                onApply={() => handleApply(offer)}
              />
            ))}
          </div>
        )}
        {/* Modals */}
        <OfferDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          offer={selectedOffer}
          creatorProfile={selectedOffer?.creator_profile}
        />
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
