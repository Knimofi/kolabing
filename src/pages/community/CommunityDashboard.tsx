import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, Users, TrendingUp, Clock } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";

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

const CommunityDashboard = () => {
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
              COMMUNITY DASHBOARD
            </h1>
            <p
              className="text-lg mb-1"
              style={{
                ...RUBIK_MEDIUM,
                color: "#fff",
                fontFamily: "'Rubik', Arial, sans-serif",
              }}
            >
              DISCOVER OPPORTUNITIES AND MANAGE YOUR COLLABORATIONS
            </p>
          </div>
          <Link to="/community/offers">
            <Button
              size="lg"
              className="bg-[#FFD861] hover:bg-yellow-300 border-2 border-[#FFD861] text-white font-bold text-lg uppercase"
              style={RUBIK_BOLD}
            >
              <Search className="w-5 h-5 mr-2" />
              BROWSE OFFERS
            </Button>
          </Link>
        </div>

        {/* Profile Setup Alert */}
        <ProfileSetupAlert />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "APPLICATIONS",
              icon: <FileText className="h-5 w-5 text-black" />,
              value: 0,
              desc: "Total applications sent",
            },
            { title: "PENDING", icon: <Clock className="h-5 w-5 text-black" />, value: 0, desc: "Awaiting response" },
            {
              title: "ACCEPTED",
              icon: <TrendingUp className="h-5 w-5 text-black" />,
              value: 0,
              desc: "Successful applications",
            },
            {
              title: "COLLABORATIONS",
              icon: <Users className="h-5 w-5 text-black" />,
              value: 0,
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
                  {String(value)}
                </div>
                <p className="text-xs text-gray-700" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-black bg-white">
            <CardHeader>
              <CardTitle className="mb-1" style={{ ...RUBIK_MEDIUM, color: "#000" }}>
                GETTING STARTED
              </CardTitle>
              <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Complete these steps to start collaborating with businesses
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
                  Set up your community profile
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
                    Browse available offers
                  </span>
                </div>
                <Link to="/community/offers">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#FFD861] bg-[#FFD861] text-white"
                    style={RUBIK_MEDIUM}
                  >
                    BROWSE OFFERS
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 bg-[#FFD861] text-black rounded-full flex items-center justify-center text-base"
                  style={RUBIK_BOLD}
                >
                  3
                </div>
                <span className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Submit your first application
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black bg-white">
            <CardHeader>
              <CardTitle style={{ ...RUBIK_MEDIUM, color: "#000" }}>RECENT OFFERS</CardTitle>
              <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Latest collaboration opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-[#FFD861] mx-auto mb-4" />
                <p className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  No offers available yet
                </p>
                <p className="text-xs text-gray-700 mt-2" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Check back soon for new opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="border-black bg-white">
          <CardHeader>
            <CardTitle style={{ ...RUBIK_MEDIUM, color: "#000" }}>TIPS FOR SUCCESS</CardTitle>
            <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
              Maximize your collaboration potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FFF7E0] rounded-lg">
                <h4 className="mb-2 text-black" style={{ ...RUBIK_MEDIUM }}>
                  COMPLETE YOUR PROFILE
                </h4>
                <p className="text-sm text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  A detailed profile increases your chances of being accepted for collaborations.
                </p>
              </div>
              <div className="p-4 bg-[#FFF7E0] rounded-lg">
                <h4 className="mb-2 text-black" style={{ ...RUBIK_MEDIUM }}>
                  WRITE COMPELLING APPLICATIONS
                </h4>
                <p className="text-sm text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Personalize each application to show why you're the perfect fit.
                </p>
              </div>
              <div className="p-4 bg-[#FFF7E0] rounded-lg">
                <h4 className="mb-2 text-black" style={{ ...RUBIK_MEDIUM }}>
                  BUILD YOUR REPUTATION
                </h4>
                <p className="text-sm text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Complete collaborations successfully to build trust and get more opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityDashboard;
