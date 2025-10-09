import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const handleBookCall = () => {
    window.location.href = "https://cal.com/maria-perez/community-platform";
  };

  return (
    <section className="py-16 px-4 bg-white" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-wide uppercase mb-3"
            style={{
              fontFamily: "'Rubik', sans-serif",
              color: "#000",
              letterSpacing: "0.04em",
            }}
          >
            Choose Your Plan
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: "'Darker Grotesque', sans-serif",
              color: "#222",
            }}
          >
            Select the perfect plan for your business and start connecting with communities today.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {/* Standard Plan */}
          <Card className="flex-1 border-2 rounded-2xl hover:border-[#FFD861] transition-shadow duration-300 hover:shadow-lg relative bg-white">
            <CardHeader className="text-center pb-4">
              <CardTitle
                className="text-2xl font-extrabold mb-1"
                style={{ fontFamily: "'Rubik', sans-serif", color: "#000" }}
              >
                Standard Plan
              </CardTitle>
              <CardDescription className="text-base" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Ready to create events & invite communities?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 py-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Publish unlimited collaboration offers
                    <span className="ml-1 text-gray-500 text-sm font-normal">
                      — reach as many communities as you want
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Track your performance
                    <span className="ml-1 text-gray-500 text-sm font-normal">— clear analytics to measure results</span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Gain full visibility
                    <span className="ml-1 text-gray-500 text-sm font-normal">
                      — get your offers showcased to all our communities
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Enjoy priority support
                    <span className="ml-1 text-gray-500 text-sm font-normal">— fast help whenever you need it</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <button
                    onClick={handleBookCall}
                    className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-2"
                    style={{
                      backgroundColor: "#FFD861",
                      color: "#000",
                      fontFamily: "'Darker Grotesque', sans-serif",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Limited time launch offer - 50% OFF
                  </button>
                  <div className="flex flex-col items-center justify-center mb-2">
                    <span className="text-sm text-gray-400 line-through">280 Euro/month</span>
                    <span className="text-4xl font-extrabold text-black" style={{ fontFamily: "'Rubik', sans-serif" }}>
                      140 Euro/month
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full text-lg font-bold uppercase bg-[#FFD861] hover:bg-yellow-300 text-black border-2 border-[#FFD861] mt-2"
                    onClick={handleBookCall}
                  >
                    Book a Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Plan */}
          <Card className="flex-1 border-2 rounded-2xl hover:border-[#FFD861] transition-shadow duration-300 hover:shadow-lg relative bg-white">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span
                className="bg-[#FFD861] text-black px-4 py-2 rounded-full text-sm font-bold tracking-wide shadow"
                style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
              >
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle
                className="text-2xl font-extrabold mb-1"
                style={{ fontFamily: "'Rubik', sans-serif", color: "#000" }}
              >
                Agency Plan
              </CardTitle>
              <CardDescription className="text-base" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                Personalized services for businesses already familiar with communities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 py-2">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    We find the collaborations for you and select the best matches
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Priority Account Management
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Advanced Performance analytics and ROI
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Consulting on Marketing Strategy (content, offers, communities, more)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                  <span className="font-medium text-black" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Personalized Content Creation
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div
                    className="text-2xl font-extrabold text-black mb-2"
                    style={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    Custom Pricing
                  </div>
                  <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
                    Based on your specific needs
                  </p>
                  <Button
                    size="lg"
                    className="w-full text-lg font-bold uppercase bg-[#FFD861] hover:bg-yellow-300 text-black border-2 border-[#FFD861]"
                    onClick={handleBookCall}
                  >
                    Book a Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="max-w-2xl mx-auto text-gray-500" style={{ fontFamily: "'Darker Grotesque', sans-serif" }}>
            All plans include verified community access, secure payment processing, and comprehensive support.
            <br />
            Book a call to discuss which plan is right for your business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
