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

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#000" }}>
        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 
            className="text-3xl md:text-4xl mb-1"
            style={{
              ...RUBIK_BOLD,
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            APPLICATIONS SUBMITTED
          </h1>
          <p
            className="text-lg mb-1"
            style={{
              ...RUBIK_MEDIUM,
              color: "#fff",
              fontFamily: "'Rubik', Arial, sans-serif",
            }}
          >
            VIEW AND MANAGE YOUR COLLABORATION APPLICATIONS
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white">
              {applications.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p>You haven't applied to any opportunities yet. Browse opportunities to get started!</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">No matching applications</h3>
                  <p>Try adjusting your search terms.</p>
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
