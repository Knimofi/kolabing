import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText, Users, TrendingUp, Clock } from "lucide-react";
import ProfileSetupAlert from "@/components/ProfileSetupAlert";

const CommunityDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-3xl md:text-4xl font-extrabold mb-1"
              style={{ fontFamily: "'Rubik', sans-serif", color: "#000" }}
            >
              Community Dashboard
            </h1>
            <p className="text-lg" style={{ fontFamily: "'Darker Grotesque', sans-serif", color: "#444" }}>
              Discover opportunities and manage your collaborations
            </p>
          </div>
          <Link to="/community/offers">
            <Button
              size="lg"
              className="bg-[#FFD861] hover:bg-yellow-300 border-2 border-[#FFD861] text-black font-bold text-lg uppercase"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Offers
            </Button>
          </Link>
        </div>

        <ProfileSetupAlert />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-black bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-bold text-black"
                style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
              >
                Applications
              </CardTitle>
              <FileText className="h-5 w-5 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black mb-1" style={{ fontFamily: "'Rubik', sans-serif" }}>
                0
              </div>
              <p className="text-xs text-gray-600" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Total applications sent
              </p>
            </CardContent>
          </Card>

          <Card className="border-black bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-bold text-black"
                style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
              >
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black mb-1" style={{ fontFamily: "'Rubik', sans-serif" }}>
                0
              </div>
              <p className="text-xs text-gray-600" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Awaiting response
              </p>
            </CardContent>
          </Card>

          <Card className="border-black bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-bold text-black"
                style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
              >
                Accepted
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black mb-1" style={{ fontFamily: "'Rubik', sans-serif" }}>
                0
              </div>
              <p className="text-xs text-gray-600" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Successful applications
              </p>
            </CardContent>
          </Card>

          <Card className="border-black bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-bold text-black"
                style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
              >
                Collaborations
              </CardTitle>
              <Users className="h-5 w-5 text-black" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-black mb-1" style={{ fontFamily: "'Rubik', sans-serif" }}>
                0
              </div>
              <p className="text-xs text-gray-600" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Active partnerships
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-black bg-white">
            <CardHeader>
              <CardTitle style={{ fontFamily: "'Rubik', sans-serif", color: "#000" }}>Getting Started</CardTitle>
              <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Complete these steps to start collaborating with businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-lg font-bold">
                  ✓
                </div>
                <span className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Set up your community profile
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#FFD861] text-black rounded-full flex items-center justify-center text-base font-bold">
                    2
                  </div>
                  <span className="text-base text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Browse available offers
                  </span>
                </div>
                <Link to="/community/offers">
                  <Button variant="outline" size="sm" className="border-[#FFD861] text-black">
                    Browse Offers
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#FFD861] text-black rounded-full flex items-center justify-center text-base font-bold">
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
              <CardTitle style={{ fontFamily: "'Rubik', sans-serif", color: "#000" }}>Recent Offers</CardTitle>
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
                <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Check back soon for new opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="border-black bg-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "'Rubik', sans-serif", color: "#000" }}>Tips for Success</CardTitle>
            <CardDescription style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
              Maximize your collaboration potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FFF7E0] rounded-lg">
                <h4 className="font-medium mb-2 text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Complete Your Profile
                </h4>
                <p className="text-sm text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  A detailed profile increases your chances of being accepted for collaborations.
                </p>
              </div>
              <div className="p-4 bg-[#FFF7E0] rounded-lg">
                <h4 className="font-medium mb-2 text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Write Compelling Applications
                </h4>
                <p className="text-sm text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Personalize each application to show why you're the perfect fit.
                </p>
              </div>
              <div className="p-4 bg-[#FFF7E0] rounded-lg">
                <h4 className="font-medium mb-2 text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                  Build Your Reputation
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
