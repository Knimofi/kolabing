import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { ContactInfoCard } from '@/components/ContactInfoCard';

interface CollaborationCardProps {
  collaboration: {
    id: string;
    created_at: string;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
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
  onStatusUpdate: (status: 'completed' | 'cancelled') => void;
  onOpenFeedbackModal?: (collaborationId: string) => void;
  userType: 'business' | 'community';
}

const CollaborationCard = ({ collaboration, onView, onStatusUpdate, onOpenFeedbackModal, userType }: CollaborationCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const partner = userType === 'business' ? collaboration.community_profile : collaboration.business_profile;
  const partnerType = userType === 'business' ? 'Community' : 'Business';

  let photoUrl = '/placeholder.svg';
  if (collaboration.offer.offer_photo) {
    if (collaboration.offer.offer_photo.startsWith('http')) {
      photoUrl = collaboration.offer.offer_photo;
    } else {
      photoUrl = `https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/public/offer-photos/${collaboration.offer.offer_photo}`;
    }
  }

  return (
    <Card className="group h-full transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{partnerType}</span>
            <span>•</span>
            <span>{partner?.city || 'Location'}</span>
          </div>
          <Avatar className="w-6 h-6">
            <AvatarImage src={partner?.profile_photo} />
            <AvatarFallback className="text-xs">
              {partner?.name?.[0] || partnerType[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Cover Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-muted aspect-video">
          <img
            src={photoUrl}
            alt={collaboration.offer.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
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
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {collaboration.offer.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>With {partner?.name || `${partnerType} Partner`}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Started: {format(new Date(collaboration.created_at), 'MMM d, yyyy')}
          </div>
        </div>

      {/* Contact Info for Community Users */}
      {userType === 'community' && (
        <ContactInfoCard 
          scheduledDate={collaboration.scheduled_date}
          contactMethods={collaboration.contact_methods}
          isCommunityView={true}
        />
      )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onView}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          {(collaboration.status === 'scheduled' || collaboration.status === 'active') && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  onStatusUpdate('completed');
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
                onClick={() => onStatusUpdate('cancelled')}
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