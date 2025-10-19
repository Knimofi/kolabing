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
      className="flex flex-col"
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #EBEBEB",
        boxShadow: "0 1.5px 8px 0 rgba(55,73,87,0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)",
        padding: "0.5rem 0.75rem",
      }}
    >
      <CardContent className="p-0 w-full flex flex-col gap-2">
        <div className="flex flex-row w-full gap-4 items-center">
          {/* Small Square Photo */}
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted relative">
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

          {/* Title and Details (middle section) */}
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <div className="flex items-center gap-2 text-xs" style={{ color: "#65676A", fontWeight: 500 }}>
              <span>{partnerType}</span>
              <span>•</span>
              <span>{partner?.city || "Location"}</span>
              <Avatar className="w-5 h-5 ml-2">
                <AvatarImage src={partner?.profile_photo} />
                <AvatarFallback className="text-xs">{partner?.name?.[0] || partnerType[0]}</AvatarFallback>
              </Avatar>
            </div>
            <h3
              className="text-base font-bold truncate"
              style={{
                color: "#181A20",
                fontFamily: "'Open Sans', Arial, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              {collaboration.offer.title}
            </h3>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#474954", fontWeight: 500 }}>
              <span>With {partner?.name || `${partnerType} Partner`}</span>
            </div>
            <div className="text-xs" style={{ color: "#474954", fontWeight: 500 }}>
              Started: {format(new Date(collaboration.created_at), "MMM d, yyyy")}
            </div>
          </div>

          {/* Right-side Details */}
          <div className="flex flex-col items-end min-w-[160px] max-w-[210px] ml-4">
            {/* Only for community user: acceptance box and contact info */}
            {userType === "community" && (
              <ContactInfoCard
                scheduledDate={collaboration.scheduled_date}
                contactMethods={collaboration.contact_methods}
                isCommunityView={true}
              />
            )}
          </div>
        </div>
        {/* Buttons < 1 row below all info */}
        <div className="flex flex-row flex-wrap gap-2 pt-2 border-t border-muted mt-3">
          <Button
            onClick={onView}
            className="min-w-[110px]"
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
                className="bg-green-600 hover:bg-green-700 text-white min-w-[90px]"
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
                className="min-w-[90px]"
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
