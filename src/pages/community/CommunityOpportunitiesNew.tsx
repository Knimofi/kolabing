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

const BG_SECTION = "#F3F4F6";
const BG_INPUT = "#E5E7EB";
const TEXT_DARK = "#232323";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be under 1000 characters"),
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
      community_deliverables: {
        tagged_stories: undefined,
        google_reviews: undefined,
        number_of_attendees: undefined,
        professional_photography: false,
        professional_reel_video: false,
        ugc_content: false,
        collab_reel_post: false,
        group_picture: false,
        loyalty_signups: undefined,
        venue: false,
        event_creation: false,
        split_revenue: false,
        monetary_compensation: undefined,
      },
    },
  });

  const combinedChecklistOptions = [
    { id: "venue", label: "Venue", hasAmount: false },
    { id: "event_creation", label: "Event Creation", hasAmount: false },
    { id: "split_revenue", label: "Split Revenue", hasAmount: false },
    { id: "monetary_compensation", label: "Monetary Compensation (€)", hasAmount: true },
    { id: "tagged_stories", label: "Tagged Stories", hasAmount: true },
    { id: "google_reviews", label: "Google Reviews", hasAmount: true },
    { id: "number_of_attendees", label: "Number of Attendees", hasAmount: true },
    { id: "professional_photography", label: "Professional Photography", hasAmount: false },
    { id: "professional_reel_video", label: "Professional Reel/Video", hasAmount: false },
    { id: "ugc_content", label: "UGC Content", hasAmount: false },
    { id: "collab_reel_post", label: "Collab Reel/Post", hasAmount: false },
    { id: "group_picture", label: "Group Picture", hasAmount: false },
    { id: "loyalty_signups", label: "Loyalty Sign-ups", hasAmount: true },
  ] as const;

  const halfIndex = Math.ceil(combinedChecklistOptions.length / 2);
  const leftColumnOptions = combinedChecklistOptions.slice(0, halfIndex);
  const rightColumnOptions = combinedChecklistOptions.slice(halfIndex);

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
          description: "Community profile missing. Please complete your community profile setup.",
          variant: "destructive",
        });
        setIsSubmitting(false);
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
        availability_start: data.availability_mode === "date_range" ? data.availability_start?.toISOString() : null,
        availability_end: data.availability_mode === "date_range" ? data.availability_end?.toISOString() : null,
        recurring_day: data.availability_mode === "recurring" ? data.recurring_day : null,
        recurring_time: data.availability_mode === "recurring" ? data.recurring_time : null,
        venue_mode: data.venue_mode,
        address: data.venue_mode === "i_have_venue" ? data.address : null,
        preferred_city: data.venue_mode === "partner_provides" ? data.preferred_city : null,
        preferred_area: data.venue_mode === "partner_provides" ? data.preferred_area : null,
        no_venue: data.venue_mode === "no_venue",
        use_profile_photo: data.use_profile_photo,
        offer_photo: finalOfferPhoto,
        business_offer: data.business_offer,
        community_deliverables: data.community_deliverables,
        timeline_days: null,
        creator_profile_id: communityProfile.profile_id,
        creator_profile_type: "community",
        status,
      };

      const { error } = await supabase.from("collab_opportunities").insert([offerData]);

      if (error) throw error;

      toast({
        title: status === "draft" ? "Collab request saved as draft" : "Collab request published successfully",
        description:
          status === "draft"
            ? "You can publish it later from your dashboard."
            : "Your collab request is now live and businesses can apply.",
      });

      navigate("/community/my-opportunities");
    } catch (error: any) {
      console.error("Error creating collab request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create collab request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }} className="py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/community/my-opportunities")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Collab Requests
          </Button>
          <div>
            <h1 style={{ color: TEXT_DARK, fontSize: 30, fontWeight: 900 }}>Create a Collab Request</h1>
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
                  Provide the essential details about your collaboration opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Collab Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Looking for venue partner for monthly meetup"
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
                          placeholder="Describe what you're looking for..."
                          className="min-h-[100px]"
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

            {/* Availability */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Availability</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  When are you available for this collaboration?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="availability_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Availability Type</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="date_range" id="date_range" />
                            <Label htmlFor="date_range" style={{ color: TEXT_DARK }}>
                              Specific date range
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="recurring" id="recurring" />
                            <Label htmlFor="recurring" style={{ color: TEXT_DARK }}>
                              Recurring schedule
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("availability_mode") === "date_range" && (
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
                )}

                {form.watch("availability_mode") === "recurring" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recurring_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: TEXT_DARK }}>Day of Week</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger style={{ fontFamily: "Open Sans, Arial, sans-serif" }}>
                                <SelectValue placeholder="Select a day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                              <SelectItem value="saturday">Saturday</SelectItem>
                              <SelectItem value="sunday">Sunday</SelectItem>
                              <SelectItem value="everyday">Every day</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recurring_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: TEXT_DARK }}>Time (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              placeholder="e.g., 19:00"
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
                  </div>
                )}
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
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Venue Requirements</FormLabel>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no_venue" id="no_venue" />
                            <Label htmlFor="no_venue" style={{ color: TEXT_DARK }}>
                              No physical venue required
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="i_have_venue" id="i_have_venue" />
                            <Label htmlFor="i_have_venue" style={{ color: TEXT_DARK }}>
                              I have a venue
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partner_provides" id="partner_provides" />
                            <Label htmlFor="partner_provides" style={{ color: TEXT_DARK }}>
                              Collab partner provides venue
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("venue_mode") === "i_have_venue" && (
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: TEXT_DARK }}>Venue Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the venue address"
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

                {form.watch("venue_mode") === "partner_provides" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferred_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: TEXT_DARK }}>Preferred City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Barcelona"
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
                          <FormLabel style={{ color: TEXT_DARK }}>Preferred Area (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Eixample, Gracia..."
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Collaboration Photo</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Add a photo for your collaboration (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="use_profile_photo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel style={{ color: TEXT_DARK }}>Use my community's profile photo</FormLabel>
                        <p style={{ color: "#606060", fontSize: 14 }}>
                          Your profile photo will be used for this collaboration
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                {!form.watch("use_profile_photo") && (
                  <FileUpload
                    bucket="offer-photos"
                    value={form.watch("offer_photo")}
                    onChange={(url) => form.setValue("offer_photo", url)}
                    label="Collaboration Photo"
                    accept="image/*"
                  />
                )}
              </CardContent>
            </Card>

            {/* What can you offer? - merged checklist with 2 columns */}
            <Card style={{ background: BG_SECTION }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What can you offer?</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Select from options and describe what you provide to collaborators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="offer_input_mode"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="text" id="offer_text" />
                            <Label htmlFor="offer_text" style={{ color: TEXT_DARK }}>
                              Describe in your own words
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="checklist" id="offer_checklist" />
                            <Label htmlFor="offer_checklist" style={{ color: TEXT_DARK }}>
                              Select from options
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("offer_input_mode") === "text" && (
                  <FormField
                    control={form.control}
                    name="business_offer.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: TEXT_DARK }}>Your Offer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Social media promotion, event hosting, content creation..."
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
                )}

                {form.watch("offer_input_mode") === "checklist" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      {leftColumnOptions.map((option) => (
                        <div key={option.id} className="space-y-2">
                          <FormField
                            control={form.control}
                            name={`community_deliverables.${option.id}` as any}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
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
                                      placeholder={
                                        option.id === "monetary_compensation"
                                          ? "Amount in €"
                                          : `How many ${option.label.toLowerCase()}?`
                                      }
                                      style={{
                                        background: BG_INPUT,
                                        color: TEXT_DARK,
                                        border: "none",
                                        fontFamily: "Open Sans, Arial, sans-serif",
                                      }}
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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

                    {/* Right column */}
                    <div className="space-y-4">
                      {rightColumnOptions.map((option) => (
                        <div key={option.id} className="space-y-2">
                          <FormField
                            control={form.control}
                            name={`community_deliverables.${option.id}` as any}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
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
                                      placeholder={
                                        option.id === "monetary_compensation"
                                          ? "Amount in €"
                                          : `How many ${option.label.toLowerCase()}?`
                                      }
                                      style={{
                                        background: BG_INPUT,
                                        color: TEXT_DARK,
                                        border: "none",
                                        fontFamily: "Open Sans, Arial, sans-serif",
                                      }}
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={form.handleSubmit((data) => handleSubmit(data, "draft"))}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={form.handleSubmit((data) => handleSubmit(data, "published"))}
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Collab Request
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CommunityOpportunitiesNew;
