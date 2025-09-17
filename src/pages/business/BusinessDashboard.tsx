import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, TrendingUp, AlertCircle } from 'lucide-react';
import ProfileSetupAlert from '@/components/ProfileSetupAlert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const BusinessDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    applications: 0,
    collaborations: 0
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
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('business_profile_id', profile!.id);

      // Fetch active (published) offers
      const { count: activeOffers } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('business_profile_id', profile!.id)
        .eq('status', 'published');

      // Fetch applications
      const { count: applications } = await supabase
        .from('applications')
        .select('offer_id!inner(*)', { count: 'exact', head: true })
        .eq('offer_id.business_profile_id', profile!.id);

      // Fetch collaborations
      const { count: collaborations } = await supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true })
        .eq('business_profile_id', profile!.id);

      setStats({
        totalOffers: totalOffers || 0,
        activeOffers: activeOffers || 0,
        applications: applications || 0,
        collaborations: collaborations || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Business Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your offers and track collaboration performance
          </p>
        </div>
        
        <Link to="/business/offers/new">
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create New Offer
          </Button>
        </Link>
      </div>

      {/* Profile Setup Alert */}
      <ProfileSetupAlert />

      {/* Subscription Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Subscription Required</h3>
              <p className="text-amber-800 text-sm mb-3">
                You need an active subscription to publish offers and connect with communities.
              </p>
              <Link to="/business/plans">
                <Button variant="outline" size="sm" className="border-amber-300 text-amber-900 hover:bg-amber-100">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.totalOffers}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOffers === 0 ? 'No offers created yet' : 'Total created offers'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.activeOffers}
            </div>
            <p className="text-xs text-muted-foreground">
              Published offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.applications}
            </div>
            <p className="text-xs text-muted-foreground">
              Total applications received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.collaborations}
            </div>
            <p className="text-xs text-muted-foreground">
              Active partnerships
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to start connecting with communities
            </CardDescription>
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
                <span className="text-sm">Create your first offer</span>
              </div>
              <Link to="/business/offers/new">
                <Button variant="outline" size="sm">
                  Create Offer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest collaboration updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Create an offer to start seeing activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDashboard;