import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface Application {
  id: string;
  message: string;
  availability: string;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  created_at: string;
  collab_opportunities: {
    title: string;
    business_profiles?: {
      name: string;
    };
    community_profiles?: {
      name: string;
    };
  };
}

interface ApplicationCardProps {
  application: Application;
  onView: () => void;
  onWithdraw: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onView, onWithdraw }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canWithdraw = application.status === "pending";

  let preferredDates = null;
  try {
    if (application.availability) {
      const parsed = JSON.parse(application.availability);
      preferredDates = parsed.preferred_dates;
    }
  } catch (e) {
    // Not JSON, ignore
  }

  return (
    <Card
      className="h-full flex flex-col"
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #EBEBEB",
        boxShadow: "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)",
      }}
    >
      <CardHeader>
        <CardTitle
          className="text-lg font-bold line-clamp-2"
          style={{
            color: "#232323",
            fontFamily: "'Rubik', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          {application.collab_opportunities.title}
        </CardTitle>
        <div className="space-y-2">
          <p
            className="text-sm"
            style={{
              color: "#474954",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Applied to:{" "}
            {application.collab_opportunities.business_profiles?.name ||
              application.collab_opportunities.community_profiles?.name}
          </p>
          <p
            className="text-sm"
            style={{
              color: "#474954",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Sent: {format(new Date(application.created_at), "MMM dd, yyyy")}
          </p>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
          {preferredDates && preferredDates.length > 0 && (
            <div className="pt-2 space-y-1">
              <p
                className="text-xs font-medium flex items-center gap-1"
                style={{
                  color: "#232323",
                  fontWeight: 500,
                }}
              >
                <Calendar className="w-3 h-3" />
                Preferred Dates:
              </p>
              {preferredDates.map((dateItem: any, index: number) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 pl-4"
                  style={{
                    color: "#65676A",
                  }}
                >
                  <Clock className="w-3 h-3" />
                  {format(new Date(dateItem.date), "MMM dd, yyyy")} • {dateItem.start_time} - {dateItem.end_time}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onView} className="flex-1">
            View
          </Button>
          {canWithdraw && (
            <Button variant="destructive" onClick={onWithdraw} className="flex-1">
              Withdraw
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
