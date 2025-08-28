import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Eye, Edit, MoreHorizontal } from 'lucide-react';

const BusinessOffers = () => {
  // Mock data - will be replaced with real data from Supabase
  const offers = [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Offers
          </h1>
          <p className="text-muted-foreground">
            Create and manage your collaboration offers
          </p>
        </div>
        
        <Link to="/business/offers/new">
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create New Offer
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" size="sm">All Offers</Button>
        <Button variant="outline" size="sm">Draft</Button>
        <Button variant="outline" size="sm">Published</Button>
        <Button variant="outline" size="sm">Closed</Button>
        <Button variant="outline" size="sm">Completed</Button>
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No offers yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first collaboration offer to start connecting with communities.
              </p>
              <Link to="/business/offers/new">
                <Button>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Offer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Example offer card structure - will be populated with real data */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">Sample Offer Title</CardTitle>
                  <CardDescription className="mt-1">
                    Created on March 15, 2024
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Draft</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Sample offer description will go here...
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Brand Awareness</Badge>
                <Badge variant="secondary">Social Media</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  0 applications
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessOffers;