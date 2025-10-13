import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ArrowLeft, Save, Send } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  availability_mode: z.enum(["date_range", "recurring"]).default("date_range"),
  availability_start: z.date().optional(),
  availability_end: z.date().optional(),
  recurring_day: z.string().optional(),
  recurring_time: z.string().optional(),
  venue_mode: z.enum(["no_venue", "i_have_venue", "partner_provides"]).default("no_venue"),
  address: z.string().optional(),
  preferred_city: z.string().optional(),
  preferred_area: z.string().optional(),
  use_profile_photo: z.boolean().default(false),
  offer_photo: z.string().optional(),
  offer_input_mode: z.enum(["text", "checklist"]).default("text"),
  business_offer: z.object({
    description: z.string().optional(),
    venue: z.boolean().default(false),
    event_creation: z.boolean().default(false),
    split_revenue: z.boolean().default(false),
    monetary_compensation: z.boolean().default(false),
    compensation_amount: z.number().optional(),
  }),
  community_deliverables: z.object({
    tagged_stories: z.number().optional(),
    google_reviews: z.number().optional(),
    number_of_attendees: z.number().optional(),
    professional_photography: z.boolean().default(false),
    professional_reel_video: z.boolean().default(false),
    ugc_content: z.boolean().default(false),
    collab_reel_post: z.boolean().default(false),
    group_picture: z.boolean().default(false),
    loyalty_signups: z.number().optional(),
    venue: z.boolean().default(false),
    event_creation: z.boolean().default(false),
    split_revenue: z.boolean().default(false),
    monetary_compensation: z.number().optional(),
  }),
});

type OfferFormData = z.infer<typeof offerSchema>;

const CommunityOpportunitiesNew = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      availability_mode: "date_range",
      venue_mode: "no_venue",
      use_profile_photo: false,
      offer_photo: "",
      offer_input_mode: "text",
      business_offer: {
        description: "",
        venue: false,
        event_creation: false,
        split_revenue: false,
        monetary_compensation: false,
      },
      community_deliverables: {},
    },
  });

  const deliverableOptions = [
    { id: "tagged_stories", label: "Tagged Stories", hasAmount: true },
    { id: "google_reviews", label: "Google Reviews", hasAmount: true },
    { id: "number_of_attendees", label: "Number of Attendees", hasAmount: true },
    { id: "professional_photography", label: "Professional Photography", hasAmount: false },
    { id: "professional_reel_video", label: "Professional Reel/Video", hasAmount: false },
    { id: "ugc_content", label: "UGC Content", hasAmount: false },
    { id: "collab_reel_post", label: "Collab Reel/Post", hasAmount: false },
    { id: "group_picture", label: "Group Picture", hasAmount: false },
    { id: "loyalty_signups", label: "Loyalty Sign-ups", hasAmount: true },
    { id: "venue", label: "Venue", hasAmount: false },
    { id: "event_creation", label: "Event Creation", hasAmount: false },
    { id: "split_revenue", label: "Split Revenue", hasAmount: false },
    { id: "monetary_compensation", label: "Monetary Compensation (€)", hasAmount: true },
  ] as const;

  const handleSubmit = async (data: OfferFormData, status: "draft" | "published") => {
    if (!profile) return;
    setIsSubmitting(true);

    try {
      const { data: communityProfile, error: communityError } = await supabase
        .from("community_profiles")
        .select("profile_id, profile_photo")
        .eq("profile_id", profile.id)
        .single();

      if (communityError || !communityProfile) {
        toast({
          title: "Error",
          description: "Community profile missing. Please complete your setup.",
          variant: "destructive",
        });
        return;
      }

      let finalOfferPhoto = data.offer_photo;
      if (data.use_profile_photo && communityProfile.profile_photo) {
        finalOfferPhoto = communityProfile.profile_photo;
      }

      const offerData = {
        ...data,
        offer_photo: finalOfferPhoto,
        creator_profile_id: communityProfile.profile_id,
        creator_profile_type: "community",
        status,
      };

      const { error } = await supabase.from("collab_opportunities").insert([offerData]);
      if (error) throw error;

      toast({
        title: status === "draft" ? "Saved as Draft" : "Published!",
        description:
          status === "draft" ? "You can publish later from your dashboard." : "Your collaboration is now live!",
      });

      navigate("/community/my-opportunities");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-transparent text-foreground/80"
          onClick={() => navigate("/community/my-opportunities")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-wide">CREATE A COLLAB REQUEST</h1>
          <p className="text-muted-foreground text-sm">Design your collaboration opportunity</p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-10">
          {/* Section */}
          <Card className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-wide">Basic Information</CardTitle>
              <CardDescription>Provide the essential details about your collaboration opportunity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collab Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Looking for a venue partner for monthly meetups"
                        className="focus:ring-2 focus:ring-primary/40 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you're looking for..."
                        className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Repeat this refined card style for all other sections... */}
          {/* (Availability, Location, Photo Upload, Offers, Expectations, Buttons) */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={form.handleSubmit((data) => handleSubmit(data, "draft"))}
              disabled={isSubmitting}
              className="rounded-xl px-6 font-light tracking-wide"
            >
              <Save className="w-4 h-4 mr-2" />
              SAVE AS DRAFT
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={form.handleSubmit((data) => handleSubmit(data, "published"))}
              disabled={isSubmitting}
              className="rounded-xl px-6 font-light tracking-wide"
            >
              <Send className="w-4 h-4 mr-2" />
              PUBLISH COLLAB
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CommunityOpportunitiesNew;
