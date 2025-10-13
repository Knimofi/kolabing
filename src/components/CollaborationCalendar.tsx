import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
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
  textTransform: "uppercase",
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
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#000",
};

const STATUS_COLORS = {
  discussions: "#31C4D1", // blue
  scheduled: "#FFD861", // yellow
  completed: "#FFA264", // orange
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales: { "en-US": enUS },
});

function classifyStatus(event) {
  // Draft/published/closed requests & pending apps = 'discussions'
  if (
    event.type.startsWith("collab_request_draft") ||
    event.type.startsWith("collab_request_published") ||
    event.type.startsWith("application_pending")
  ) {
    return "discussions";
  }
  // Scheduled collaboration = 'scheduled'
  if (event.type.startsWith("collaboration_scheduled")) {
    return "scheduled";
  }
  // Completed/collab_request_closed = 'completed'
  if (event.type.startsWith("collab_request_closed") || event.type.startsWith("collaboration_completed")) {
    return "completed";
  }
  return "discussions";
}

function CollaborationCalendar({ userType }) {
  const { profile } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterParticipant, setFilterParticipant] = useState("all");
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (profile?.id) fetchCalendarData();
    // eslint-disable-next-line
  }, [profile?.id]);

  const fetchCalendarData = async () => {
    setLoading(true);
    const events = [];
    const participantSet = new Set();

    try {
      // Collab Requests
      const { data: requests } = await supabase
        .from("collab_opportunities")
        .select("*")
        .eq("creator_profile_id", profile.id)
        .eq("creator_profile_type", userType);

      requests?.forEach((req) => {
        const eventStatus = req.status?.toLowerCase();
        const displayType =
          eventStatus === "closed"
            ? "collab_request_closed"
            : eventStatus === "draft"
              ? "collab_request_draft"
              : "collab_request_published";
        const eventDate = req.availability_start ? new Date(req.availability_start) : new Date(req.created_at);
        events.push({
          id: req.id,
          collabTitle: req.title,
          collaboratorName: "", // No partner yet
          start: eventDate,
          end: req.availability_end ? new Date(req.availability_end) : eventDate,
          type: displayType,
          status: req.status,
        });
      });

      // Collaborations
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

        events.push({
          id: collab.id,
          collabTitle: collab.title || "Untitled",
          collaboratorName: otherParticipantName,
          start: collab.scheduled_date ? new Date(collab.scheduled_date) : new Date(collab.created_at),
          end: collab.scheduled_date ? new Date(collab.scheduled_date) : new Date(collab.created_at),
          type: `collaboration_${collab.status}`,
          status: collab.status,
          participantId: otherParticipantId,
          participantName: otherParticipantName,
        });
      });

      // Applications (Pending)
      let applicationsQuery = supabase
        .from("applications")
        .select(
          "*, collab_opportunities!collab_opportunity_id(id, title, creator_profile_id), community_profile:community_profiles!community_profile_id(profile_id, name)",
        );

      if (userType === "community") {
        applicationsQuery = applicationsQuery.eq("applicant_profile_id", profile.id);
      } else {
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

        events.push({
          id: app.id,
          collabTitle: app.collab_opportunities?.title || "Unknown",
          collaboratorName: participantName,
          start: new Date(app.created_at),
          end: new Date(app.created_at),
          type: `application_${app.status}`,
          status: app.status,
          participantId,
          participantName,
        });
      });

      setAllEvents(events);
      setParticipants(Array.from(participantSet).map((p) => JSON.parse(p)));
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter for dropdown status and collaborator
  const displayedEvents = allEvents.filter((e) => {
    const statusClass = classifyStatus(e);
    const statusMatch = filterStatus === "all" || filterStatus === statusClass;
    const participantMatch = filterParticipant === "all" || filterParticipant === e.participantId;
    return statusMatch && participantMatch;
  });

  // Calendar event style: color by status, Open Sans, normal weight
  const eventStyleGetter = (event) => {
    const statusClass = classifyStatus(event);
    return {
      style: {
        backgroundColor: STATUS_COLORS[statusClass] || "#fff",
        color: "#000",
        borderRadius: "7px",
        border: "none",
        fontFamily: "'Open Sans', Arial, sans-serif",
        fontWeight: 400,
        fontSize: "16px",
        opacity: 0.95,
      },
    };
  };

  return (
    <Card className="bg-white border-[#eee]">
      <CardHeader>
        <CardTitle style={{ ...RUBIK_BOLD, fontSize: 26 }}>COLLABORATIONS CALENDAR</CardTitle>
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
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              style={{
                ...DARKER_GROTESQUE,
                background: "#fff",
                border: "1px solid #BBB",
              }}
              className="w-full md:w-[200px]"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent style={DARKER_GROTESQUE}>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="discussions">Discussions</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterParticipant} onValueChange={setFilterParticipant}>
            <SelectTrigger
              style={{ ...DARKER_GROTESQUE, background: "#fff", border: "1px solid #BBB" }}
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

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2 pb-2">
          <Badge style={{ backgroundColor: "#31C4D1", color: "#000", ...DARKER_GROTESQUE }}>Discussions</Badge>
          <Badge style={{ backgroundColor: "#FFD861", color: "#000", ...DARKER_GROTESQUE }}>Scheduled</Badge>
          <Badge style={{ backgroundColor: "#FFA264", color: "#000", ...DARKER_GROTESQUE }}>Completed</Badge>
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
                events={displayedEvents.map((e) => ({
                  ...e,
                  title: `${e.collaboratorName ? e.collaboratorName + ": " : ""}${e.collabTitle || ""}`,
                }))}
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
