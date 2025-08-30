import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Building2,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isBusiness = profile?.type === 'business';

  const businessNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/business' },
    { icon: FileText, label: 'Offers', href: '/business/offers' },
    { icon: Users, label: 'Collaborations', href: '/business/collaborations' },
    { icon: BarChart3, label: 'Analytics', href: '/business/analytics' },
    { icon: CreditCard, label: 'Plans', href: '/business/plans' },
    { icon: Settings, label: 'Profile', href: '/business/profile' },
  ];

  const communityNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/community' },
    { icon: FileText, label: 'Browse Offers', href: '/community/offers' },
    { icon: UserCheck, label: 'My Applications', href: '/community/my-applications' },
    { icon: Users, label: 'Collaborations', href: '/community/collaborations' },
    { icon: BarChart3, label: 'Analytics', href: '/community/analytics' },
    { icon: Settings, label: 'Profile', href: '/community/profile' },
  ];

  const navItems = isBusiness ? businessNavItems : communityNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-foreground">Kolabing</span>
            </Link>
            
            <button
              onClick={closeSidebar}
              className="md:hidden text-muted-foreground hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                {isBusiness ? (
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Users className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile?.type} Account
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== '/business' && item.href !== '/community' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-card border-b border-border p-4 md:p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome back, {profile?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;