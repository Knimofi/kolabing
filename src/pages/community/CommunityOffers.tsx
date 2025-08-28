import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Calendar, Building2, Heart } from 'lucide-react';

const CommunityOffers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - will be replaced with real data from Supabase
  const offers = [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Browse Offers
        </h1>
        <p className="text-muted-foreground">
          Discover collaboration opportunities that match your community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search offers by title, business, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">All Categories</Button>
        <Button variant="outline" size="sm">Brand Awareness</Button>
        <Button variant="outline" size="sm">Content Creation</Button>
        <Button variant="outline" size="sm">Events</Button>
        <Button variant="outline" size="sm">Product Promotion</Button>
        <Button variant="outline" size="sm">Lead Generation</Button>
      </div>

      {/* Offers Grid */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No offers available yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                New collaboration opportunities will appear here. Check back soon!
              </p>
              <Button variant="outline">
                Notify Me of New Offers
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Example offer card structure - will be populated with real data */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">TechCorp Inc.</span>
                  </div>
                  <CardTitle className="text-lg">Sample Collaboration Offer</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                We're looking for tech communities to help promote our new developer tools...
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Brand Awareness</Badge>
                <Badge variant="secondary">Tech</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  San Francisco, CA (Remote OK)
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Available: Mar 15 - Apr 15, 2024
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  5 applications
                </div>
                <Button size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Load More */}
      {offers.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Offers
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommunityOffers;