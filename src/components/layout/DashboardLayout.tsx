import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, Users, BarChart3, Settings, LogOut, Menu, X, Building2, UserCheck, CreditCard } from "lucide-react";
const RUBIK_BOLD = {
  fontFamily: "'Rubik', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  color: "#000"
};
const OPEN_SANS = {
  fontFamily: "'Open Sans', Arial, sans-serif",
  fontWeight: 400,
  color: "#000"
};
const DARKER_GROTESQUE = {
  fontFamily: "'Darker Grotesque', Arial, sans-serif",
  textTransform: "uppercase" as const,
  fontWeight: 400,
  color: "#000"
};
const DashboardLayout = ({
  children
}) => {
  const {
    profile,
    signOut
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isBusiness = profile?.user_type === "business";
  const businessNavItems = [{
    icon: LayoutDashboard,
    label: "Overview",
    href: "/business"
  }, {
    icon: FileText,
    label: "My Collab Requests",
    href: "/business/opportunities"
  }, {
    icon: Building2,
    label: "Find a Collab",
    href: "/business/browse"
  }, {
    icon: FileText,
    label: "Applications Submitted",
    href: "/business/my-applications"
  }, {
    icon: UserCheck,
    label: "Applications Received",
    href: "/business/applications"
  }, {
    icon: Users,
    label: "Collaborations",
    href: "/business/collaborations"
  }, {
    icon: Settings,
    label: "Profile",
    href: "/business/profile"
  }];
  const communityNavItems = [{
    icon: LayoutDashboard,
    label: "Overview",
    href: "/community"
  }, {
    icon: FileText,
    label: "My Collab Requests",
    href: "/community/my-opportunities"
  }, {
    icon: Building2,
    label: "Find a Collab",
    href: "/community/opportunities"
  }, {
    icon: FileText,
    label: "Applications Submitted",
    href: "/community/my-applications"
  }, {
    icon: UserCheck,
    label: "Applications Received",
    href: "/community/applications-received"
  }, {
    icon: Users,
    label: "Collaborations",
    href: "/community/collaborations"
  }, {
    icon: Settings,
    label: "Profile",
    href: "/community/profile"
  }];
  const navItems = isBusiness ? businessNavItems : communityNavItems;
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const closeSidebar = () => setSidebarOpen(false);
  return <div className="min-h-screen bg-background flex" style={{
    background: "#fff"
  }}>
      {/* Sidebar */}
      <aside className={`
          fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `} style={{
      background: "#FFFFFF",
      borderRight: "1px solid #F0F0F0",
      boxShadow: "2px 0 8px rgba(0, 0, 0, 0.02)"
    }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <img src="https://qcmperlkuujhweikoyru.supabase.co/storage/v1/object/sign/media/Logo_Kolabing-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mOWQ2MzU4NS1iNjc3LTQ1NGYtOTRhZS1iODg3NjU5MWU3OGIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9Mb2dvX0tvbGFiaW5nLXJlbW92ZWJnLXByZXZpZXcucG5nIiwiaWF0IjoxNzYwMDAwMjY3LCJleHAiOjE3OTE1MzYyNjd9.WlXIWFEuiQztblbyF1mWhhOva8mD5hcjKghi55y3jRo" alt="Kolabing Logo" className="w-8 h-8" />
              <span style={RUBIK_BOLD}>Kolabing</span>
            </Link>
            <button onClick={closeSidebar} className="md:hidden text-muted-foreground hover:text-foreground" aria-label="Close sidebar">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                {isBusiness ? <Building2 className="w-5 h-5 text-muted-foreground" /> : <Users className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <p style={{
                ...OPEN_SANS,
                fontSize: "14px",
                fontWeight: 600
              }}>{profile?.name}</p>
                <p style={{
                ...OPEN_SANS,
                fontSize: "12px"
              }}>{profile?.user_type} Account</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Main navigation">
            {navItems.map(item => {
            const isActive = location.pathname === item.href || item.href !== "/business" && item.href !== "/community" && location.pathname.startsWith(item.href);
            return <Link key={item.href} to={item.href} onClick={closeSidebar} style={{
              ...DARKER_GROTESQUE,
              background: isActive ? "#FFF9E6" : "transparent",
              color: isActive ? "#000" : "#4A4A4A",
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: isActive ? 600 : 500,
              borderLeft: isActive ? "3px solid #FFD861" : "3px solid transparent",
              transition: "all 0.15s ease"
            }} aria-current={isActive ? "page" : undefined} onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = "#F8F9FA";
            }} onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}>
                  <item.icon className="w-5 h-5" />
                  <span style={{
                marginLeft: 10
              }}>{item.label}</span>
                </Link>;
          })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" onClick={handleSignOut} style={{
            width: "100%",
            justifyContent: "start",
            color: "#444",
            fontFamily: "'Open Sans', Arial, sans-serif"
          }}>
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header style={{
        background: "#fff",
        borderBottom: "1px solid #eee",
        padding: "22px 36px"
      }}>
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground" aria-label="Open sidebar">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              <span style={{
              ...OPEN_SANS,
              fontSize: "15px",
              display: "inline",
              color: "#222"
            }}>
                Welcome back, {profile?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{
        background: "#F8F9FA"
      }} className="flex-1 p-4 md:p-6 bg-zinc-900">
          {children}
        </main>
      </div>
    </div>;
};
export default DashboardLayout;