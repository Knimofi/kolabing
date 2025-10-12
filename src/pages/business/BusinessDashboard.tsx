import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";
import CollaborationCalendar from "@/components/CollaborationCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
    if (profile?.id) {
      fetchStats();
    }
  }, [profile?.id]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch total opportunities
      const { count: totalOffers } = await supabase
        .from("collab_opportunities")
        .select("*", { count: "exact", head: true })
        .eq("creator_profile_id", profile!.id);

      // Fetch active (published) opportunities
      const { count: activeOffers } = await supabase
        .from("collab_opportunities")
        .select("*", { count: "exact", head: true })
        .eq("creator_profile_id", profile!.id)
        .eq("status", "published");

      // Fetch applications on user's opportunities
      const { count: applications } = await supabase
        .from("applications")
        .select("collab_opportunity_id!inner(*)", { count: "exact", head: true })
        .eq("collab_opportunity_id.creator_profile_id", profile!.id);

      // Fetch collaborations where user is creator
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
    <div className="min-h-screen" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 
              className="text-3xl md:text-4xl mb-1"
              style={{
                ...RUBIK_BOLD,
                color: "#fff",
                letterSpacing: "0.04em",
              }}
            >
              BUSINESS DASHBOARD
            </h1>
            <p
              className="text-lg mb-1"
              style={{
                ...RUBIK_MEDIUM,
                color: "#fff",
                fontFamily: "'Rubik', Arial, sans-serif",
              }}
            >
              MANAGE YOUR OFFERS AND TRACK COLLABORATION PERFORMANCE
            </p>
          </div>

          <Link to="/business/opportunities/new">
            <Button 
              size="lg" 
              className="bg-[#FFD861] hover:bg-yellow-300 border-2 border-[#FFD861] text-white font-bold text-lg uppercase"
              style={RUBIK_BOLD}
            >
              <Plus className="w-5 h-5 mr-2" />
              CREATE COLLAB REQUEST
            </Button>
          </Link>
        </div>

        {/* Profile Setup Alert */}
        <ProfileSetupAlert />

        {/* Collaboration Calendar */}
        <CollaborationCalendar userType="business" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalOffers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOffers === 0 ? "No offers created yet" : "Total created offers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeOffers}</div>
            <p className="text-xs text-muted-foreground">Published offers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.applications}</div>
            <p className="text-xs text-muted-foreground">Total applications received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.collaborations}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to start connecting with communities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="text-sm">Set up your business profile</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm">Choose a subscription plan</span>
              </div>
              <Link to="/business/plans">
                <Button variant="outline" size="sm">
                  Choose Plan
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm">Create your first collab opportunity</span>
              </div>
              <Link to="/business/opportunities/new">
                <Button variant="outline" size="sm">
                  Create Collab Opportunity
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest collaboration updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-2">Create an offer to start seeing activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
