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

  const getIcon = (value, isKolabing = false) => {
    if (isKolabing) {
      return <Check className="w-5 h-5 text-green-600" />;
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
      return <X className="w-5 h-5 text-red-600" />;
    }
    return <Minus className="w-5 h-5 text-yellow-500" />;
  };

  const formatValue = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="overflow-x-auto rounded-lg">
          <Table className="w-full" style={{ background: "transparent" }}>
            <TableHeader>
              <TableRow className="border border-black">
                <TableHead
                  className="
                    text-center
                    font-darker-grotesque
                    font-bold
                    uppercase
                    text-lg
                    text-black
                    border border-black
                    bg-transparent
                  "
                  style={{ letterSpacing: "0.06em" }}
                >
                  FEATURES
                </TableHead>
                <TableHead
                  className="
                    text-center
                    font-darker-grotesque
                    font-bold
                    uppercase
                    text-lg
                    text-black
                    border border-black
                  "
                  style={{
                    backgroundColor: "#FFD861",
                    letterSpacing: "0.06em",
                  }}
                >
                  KOLABING
                </TableHead>
                <TableHead
                  className="
                    text-center
                    font-darker-grotesque
                    font-bold
                    uppercase
                    text-lg
                    text-black
                    border border-black
                    bg-transparent
                  "
                  style={{ letterSpacing: "0.06em" }}
                >
                  TRADITIONAL ADS
                </TableHead>
                <TableHead
                  className="
                    text-center
                    font-darker-grotesque
                    font-bold
                    uppercase
                    text-lg
                    text-black
                    border border-black
                    bg-transparent
                  "
                  style={{ letterSpacing: "0.06em" }}
                >
                  INFLUENCERS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => (
                <TableRow key={index} className="border border-black">
                  <TableCell className="text-center font-darker-grotesque font-semibold text-black py-6 uppercase border border-black bg-transparent">
                    {row.feature}
                  </TableCell>
                  <TableCell className="text-center py-6 border border-black" style={{ backgroundColor: "#FFD861" }}>
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.kolabing, true)}
                      <span className="font-darker-grotesque font-bold text-black uppercase">
                        {formatValue(row.kolabing)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6 font-darker-grotesque text-black uppercase border border-black bg-transparent">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.ads)}
                      <span className="font-darker-grotesque text-black uppercase">{formatValue(row.ads)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6 font-darker-grotesque text-black uppercase border border-black bg-transparent">
                    <div className="flex items-center justify-center space-x-2">
                      {getIcon(row.influencers)}
                      <span className="font-darker-grotesque text-black uppercase">{formatValue(row.influencers)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
