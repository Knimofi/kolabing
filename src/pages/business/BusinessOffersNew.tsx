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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, ArrowLeft, Save, Send, CheckCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const BG_PAGE = "#F7F8FA";
const BG_SECTION = "#fff";
const BG_INPUT = "#F5F6F8";
const TEXT_DARK = "#232323";
const CARD_SHADOW = "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)";
const CARD_BORDER = "1px solid #EBEBEB";
const CARD_RADIUS = "14px";

const atLeastOneChecked = (obj: any) =>
  Object.values(obj || {}).some((val) => (typeof val === "number" && val > 0) || val === true);

const offerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be under 1000 characters"),
  availability_start: z.date().optional(),
  availability_end: z.date().optional(),
  address: z.string().optional(),
  no_venue: z.boolean().default(false),
  offer_photo: z.string().optional(),
  business_offer: z.object({
    description: z.string().min(1, "Business offer is required"),
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
    minimum_consumption: z.number().optional(),
  }),
  timeline_days: z.number().min(1, "Timeline is required").max(365, "Timeline must be under 365 days"),
  intent: z.enum(["draft", "published"]).default("draft"),
}).superRefine((data, ctx) => {
  // Only validate strictly for publish intent
  if (data.intent === "published") {
    // Validate at least one deliverable
    if (!atLeastOneChecked(data.community_deliverables)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one community deliverable for publishing",
        path: ["community_deliverables"],
      });
    }
    
    // Validate venue/address
    if (!data.no_venue && !data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required if no venue checkbox is not checked",
        path: ["address"],
      });
    }
  }
});

type OfferFormData = z.infer<typeof offerSchema>;

