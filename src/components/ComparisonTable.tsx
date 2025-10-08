import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Minus } from "lucide-react";

const ComparisonTable = () => {
  const comparisonData = [
    {
      feature: "Community Discovery",
      kolabing: "verified",
      ads: "none",
      influencers: "none",
    },
    {
      feature: "Performance Tracking",
      kolabing: "Clear",
      ads: "basic",
      influencers: "limited",
    },
    {
      feature: "Brand Engagement",
      kolabing: "authentic",
      ads: "low",
      influencers: "variable",
    },
    {
      feature: "Direct Revenue",
      kolabing: "measurable",
      ads: "unclear",
      influencers: "unclear",
    },
    {
      feature: "Content Impact",
      kolabing: "authentic",
      ads: "commercial",
      influencers: "performative",
    },
  ];

  const getIcon = (value: string, isKolabing: boolean = false) => {
    if (isKolabing) {
      return <Check className="w-5 h-5 text-green-400" />;
    }

    if (
      value.includes("limited") ||
      value.includes("low") ||
      value.includes("unclear") ||
      value.includes("generic") ||
      value.includes("manual") ||
      value.includes("basic") ||
      value.includes("hard to measure") ||
      value.includes("inconsistent")
    ) {
      return <X className="w-5 h-5 text-red-400" />;
    }

    return <Minus className="w-5 h-5 text-yellow-400" />;
  };

  const formatValue = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-rubik font-bold text-foreground mb-4">Why Choose Kolabing?</h2>
          <p className="text-xl font-darker-grotesque text-muted-foreground max-w-2xl mx-auto">
            Compare us with traditional advertising and influencer marketing
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <Table className="w-full bg-black">
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-black">
                <TableHead className="text-left font-rubik font-bold text-lg text-white">Features</TableHead>
                <TableHead className="text-center font-rubik font-bold text-lg text-white bg-gray-900">
                  Kolabing
                </TableHead>
                <TableHead className="text-center font-rubik font-bold text-lg text-white">Traditional Ads</TableHead>
                <TableHead className="text-center font-rubik font-bold text-lg text-white">Influencers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => (
                <TableRow key={index} className="border-gray-800 hover:bg-gray-900">
                  <TableCell className="font-darker-grotesque font-semibold text-white py-6">{row.feature}</TableCell>
                  <TableCell className="text-center py-6 bg-gray-900">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.kolabing, true)}
                      <span className="font-darker-grotesque font-medium text-white">{formatValue(row.kolabing)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.ads)}
                      <span className="font-darker-grotesque text-gray-300">{formatValue(row.ads)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.influencers)}
                      <span className="font-darker-grotesque text-gray-300">{formatValue(row.influencers)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-center mt-12">
          <p className="font-darker-grotesque text-muted-foreground max-w-2xl mx-auto">
            Get authentic community partnerships with measurable results and transparent performance tracking
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
