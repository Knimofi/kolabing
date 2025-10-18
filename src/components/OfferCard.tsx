// src/components/OfferCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    availability_start?: string;
    availability_end?: string;
    offer_photo?: string;
    business_offer: { description: string };
    community_deliverables: {
      tagged_stories?: number;
      google_reviews?: number;
      number_of_attendees?: number;
      professional_photography?: boolean;
      professional_reel_video?: boolean;
      ugc_content?: boolean;
      collab_reel_post?: boolean;
      group_picture?: boolean;
      loyalty_signups?: number;
      minimum_consumption?: number;
    };
  };
  creatorProfile?: {
    name?: string;
    business_type?: string;
    community_type?: string;
    city?: string;
    profile_photo?: string;
    profile_type?: string;
  };
  businessProfile?: {
    name?: string;
    business_type?: string;
    city?: string;
    profile_photo?: string;
  };
  showActions?: boolean;
  onSeeDetails?: () => void;
  onApply?: () => void;
}

const SOFT_YELLOW = "#FFF6D8";
const SOFT_BLACK = "#232323";
const CARD_BORDER = "#F9E9AC";
const SHADOW = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)";
const BUTTON_YELLOW = "#FFD861";

const OfferCard = ({
  offer,
  creatorProfile,
  businessProfile,
  showActions = true,
  onSeeDetails,
  onApply,
}: OfferCardProps) => {
  const profile = creatorProfile || businessProfile;
  const formatAvailability = () => {
    if (!offer.availability_start && !offer.availability_end) return null;
    if (offer.availability_start && offer.availability_end) {
      const start = new Date(offer.availability_start);
      const end = new Date(offer.availability_end);
      return `${format(start, "MMM d")}–${format(end, "d")}`;
    }
    if (offer.availability_start) {
      return `From ${format(new Date(offer.availability_start), "MMM d")}`;
    }
    return null;
  };

  // WHAT THEY OFFER SECTION
  const renderBusinessOffer = () => (
    <div className="mb-1">
      <div className="font-semibold text-sm" style={{ color: SOFT_BLACK }}>
        What they offer
      </div>
      <div className="flex items-center gap-2 text-sm" style={{ color: SOFT_BLACK, opacity: 0.85 }}>
        <span>🎁</span>
        <span className="truncate">{offer.business_offer.description}</span>
      </div>
    </div>
  );
  // WHAT THEY ARE LOOKING FOR SECTION
  const renderDeliverables = () => {
    const deliverables: string[] = [];
    const d = offer.community_deliverables;
    if (d.tagged_stories) deliverables.push(`📲 ${d.tagged_stories} Stories`);
    if (d.google_reviews) deliverables.push(`⭐ ${d.google_reviews} Reviews`);
    if (d.number_of_attendees) deliverables.push(`👥 ${d.number_of_attendees} Attendees`);
    if (d.professional_photography) deliverables.push("📸 Photography");
    if (d.professional_reel_video) deliverables.push("🎥 Reel/Video");
    if (d.ugc_content) deliverables.push("✍️ UGC Content");
    if (d.collab_reel_post) deliverables.push("🤝 Collab Post");
    if (d.group_picture) deliverables.push("🖼️ Group Picture");
    if (d.loyalty_signups) deliverables.push(`📝 ${d.loyalty_signups} Sign-ups`);
    if (d.minimum_consumption) deliverables.push(`💶 Min. €${d.minimum_consumption}`);
    return (
      <>
        <div className="font-semibold text-sm mt-2" style={{ color: SOFT_BLACK }}>
          What they're looking for
        </div>
        <div className="flex flex-wrap gap-1 text-sm" style={{ color: SOFT_BLACK, opacity: 0.85 }}>
          {deliverables.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item}</span>
              {index < deliverables.length - 1 && <span>•</span>}
            </React.Fragment>
          ))}
        </div>
      </>
    );
  };

  const truncateDescription = (text: string, maxLines = 2) => {
    const words = text.split(" ");
    const approximateWordsPerLine = 8;
    const maxWords = maxLines * approximateWordsPerLine;
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  let photoUrl = profile?.profile_photo || "/placeholder.svg";
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

  const displayType =
    creatorProfile?.business_type || creatorProfile?.community_type || businessProfile?.business_type || "Creator";
  const displayBadge = creatorProfile?.profile_type === "community" ? "Community" : "Business";

  return (
    <Card
      className="group h-full transition-all duration-200 hover:scale-[1.03] hover:shadow-xl"
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
            <span>{displayType}</span>
            <span>•</span>
            <span>{profile?.city || "Location"}</span>
          </div>
          <Avatar className="w-6 h-6">
            <AvatarImage src={profile?.profile_photo} />
            <AvatarFallback className="text-xs">{profile?.name?.[0] || "C"}</AvatarFallback>
          </Avatar>
        </div>
        {/* Cover Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden aspect-video" style={{ background: "#FFE49B" }}>
          <img
            src={photoUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
            style={{ borderRadius: "9px" }}
          />
          {formatAvailability() && (
            <div
              className="absolute bottom-2 left-2 bg-white/85 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium"
              style={{ color: SOFT_BLACK }}
            >
              {formatAvailability()}
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-xl leading-tight line-clamp-2" style={{ color: SOFT_BLACK }}>
            {offer.title}
          </h3>
          {renderBusinessOffer()}
          {renderDeliverables()}
          <p className="text-sm leading-relaxed" style={{ color: SOFT_BLACK, opacity: 0.87 }}>
            {truncateDescription(offer.description)}
          </p>
        </div>
        {/* Footer Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderColor: CARD_BORDER }}>
            {onSeeDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                style={{
                  background: SOFT_YELLOW,
                  color: SOFT_BLACK,
                  fontWeight: 500,
                  border: `1px solid ${SOFT_YELLOW}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FFE49B")}
                onMouseLeave={(e) => (e.currentTarget.style.background = SOFT_YELLOW)}
                onClick={onSeeDetails}
              >
                See Details
              </Button>
            )}
            {onApply && (
              <Button
                size="sm"
                className="flex-1"
                style={{
                  background: BUTTON_YELLOW,
                  color: SOFT_BLACK,
                  fontWeight: 600,
                  boxShadow: "none",
                }}
                onClick={onApply}
              >
                Apply
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferCard;
