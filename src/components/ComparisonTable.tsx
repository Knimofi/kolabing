import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Minus } from 'lucide-react';

const ComparisonTable = () => {
  const comparisonData = [
    {
      feature: 'Community Discovery',
      kolabing: 'verified',
      ads: 'none',
      influencers: 'none'
    },
    {
      feature: 'Performance Tracking',
      kolabing: 'Clear',
      ads: 'basic',
      influencers: 'limited'
    },
    {
      feature: 'Brand Engagement',
      kolabing: 'authentic',
      ads: 'low',
      influencers: 'variable'
    },
    {
      feature: 'Direct Revenue',
      kolabing: 'measurable',
      ads: 'unclear',
      influencers: 'unclear'
    },
    {
      feature: 'Content Impact',
      kolabing: 'authentic',
      ads: 'commercial',
      influencers: 'performative'
    }
  ];

  const getIcon = (value: string, isKolabing: boolean = false) => {
    if (isKolabing) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    
    if (value.includes('limited') || value.includes('low') || value.includes('unclear') || 
        value.includes('generic') || value.includes('manual') || value.includes('basic') ||
        value.includes('hard to measure') || value.includes('inconsistent')) {
      return <X className="w-5 h-5 text-red-500" />;
    }
    
    return <Minus className="w-5 h-5 text-yellow-500" />;
  };

  const formatValue = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Kolabing?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare us with traditional advertising and influencer marketing
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-left font-bold text-lg text-foreground">Features</TableHead>
                <TableHead className="text-center font-bold text-lg text-primary bg-primary/5">Kolabing</TableHead>
                <TableHead className="text-center font-bold text-lg text-muted-foreground">Traditional Ads</TableHead>
                <TableHead className="text-center font-bold text-lg text-muted-foreground">Influencers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => (
                <TableRow key={index} className="border-border hover:bg-muted/50">
                  <TableCell className="font-semibold text-foreground py-6">
                    {row.feature}
                  </TableCell>
                  <TableCell className="text-center py-6 bg-primary/5">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.kolabing, true)}
                      <span className="font-medium text-foreground">{formatValue(row.kolabing)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.ads)}
                      <span className="text-muted-foreground">{formatValue(row.ads)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.influencers)}
                      <span className="text-muted-foreground">{formatValue(row.influencers)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get authentic community partnerships with measurable results and transparent performance tracking
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;