import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { ContactInfoCard } from "@/components/ContactInfoCard";

interface CollaborationCardProps {
  collaboration: {
    id: string;
    created_at: string;
    status: "scheduled" | "active" | "completed" | "cancelled";
    scheduled_date?: string;
    contact_methods?: {
      whatsapp?: string;
      instagram?: string;
      email?: string;
    };
    offer: {
      id: string;
      title: string;
      description: string;
      offer_photo?: string;
    };
    business_profile?: {
      name?: string;
      business_type?: string;
      city?: string;
      profile_photo?: string;
    };
    community_profile?: {
      name?: string;
      community_type?: string;
      city?: string;
      profile_photo?: string;
    };
  };
  onView: () => void;
  onStatusUpdate: (status: "completed" | "cancelled") => void;
  onOpenFeedbackModal?: (collaborationId: string) => void;
  userType: "business" | "community";
}

const CollaborationCard = ({
  collaboration,
  onView,
  onStatusUpdate,
  onOpenFeedbackModal,
  userType,
}: CollaborationCardProps) => {
  const getStatusColor = (status: string) => {
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
      className="group h-full flex flex-col"
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #EBEBEB",
        boxShadow: "0 1.5px 8px 0 rgba(55,73,87,0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)",
      }}
    >
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: "#65676A", fontWeight: 500 }}>
            <span>{partnerType}</span>
            <span>•</span>
            <span>{partner?.city || "Location"}</span>
          </div>
          <Avatar className="w-6 h-6">
            <AvatarImage src={partner?.profile_photo} />
            <AvatarFallback className="text-xs">{partner?.name?.[0] || partnerType[0]}</AvatarFallback>
          </Avatar>
        </div>

        {/* Cover Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-muted aspect-video">
          <img
            src={photoUrl}
            alt={collaboration.offer.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute bottom-2 left-2">
            <Badge className={getStatusColor(collaboration.status)}>
              {collaboration.status.charAt(0).toUpperCase() + collaboration.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          <h3
            className="text-lg font-bold line-clamp-2"
            style={{
              color: "#181A20",
              fontFamily: "'Open Sans', Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
          >
            {collaboration.offer.title}
          </h3>

          <div className="flex items-center gap-2 text-sm" style={{ color: "#474954", fontWeight: 500 }}>
            <span>With {partner?.name || `${partnerType} Partner`}</span>
          </div>

          <div className="text-sm" style={{ color: "#474954", fontWeight: 500 }}>
            Started: {format(new Date(collaboration.created_at), "MMM d, yyyy")}
          </div>
        </div>

        {/* Info/Acceptance box with soft yellow */}
        {collaboration.status === "scheduled" && (
          <div
            style={{
              background: "#FFF6D8",
              borderRadius: "14px",
              boxShadow: "0 2px 10px 0 rgba(255,170,0,0.04)",
              color: "#232323",
              padding: "1.1rem 1rem 1rem 1.2rem",
              margin: "1rem 0 0.2rem 0",
              fontWeight: 500,
              fontSize: 16,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontWeight: 700 }}>
              <span style={{ marginRight: 6 }}>✨</span>Your collab has been accepted!
            </span>
            <span style={{ color: "#474954", fontWeight: 400, fontSize: 15 }}>
              Now it's time for you to contact the business. Here's their contact information:
            </span>
            {/* Additional scheduled event info can go here */}
            {collaboration.scheduled_date && (
              <div
                style={{
                  background: "#181A20",
                  color: "#FFF6D8",
                  borderRadius: 10,
                  padding: "8px 12px",
                  marginTop: 8,
                  display: "inline-block",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 0.01,
                }}
              >
                Scheduled For <br />
                {format(new Date(collaboration.scheduled_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </div>
            )}
          </div>
        )}

        {/* Contact Info for Community Users */}
        {userType === "community" && (
          <ContactInfoCard
            scheduledDate={collaboration.scheduled_date}
            contactMethods={collaboration.contact_methods}
            isCommunityView={true}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 mt-auto">
          <Button
            onClick={onView}
            className="flex-1 min-w-[120px]"
            style={{
              background: "#FFF8E1",
              color: "#181A20",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 1.5px 4px 0 rgba(55, 73, 87, 0.11)",
            }}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          {(collaboration.status === "scheduled" || collaboration.status === "active") && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-[100px]"
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
                className="flex-1 min-w-[100px]"
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
