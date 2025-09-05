import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Application {
  id: string;
  message: string;
  availability: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  created_at: string;
  offers: {
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {application.offers.title}
        </CardTitle>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Applied to: {application.offers.business_profiles.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Sent: {format(new Date(application.created_at), 'MMM dd, yyyy')}
          </p>
          <Badge className={getStatusColor(application.status)}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
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