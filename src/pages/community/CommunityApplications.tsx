import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, User, ExternalLink, Calendar, MessageSquare, Inbox } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AcceptApplicationModal } from "@/components/modals/AcceptApplicationModal";

interface BusinessProfile {
  profile_id: string;
  name: string | null;
  business_type: string | null;
  city: string | null;
  profile_photo: string | null;
  website: string | null;
  instagram: string | null;
  about: string | null;
}

interface Application {
  id: string;
  status: string;
  message: string | null;
  availability: string | null;
  created_at: string;
  collab_opportunities: {
    id: string;
    title: string;
    description: string;
  };
  business_profiles: BusinessProfile;
}

const RUBIK_BOLD = { fontFamily: 'Rubik, sans-serif', fontWeight: 700 };
const OPEN_SANS = { fontFamily: '"Open Sans", Arial, sans-serif' };

export default function CommunityApplications() {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusinessProfile, setSelectedBusinessProfile] = useState<BusinessProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [applicationToAccept, setApplicationToAccept] = useState<Application | null>(null);
  const [applicationToDecline, setApplicationToDecline] = useState<Application | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [communityProfile, setCommunityProfile] = useState<{ instagram: string | null; email: string | null }>({ instagram: null, email: null });

  useEffect(() => {
    if (profile?.id) {
      fetchApplications();
    }
  }, [profile?.id]);

  const fetchApplications = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      // Fetch community profile contact info
      const { data: communityData } = await supabase
        .from("community_profiles")
        .select("instagram")
        .eq("profile_id", profile.id)
        .single();

      setCommunityProfile({
        instagram: communityData?.instagram || null,
        email: profile.email || null,
      });

      // Step 1: Fetch applications with opportunity data
      const { data: applicationsData, error: appsError } = await supabase
        .from("applications")
        .select(`
          *,
          collab_opportunities!inner(
            id,
            title,
            description,
            creator_profile_id,
            creator_profile_type
          )
        `)
        .eq("collab_opportunities.creator_profile_id", profile.id)
        .eq("collab_opportunities.creator_profile_type", "community")
        .eq("applicant_profile_type", "business")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;

      if (!applicationsData || applicationsData.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Step 2: Extract unique business profile IDs
      const businessProfileIds = [
        ...new Set(applicationsData.map((app) => app.applicant_profile_id)),
      ];

      // Step 3: Fetch business profiles
      const { data: businessProfiles, error: bizError } = await supabase
        .from("business_profiles")
        .select("profile_id, name, business_type, city, profile_photo, website, instagram, about")
        .in("profile_id", businessProfileIds);

      if (bizError) throw bizError;

      // Step 4: Merge business profiles into applications
      const businessProfileMap = new Map(
        businessProfiles?.map((bp) => [bp.profile_id, bp]) || []
      );

      const mergedApplications = applicationsData.map((app) => ({
        ...app,
        business_profiles: businessProfileMap.get(app.applicant_profile_id) || {
          profile_id: app.applicant_profile_id,
          name: null,
          business_type: null,
          city: null,
          profile_photo: null,
          website: null,
          instagram: null,
          about: null,
        },
      }));

      setApplications(mergedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (businessProfile: BusinessProfile) => {
    setSelectedBusinessProfile(businessProfile);
    setShowProfileModal(true);
  };

  const handleShowAcceptModal = (application: Application) => {
    setApplicationToAccept(application);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async (scheduledDate: Date, contactMethods: any) => {
    if (!applicationToAccept) return;

    setIsAccepting(true);
    try {
      // Call accept_application RPC
      const { data: collaborationId, error: rpcError } = await supabase
        .rpc("accept_application", {
          p_application_id: applicationToAccept.id,
        });

      if (rpcError) throw rpcError;

      // Update collaboration with scheduled date and contact methods
      const { error: updateError } = await supabase
        .from("collaborations")
        .update({
          scheduled_date: scheduledDate.toISOString(),
          contact_methods: contactMethods,
        })
        .eq("id", collaborationId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Application accepted successfully!",
      });

      // Remove from pending list
      setApplications((prev) =>
        prev.filter((app) => app.id !== applicationToAccept.id)
      );

      setShowAcceptModal(false);
      setApplicationToAccept(null);
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "Failed to accept application",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineApplication = async () => {
    if (!applicationToDecline) return;

    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "declined" })
        .eq("id", applicationToDecline.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application declined",
      });

      // Remove from list
      setApplications((prev) =>
        prev.filter((app) => app.id !== applicationToDecline.id)
      );

      setApplicationToDecline(null);
    } catch (error) {
      console.error("Error declining application:", error);
      toast({
        title: "Error",
        description: "Failed to decline application",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" style={{ background: '#FFF4E6', color: '#996A13', borderColor: '#FFD861' }}>Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" style={{ background: '#E6F4EA', color: '#1B5E20', borderColor: '#4CAF50' }}>Accepted</Badge>;
      case "declined":
        return <Badge variant="outline" style={{ background: '#FFEBEE', color: '#C62828', borderColor: '#F44336' }}>Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Group applications by opportunity
  const applicationsByOpportunity = applications.reduce((acc, app) => {
    const oppId = app.collab_opportunities.id;
    if (!acc[oppId]) {
      acc[oppId] = {
        opportunity: app.collab_opportunities,
        applications: [],
      };
    }
    acc[oppId].applications.push(app);
    return acc;
  }, {} as Record<string, { opportunity: any; applications: Application[] }>);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F8FA', padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#FFD861' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA', padding: '32px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ ...RUBIK_BOLD, fontSize: '30px', color: '#232323', textTransform: 'uppercase', marginBottom: '8px' }}>
            APPLICATIONS RECEIVED
          </h1>
          <p style={{ ...OPEN_SANS, fontSize: '15px', color: '#999' }}>
            Review and manage applications from businesses to your collaboration requests
          </p>
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <Card style={{
            background: '#fff',
            border: '1px solid #EBEBEB',
            borderRadius: '14px',
            boxShadow: '0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)',
            padding: '48px 24px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FFF9E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Inbox style={{ width: '32px', height: '32px', color: '#FFD861' }} />
              </div>
            </div>
            <h3 style={{ ...RUBIK_BOLD, fontSize: '20px', color: '#232323', marginBottom: '8px' }}>
              No pending applications
            </h3>
            <p style={{ ...OPEN_SANS, fontSize: '14px', color: '#999' }}>
              When businesses apply to your collaboration requests, they'll appear here
            </p>
          </Card>
        )}

        {/* Applications grouped by opportunity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Object.entries(applicationsByOpportunity).map(([oppId, { opportunity, applications: oppApps }]) => (
            <Card key={oppId} style={{
              background: '#fff',
              border: '1px solid #EBEBEB',
              borderRadius: '14px',
              boxShadow: '0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)',
              padding: '24px'
            }}>
              {/* Opportunity Header */}
              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #EBEBEB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h2 style={{ ...RUBIK_BOLD, fontSize: '20px', color: '#232323' }}>
                    {opportunity.title}
                  </h2>
                  <Badge variant="secondary" style={{ background: '#FFD861', color: '#232323', fontSize: '12px', fontWeight: 600 }}>
                    {oppApps.length} {oppApps.length === 1 ? 'Application' : 'Applications'}
                  </Badge>
                </div>
                <p style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060', lineHeight: '1.5' }}>
                  {opportunity.description}
                </p>
              </div>

              {/* Applications List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {oppApps.map((application) => (
                  <div key={application.id} style={{
                    background: '#F7F8FA',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {/* Business Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: application.business_profiles.profile_photo ? 'transparent' : '#FFD861',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {application.business_profiles.profile_photo ? (
                          <img src={application.business_profiles.profile_photo} alt={application.business_profiles.name || 'Business'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User style={{ width: '28px', height: '28px', color: '#232323' }} />
                        )}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <h3 style={{ ...RUBIK_BOLD, fontSize: '18px', color: '#232323' }}>
                            {application.business_profiles.name || 'Unnamed Business'}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          {application.business_profiles.business_type && (
                            <span style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060' }}>
                              {application.business_profiles.business_type}
                            </span>
                          )}
                          {application.business_profiles.business_type && application.business_profiles.city && (
                            <span style={{ color: '#EBEBEB' }}>•</span>
                          )}
                          {application.business_profiles.city && (
                            <span style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060' }}>
                              {application.business_profiles.city}
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#999' }}>
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          <span style={{ ...OPEN_SANS, fontSize: '13px' }}>
                            Applied {format(new Date(application.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    {application.availability && (
                      <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        border: '1px solid #EBEBEB'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Calendar style={{ width: '16px', height: '16px', color: '#FFD861' }} />
                          <span style={{ ...RUBIK_BOLD, fontSize: '14px', color: '#232323' }}>
                            Preferred Dates/Times
                          </span>
                        </div>
                        <p style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060', lineHeight: '1.5' }}>
                          {application.availability}
                        </p>
                      </div>
                    )}

                    {/* Message */}
                    {application.message && (
                      <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        border: '1px solid #EBEBEB'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <MessageSquare style={{ width: '16px', height: '16px', color: '#FFD861' }} />
                          <span style={{ ...RUBIK_BOLD, fontSize: '14px', color: '#232323' }}>
                            Application Message
                          </span>
                        </div>
                        <p style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060', lineHeight: '1.5' }}>
                          {application.message}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <Button
                        onClick={() => handleViewProfile(application.business_profiles)}
                        variant="outline"
                        style={{
                          background: '#fff',
                          color: '#232323',
                          border: '1px solid #EBEBEB',
                          borderRadius: '8px',
                          fontWeight: 500,
                          boxShadow: '0 1.5px 3px 0 rgba(55, 73, 87, 0.08)'
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        onClick={() => handleShowAcceptModal(application)}
                        style={{
                          background: '#FFD861',
                          color: '#232323',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          boxShadow: '0 1.5px 4px 0 rgba(55, 73, 87, 0.11)'
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => setApplicationToDecline(application)}
                        variant="outline"
                        style={{
                          background: '#fff',
                          color: '#C62828',
                          border: '1px solid #FFEBEE',
                          borderRadius: '8px',
                          fontWeight: 500
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Business Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent style={{ maxWidth: '600px', background: '#fff', borderRadius: '14px' }}>
          <DialogHeader>
            <DialogTitle style={{ ...RUBIK_BOLD, fontSize: '24px', color: '#232323' }}>
              Business Profile
            </DialogTitle>
          </DialogHeader>
          
          {selectedBusinessProfile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: selectedBusinessProfile.profile_photo ? 'transparent' : '#FFD861',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {selectedBusinessProfile.profile_photo ? (
                    <img src={selectedBusinessProfile.profile_photo} alt={selectedBusinessProfile.name || 'Business'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User style={{ width: '40px', height: '40px', color: '#232323' }} />
                  )}
                </div>
                
                <div>
                  <h3 style={{ ...RUBIK_BOLD, fontSize: '20px', color: '#232323', marginBottom: '4px' }}>
                    {selectedBusinessProfile.name || 'Unnamed Business'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedBusinessProfile.business_type && (
                      <span style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060' }}>
                        {selectedBusinessProfile.business_type}
                      </span>
                    )}
                    {selectedBusinessProfile.business_type && selectedBusinessProfile.city && (
                      <span style={{ color: '#EBEBEB' }}>•</span>
                    )}
                    {selectedBusinessProfile.city && (
                      <span style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060' }}>
                        {selectedBusinessProfile.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedBusinessProfile.about && (
                <div>
                  <h4 style={{ ...RUBIK_BOLD, fontSize: '16px', color: '#232323', marginBottom: '8px' }}>
                    About
                  </h4>
                  <p style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060', lineHeight: '1.6' }}>
                    {selectedBusinessProfile.about}
                  </p>
                </div>
              )}

              {(selectedBusinessProfile.website || selectedBusinessProfile.instagram) && (
                <div>
                  <h4 style={{ ...RUBIK_BOLD, fontSize: '16px', color: '#232323', marginBottom: '12px' }}>
                    Links
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedBusinessProfile.website && (
                      <a
                        href={selectedBusinessProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...OPEN_SANS,
                          fontSize: '14px',
                          color: '#FFD861',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                        Website
                      </a>
                    )}
                    {selectedBusinessProfile.instagram && (
                      <a
                        href={`https://instagram.com/${selectedBusinessProfile.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...OPEN_SANS,
                          fontSize: '14px',
                          color: '#FFD861',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Accept Application Modal */}
      {applicationToAccept && (
        <AcceptApplicationModal
          open={showAcceptModal}
          onOpenChange={setShowAcceptModal}
          application={applicationToAccept}
          businessProfile={communityProfile}
          onConfirm={handleConfirmAccept}
          isSubmitting={isAccepting}
        />
      )}

      {/* Decline Confirmation */}
      <AlertDialog open={!!applicationToDecline} onOpenChange={() => setApplicationToDecline(null)}>
        <AlertDialogContent style={{ background: '#fff', borderRadius: '14px' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ ...RUBIK_BOLD, fontSize: '20px', color: '#232323' }}>
              Decline Application
            </AlertDialogTitle>
            <AlertDialogDescription style={{ ...OPEN_SANS, fontSize: '14px', color: '#606060' }}>
              Are you sure you want to decline this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{
              background: '#fff',
              color: '#232323',
              border: '1px solid #EBEBEB',
              borderRadius: '8px',
              fontWeight: 500
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeclineApplication}
              style={{
                background: '#F44336',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700
              }}
            >
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
