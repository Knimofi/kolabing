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
            <p className="text-lg" style={{ ...RUBIK_MEDIUM, color: "#fff", fontFamily: "'Rubik', Arial, sans-serif" }}>
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

        {/* ...the rest of your dashboard here... */}
      </div>
    </div>
  );
};

export default CommunityDashboard;
