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
import { CalendarIcon, ArrowLeft, Save, Send, Info } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BG_SECTION = "#F3F4F6";
const BG_INPUT = "#E5E7EB";
const TEXT_DARK = "#232323";

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
        title: data.title,
        description: data.description,
        availability_mode: data.availability_mode,
        availability_start: data.availability_start?.toISOString(),
        availability_end: data.availability_end?.toISOString(),
        recurring_day: data.recurring_day,
        recurring_time: data.recurring_time,
        venue_mode: data.venue_mode,
        address: data.address,
        preferred_city: data.preferred_city,
        preferred_area: data.preferred_area,
        use_profile_photo: data.use_profile_photo,
        offer_photo: finalOfferPhoto,
        business_offer: data.business_offer,
        community_deliverables: data.community_deliverables,
        creator_profile_id: communityProfile.profile_id,
        creator_profile_type: "community" as const,
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
    <div style={{ minHeight: "100vh", background: "#fff" }} className="py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/community/my-opportunities")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Requests
          </Button>
          <div>
            <h1 style={{ color: TEXT_DARK, fontSize: 30, fontWeight: 900 }}>Create New Request</h1>
            <p style={{ color: "#606060" }}>Design your collaboration opportunity</p>
          </div>
        </div>
        <Form {...form}>
          <form className="space-y-6">
            {/* Basic Information */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Basic Information</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Provide the essential details about your collaboration request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Request Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Looking for venue partner for monthly meetups"
                          style={{
                            background: BG_INPUT,
                            color: TEXT_DARK,
                            border: "none",
                            fontFamily: "Open Sans, Arial, sans-serif",
                          }}
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
                      <FormLabel style={{ color: TEXT_DARK }}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your collaboration opportunity in detail..."
                          style={{
                            background: BG_INPUT,
                            color: TEXT_DARK,
                            border: "none",
                            fontFamily: "Open Sans, Arial, sans-serif",
                          }}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* Availability */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Availability</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  When are you available for this collaboration?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="availability_start"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel style={{ color: TEXT_DARK }}>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                style={{
                                  background: BG_INPUT,
                                  color: TEXT_DARK,
                                  border: "none",
                                  fontFamily: "Open Sans, Arial, sans-serif",
                                }}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability_end"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel style={{ color: TEXT_DARK }}>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                style={{
                                  background: BG_INPUT,
                                  color: TEXT_DARK,
                                  border: "none",
                                  fontFamily: "Open Sans, Arial, sans-serif",
                                }}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Location */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Location</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Where will this collaboration take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="venue_mode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "no_venue"}
                          onCheckedChange={() =>
                            form.setValue(
                              "venue_mode",
                              form.watch("venue_mode") === "no_venue" ? "i_have_venue" : "no_venue",
                            )
                          }
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel style={{ color: TEXT_DARK }}>No physical venue required</FormLabel>
                        <p style={{ color: "#606060", fontSize: 14 }}>
                          Check this if the collaboration is online or doesn't require a specific location
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("venue_mode") !== "no_venue" && (
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: TEXT_DARK }}>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the collaboration venue address"
                            style={{
                              background: BG_INPUT,
                              color: TEXT_DARK,
                              border: "none",
                              fontFamily: "Open Sans, Arial, sans-serif",
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="preferred_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Preferred City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City (optional)"
                          style={{
                            background: BG_INPUT,
                            color: TEXT_DARK,
                            border: "none",
                            fontFamily: "Open Sans, Arial, sans-serif",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferred_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Preferred Area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Area or neighborhood (optional)"
                          style={{
                            background: BG_INPUT,
                            color: TEXT_DARK,
                            border: "none",
                            fontFamily: "Open Sans, Arial, sans-serif",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* Photo Upload */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Request Photo</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Upload a photo for your request (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="use_profile_photo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>
                        Use your community profile photo
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {!form.watch("use_profile_photo") && (
                  <FileUpload
                    bucket="offer-photos"
                    value={form.watch("offer_photo")}
                    onChange={(url) => form.setValue("offer_photo", url)}
                    label="Request Photo"
                    accept="image/*"
                  />
                )}
              </CardContent>
            </Card>
            {/* What You Offer */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What You're Offering</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Describe what your community is providing to the business partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="business_offer.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Your Offer</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Attendees, social content, photography, UGC, etc."
                          className="min-h-[80px]"
                          style={{
                            background: BG_INPUT,
                            color: TEXT_DARK,
                            border: "none",
                            fontFamily: "Open Sans, Arial, sans-serif",
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* Community Deliverables */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What Do You Expect?</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Select the deliverables you expect from the business partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {deliverableOptions.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <FormField
                        control={form.control}
                        name={`community_deliverables.${option.id}` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={typeof field.value === "number" ? Boolean(field.value) : Boolean(field.value)}
                                onCheckedChange={(checked) => {
                                  if (option.hasAmount) {
                                    field.onChange(checked ? 1 : undefined);
                                  } else {
                                    field.onChange(checked);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {option.hasAmount && form.watch(`community_deliverables.${option.id}` as any) && (
                        <FormField
                          control={form.control}
                          name={`community_deliverables.${option.id}` as any}
                          render={({ field }) => (
                            <FormItem className="ml-6">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`How many ${option.label.toLowerCase()}?`}
                                  style={{
                                    background: BG_INPUT,
                                    color: TEXT_DARK,
                                    border: "none",
                                    fontFamily: "Open Sans, Arial, sans-serif",
                                  }}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit((data) => handleSubmit(data, "draft"))}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit((data) => handleSubmit(data, "published"))}
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Request
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CommunityOpportunitiesNew;
