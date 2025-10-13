import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Font/style constants
const DARKER_GROTESQUE = {
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 400,
  color: "#000",
};
const OPEN_SANS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  color: "#000",
};
const RUBIK_BOLD = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  color: "#000",
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales: { "en-US": enUS },
});

// Event colors to match your screenshot
const colorMap = {
  collab_request_draft: "#F65F5A", // red
  collab_request_published: "#FFD861", // yellow
  collab_request_closed: "#FFA264", // orange
  collaboration_scheduled: "#31C4D1", // cyan
  collaboration_completed: "#47C66A", // green
  application_pending: "#F7B2DE", // pink
  application_accepted: "#47C66A", // green
  application_declined: "#C9D8FC", // light blue
};

function CollaborationCalendar({ userType }) {
  const { profile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterParticipant, setFilterParticipant] = useState("all");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (profile?.id) {
      fetchCalendarData();
    }
    // eslint-disable-next-line
  }, [profile?.id, filterType, filterParticipant]);

  const fetchCalendarData = async () => {
    setLoading(true);
    const allEvents = [];
    const participantSet = new Set();

    try {
      // Collab Requests (created by this user)
      if (filterType === "all" || filterType === "collab_requests") {
        const { data: requests } = await supabase
          .from("collab_opportunities")
          .select("*")
          .eq("creator_profile_id", profile.id)
          .eq("creator_profile_type", userType);

        requests?.forEach((req) => {
          const eventDate = req.availability_start ? new Date(req.availability_start) : new Date(req.created_at);
          allEvents.push({
            id: req.id,
            title: `${req.status?.toUpperCase?.() || "REQ"}: ${req.title}`,
            start: eventDate,
            end: req.availability_end ? new Date(req.availability_end) : eventDate,
            type: `collab_request_${req.status}`,
            status: req.status,
          });
        });
      }

      // Collaborations (where this user is creator or applicant)
      if (filterType === "all" || filterType === "collaborations") {
        const { data: collabs } = await supabase
          .from("collaborations")
          .select(
            "*, business_profile:business_profiles!business_profile_id(profile_id, name), community_profile:community_profiles!community_profile_id(profile_id, name)",
          )
          .or(`creator_profile_id.eq.${profile.id},applicant_profile_id.eq.${profile.id}`);

        collabs?.forEach((collab) => {
          const otherParticipantName =
            collab.creator_profile_id === profile.id
              ? collab.community_profile?.name || collab.business_profile?.name || "Unknown"
              : collab.business_profile?.name || collab.community_profile?.name || "Unknown";
          const otherParticipantId =
            collab.creator_profile_id === profile.id ? collab.applicant_profile_id : collab.creator_profile_id;

          participantSet.add(JSON.stringify({ id: otherParticipantId, name: otherParticipantName }));

          if (filterParticipant === "all" || filterParticipant === otherParticipantId) {
            const eventDate = collab.scheduled_date ? new Date(collab.scheduled_date) : new Date(collab.created_at);
            allEvents.push({
              id: collab.id,
              title: `Collab: ${otherParticipantName}`,
              start: eventDate,
              end: eventDate,
              type: `collaboration_${collab.status}`,
              status: collab.status,
              participantId: otherParticipantId,
              participantName: otherParticipantName,
            });
          }
        });
      }

      // Applications (sent or received)
      if (filterType === "all" || filterType === "applications") {
        let applicationsQuery = supabase
          .from("applications")
          .select(
            "*, collab_opportunities!collab_opportunity_id(id, title, creator_profile_id), community_profile:community_profiles!community_profile_id(profile_id, name)",
          );

        if (userType === "community") {
          applicationsQuery = applicationsQuery.eq("applicant_profile_id", profile.id);
        } else {
          // For business, filter by creator_profile_id in related opportunities
          const { data: myOpportunities } = await supabase
            .from("collab_opportunities")
            .select("id")
            .eq("creator_profile_id", profile.id);
          const opportunityIds = myOpportunities?.map((o) => o.id) || [];
          if (opportunityIds.length > 0) {
            applicationsQuery = applicationsQuery.in("collab_opportunity_id", opportunityIds);
          } else {
            applicationsQuery = applicationsQuery.eq("collab_opportunity_id", "00000000-0000-0000-0000-000000000000");
          }
        }

        const { data: apps } = await applicationsQuery;

        apps?.forEach((app) => {
          const participantName = app.community_profile?.name || "Unknown";
          const participantId = app.applicant_profile_id;

          participantSet.add(JSON.stringify({ id: participantId, name: participantName }));

          if (filterParticipant === "all" || filterParticipant === participantId) {
            allEvents.push({
              id: app.id,
              title: `Application: ${app.collab_opportunities?.title || "Unknown"}`,
              start: new Date(app.created_at),
              end: new Date(app.created_at),
              type: `application_${app.status}`,
              status: app.status,
              participantId,
              participantName,
            });
          }
        });
      }

      setEvents(allEvents);
      setParticipants(Array.from(participantSet).map((p) => JSON.parse(p as string)));
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: colorMap[event.type] || "#fff",
      color: "#000",
      borderRadius: "7px",
      opacity: 0.95,
      border: "none",
      fontFamily: "'Open Sans', Arial, sans-serif",
      fontWeight: "bold",
      fontSize: "16px",
    },
  });

  return (
    <Card className="bg-white border-[#eee]">
      <CardHeader>
        <CardTitle
          style={{
            ...RUBIK_BOLD,
            fontSize: 26,
          }}
        >
          Business Dashboard
        </CardTitle>
        <CardDescription
          style={{
            ...OPEN_SANS,
            fontSize: 16,
            textTransform: "none",
          }}
        >
          View all your collaboration activities in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters - Darker Grotesque, uppercase, light */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger
              style={{
                ...DARKER_GROTESQUE,
                background: "#fff",
                border: "1px solid #BBB",
              }}
              className="w-full md:w-[200px]"
            >
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent style={DARKER_GROTESQUE}>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="collab_requests">Collab Requests</SelectItem>
              <SelectItem value="collaborations">Collaborations</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterParticipant} onValueChange={setFilterParticipant}>
            <SelectTrigger
              style={{
                ...DARKER_GROTESQUE,
                background: "#fff",
                border: "1px solid #BBB",
              }}
              className="w-full md:w-[200px]"
            >
              <SelectValue placeholder="Filter by collaborator" />
            </SelectTrigger>
            <SelectContent style={DARKER_GROTESQUE}>
              <SelectItem value="all">All Collaborators</SelectItem>
              {participants.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legend - Darker Grotesque, event colors, always black text */}
        <div className="flex flex-wrap gap-2 pt-2 pb-2">
          <Badge style={{ backgroundColor: "#F65F5A", color: "#000", ...DARKER_GROTESQUE }}>Draft</Badge>
          <Badge style={{ backgroundColor: "#FFD861", color: "#000", ...DARKER_GROTESQUE }}>Published</Badge>
          <Badge style={{ backgroundColor: "#FFA264", color: "#000", ...DARKER_GROTESQUE }}>Closed</Badge>
          <Badge style={{ backgroundColor: "#31C4D1", color: "#000", ...DARKER_GROTESQUE }}>Scheduled</Badge>
          <Badge style={{ backgroundColor: "#47C66A", color: "#000", ...DARKER_GROTESQUE }}>Completed</Badge>
          <Badge style={{ backgroundColor: "#F7B2DE", color: "#000", ...DARKER_GROTESQUE }}>Pending App</Badge>
          <Badge style={{ backgroundColor: "#22C55E", color: "#000", ...DARKER_GROTESQUE }}>Accepted</Badge>
          <Badge style={{ backgroundColor: "#C9D8FC", color: "#000", ...DARKER_GROTESQUE }}>Declined</Badge>
        </div>

        {/* Calendar block */}
        <div className="bg-white rounded-lg border mt-4" style={{ boxShadow: "none" }}>
          {loading ? (
            <div className="h-[600px] flex items-center justify-center">
              <p style={OPEN_SANS}>Loading calendar...</p>
            </div>
          ) : (
            <div
              style={{
                background: "#fff",
                color: "#000",
                height: "600px",
                borderRadius: "10px",
                border: "1px solid #eee",
                fontFamily: "'Open Sans', Arial, sans-serif",
              }}
            >
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "100%",
                  background: "#fff",
                  color: "#000",
                  fontFamily: "'Open Sans', Arial, sans-serif",
                }}
                eventPropGetter={eventStyleGetter}
                views={["month", "week", "day"]}
                defaultView="month"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export default CollaborationCalendar;
