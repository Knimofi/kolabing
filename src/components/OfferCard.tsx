import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface OfferCardProps {
  offer: any;
  businessProfile: any;
  showActions?: boolean;
  onSeeDetails?: () => void;
  onApply?: () => void;
}

const OfferCard = ({ offer, businessProfile, showActions = true, onSeeDetails, onApply }: OfferCardProps) => {
  const formatAvailability = () => {
    if (!offer.availability_start && !offer.availability_end) return null;
    if (offer.availability_start && offer.availability_end) {
      const start = new Date(offer.availability_start);
      const end = new Date(offer.availability_end);
      return `${format(start, 'MMM d')}–${format(end, 'd')}`;
    }
    if (offer.availability_start) return `From ${format(new Date(offer.availability_start), 'MMM d')}`;
    return null;
  };

  const getOfferImage = () => {
    if (!offer.offer_photo) return businessProfile?.profile_photo || '/placeholder.svg';
    const { data: { publicUrl } } = supabase.storage.from('offers').getPublicUrl(offer.offer_photo);
    return publicUrl;
  };

  return (
    <Card className="group h-full transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{businessProfile?.business_type || 'Business'}</span>
            <span>•</span>
            <span>{businessProfile?.city || 'Location'}</span>
          </div>
          <Avatar className="w-6 h-6">
            <AvatarImage src={businessProfile?.profile_photo} />
            <AvatarFallback>{businessProfile?.name?.[0] || 'B'}</AvatarFallback>
          </Avatar>
        </div>

        {/* Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-muted aspect-video">
          <img
            src={getOfferImage()}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          {formatAvailability() && (
            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
              {formatAvailability()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{offer.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{offer.description}</p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t">
            <Button variant="outline" size="sm" className="flex-1" onClick={onSeeDetails}>
              See Details
            </Button>
            <Button size="sm" className="flex-1" onClick={onApply}>
              Apply
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferCard;
