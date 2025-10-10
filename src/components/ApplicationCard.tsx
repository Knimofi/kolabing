import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface Application {
  id: string;
  message: string;
  availability: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  created_at: string;
  collab_opportunities: {
    title: string;
    business_profiles: {
      name: string;
    };
  };
}

interface ApplicationCardProps {
  application: Application;
  onView: () => void;
  onWithdraw: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onView, 
  onWithdraw 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canWithdraw = application.status === 'pending';

  // Parse preferred dates if available
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {application.collab_opportunities.title}
        </CardTitle>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Applied to: {application.collab_opportunities.business_profiles.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Sent: {format(new Date(application.created_at), 'MMM dd, yyyy')}
          </p>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
          
          {/* Show Preferred Dates */}
          {preferredDates && preferredDates.length > 0 && (
            <div className="pt-2 space-y-1">
              <p className="text-xs font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Preferred Dates:
              </p>
              {preferredDates.map((dateItem: any, index: number) => (
                <div key={index} className="text-xs text-muted-foreground flex items-center gap-1 pl-4">
                  <Clock className="w-3 h-3" />
                  {format(new Date(dateItem.date), 'MMM dd, yyyy')} • {dateItem.start_time} - {dateItem.end_time}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="mt-auto">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onView}
            className="flex-1"
          >
            View
          </Button>
          {canWithdraw && (
            <Button
              variant="destructive"
              onClick={onWithdraw}
              className="flex-1"
            >
              Withdraw
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;