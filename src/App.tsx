import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessOffers from "./pages/business/BusinessOffers";
import BusinessProfile from "./pages/business/BusinessProfile";
import CommunityDashboard from "./pages/community/CommunityDashboard";
import CommunityOffers from "./pages/community/CommunityOffers";
import CommunityProfile from "./pages/community/CommunityProfile";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            
            {/* Business Routes */}
            <Route path="/business/*" element={
              <ProtectedRoute requiresType="business">
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<BusinessDashboard />} />
                    <Route path="/offers" element={<BusinessOffers />} />
                    <Route path="/offers/new" element={
                      <ComingSoon 
                        title="Create New Offer"
                        description="Design your collaboration opportunity"
                        features={[
                          "Multi-step offer creation wizard",
                          "Rich text description editor",
                          "Deliverable specifications",
                          "Collaboration goal selection"
                        ]}
                      />
                    } />
                    <Route path="/offers/:id" element={
                      <ComingSoon 
                        title="Offer Details"
                        description="View and manage your offer"
                      />
                    } />
                    <Route path="/collaborations" element={
                      <ComingSoon 
                        title="Collaborations"
                        description="Manage your active partnerships"
                        features={[
                          "Track collaboration progress",
                          "Communicate with partners",
                          "Mark collaborations complete",
                          "Schedule follow-ups"
                        ]}
                      />
                    } />
                    <Route path="/analytics" element={
                      <ComingSoon 
                        title="Analytics"
                        description="Track your collaboration performance"
                        features={[
                          "Application conversion rates",
                          "Collaboration success metrics",
                          "Community engagement insights",
                          "ROI tracking"
                        ]}
                      />
                    } />
                    <Route path="/plans" element={
                      <ComingSoon 
                        title="Subscription Plans"
                        description="Manage your subscription"
                        features={[
                          "View current plan details",
                          "Upgrade or downgrade plans",
                          "Billing history",
                          "Payment method management"
                        ]}
                      />
                    } />
                    <Route path="/profile" element={<BusinessProfile />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Community Routes */}
            <Route path="/community/*" element={
              <ProtectedRoute requiresType="community">
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<CommunityDashboard />} />
                    <Route path="/offers" element={<CommunityOffers />} />
                    <Route path="/offers/:id" element={
                      <ComingSoon 
                        title="Offer Details"
                        description="View offer details and apply"
                      />
                    } />
                    <Route path="/my-applications" element={
                      <ComingSoon 
                        title="My Applications"
                        description="Track your collaboration applications"
                        features={[
                          "View application status",
                          "Edit pending applications",
                          "Track response times",
                          "Application history"
                        ]}
                      />
                    } />
                    <Route path="/collaborations" element={
                      <ComingSoon 
                        title="Collaborations"
                        description="Manage your active partnerships"
                        features={[
                          "Track collaboration progress",
                          "Communicate with businesses",
                          "Submit deliverables",
                          "Complete post-collaboration surveys"
                        ]}
                      />
                    } />
                    <Route path="/analytics" element={
                      <ComingSoon 
                        title="Analytics"
                        description="Track your community performance"
                        features={[
                          "Application success rates",
                          "Collaboration completion stats",
                          "Trust score tracking",
                          "Earnings overview"
                        ]}
                      />
                    } />
                    <Route path="/profile" element={<CommunityProfile />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
