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
import { CalendarIcon, ArrowLeft, Save, Send } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";

const BG_PAGE = "#F7F8FA"; // uniform greyish background
const BG_SECTION = "#fff"; // cards are white for lifted effect
const CARD_SHADOW = "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)";
const CARD_RADIUS = "14px";
const TEXT_DARK = "#232323";
const CHIP_YELLOW = "#FFD861"; // Use this for main buttons and chips

const checklistOptions = [
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
];

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

  offer_input_mode: z.enum(["checklist", "text"]).default("text"),
  offer_checklist: z.record(z.union([z.boolean(), z.number()])).optional(),
  offer_text: z.string().optional(),

  expect_input_mode: z.enum(["checklist", "text"]).default("checklist"),
  expect_checklist: z.record(z.union([z.boolean(), z.number()])).optional(),
  expect_text: z.string().optional(),
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
      offer_checklist: {},
      offer_text: "",
      expect_input_mode: "checklist",
      expect_checklist: {},
      expect_text: "",
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

        offer_input_mode: data.offer_input_mode,
        offer_checklist: data.offer_checklist,
        offer_text: data.offer_text,
        expect_input_mode: data.expect_input_mode,
        expect_checklist: data.expect_checklist,
        expect_text: data.expect_text,
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

  // Card style shortcut
  const cardStyles = {
    background: BG_SECTION,
    boxShadow: CARD_SHADOW,
    borderRadius: CARD_RADIUS,
    border: "1px solid #EBEBEB",
  };

  // Button styles
  const mainButtonStyles = {
    background: CHIP_YELLOW,
    color: TEXT_DARK,
    fontWeight: 700,
    borderRadius: "8px",
    boxShadow: "0 1.5px 4px 0 rgba(55, 73, 87, 0.11)",
    border: "none",
  };

  const outlineButtonStyles = {
    background: "#fff",
    color: TEXT_DARK,
    fontWeight: 500,
    borderRadius: "8px",
    boxShadow: "0 1.5px 3px 0 rgba(55,73,87,0.08)",
    border: "1px solid #EBEBEB",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG_PAGE,
        padding: "32px 0 0 0",
      }}
      className="flex flex-col items-center"
    >
      <div className="w-full max-w-2xl space-y-6 mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            style={{
              ...mainButtonStyles,
              padding: "10px 22px",
              fontSize: "16px",
            }}
            onClick={() => navigate("/community/my-opportunities")}
          >
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
            <Card style={cardStyles}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Basic Information</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Provide essential details about your collaboration request
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
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
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
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
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
            <Card style={cardStyles}>
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
                      <FormLabel style={{ color: TEXT_DARK }}>Mode</FormLabel>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          style={{
                            ...mainButtonStyles,
                            background: field.value === "date_range" ? CHIP_YELLOW : "#fff",
                            color: field.value === "date_range" ? TEXT_DARK : TEXT_DARK,
                            border: field.value === "date_range" ? "none" : "1px solid #EBEBEB",
                          }}
                          onClick={() => field.onChange("date_range")}
                        >
                          Date Range
                        </Button>
                        <Button
                          type="button"
                          style={{
                            ...mainButtonStyles,
                            background: field.value === "recurring" ? CHIP_YELLOW : "#fff",
                            color: field.value === "recurring" ? TEXT_DARK : TEXT_DARK,
                            border: field.value === "recurring" ? "none" : "1px solid #EBEBEB",
                          }}
                          onClick={() => field.onChange("recurring")}
                        >
                          Recurring
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("availability_mode") === "date_range" ? (
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
                                    ...outlineButtonStyles,
                                    borderRadius: "8px",
                                    padding: "10px",
                                    textAlign: "left",
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
                                    ...outlineButtonStyles,
                                    borderRadius: "8px",
                                    padding: "10px",
                                    textAlign: "left",
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recurring_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: TEXT_DARK }}>Day</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Every Tuesday"
                              style={{
                                background: "#F5F6F8",
                                color: TEXT_DARK,
                                border: "none",
                                borderRadius: "8px",
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
                      name="recurring_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: TEXT_DARK }}>Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 18:00 - 21:00"
                              style={{
                                background: "#F5F6F8",
                                color: TEXT_DARK,
                                border: "none",
                                borderRadius: "8px",
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
            <Card style={cardStyles}>
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
                      <FormLabel style={{ color: TEXT_DARK }}>Venue Mode</FormLabel>
                      <div className="flex gap-4">
                        {["no_venue", "i_have_venue", "partner_provides"].map((mode) => (
                          <Button
                            key={mode}
                            type="button"
                            style={{
                              ...mainButtonStyles,
                              background: field.value === mode ? CHIP_YELLOW : "#fff",
                              color: field.value === mode ? TEXT_DARK : TEXT_DARK,
                              border: field.value === mode ? "none" : "1px solid #EBEBEB",
                            }}
                            onClick={() => field.onChange(mode)}
                          >
                            {mode === "no_venue"
                              ? "No Venue"
                              : mode === "i_have_venue"
                                ? "I Have Venue"
                                : "Partner Provides"}
                          </Button>
                        ))}
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
                              background: "#F5F6F8",
                              color: TEXT_DARK,
                              border: "none",
                              borderRadius: "8px",
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
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
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
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
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
            <Card style={cardStyles}>
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
            {/* What can you offer? */}
            <Card style={cardStyles}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What can you offer?</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Select from the list or write your own offering for the business partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    style={{
                      ...mainButtonStyles,
                      background: form.watch("offer_input_mode") === "checklist" ? CHIP_YELLOW : "#fff",
                      color: form.watch("offer_input_mode") === "checklist" ? TEXT_DARK : TEXT_DARK,
                      border: form.watch("offer_input_mode") === "checklist" ? "none" : "1px solid #EBEBEB",
                    }}
                    onClick={() => form.setValue("offer_input_mode", "checklist")}
                  >
                    Select from the list
                  </Button>
                  <Button
                    type="button"
                    style={{
                      ...mainButtonStyles,
                      background: form.watch("offer_input_mode") === "text" ? CHIP_YELLOW : "#fff",
                      color: form.watch("offer_input_mode") === "text" ? TEXT_DARK : TEXT_DARK,
                      border: form.watch("offer_input_mode") === "text" ? "none" : "1px solid #EBEBEB",
                    }}
                    onClick={() => form.setValue("offer_input_mode", "text")}
                  >
                    Write my own
                  </Button>
                </div>
                {form.watch("offer_input_mode") === "text" ? (
                  <FormField
                    control={form.control}
                    name="offer_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: TEXT_DARK }}>Offer details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your offering for the business partner..."
                            className="min-h-[100px]"
                            style={{
                              background: "#F5F6F8",
                              color: TEXT_DARK,
                              border: "none",
                              borderRadius: "8px",
                              fontFamily: "Open Sans, Arial, sans-serif",
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-4">
                    {checklistOptions.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <FormField
                          control={form.control}
                          name={`offer_checklist.${option.id}` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={option.hasAmount ? Number(field.value) > 0 : Boolean(field.value)}
                                  onCheckedChange={(checked) => {
                                    if (option.hasAmount) {
                                      field.onChange(checked ? 1 : 0);
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
                        {option.hasAmount && Number(form.watch(`offer_checklist.${option.id}`)) > 0 && (
                          <FormField
                            control={form.control}
                            name={`offer_checklist.${option.id}` as any}
                            render={({ field }) => (
                              <FormItem className="ml-6">
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder={`How many ${option.label.toLowerCase()}?`}
                                    style={{
                                      background: "#F5F6F8",
                                      color: TEXT_DARK,
                                      border: "none",
                                      borderRadius: "8px",
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
                )}
              </CardContent>
            </Card>
            {/* What do you expect from collaborators? */}
            <Card style={cardStyles}>
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What do you expect from collaborators?</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Select from the list or write your own expectations for the business partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    style={{
                      ...mainButtonStyles,
                      background: form.watch("expect_input_mode") === "checklist" ? CHIP_YELLOW : "#fff",
                      color: form.watch("expect_input_mode") === "checklist" ? TEXT_DARK : TEXT_DARK,
                      border: form.watch("expect_input_mode") === "checklist" ? "none" : "1px solid #EBEBEB",
                    }}
                    onClick={() => form.setValue("expect_input_mode", "checklist")}
                  >
                    Select from the list
                  </Button>
                  <Button
                    type="button"
                    style={{
                      ...mainButtonStyles,
                      background: form.watch("expect_input_mode") === "text" ? CHIP_YELLOW : "#fff",
                      color: form.watch("expect_input_mode") === "text" ? TEXT_DARK : TEXT_DARK,
                      border: form.watch("expect_input_mode") === "text" ? "none" : "1px solid #EBEBEB",
                    }}
                    onClick={() => form.setValue("expect_input_mode", "text")}
                  >
                    Write my own
                  </Button>
                </div>
                {form.watch("expect_input_mode") === "text" ? (
                  <FormField
                    control={form.control}
                    name="expect_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: TEXT_DARK }}>Expectations</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your expectations from the business partner..."
                            className="min-h-[100px]"
                            style={{
                              background: "#F5F6F8",
                              color: TEXT_DARK,
                              border: "none",
                              borderRadius: "8px",
                              fontFamily: "Open Sans, Arial, sans-serif",
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-4">
                    {checklistOptions.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <FormField
                          control={form.control}
                          name={`expect_checklist.${option.id}` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={option.hasAmount ? Number(field.value) > 0 : Boolean(field.value)}
                                  onCheckedChange={(checked) => {
                                    if (option.hasAmount) {
                                      field.onChange(checked ? 1 : 0);
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
                        {option.hasAmount && Number(form.watch(`expect_checklist.${option.id}`)) > 0 && (
                          <FormField
                            control={form.control}
                            name={`expect_checklist.${option.id}` as any}
                            render={({ field }) => (
                              <FormItem className="ml-6">
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder={`How many ${option.label.toLowerCase()}?`}
                                    style={{
                                      background: "#F5F6F8",
                                      color: TEXT_DARK,
                                      border: "none",
                                      borderRadius: "8px",
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
                )}
              </CardContent>
            </Card>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                style={outlineButtonStyles}
                onClick={form.handleSubmit((data) => handleSubmit(data, "draft"))}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="button"
                style={{
                  ...mainButtonStyles,
                  minWidth: "170px",
                  fontSize: "17px",
                  padding: "12px 0",
                }}
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
