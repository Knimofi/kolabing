import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, Users, TrendingUp, Clock } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";
import CollaborationCalendar from "@/components/CollaborationCalendar"; // <-- calendar import

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
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1
                style={{
                  fontFamily: "'Rubik', Arial, sans-serif",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  fontSize: 30,
                  letterSpacing: "0.03em",
                }}
              >
                COMMUNITY DASHBOARD
              </h1>
              <p
                style={{
                  fontFamily: "'Open Sans', Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 15,
                  color: "#4A4A4A",
                }}
              >
                DISCOVER OPPORTUNITIES AND MANAGE YOUR COLLABORATIONS
              </p>
            </div>
            <Link to="/community/opportunities">
              <Button
                size="lg"
                style={{
                  background: "#FFD861",
                  border: "2px solid #FFD861",
                  color: "#000",
                  fontFamily: "'Darker Grotesque', Arial, sans-serif",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(255, 216, 97, 0.3)",
                  transition: "all 0.2s ease-in-out"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Search className="w-5 h-5 mr-2" />
                BROWSE OPPORTUNITIES
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Setup Alert */}
        <ProfileSetupAlert />

        {/* Collaboration Calendar (NEW) */}
        <CollaborationCalendar userType="community" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "APPLICATIONS",
              icon: <FileText className="h-5 w-5" style={{ color: "#000" }} />,
              value: 0,
              desc: "Total applications sent",
            },
            { title: "PENDING", icon: <Clock className="h-5 w-5" style={{ color: "#000" }} />, value: 0, desc: "Awaiting response" },
            {
              title: "ACCEPTED",
              icon: <TrendingUp className="h-5 w-5" style={{ color: "#000" }} />,
              value: 0,
              desc: "Successful applications",
            },
            {
              title: "COLLABORATIONS",
              icon: <Users className="h-5 w-5" style={{ color: "#000" }} />,
              value: 0,
              desc: "Active partnerships",
            },
          ].map(({ title, icon, value, desc }, idx) => (
            <Card 
              key={idx} 
              style={{ 
                background: "#FFF6D8", 
                border: "1.5px solid #F9E9AC", 
                borderRadius: "18px", 
                boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)", 
                transition: "all 0.2s ease" 
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(231, 192, 58, 0.18), 0 2px 12px 0 rgba(60, 44, 0, 0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)"; }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "13px", letterSpacing: "0.08em", color: "#1A1A1A" }}>
                  {title}
                </CardTitle>
                <div style={{ background: "#FFD861", borderRadius: "50%", padding: "8px" }}>
                  {icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Rubik', Arial, sans-serif", color: "#1A1A1A" }}>
                  {String(value)}
                </div>
                <p className="text-xs" style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>
                GETTING STARTED
              </CardTitle>
              <CardDescription style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                Complete these steps to start collaborating with businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center space-x-3">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#D1FAE5",
                    color: "#059669",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700
                  }}
                >
                  ✓
                </div>
                <span style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "15px", color: "#1A1A1A" }}>
                  Set up your community profile
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "#FFF9E6",
                      color: "#D97706",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700
                    }}
                  >
                    2
                  </div>
                  <span style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "15px", color: "#1A1A1A" }}>
                    Browse available opportunities
                  </span>
                </div>
                <Link to="/community/opportunities">
                  <Button
                    size="sm"
                    style={{
                      background: "#FFD861",
                      border: "2px solid #FFD861",
                      color: "#000",
                      fontFamily: "'Darker Grotesque', Arial, sans-serif",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(255, 216, 97, 0.3)",
                      transition: "all 0.2s ease-in-out"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    BROWSE OPPORTUNITIES
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#FFF9E6",
                    color: "#D97706",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700
                  }}
                >
                  3
                </div>
                <span style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "15px", color: "#1A1A1A" }}>
                  Submit your first application
                </span>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>RECENT OFFERS</CardTitle>
              <CardDescription style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
                Latest collaboration opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: "#FFD861" }} />
                <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "15px", color: "#1A1A1A" }}>
                  No offers available yet
                </p>
                <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "13px", color: "#6B7280", marginTop: "8px" }}>
                  Check back soon for new opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card style={{ background: "#FFF6D8", border: "1.5px solid #F9E9AC", borderRadius: "18px", boxShadow: "0 2px 16px 0 rgba(231, 192, 58, 0.12), 0 1.5px 9px 0 rgba(60, 44, 0, 0.06)" }}>
          <CardHeader>
            <CardTitle style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "16px", color: "#1A1A1A" }}>TIPS FOR SUCCESS</CardTitle>
            <CardDescription style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#4A4A4A" }}>
              Maximize your collaboration potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div style={{ padding: "16px", background: "#FFF9E6", borderRadius: "8px" }}>
                <h4 style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "14px", color: "#1A1A1A", marginBottom: "8px" }}>
                  COMPLETE YOUR PROFILE
                </h4>
                <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "14px", color: "#4A4A4A" }}>
                  A detailed profile increases your chances of being accepted for collaborations.
                </p>
              </div>
              <div style={{ padding: "16px", background: "#FFF9E6", borderRadius: "8px" }}>
                <h4 style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "14px", color: "#1A1A1A", marginBottom: "8px" }}>
                  WRITE COMPELLING APPLICATIONS
                </h4>
                <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "14px", color: "#4A4A4A" }}>
                  Personalize each application to show why you're the perfect fit.
                </p>
              </div>
              <div style={{ padding: "16px", background: "#FFF9E6", borderRadius: "8px" }}>
                <h4 style={{ fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase", fontWeight: 600, fontSize: "14px", color: "#1A1A1A", marginBottom: "8px" }}>
                  BUILD YOUR REPUTATION
                </h4>
                <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "14px", color: "#4A4A4A" }}>
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
