import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Clock, Package, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import FeedbackSummary from '@/components/FeedbackSummary';
import { ContactInfoCard } from '@/components/ContactInfoCard';

interface CollaborationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboration: any;
  onStatusUpdate: (status: 'completed' | 'cancelled') => void;
  onOpenFeedbackModal?: (collaborationId: string) => void;
  userType: 'business' | 'community';
  currentUserProfileId?: string;
}

const CollaborationDetailsModal = ({ 
  open, 
  onOpenChange, 
  collaboration, 
  onStatusUpdate,
  onOpenFeedbackModal,
  userType,
  currentUserProfileId
}: CollaborationDetailsModalProps) => {
  const [userSurvey, setUserSurvey] = useState<any>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<any>(null);
  const [loadingSurveys, setLoadingSurveys] = useState(false);

  useEffect(() => {
    if (open && collaboration?.id && collaboration.status === 'completed') {
      fetchSurveys();
    }
  }, [open, collaboration?.id, collaboration?.status]);

  const fetchSurveys = async () => {
    if (!collaboration?.id || !currentUserProfileId) return;
    
    setLoadingSurveys(true);
    try {
      const partnerProfileId = userType === 'business' 
        ? collaboration.community_profile_id 
        : collaboration.business_profile_id;

      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('collaboration_id', collaboration.id);

      if (error) throw error;

      const user = data?.find(s => s.filled_by_profile_id === currentUserProfileId);
      const partner = data?.find(s => s.filled_by_profile_id === partnerProfileId);

      setUserSurvey(user || null);
      setPartnerSurvey(partner || null);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoadingSurveys(false);
    }
  };

  if (!collaboration) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const partner = userType === 'business' ? collaboration.community_profile : collaboration.business_profile;
  const partnerType = userType === 'business' ? 'Community' : 'Business';

  const renderBusinessOffer = () => {
    const businessOffer = collaboration.offer.business_offer;
    if (!businessOffer || !businessOffer.description) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Package className="w-4 h-4" />
          What's Offered
        </h4>
        <p className="text-sm text-muted-foreground">{businessOffer.description}</p>
      </div>
    );
  };

  const renderDeliverables = () => {
    const deliverables = collaboration.offer.community_deliverables;
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
          Expected Deliverables
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
              <AvatarImage src={partner?.profile_photo} />
              <AvatarFallback>{partner?.name?.[0] || partnerType[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{collaboration.offer.title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                With {partner?.name || `${partnerType} Partner`}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cover Image */}
          {collaboration.offer.offer_photo && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={collaboration.offer.offer_photo.startsWith('http') 
                  ? collaboration.offer.offer_photo 
                  : `https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/public/offer-photos/${collaboration.offer.offer_photo}`
                }
                alt={collaboration.offer.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          )}

          {/* Status and Timeline */}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className={getStatusColor(collaboration.status)}>
              {collaboration.status.charAt(0).toUpperCase() + collaboration.status.slice(1)}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Started: {formatDate(collaboration.created_at)}</span>
            </div>
            {collaboration.completed_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Completed: {formatDate(collaboration.completed_at)}</span>
              </div>
            )}
          </div>

          {/* Contact Info for Community Users */}
          {userType === 'community' && (
            <ContactInfoCard 
              scheduledDate={collaboration.scheduled_date}
              contactMethods={collaboration.contact_methods}
              isCommunityView={true}
            />
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Collaboration Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{collaboration.offer.description}</p>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaboration.offer.timeline_days && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{collaboration.offer.timeline_days} days timeline</span>
              </div>
            )}

            {collaboration.offer.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{collaboration.offer.address}</span>
              </div>
            )}
          </div>

          {/* Business Offer */}
          {renderBusinessOffer()}

          {/* Community Deliverables */}
          {renderDeliverables()}

          {/* Original Application Details */}
          {collaboration.applications && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-sm">Original Application</h4>
              {(() => {
                try {
                  const availability = collaboration.applications.availability;
                  if (availability) {
                    const parsed = JSON.parse(availability);
                    const preferredDates = parsed.preferred_dates || [];
                    
                    if (preferredDates.length > 0) {
                      return (
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-2">Proposed Dates:</h5>
                          <div className="space-y-2">
                            {preferredDates.map((dateOption: any, index: number) => (
                              <div key={index} className="text-sm p-2 bg-muted/50 rounded border">
                                <div className="font-medium">
                                  {format(new Date(dateOption.date), "EEEE, MMMM d, yyyy")}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {dateOption.start_time} - {dateOption.end_time}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  }
                } catch (e) {
                  // If not JSON, show as text
                  if (collaboration.applications.availability) {
                    return (
                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground mb-1">Availability:</h5>
                        <p className="text-sm">{collaboration.applications.availability}</p>
                      </div>
                    );
                  }
                }
              })()}
              {collaboration.applications.message && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground mb-1">Message:</h5>
                  <p className="text-sm whitespace-pre-wrap">{collaboration.applications.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Partner Profile Details */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold text-sm">About {partner?.name}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {partner?.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {partner.city}
                </div>
              )}
              {partner?.website && (
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Website
                </a>
              )}
              {partner?.instagram && (
                <a 
                  href={`https://instagram.com/${partner.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          {collaboration.status === 'completed' && (
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-semibold text-sm">Collaboration Feedback</h4>
              {loadingSurveys ? (
                <p className="text-sm text-muted-foreground">Loading feedback...</p>
              ) : (
                <div className="space-y-4">
                  {/* Your Feedback */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium">Your Feedback</h5>
                      {userSurvey?.submitted_at ? (
                        <Badge variant="default" className="bg-green-600">
                          ✓ Feedback Sent
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          🟠 Pending Feedback
                        </Badge>
                      )}
                    </div>
                    {userSurvey?.submitted_at ? (
                      <FeedbackSummary 
                        surveys={[userSurvey]} 
                        userType={userType}
                        isUserFeedback={true}
                      />
                    ) : (
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                          You haven't submitted feedback yet
                        </p>
                        {onOpenFeedbackModal && (
                          <Button
                            size="sm"
                            onClick={() => {
                              onOpenFeedbackModal(collaboration.id);
                              onOpenChange(false);
                            }}
                          >
                            Add Feedback
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Partner Feedback */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium">Partner's Feedback</h5>
                      {partnerSurvey?.submitted_at ? (
                        <Badge variant="default" className="bg-green-600">
                          ✓ Feedback Received
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          🟠 Pending
                        </Badge>
                      )}
                    </div>
                    {partnerSurvey?.submitted_at ? (
                      <FeedbackSummary 
                        surveys={[partnerSurvey]} 
                        userType={userType === 'business' ? 'community' : 'business'}
                        isUserFeedback={false}
                      />
                    ) : (
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Partner hasn't submitted feedback yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {(collaboration.status === 'scheduled' || collaboration.status === 'active') && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  onStatusUpdate('completed');
                  onOpenChange(false);
                  if (onOpenFeedbackModal) {
                    setTimeout(() => onOpenFeedbackModal(collaboration.id), 500);
                  }
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Collaboration
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => {
                  onStatusUpdate('cancelled');
                  onOpenChange(false);
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Collaboration
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationDetailsModal;