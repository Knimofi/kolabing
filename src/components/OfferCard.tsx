import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface OfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    availability_start?: string;
    availability_end?: string;
    offer_photo?: string;
    business_offer: {
      description: string;
    };
    community_deliverables: {
      tagged_stories?: number;
      google_reviews?: number;
      number_of_attendees?: number;
      professional_photography?: boolean;
      professional_reel_video?: boolean;
      ugc_content?: boolean;
      collab_reel_post?: boolean;
      group_picture?: boolean;
      loyalty_signups?: number;
      minimum_consumption?: number;
    };
  };
  businessProfile: {
    name?: string;
    business_type?: string;
    city?: string;
    profile_photo?: string;
  };
  showActions?: boolean;
  onSeeDetails?: () => void;
  onApply?: () => void;
}

// Helper to safely get Supabase public URL
const getOfferPhotoUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return supabase.storage.from('offers').getPublicUrl(path).data.publicUrl;
};

const OfferCard = ({
  offer,
  businessProfile,
  showActions = true,
  onSeeDetails,
  onApply,
}: OfferCardProps) => {
  const formatAvailability = () => {
    if (!offer.availability_start && !offer.availability_end) return null;

    if (offer.availability_start && offer.availability_end) {
      const start = new Date(offer.availability_start);
      const end = new Date(offer.availability_end);
      return `${format(start, 'MMM d')}–${format(end, 'd')}`;
    }

    if (offer.availability_start) {
      return `From ${format(new Date(offer.availability_start), 'MMM d')}`;
    }

    return null;
  };

  const renderBusinessOffer = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>🎁</span>
      <span className="truncate">{offer.business_offer.description}</span>
    </div>
  );

  const renderDeliverables = () => {
    const deliverables: string[] = [];
    const d = offer.community_deliverables;

    if (d.tagged_stories) deliverables.push(`📲 ${d.tagged_stories} Stories`);
    if (d.google_reviews) deliverables.push(`⭐ ${d.google_reviews} Reviews`);
    if (d.number_of_attendees) deliverables.push(`👥 ${d.number_of_attendees} Attendees`);
    if (d.professional_photography) deliverables.push('📸 Photography');
    if (d.professional_reel_video) deliverables.push('🎥 Reel/Video');
    if (d.ugc_content) deliverables.push('✍️ UGC Content');
    if (d.collab_reel_post) deliverables.push('🤝 Collab Post');
    if (d.group_picture) deliverables.push('🖼️ Group Picture');
    if (d.loyalty_signups) deliverables.push(`📝 ${d.loyalty_signups} Sign-ups`);
    if (d.minimum_consumption) deliverables.push(`💶 Min. €${d.minimum_consumption}`);

    return (
      <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
        {deliverables.map((item, index) => (
          <React.Fragment key={index}>
            <span>{item}</span>
            {index < deliverables.length - 1 && <span>•</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const truncateDescription = (text: string, maxLines = 2) => {
    const words = text.split(' ');
    const approximateWordsPerLine = 8;
    const maxWords = maxLines * approximateWordsPerLine;
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const photoUrl = getOfferPhotoUrl(offer.offer_photo)
    || businessProfile?.profile_photo
    || '/placeholder.svg';

  return (
    <Card className="group h-full transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{businessProfile.business_type || 'Business'}</span>
            <span>•</span>
            <span>{businessProfile.city || 'Location'}</span>
          </div>
          <Avatar className="w-6 h-6">
            <AvatarImage src={businessProfile.profile_photo} />
            <AvatarFallback className="text-xs">
              {businessProfile.name?.[0] || 'B'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Cover Image */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-muted aspect-video">
          <img
            src={photoUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          {formatAvailability() && (
            <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
              {formatAvailability()}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {offer.title}
          </h3>

          {renderBusinessOffer()}
          {renderDeliverables()}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateDescription(offer.description)}
          </p>
        </div>

        {/* Footer Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t">
            {onSeeDetails && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onSeeDetails}>
                See Details
              </Button>
            )}
            {onApply && (
              <Button size="sm" className="flex-1" onClick={onApply}>
                Apply
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferCard;

