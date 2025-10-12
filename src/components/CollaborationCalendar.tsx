import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales: { 'en-US': enUS },
});

type CalendarEventType = 
  | 'collab_request_draft' 
  | 'collab_request_published' 
  | 'collab_request_closed'
  | 'collaboration_scheduled'
  | 'collaboration_completed'
  | 'application_pending'
  | 'application_accepted'
  | 'application_declined';

interface CollabCalendarEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  type: CalendarEventType;
  status?: string;
  id: string;
  participantId?: string;
  participantName?: string;
}

interface CollaborationCalendarProps {
  userType: 'business' | 'community';
}

const CollaborationCalendar: React.FC<CollaborationCalendarProps> = ({ userType }) => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<CollabCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'collab_requests' | 'collaborations' | 'applications'>('all');
  const [filterParticipant, setFilterParticipant] = useState<string>('all');
  const [participants, setParticipants] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (profile?.id) {
      fetchCalendarData();
    }
  }, [profile?.id, filterType, filterParticipant]);

  const fetchCalendarData = async () => {
    if (!profile) return;
    
    setLoading(true);
    const allEvents: CollabCalendarEvent[] = [];
    const participantSet = new Set<string>();

    try {
      // Fetch Collab Requests (created by user)
      if (filterType === 'all' || filterType === 'collab_requests') {
        const { data: requests } = await supabase
          .from('collab_opportunities')
          .select('*')
          .eq('creator_profile_id', profile.id)
          .eq('creator_profile_type', userType);

        requests?.forEach((req) => {
          const eventDate = req.availability_start 
            ? new Date(req.availability_start) 
            : new Date(req.created_at);
          
          allEvents.push({
            id: req.id,
            title: `${req.status.toUpperCase()}: ${req.title}`,
            start: eventDate,
            end: req.availability_end ? new Date(req.availability_end) : eventDate,
            type: `collab_request_${req.status}` as CalendarEventType,
            status: req.status,
          });
        });
      }

      // Fetch Collaborations (where user is participant)
      if (filterType === 'all' || filterType === 'collaborations') {
        const { data: collabs } = await supabase
          .from('collaborations')
          .select(`
            *,
            business_profile:business_profiles!business_profile_id(profile_id, name),
            community_profile:community_profiles!community_profile_id(profile_id, name)
          `)
          .or(`creator_profile_id.eq.${profile.id},applicant_profile_id.eq.${profile.id}`);

        collabs?.forEach((collab: any) => {
          const otherParticipantName = collab.creator_profile_id === profile.id
            ? (collab.community_profile?.name || collab.business_profile?.name || 'Unknown')
            : (collab.business_profile?.name || collab.community_profile?.name || 'Unknown');
          
          const otherParticipantId = collab.creator_profile_id === profile.id
            ? collab.applicant_profile_id
            : collab.creator_profile_id;

          participantSet.add(JSON.stringify({ id: otherParticipantId, name: otherParticipantName }));

          if (filterParticipant === 'all' || filterParticipant === otherParticipantId) {
            const eventDate = collab.scheduled_date 
              ? new Date(collab.scheduled_date) 
              : new Date(collab.created_at);

            allEvents.push({
              id: collab.id,
              title: `Collab: ${otherParticipantName}`,
              start: eventDate,
              end: eventDate,
              type: `collaboration_${collab.status}` as CalendarEventType,
              status: collab.status,
              participantId: otherParticipantId,
              participantName: otherParticipantName,
            });
          }
        });
      }

      // Fetch Applications (sent by community OR received by business)
      if (filterType === 'all' || filterType === 'applications') {
        let applicationsQuery = supabase
          .from('applications')
          .select(`
            *,
            collab_opportunities!collab_opportunity_id(id, title, creator_profile_id),
            community_profile:community_profiles!community_profile_id(profile_id, name)
          `);

        if (userType === 'community') {
          applicationsQuery = applicationsQuery.eq('applicant_profile_id', profile.id);
        } else {
          // For business, we need to filter by creator_profile_id in the collab_opportunities
          const { data: myOpportunities } = await supabase
            .from('collab_opportunities')
            .select('id')
            .eq('creator_profile_id', profile.id);
          
          const opportunityIds = myOpportunities?.map(o => o.id) || [];
          if (opportunityIds.length > 0) {
            applicationsQuery = applicationsQuery.in('collab_opportunity_id', opportunityIds);
          } else {
            // Skip query if no opportunities exist
            applicationsQuery = applicationsQuery.eq('collab_opportunity_id', '00000000-0000-0000-0000-000000000000');
          }
        }

        const { data: apps } = await applicationsQuery;

        apps?.forEach((app: any) => {
          const participantName = app.community_profile?.name || 'Unknown';
          const participantId = app.applicant_profile_id;

          participantSet.add(JSON.stringify({ id: participantId, name: participantName }));

          if (filterParticipant === 'all' || filterParticipant === participantId) {
            allEvents.push({
              id: app.id,
              title: `Application: ${app.collab_opportunities?.title || 'Unknown'}`,
              start: new Date(app.created_at),
              end: new Date(app.created_at),
              type: `application_${app.status}` as CalendarEventType,
              status: app.status,
              participantId,
              participantName,
            });
          }
        });
      }

      setEvents(allEvents);
      setParticipants(Array.from(participantSet).map(p => JSON.parse(p)));
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event: CollabCalendarEvent) => {
    const colorMap: Record<CalendarEventType, string> = {
      collab_request_draft: '#9CA3AF',
      collab_request_published: '#3B82F6',
      collab_request_closed: '#6B7280',
      collaboration_scheduled: '#10B981',
      collaboration_completed: '#059669',
      application_pending: '#F59E0B',
      application_accepted: '#22C55E',
      application_declined: '#EF4444',
    };

    return {
      style: {
        backgroundColor: colorMap[event.type] || '#6B7280',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration Calendar</CardTitle>
        <CardDescription>
          View all your collaboration activities in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="collab_requests">Collab Requests</SelectItem>
              <SelectItem value="collaborations">Collaborations</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterParticipant} onValueChange={setFilterParticipant}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by collaborator" />
            </SelectTrigger>
            <SelectContent>
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
        <div className="flex flex-wrap gap-2">
          <Badge style={{ backgroundColor: '#9CA3AF' }} className="text-white">Draft</Badge>
          <Badge style={{ backgroundColor: '#3B82F6' }} className="text-white">Published</Badge>
          <Badge style={{ backgroundColor: '#10B981' }} className="text-white">Scheduled</Badge>
          <Badge style={{ backgroundColor: '#059669' }} className="text-white">Completed</Badge>
          <Badge style={{ backgroundColor: '#F59E0B' }} className="text-white">Pending App</Badge>
          <Badge style={{ backgroundColor: '#22C55E' }} className="text-white">Accepted</Badge>
          <Badge style={{ backgroundColor: '#EF4444' }} className="text-white">Declined</Badge>
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="h-[600px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        ) : (
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              defaultView="month"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaborationCalendar;
