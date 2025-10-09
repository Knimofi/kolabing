import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";
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

      // Fetch total offers
      const { count: totalOffers } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("business_profile_id", profile!.id);

      // Fetch active (published) offers
      const { count: activeOffers } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("business_profile_id", profile!.id)
        .eq("status", "published");

      // Fetch applications
      const { count: applications } = await supabase
        .from("applications")
        .select("offer_id!inner(*)", { count: "exact", head: true })
        .eq("offer_id.business_profile_id", profile!.id);

      // Fetch collaborations
      const { count: collaborations } = await supabase
        .from("collaborations")
        .select("*", { count: "exact", head: true })
        .eq("business_profile_id", profile!.id);

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
            <p className="text-lg" style={{ fontFamily: "'Darker Grotesque', sans-serif", color: "#aaa" }}>
              Manage your offers and track partnership success
            </p>
          </div>
          <Link to="/business/offers/new">
            <Button
              size="lg"
              className="bg-[#FFD861] hover:bg-yellow-400 border-2 border-[#FFD861] text-white font-bold text-lg uppercase"
              style={RUBIK_BOLD}
            >
              <Plus className="w-5 h-5 mr-2" />
              CREATE NEW OFFER
            </Button>
          </Link>
        </div>

        <ProfileSetupAlert />

        {/* Subscription Alert */}
        <Card className="border-[#FFD861] bg-[#FFF7E0]">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-[#FFD861] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="mb-1" style={{ ...RUBIK_MEDIUM, color: "#000" }}>
                  SUBSCRIPTION REQUIRED
                </h3>
                <p className="text-black text-sm mb-3" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  You need an active subscription to publish offers and connect with communities.
                </p>
                <Link to="/business/plans">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FFD861] bg-[#FFD861] text-white hover:bg-yellow-400"
                    style={RUBIK_MEDIUM}
                  >
                    VIEW PLANS
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "TOTAL OFFERS",
              icon: <FileText className="h-5 w-5 text-black" />,
              value: stats.totalOffers,
              desc: stats.totalOffers === 0 ? "No offers created yet" : "Total created offers",
            },
            {
              title: "ACTIVE OFFERS",
              icon: <TrendingUp className="h-5 w-5 text-black" />,
              value: stats.activeOffers,
              desc: "Published offers",
            },
            {
              title: "APPLICATIONS",
              icon: <Users className="h-5 w-5 text-black" />,
              value: stats.applications,
              desc: "Total applications received",
            },
            {
              title: "COLLABORATIONS",
              icon: <Users className="h-5 w-5 text-black" />,
              value: stats.collaborations,
              desc: "Active partnerships",
            },
          ].map(({ title, icon, value, desc }, idx) => (
            <Card key={idx} className="border-black bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm" style={{ ...RUBIK_MEDIUM, color: "#000" }}>
                  {title}
                </CardTitle>
                {icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-black mb-1" style={{ ...RUBIK_BOLD, color: "#000" }}>
                  {loading ? "..." : String(value).toUpperCase()}
                </div>
                <p className="text-xs text-gray-600" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Getting Started Block */}
          <Card className="border-black bg-white">
            <CardHeader>
              <CardTitle className="mb-1" style={{ ...RUBIK_MEDIUM, color: "#000" }}>
                GETTING STARTED
              </CardTitle>
              <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Complete these steps to start connecting with communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg"
                  style={RUBIK_BOLD}
                >
                  ✓
                </div>
                <span className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Set up your business profile
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 bg-[#FFD861] text-black rounded-full flex items-center justify-center text-base"
                    style={RUBIK_BOLD}
                  >
                    2
                  </div>
                  <span className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Choose a subscription plan
                  </span>
                </div>
                <Link to="/business/plans">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FFD861] bg-[#FFD861] text-white"
                    style={RUBIK_MEDIUM}
                  >
                    CHOOSE PLAN
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 bg-[#FFD861] text-black rounded-full flex items-center justify-center text-base"
                    style={RUBIK_BOLD}
                  >
                    3
                  </div>
                  <span className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Create your first offer
                  </span>
                </div>
                <Link to="/business/offers/new">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FFD861] bg-[#FFD861] text-white"
                    style={RUBIK_MEDIUM}
                  >
                    CREATE OFFER
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Block */}
          <Card className="border-black bg-white">
            <CardHeader>
              <CardTitle style={{ ...RUBIK_MEDIUM, color: "#000" }}>RECENT ACTIVITY</CardTitle> className="text-3xl
              md:text-4xl mb-1"
              <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Your latest collaboration updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#FFD861] mx-auto mb-4" />
                <p className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  No recent activity
                </p>
                <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Create an offer to start seeing activity here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