const BusinessOffersNew = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      no_venue: false,
      offer_photo: "",
      business_offer: {
        description: "",
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
        minimum_consumption: undefined,
      },
      timeline_days: 7,
      intent: "draft",
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
  ] as const;

  const handleSubmit = async (data: OfferFormData) => {
    if (!profile) return;

    const status = data.intent;
    
    // Dev mode: log validation blocks
    if (import.meta.env.DEV && !form.formState.isValid) {
      console.log("[Validation Blocked]", form.formState.errors);
    }
    
    // Scroll to first error if validation fails
    if (!form.formState.isValid) {
      form.setError("root", {
        message: "Please fix the errors below before " + (status === "published" ? "publishing" : "saving"),
      });
      const firstErrorField = Object.keys(form.formState.errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data: businessProfile, error: businessError } = await supabase
        .from("business_profiles")
        .select("profile_id")
        .eq("profile_id", profile.id)
        .single();

      if (businessError || !businessProfile) {
        console.error("[BusinessOffersNew] Profile fetch error:", businessError);
        toast({
          title: "Error",
          description: "Business profile missing. Please complete your business profile setup.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Defensive check: Ensure profile IDs match
      if (businessProfile.profile_id !== profile.id) {
        console.warn("[BusinessOffersNew] Profile ID mismatch!", {
          businessProfileId: businessProfile.profile_id,
          authProfileId: profile.id,
        });
        toast({
          title: "Profile Error",
          description: "Profile ID mismatch detected. Please contact support.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const offerData = {
        title: data.title,
        description: data.description,
        availability_start: data.availability_start?.toISOString(),
        availability_end: data.availability_end?.toISOString(),
        address: data.no_venue ? null : data.address,
        no_venue: data.no_venue,
        offer_photo: data.offer_photo,
        business_offer: data.business_offer,
        community_deliverables: data.community_deliverables,
        timeline_days: data.timeline_days,
        creator_profile_id: businessProfile.profile_id,
        creator_profile_type: "business",
        status,
      };

      console.log("[BusinessOffersNew] Attempting to insert offer:", offerData);

      const { data: insertedOffer, error } = await supabase
        .from("collab_opportunities")
        .insert([offerData])
        .select("id")
        .single();

      if (error) {
        console.error("[BusinessOffersNew] Insert error:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        
        // Map known errors to friendly messages
        if (error.message.includes("subscription")) {
          toast({
            title: "Subscription Required",
            description: "You need an active subscription to publish. Please visit Business Plans.",
            variant: "destructive",
          });
        } else if (error.code === "42501" || error.message.includes("policy")) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to publish this request. Please sign in again or contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to ${status === "published" ? "publish" : "save"}: ${error.message}`,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return;
      }

      console.log("[BusinessOffersNew] Successfully created offer:", insertedOffer);

      toast({
        title: status === "draft" ? "Offer saved as draft" : "Offer published successfully",
        description:
          status === "draft"
            ? "You can publish it later from your offers dashboard."
            : "Your offer is now live and communities can apply.",
      });

      navigate("/business/opportunities");
    } catch (error: any) {
      console.error("[BusinessOffersNew] Submission failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG_PAGE }} className="py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/business/opportunities")}>
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
            {/* Top-of-form error alert */}
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}
            
            {/* Basic Information */}
            <Card
              style={{ background: BG_SECTION, border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
            >
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
                          placeholder="e.g., Instagram Partnership for Coffee Shop"
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
            <Card
              style={{ background: BG_SECTION, border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
            >
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
            <Card
              style={{ background: BG_SECTION, border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
            >
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Location</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Where will this collaboration take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="no_venue"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                {!form.watch("no_venue") && (
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
              </CardContent>
            </Card>
            {/* Photo Upload */}
            <Card
              style={{ background: BG_SECTION, border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
            >
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>Request Photo</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Upload a photo for your request (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  bucket="offer-photos"
                  value={form.watch("offer_photo")}
                  onChange={(url) => form.setValue("offer_photo", url)}
                  label="Request Photo"
                  accept="image/*"
                />
              </CardContent>
            </Card>
            {/* Business Offer */}
            <Card
              style={{ background: BG_SECTION, border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
            >
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What You're Offering</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Describe what you're providing to the community
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
                          placeholder="e.g., Free products, monetary compensation, exclusive access..."
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
            <Card
              style={{ background: BG_SECTION, border: CARD_BORDER, borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
            >
              <CardHeader>
                <CardTitle style={{ color: TEXT_DARK }}>What do you expect from the community?</CardTitle>
                <CardDescription style={{ color: "#606060" }}>
                  Select the deliverables you expect from your community partner
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
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                  <FormField
                    control={form.control}
                    name="community_deliverables.minimum_consumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: TEXT_DARK }}>Minimum Consumption in Place (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter minimum consumption amount"
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
                </div>
                <FormField
                  control={form.control}
                  name="timeline_days"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel style={{ color: TEXT_DARK }}>Timeline (days after collaboration)</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <Info size={14} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>How much time a community has to finish all deliverables.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of days to complete deliverables"
                          style={{
                            background: BG_INPUT,
                            color: TEXT_DARK,
                            border: "none",
                            fontFamily: "Open Sans, Arial, sans-serif",
                          }}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit(
                  (data) => {
                    if (import.meta.env.DEV) console.log("[BusinessOffersNew] Draft submit clicked", { data });
                    handleSubmit({ ...data, intent: "draft" });
                  },
                  (errors) => {
                    console.warn("[BusinessOffersNew] Draft submit blocked by validation", errors);
                    form.setError("root", { message: "Please fix the errors below before saving" });
                    const firstErrorField = Object.keys(errors || {})[0];
                    if (firstErrorField) {
                      const element = document.querySelector(`[name="${firstErrorField}"]`);
                      element?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }
                )}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(
                  (data) => {
                    if (import.meta.env.DEV) console.log("[BusinessOffersNew] Publish submit clicked", { data });
                    handleSubmit({ ...data, intent: "published" });
                  },
                  (errors) => {
                    console.warn("[BusinessOffersNew] Publish submit blocked by validation", errors);
                    form.setError("root", { message: "Please fix the errors below before publishing" });
                    const firstErrorField = Object.keys(errors || {})[0];
                    if (firstErrorField) {
                      const element = document.querySelector(`[name="${firstErrorField}"]`);
                      element?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }
                )}
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Publishing..." : "Publish Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BusinessOffersNew;
