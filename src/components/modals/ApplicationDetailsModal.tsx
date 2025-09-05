import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MapPin, Calendar, Globe, Instagram } from 'lucide-react';

interface ApplicationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  open,
  onOpenChange,
  application
}) => {
  if (!application) return null;

  const { offers, message, availability, status, created_at } = application;
  const businessProfile = offers.business_profiles;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Status */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Application Status</h3>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Applied on {format(new Date(created_at), 'MMMM dd, yyyy')}
              </span>
            </div>
          </div>

          {/* Offer Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Offer Applied To</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-xl">{offers.title}</h4>
              <p className="text-muted-foreground">{offers.description}</p>
              
              {/* Categories */}
              {offers.categories && Array.isArray(offers.categories) && offers.categories.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Categories: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {offers.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {offers.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {offers.address}
                </div>
              )}

              {/* Timeline */}
              {offers.timeline_days && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {offers.timeline_days} days timeline
                </div>
              )}
            </div>
          </div>

          {/* Application Message */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Application</h3>
            <div className="space-y-3">
              {availability && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Availability:</span>
                  <p className="mt-1">{availability}</p>
                </div>
              )}
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">Message:</span>
                <p className="mt-1 whitespace-pre-wrap">{message}</p>
              </div>
            </div>
          </div>

          {/* Business Profile */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Business Information</h3>
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage 
                  src={businessProfile?.profile_photo || undefined} 
                  alt={businessProfile?.name || 'Business'} 
                />
                <AvatarFallback>
                  {businessProfile?.name?.charAt(0) || 'B'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <h4 className="font-medium text-lg">{businessProfile?.name}</h4>
                {businessProfile?.business_type && (
                  <p className="text-sm text-muted-foreground">{businessProfile.business_type}</p>
                )}
                {businessProfile?.city && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {businessProfile.city}
                  </div>
                )}
                
                <div className="flex gap-3">
                  {businessProfile?.website && (
                    <a 
                      href={businessProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Globe className="w-3 h-3" />
                      Website
                    </a>
                  )}
                  {businessProfile?.instagram && (
                    <a 
                      href={`https://instagram.com/${businessProfile.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Instagram className="w-3 h-3" />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsModal;