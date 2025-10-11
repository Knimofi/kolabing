import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, CheckCircle, XCircle, Calendar, MessageSquare, Instagram, Globe, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AcceptApplicationModal } from "@/components/modals/AcceptApplicationModal";

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
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchApplications();
    }
  }, [profile]);

  const fetchApplications = async () => {
    if (!profile) return;

    try {
      // Fetch business profile for contact info
      const { data: bizProfile } = await supabase
        .from("business_profiles")
        .select("instagram")
        .eq("profile_id", profile.id)
        .single();

      if (bizProfile) {
        setBusinessProfile({
          instagram: bizProfile.instagram,
          email: profile.email,
        });
      }

      const { data: applicationsData, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          collab_opportunities!inner(
            id,
            title,
            description,
            creator_profile_id,
            creator_profile_type
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
        `,
        )
        .eq("collab_opportunities.creator_profile_id", profile.id)
        .eq("collab_opportunities.creator_profile_type", "business")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApplications(applicationsData || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (communityProfile: any) => {
    setSelectedCommunityProfile(communityProfile);
    setShowProfileModal(true);
  };

  const handleShowAcceptModal = (application: any) => {
    setApplicationToAccept(application);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async (scheduledDate: Date, contactMethods: any) => {
    if (!applicationToAccept) return;
    setIsAccepting(true);
    try {
      const { data, error } = await supabase.rpc("accept_application", {
        p_application_id: applicationToAccept.id,
      });

      if (error) throw error;

      // Update the collaboration with scheduled date and contact methods
      const { error: updateError } = await supabase
        .from("collaborations")
        .update({
          scheduled_date: scheduledDate.toISOString(),
          contact_methods: contactMethods,
        })
        .eq("id", data);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Application accepted! Collaboration has been created.",
      });

      setApplications(
        applications.filter(
          (app) =>
            app.collab_opportunity_id !== applicationToAccept.collab_opportunity_id ||
            app.id === applicationToAccept.id,
        ),
      );

      setShowAcceptModal(false);
      setApplicationToAccept(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineApplication = async (application: any) => {
    setProcessingApplication(application.id);
    try {
      const { error } = await supabase.from("applications").update({ status: "declined" }).eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Application Declined",
        description: "The application has been declined.",
      });

      setApplications(applications.filter((app) => app.id !== application.id));
      setApplicationToDecline(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to decline application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingApplication(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      accepted: { variant: "default" as const, label: "Accepted" },
      declined: { variant: "destructive" as const, label: "Declined" },
      withdrawn: { variant: "outline" as const, label: "Withdrawn" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Group applications by opportunity
  const applicationsByOpportunity = applications.reduce(
    (acc, app) => {
      const oppId = app.collab_opportunities.id;
      if (!acc[oppId]) {
        acc[oppId] = {
          opportunity: app.collab_opportunities,
          applications: [],
        };
      }
      acc[oppId].applications.push(app);
      return acc;
    },
    {} as Record<string, { opportunity: any; applications: any[] }>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Applications Received</h1>
        <p className="text-muted-foreground">Review and manage applications for your collaboration opportunities</p>
      </div>

      {Object.keys(applicationsByOpportunity).length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No pending applications</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                When communities apply to your collaboration opportunities, they'll appear here for review.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(applicationsByOpportunity).map(([oppId, oppData]) => {
            const { opportunity, applications: oppApplications } = oppData as { opportunity: any; applications: any[] };
            return (
              <Card key={oppId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{opportunity.title}</span>
                    <Badge variant="outline">
                      {oppApplications.length} {oppApplications.length === 1 ? "Application" : "Applications"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{opportunity.description.substring(0, 150)}...</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {oppApplications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 space-y-3">
                        {/* Community Profile Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={application.community_profiles.profile_photo} />
                              <AvatarFallback>{application.community_profiles.name?.[0] || "C"}</AvatarFallback>
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
                            Applied {format(new Date(application.created_at), "MMM d, yyyy")}
                          </div>

                          {application.availability &&
                            (() => {
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
                                          • {format(new Date(dateItem.date), "MMM dd, yyyy")} • {dateItem.start_time} -{" "}
                                          {dateItem.end_time}
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
                            onClick={() => handleShowAcceptModal(application)}
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
                  <AvatarFallback className="text-lg">{selectedCommunityProfile.name?.[0] || "C"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCommunityProfile.name}</h3>
                  <p className="text-muted-foreground">{selectedCommunityProfile.community_type}</p>
                  {selectedCommunityProfile.city && (
                    <p className="text-sm text-muted-foreground">{selectedCommunityProfile.city}</p>
                  )}
                </div>
              </div>
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
                    <Instagram className="w-4 h-4" />@{selectedCommunityProfile.instagram}
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Accept Application Modal */}
      {applicationToAccept && businessProfile && (
        <AcceptApplicationModal
          open={showAcceptModal}
          onOpenChange={(open) => {
            setShowAcceptModal(open);
            if (!open) setApplicationToAccept(null);
          }}
          application={applicationToAccept}
          onConfirm={handleConfirmAccept}
          isSubmitting={isAccepting}
          businessProfile={businessProfile}
        />
      )}

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
              {processingApplication === applicationToDecline?.id ? "Processing..." : "Decline Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessApplications;
