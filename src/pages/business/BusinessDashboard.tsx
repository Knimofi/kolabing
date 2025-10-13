import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, TrendingUp } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";
import CollaborationCalendar from "@/components/CollaborationCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// --- FONT STYLES ---
const OPEN_SANS_BOLD_TITLE = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  color: "#000",
  fontSize: 22,
  letterSpacing: 0.02,
  margin: 0,
};

const OPEN_SANS_BOLD_TITLE_LARGE = {
  ...OPEN_SANS_BOLD_TITLE,
  fontSize: 25,
};

const OPEN_SANS_BOLD_TITLE_LATEST = {
  ...OPEN_SANS_BOLD_TITLE,
  fontSize: 26,
};

const OPEN_SANS_SUBTITLE = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 15,
  color: "#222",
  letterSpacing: 0,
  textTransform: "none" as const,
  margin: 0,
};

const OPEN_SANS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 14,
  color: "#222",
};
const STAT_CARD_BG = "#FFD861";
const GETTING_STARTED_BG = "#F7F7F7";

const BUTTON_YELLOW = {
  background: "#FFD861",
  border: "2px solid #FFD861",
  color: "#000",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 400,
  letterSpacing: "0.03em",
  fontSize: 17,
};

const BUTTON_OUTLINE = {
  background: "#000",
  border: "1.5px solid #000",
  color: "#fff",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 400,
  letterSpacing: "0.03em",
  fontSize: 15,
  padding: "8px 14px",
  whiteSpace: "normal" as const,
  maxWidth: "154px",
  textAlign: "center" as const,
};

const BusinessDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    applications: 0,
    collaborations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) fetchStats();
  }, [profile?.id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { count: totalOffers } = await supabase
        .from("collab_opportunities")
        .select("*", { count: "exact", head: true })
        .eq("creator_profile_id", profile!.id);
      const { count: activeOffers } = await supabase
        .from("collab_opportunities")
        .select("*", { count: "exact", head: true })
        .eq("creator_profile_id", profile!.id)
        .eq("status", "published");
      const { count: applications } = await supabase
        .from("applications")
        .select("collab_opportunity_id!inner(*)", { count: "exact", head: true })
        .eq("collab_opportunity_id.creator_profile_id", profile!.id);
      const { count: collaborations } = await supabase
        .from("collaborations")
        .select("*", { count: "exact", head: true })
        .eq("creator_profile_id", profile!.id);
      setStats({
        totalOffers: totalOffers || 0,
        activeOffers: activeOffers || 0,
        applications: applications || 0,
        collaborations: collaborations || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 style={OPEN_SANS_BOLD_TITLE_LATEST}>Business Dashboard</h1>
            <p style={OPEN_SANS_SUBTITLE}>Manage your offers and track collaboration performance</p>
          </div>
          <Link to="/business/opportunities/new">
            <Button size="lg" style={BUTTON_YELLOW}>
              <Plus className="w-5 h-5 mr-2" />
              Create Collab Request
            </Button>
          </Link>
        </div>

        <ProfileSetupAlert />

        {/* Collab Calendar */}
        <CollaborationCalendar userType="business" />

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="pb-2">
              <span style={OPEN_SANS_BOLD_TITLE}>Total Offers</span>
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#000" }}
              >
                {loading ? "..." : stats.totalOffers}
              </div>
              <p className="text-xs" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#222" }}>
                {stats.totalOffers === 0 ? "No offers created yet" : "Total created offers"}
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="pb-2">
              <span style={OPEN_SANS_BOLD_TITLE}>Active Offers</span>
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#000" }}
              >
                {loading ? "..." : stats.activeOffers}
              </div>
              <p className="text-xs" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#222" }}>
                Published offers
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="pb-2">
              <span style={OPEN_SANS_BOLD_TITLE}>Applications</span>
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#000" }}
              >
                {loading ? "..." : stats.applications}
              </div>
              <p className="text-xs" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#222" }}>
                Total applications received
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="pb-2">
              <span style={OPEN_SANS_BOLD_TITLE}>Collaborations</span>
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#000" }}
              >
                {loading ? "..." : stats.collaborations}
              </div>
              <p className="text-xs" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#222" }}>
                Active partnerships
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card style={{ background: GETTING_STARTED_BG }}>
            <CardHeader>
              <CardTitle style={OPEN_SANS_BOLD_TITLE_LARGE}>Getting Started</CardTitle>
              <CardDescription style={OPEN_SANS_SUBTITLE}>
                Complete these steps to start connecting with communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center mb-1">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mb-2 md:mb-0">
                  ✓
                </div>
                <span className="text-sm" style={OPEN_SANS}>
                  Set up your business profile
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <div className="flex items-center mr-3 mb-2 md:mb-0">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    2
                  </div>
                  <span className="text-sm" style={OPEN_SANS}>
                    Choose a subscription plan
                  </span>
                </div>
                <Link to="/business/plans" className="block md:inline-block">
                  <Button variant="outline" size="sm" style={BUTTON_OUTLINE}>
                    Choose Plan
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <div className="flex items-center mr-3 mb-2 md:mb-0">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    3
                  </div>
                  <span className="text-sm" style={OPEN_SANS}>
                    Create your first collab opportunity
                  </span>
                </div>
                <Link to="/business/opportunities/new" className="block md:inline-block">
                  <Button variant="outline" size="sm" style={BUTTON_OUTLINE}>
                    Create Collab
                    <br />
                    Opportunity
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
