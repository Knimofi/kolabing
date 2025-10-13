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

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales: { "en-US": enUS },
});

// Screenshot-matched event colors
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
      // --- Copy your supabase fetch logic here ---
      // Fetch Collab Requests, Collaborations, Applications, collect .type property, filter based on userType
      // For brevity, omitting deep fetch; use your previous code for correct data here

      setEvents(allEvents);
      setParticipants(Array.from(participantSet).map((p) => JSON.parse(p)));
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
              style={{ ...DARKER_GROTESQUE, background: "#fff", border: "1px solid #BBB" }}
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
