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
const RUBIK_EXTRA_BOLD_TITLE = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  color: "#1A1A1A",
  fontSize: 30,
  letterSpacing: "0.03em",
  margin: 0,
};
const OPEN_SANS_BOLD_CARD_SMALL = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 600,
  color: "#232323",
  fontSize: 13,
  letterSpacing: "0.08em",
  margin: 0,
};
const OPEN_SANS_SUBTITLE = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 15,
  color: "#4A4A4A",
  letterSpacing: 0,
  textTransform: "none" as const,
  margin: 0,
};
const OPEN_SANS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 14,
  color: "#4A4A4A",
};

const BUTTON_YELLOW = {
  background: "#FFD861",
  border: "2px solid #FFD861",
  color: "#000",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 600,
  letterSpacing: "0.03em",
  fontSize: 17,
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(255, 216, 97, 0.3)",
  transition: "all 0.2s ease-in-out",
};
const BUTTON_OUTLINE = {
  background: "#1A1A1A",
  border: "2px solid #1A1A1A",
  color: "#fff",
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 500,
  letterSpacing: "0.03em",
  fontSize: 15,
  padding: "8px 14px",
  whiteSpace: "normal" as const,
  maxWidth: "154px",
  textAlign: "center" as const,
  borderRadius: "8px",
  transition: "all 0.2s ease-in-out",
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
      <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 style={RUBIK_EXTRA_BOLD_TITLE}>BUSINESS DASHBOARD</h1>
              <p style={OPEN_SANS_SUBTITLE}>Manage your offers and track collaboration performance</p>
            </div>
            <Link to="/business/opportunities/new">
              <Button 
                size="lg" 
                style={BUTTON_YELLOW}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collab Request
              </Button>
            </Link>
          </div>
        </div>

        <ProfileSetupAlert />

        {/* Collab Calendar */}
        <CollaborationCalendar userType="business" />

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)"; }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span style={OPEN_SANS_BOLD_CARD_SMALL}>Total Offers</span>
                <div style={{ background: "#FFD861", borderRadius: "50%", padding: "8px" }}>
                  <FileText className="w-4 h-4" style={{ color: "#000" }} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ fontFamily: "'Rubik', Arial, sans-serif", color: "#1A1A1A" }}>
                {loading ? "..." : stats.totalOffers}
              </div>
              <p className="text-xs mt-1" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                {stats.totalOffers === 0 ? "No offers created yet" : "Total created offers"}
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(231, 192, 58, 0.18), 0 2px 12px 0 rgba(60, 44, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)"; }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span style={OPEN_SANS_BOLD_CARD_SMALL}>Active Offers</span>
                <div style={{ background: "#FFD861", borderRadius: "50%", padding: "8px" }}>
                  <TrendingUp className="w-4 h-4" style={{ color: "#000" }} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ fontFamily: "'Rubik', Arial, sans-serif", color: "#1A1A1A" }}>
                {loading ? "..." : stats.activeOffers}
              </div>
              <p className="text-xs mt-1" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                Published offers
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(231, 192, 58, 0.18), 0 2px 12px 0 rgba(60, 44, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)"; }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span style={OPEN_SANS_BOLD_CARD_SMALL}>Applications</span>
                <div style={{ background: "#FFD861", borderRadius: "50%", padding: "8px" }}>
                  <FileText className="w-4 h-4" style={{ color: "#000" }} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ fontFamily: "'Rubik', Arial, sans-serif", color: "#1A1A1A" }}>
                {loading ? "..." : stats.applications}
              </div>
              <p className="text-xs mt-1" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                Total applications received
              </p>
            </CardContent>
          </Card>
          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(231, 192, 58, 0.18), 0 2px 12px 0 rgba(60, 44, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)"; }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span style={OPEN_SANS_BOLD_CARD_SMALL}>Collaborations</span>
                <div style={{ background: "#FFD861", borderRadius: "50%", padding: "8px" }}>
                  <Users className="w-4 h-4" style={{ color: "#000" }} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ fontFamily: "'Rubik', Arial, sans-serif", color: "#1A1A1A" }}>
                {loading ? "..." : stats.collaborations}
              </div>
              <p className="text-xs mt-1" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                Active partnerships
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontWeight: 600, fontSize: 18, color: "#232323" }}>Getting Started</CardTitle>
              <CardDescription style={OPEN_SANS_SUBTITLE}>
                Complete these steps to start connecting with communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center mb-1">
                <div style={{ width: "32px", height: "32px", background: "#D1FAE5", color: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, marginRight: "12px", marginBottom: "8px" }}>
                  ✓
                </div>
                <span className="text-sm" style={OPEN_SANS}>
                  Set up your business profile
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <div className="flex items-center mr-3 mb-2 md:mb-0">
                  <div style={{ width: "32px", height: "32px", background: "#FFF9E6", color: "#D97706", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, marginRight: "12px" }}>
                    2
                  </div>
                  <span className="text-sm" style={OPEN_SANS}>
                    Choose a subscription plan
                  </span>
                </div>
                <Link to="/business/plans" className="block md:inline-block">
                  <Button 
                    size="sm" 
                    style={BUTTON_OUTLINE}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    Choose Plan
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                <div className="flex items-center mr-3 mb-2 md:mb-0">
                  <div style={{ width: "32px", height: "32px", background: "#FFF9E6", color: "#D97706", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, marginRight: "12px" }}>
                    3
                  </div>
                  <span className="text-sm" style={OPEN_SANS}>
                    Create your first collab opportunity
                  </span>
                </div>
                <Link to="/business/opportunities/new" className="block md:inline-block">
                  <Button 
                    size="sm" 
                    style={BUTTON_OUTLINE}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
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
