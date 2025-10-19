import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ApplicationCard from '@/components/ApplicationCard';
import ApplicationDetailsModal from '@/components/modals/ApplicationDetailsModal';
import { Search } from 'lucide-react';

const RUBIK_BOLD = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
};

const RUBIK_MEDIUM = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 500,
};

interface Application {
  id: string;
  message: string;
  availability: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  created_at: string;
  collab_opportunities: {
    id: string;
    title: string;
    description: string;
    categories: string[] | null;
    address: string | null;
    timeline_days: number | null;
    offer_photo: string | null;
    community_profiles: {
      name: string;
      community_type: string | null;
      city: string | null;
      profile_photo: string | null;
      website: string | null;
      instagram: string | null;
    };
  } | null;
}

const BusinessMyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      fetchApplications();
    }
  }, [profile]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          message,
          availability,
          status,
          created_at,
          collab_opportunities!inner (
            id,
            title,
            description,
            categories,
            address,
            timeline_days,
            offer_photo,
            creator_profile_id
          )
        `)
        .eq('applicant_profile_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch creator profiles for each opportunity
      const applicationsWithProfiles = await Promise.all(
        (data || []).map(async (app) => {
          const { data: creatorProfile } = await supabase
            .from('community_profiles')
            .select('name, community_type, city, profile_photo, website, instagram')
            .eq('profile_id', app.collab_opportunities.creator_profile_id)
            .single();
          
          return {
            ...app,
            collab_opportunities: {
              ...app.collab_opportunities,
              community_profiles: creatorProfile
            }
          };
        })
      );
      
      setApplications(applicationsWithProfiles as Application[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleWithdrawApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowWithdrawDialog(true);
  };

  const confirmWithdraw = async () => {
    if (!selectedApplication) return;

    try {
      setWithdrawingId(selectedApplication.id);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', selectedApplication.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application withdrawn successfully.",
      });

      await fetchApplications();
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setWithdrawingId(null);
      setShowWithdrawDialog(false);
      setSelectedApplication(null);
    }
  };

  const filteredApplications = applications.filter(application => {
    if (!application.collab_opportunities || !application.collab_opportunities.community_profiles) return false;
    
    const title = application.collab_opportunities.title || '';
    const communityName = application.collab_opportunities.community_profiles.name || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           communityName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const RUBIK_EXTRA_BOLD_TITLE = {
    fontFamily: "'Rubik', Arial, sans-serif",
    textTransform: "uppercase" as const,
    fontWeight: 700,
    color: "#2b2b2d",
    fontSize: 30,
    letterSpacing: "0.03em",
    margin: 0,
  };
  const OPEN_SANS_SUBTITLE = {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 400,
    fontSize: 15,
    color: "#5a5a5c",
    letterSpacing: 0,
    textTransform: "none" as const,
    margin: 0,
  };
  const OPEN_SANS = {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 400,
    fontSize: 14,
    color: "#5a5a5c",
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p style={OPEN_SANS}>Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-[700] text-[30px] uppercase text-[#232323] tracking-tight mb-2">APPLICATIONS SUBMITTED</h1>
          <p className="text-[15px] text-[#999] mb-6">View and manage your collaboration applications</p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F5F5] text-[#222] border-none rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border focus:border-[#E8D7A0] focus:shadow-[0_0_0_3px_rgba(255,246,216,0.4)]"
          />
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12" style={{ background: "#FFF6D8", borderRadius: "18px", border: "1.5px solid #F9E9AC", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", padding: "4rem" }}>
            <div>
              {applications.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ ...OPEN_SANS, fontWeight: 600, color: "#2b2b2d" }}>No applications yet</h3>
                  <p style={OPEN_SANS}>You haven't applied to any opportunities yet. Browse opportunities to get started!</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ ...OPEN_SANS, fontWeight: 600, color: "#2b2b2d" }}>No matching applications</h3>
                  <p style={OPEN_SANS}>Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onView={() => handleViewApplication(application)}
                onWithdraw={() => handleWithdrawApplication(application)}
              />
            ))}
          </div>
        )}

        {/* Application Details Modal */}
        <ApplicationDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          application={selectedApplication}
        />

        {/* Withdraw Confirmation Dialog */}
        <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to withdraw your application for "{selectedApplication?.collab_opportunities?.title}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmWithdraw}
                disabled={withdrawingId !== null}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {withdrawingId === selectedApplication?.id ? 'Withdrawing...' : 'Withdraw'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BusinessMyApplications;
