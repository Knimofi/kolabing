import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, CheckCircle, XCircle, Calendar, MessageSquare, Users, Instagram, Globe, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const BusinessApplications = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunityProfile, setSelectedCommunityProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [applicationToAccept, setApplicationToAccept] = useState<any>(null);
  const [applicationToDecline, setApplicationToDecline] = useState<any>(null);
  const [processingApplication, setProcessingApplication] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchApplications();
    }
  }, [profile]);

  const fetchApplications = async () => {
    if (!profile) return;

    try {
      const { data: applicationsData, error } = await supabase
        .from('applications')
        .select(`
          *,
          offers!inner(
            id,
            title,
            description,
            business_profile_id
          ),
          community_profiles!inner(
            profile_id,
            name,
            community_type,
            city,
            profile_photo,
            website,
            instagram,
            tiktok
          )
        `)
        .eq('offers.business_profile_id', profile.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(applicationsData || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (communityProfile: any) => {
    setSelectedCommunityProfile(communityProfile);
    setShowProfileModal(true);
  };

  const handleAcceptApplication = async (application: any) => {
    setProcessingApplication(application.id);
    try {
      const { data, error } = await supabase.rpc('accept_application', {
        p_application_id: application.id
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Application accepted! Collaboration has been created.',
      });

      // Remove from pending applications list
      setApplications(applications.filter(app => 
        app.offer_id !== application.offer_id || app.id === application.id
      ));
      setApplicationToAccept(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to accept application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingApplication(null);
    }
  };

  const handleDeclineApplication = async (application: any) => {
    setProcessingApplication(application.id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'declined' })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: 'Application Declined',
        description: 'The application has been declined.',
      });

      // Remove from list
      setApplications(applications.filter(app => app.id !== application.id));
      setApplicationToDecline(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to decline application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingApplication(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      accepted: { variant: 'default' as const, label: 'Accepted' },
      declined: { variant: 'destructive' as const, label: 'Declined' },
      withdrawn: { variant: 'outline' as const, label: 'Withdrawn' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  // Group applications by offer
  const applicationsByOffer = applications.reduce((acc, app) => {
    const offerId = app.offers.id;
    if (!acc[offerId]) {
      acc[offerId] = {
        offer: app.offers,
        applications: []
      };
    }
    acc[offerId].applications.push(app);
    return acc;
  }, {} as Record<string, { offer: any; applications: any[] }>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Review Applications
        </h1>
        <p className="text-muted-foreground">
          Review and manage applications for your collaboration offers
        </p>
      </div>

      {/* Applications by Offer */}
      {Object.keys(applicationsByOffer).length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No pending applications
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When communities apply to your offers, they'll appear here for review.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(applicationsByOffer).map(([offerId, offerData]) => {
            const { offer, applications: offerApplications } = offerData as { offer: any; applications: any[] };
            return (
              <Card key={offerId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{offer.title}</span>
                    <Badge variant="outline">
                      {offerApplications.length} {offerApplications.length === 1 ? 'Application' : 'Applications'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {offer.description.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offerApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 space-y-3">
                      {/* Community Profile Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={application.community_profiles.profile_photo} />
                            <AvatarFallback>
                              {application.community_profiles.name?.[0] || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{application.community_profiles.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {application.community_profiles.community_type} • {application.community_profiles.city}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      {/* Application Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Applied {format(new Date(application.created_at), 'MMM d, yyyy')}
                        </div>
                        
                        {application.availability && (() => {
                          try {
                            const parsed = JSON.parse(application.availability);
                            if (parsed.preferred_dates && parsed.preferred_dates.length > 0) {
                              return (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Preferred Dates:
                                  </p>
                                  {parsed.preferred_dates.map((dateItem: any, index: number) => (
                                    <div key={index} className="text-sm text-muted-foreground pl-6">
                                      • {format(new Date(dateItem.date), 'MMM dd, yyyy')} • {dateItem.start_time} - {dateItem.end_time}
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          } catch (e) {
                            // Not JSON, show as plain text
                            return (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                Availability: {application.availability}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Application Message */}
                      <div className="bg-muted/50 p-3 rounded text-sm">
                        <p className="font-medium mb-1">Application Message:</p>
                        <p className="text-muted-foreground">{application.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(application.community_profiles)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setApplicationToAccept(application)}
                          disabled={processingApplication === application.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setApplicationToDecline(application)}
                          disabled={processingApplication === application.id}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Community Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Community Profile</DialogTitle>
          </DialogHeader>
          {selectedCommunityProfile && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedCommunityProfile.profile_photo} />
                  <AvatarFallback className="text-lg">
                    {selectedCommunityProfile.name?.[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCommunityProfile.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedCommunityProfile.community_type}
                  </p>
                  {selectedCommunityProfile.city && (
                    <p className="text-sm text-muted-foreground">{selectedCommunityProfile.city}</p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                {selectedCommunityProfile.website && (
                  <a
                    href={selectedCommunityProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {selectedCommunityProfile.instagram && (
                  <a
                    href={`https://instagram.com/${selectedCommunityProfile.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Instagram className="w-4 h-4" />
                    @{selectedCommunityProfile.instagram}
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Accept Application Dialog */}
      <AlertDialog open={!!applicationToAccept} onOpenChange={() => setApplicationToAccept(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this application from {applicationToAccept?.community_profiles.name}? 
              This will create a collaboration and decline all other applications for this offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAcceptApplication(applicationToAccept)}
              disabled={processingApplication === applicationToAccept?.id}
            >
              {processingApplication === applicationToAccept?.id ? 'Processing...' : 'Accept Application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Application Dialog */}
      <AlertDialog open={!!applicationToDecline} onOpenChange={() => setApplicationToDecline(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this application from {applicationToDecline?.community_profiles.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeclineApplication(applicationToDecline)}
              disabled={processingApplication === applicationToDecline?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processingApplication === applicationToDecline?.id ? 'Processing...' : 'Decline Application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessApplications;