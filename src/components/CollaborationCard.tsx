import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { ContactInfoCard } from "@/components/ContactInfoCard";

const getStatusColor = (status) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CollaborationCard = ({ collaboration, onView, onStatusUpdate, onOpenFeedbackModal, userType }) => {
  const partner = userType === "business" ? collaboration.community_profile : collaboration.business_profile;
  const partnerType = userType === "business" ? "Community" : "Business";

  let photoUrl = "/placeholder.svg";
  if (collaboration.offer.offer_photo) {
    if (collaboration.offer.offer_photo.startsWith("http")) {
      photoUrl = collaboration.offer.offer_photo;
    } else {
      photoUrl = `https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/public/offer-photos/${collaboration.offer.offer_photo}`;
    }
  }

  return (
    <Card
      className="h-full flex flex-col"
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #EBEBEB",
        boxShadow: "0 1.5px 8px 0 rgba(55,73,87,0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)",
        minHeight: 0,
      }}
    >
      <CardContent className="p-3 flex flex-col gap-2 h-full">
        {/* Header: Tighter, avatar left */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={partner?.profile_photo} />
              <AvatarFallback className="text-xs">{partner?.name?.[0] || partnerType[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium" style={{ color: "#65676A" }}>
              {partnerType} · {partner?.city || "Location"}
            </span>
          </div>
          <Badge className={getStatusColor(collaboration.status)}>
            {collaboration.status.charAt(0).toUpperCase() + collaboration.status.slice(1)}
          </Badge>
        </div>

        {/* Photo */}
        <div className="relative rounded overflow-hidden bg-muted" style={{ height: "92px" }}>
          <img
            src={photoUrl}
            alt={collaboration.offer.title}
            className="object-cover w-full h-full"
            style={{ minHeight: 0, maxHeight: 92 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Main Section */}
        <div className="flex flex-col gap-1" style={{ flexGrow: 1 }}>
          {/* Title, much smaller and single-line clamp */}
          <h3
            className="text-base font-semibold truncate"
            style={{
              color: "#181A20",
              fontFamily: "'Open Sans', Arial, sans-serif",
              letterSpacing: "0.01em",
              marginBottom: 1,
            }}
          >
            {collaboration.offer.title}
          </h3>

          <div className="text-xs font-medium text-muted-foreground truncate" style={{ color: "#474954" }}>
            With {partner?.name || `${partnerType} Partner`}
          </div>
          <div className="text-xs" style={{ color: "#474954" }}>
            {format(new Date(collaboration.created_at), "MMM d, yyyy")}
          </div>
        </div>

        {/* Scheduled info, even more compressed */}
        {collaboration.status === "scheduled" && (
          <div
            style={{
              background: "#FFF6D8",
              borderRadius: "10px",
              color: "#232323",
              fontWeight: 500,
              fontSize: 13,
              padding: "0.8rem",
              margin: "4px 0",
              lineHeight: 1.3,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>✨ Accepted!</span>
            {collaboration.scheduled_date && (
              <div
                style={{
                  background: "#181A20",
                  color: "#FFF6D8",
                  borderRadius: 8,
                  padding: "4px 8px",
                  marginTop: 6,
                  display: "inline-block",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {format(new Date(collaboration.scheduled_date), "EEE, MMM d, yyyy · h:mm a")}
              </div>
            )}
          </div>
        )}

        {/* Contact Info: show only if community user & scheduled */}
        {userType === "community" && (
          <ContactInfoCard
            scheduledDate={collaboration.scheduled_date}
            contactMethods={collaboration.contact_methods}
            isCommunityView={true}
          />
        )}

        {/* Actions: tightly wrapped, minimal gap, smaller, end-aligned */}
        <div className="flex flex-wrap gap-1 pt-2 mt-auto">
          <Button
            onClick={onView}
            className="flex-1 min-w-[80px] text-xs"
            size="sm"
            style={{
              background: "#FFF8E1",
              color: "#181A20",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              padding: "3px 0.5em",
              minHeight: "28px",
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {(collaboration.status === "scheduled" || collaboration.status === "active") && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-[80px] text-xs"
                style={{ minHeight: "28px" }}
                onClick={() => {
                  onStatusUpdate("completed");
                  if (onOpenFeedbackModal) {
                    setTimeout(() => onOpenFeedbackModal(collaboration.id), 500);
                  }
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 min-w-[80px] text-xs"
                style={{ minHeight: "28px" }}
                onClick={() => onStatusUpdate("cancelled")}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationCard;
