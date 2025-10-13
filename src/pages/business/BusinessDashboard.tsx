import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, TrendingUp } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";
import CollaborationCalendar from "@/components/CollaborationCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// --- FONTS/STYLES ---
const RUBIK_BOLD = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase",
  fontWeight: 700,
  color: "#000",
};
const OPEN_SANS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  color: "#000",
};
const DARKER_GROTESQUE_LIGHT = {
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase",
  fontWeight: 400,
  color: "#000",
};
const STAT_CARD_BG = "#FFD861"; // Yellow
const GETTING_STARTED_BG = "#F7F7F7"; // slightly darker white

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
    // eslint-disable-next-line
  }, [profile?.id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch stats (unchanged)
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-3xl md:text-4xl mb-1"
              style={{
                ...RUBIK_BOLD,
                letterSpacing: "0.04em",
                color: "#000",
              }}
            >
              BUSINESS DASHBOARD
            </h1>
            <p
              className="text-lg mb-1"
              style={{
                ...OPEN_SANS,
                textTransform: "none",
                color: "#000",
                fontWeight: 400,
              }}
            >
              Manage your offers and track collaboration performance
            </p>
          </div>
          <Link to="/business/opportunities/new">
            <Button
              size="lg"
              style={{
                background: "#FFD861",
                border: "2px solid #FFD861",
                color: "#000",
                fontWeight: 400,
                ...DARKER_GROTESQUE_LIGHT,
                fontSize: "1.2rem",
                letterSpacing: "0.04em",
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Collab Request
            </Button>
          </Link>
        </div>

        {/* Alerts */}
        <ProfileSetupAlert />

        {/* Calendar */}
        <CollaborationCalendar userType="business" />

        {/* Stats cards in yellow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm" style={{ ...OPEN_SANS, color: "#000", fontWeight: 600 }}>
                Total Offers
              </CardTitle>
              <FileText className="h-4 w-4" style={{ color: "#000" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={OPEN_SANS}>
                {loading ? "..." : stats.totalOffers}
              </div>
              <p className="text-xs" style={OPEN_SANS}>
                {stats.totalOffers === 0 ? "No offers created yet" : "Total created offers"}
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm" style={{ ...OPEN_SANS, color: "#000", fontWeight: 600 }}>
                Active Offers
              </CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: "#000" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={OPEN_SANS}>
                {loading ? "..." : stats.activeOffers}
              </div>
              <p className="text-xs" style={OPEN_SANS}>
                Published offers
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm" style={{ ...OPEN_SANS, color: "#000", fontWeight: 600 }}>
                Applications
              </CardTitle>
              <Users className="h-4 w-4" style={{ color: "#000" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={OPEN_SANS}>
                {loading ? "..." : stats.applications}
              </div>
              <p className="text-xs" style={OPEN_SANS}>
                Total applications received
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: STAT_CARD_BG }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm" style={{ ...OPEN_SANS, color: "#000", fontWeight: 600 }}>
                Collaborations
              </CardTitle>
              <Users className="h-4 w-4" style={{ color: "#000" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={OPEN_SANS}>
                {loading ? "..." : stats.collaborations}
              </div>
              <p className="text-xs" style={OPEN_SANS}>
                Active partnerships
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card style={{ background: GETTING_STARTED_BG }}>
            <CardHeader>
              <CardTitle style={RUBIK_BOLD}>Getting Started</CardTitle>
              <CardDescription style={OPEN_SANS}>
                Complete these steps to start connecting with communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  ✓
                </div>
                <span className="text-sm" style={OPEN_SANS}>
                  Set up your business profile
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center mr-3">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    2
                  </div>
                  <span className="text-sm" style={OPEN_SANS}>
                    Choose a subscription plan
                  </span>
                </div>
                <Link to="/business/plans">
                  <Button variant="outline" size="sm" style={DARKER_GROTESQUE_LIGHT}>
                    Choose Plan
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center mr-3">
                  <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    3
                  </div>
                  <span className="text-sm" style={OPEN_SANS}>
                    Create your first collab opportunity
                  </span>
                </div>
                <Link to="/business/opportunities/new">
                  <Button variant="outline" size="sm" style={DARKER_GROTESQUE_LIGHT}>
                    Create Collab Opportunity
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
