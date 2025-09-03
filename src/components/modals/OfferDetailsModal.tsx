import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';

interface OfferDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: any;
  businessProfile: any;
}

const OfferDetailsModal = ({ open, onOpenChange, offer, businessProfile }: OfferDetailsModalProps) => {
  if (!offer) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const renderBusinessOffer = () => {
    const businessOffer = offer.business_offer;
    if (!businessOffer || !businessOffer.description) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Package className="w-4 h-4" />
          What We Offer
        </h4>
        <p className="text-sm text-muted-foreground">{businessOffer.description}</p>
      </div>
    );
  };

  const renderDeliverables = () => {
    const deliverables = offer.community_deliverables;
    if (!deliverables) return null;

    const items = [];
    if (deliverables.tagged_stories) items.push(`${deliverables.tagged_stories} Tagged Stories`);
    if (deliverables.google_reviews) items.push(`${deliverables.google_reviews} Google Reviews`);
    if (deliverables.number_of_attendees) items.push(`${deliverables.number_of_attendees} Event Attendees`);
    if (deliverables.professional_photography) items.push('Professional Photography');
    if (deliverables.professional_reel_video) items.push('Professional Reel/Video');
    if (deliverables.ugc_content) items.push('UGC Content Creation');
    if (deliverables.collab_reel_post) items.push('Collaborative Reel/Post');
    if (deliverables.group_picture) items.push('Group Picture');
    if (deliverables.loyalty_signups) items.push(`${deliverables.loyalty_signups} Loyalty Sign-ups`);
    if (deliverables.minimum_consumption) items.push(`Minimum €${deliverables.minimum_consumption} Consumption`);

    if (items.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          What We Need
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={businessProfile?.profile_photo} />
              <AvatarFallback>{businessProfile?.name?.[0] || 'B'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{offer.title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {businessProfile?.name} • {businessProfile?.business_type}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Image */}
          {offer.offer_photo && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={offer.offer_photo}
                alt={offer.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Status and Categories */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={offer.status === 'published' ? 'default' : 'secondary'}>
              {offer.status === 'published' ? 'Active' : offer.status}
            </Badge>
            {offer.categories && Array.isArray(offer.categories) && offer.categories.map((category: string, index: number) => (
              <Badge key={index} variant="outline">{category}</Badge>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{offer.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timeline */}
            {offer.timeline_days && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{offer.timeline_days} days timeline</span>
              </div>
            )}

            {/* Location */}
            {offer.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{offer.address}</span>
              </div>
            )}

            {/* Availability Start */}
            {offer.availability_start && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Starts: {formatDate(offer.availability_start)}</span>
              </div>
            )}

            {/* Availability End */}
            {offer.availability_end && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Ends: {formatDate(offer.availability_end)}</span>
              </div>
            )}
          </div>

          {/* Business Offer */}
          {renderBusinessOffer()}

          {/* Community Deliverables */}
          {renderDeliverables()}

          {/* Business Profile Details */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold text-sm">About {businessProfile?.name}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {businessProfile?.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {businessProfile.city}
                </div>
              )}
              {businessProfile?.website && (
                <a 
                  href={businessProfile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Website
                </a>
              )}
              {businessProfile?.instagram && (
                <a 
                  href={`https://instagram.com/${businessProfile.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDetailsModal;