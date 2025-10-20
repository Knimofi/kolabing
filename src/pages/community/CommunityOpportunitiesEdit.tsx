import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// Design tokens matching Create page
const BG_PAGE = "#F7F8FA";
const BG_SECTION = "#fff";
const CARD_SHADOW = "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)";
const CARD_RADIUS = "14px";
const TEXT_DARK = "#232323";
const CHIP_YELLOW = "#FFD861";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  availability_mode: z.enum(['date_range', 'recurring']).default('date_range'),
  availability_start: z.date().optional(),
  availability_end: z.date().optional(),
  recurring_day: z.string().optional(),
  recurring_time: z.string().optional(),
  venue_mode: z.enum(['no_venue', 'i_have_venue', 'partner_provides']).default('no_venue'),
  address: z.string().optional(),
  preferred_city: z.string().optional(),
  preferred_area: z.string().optional(),
  use_profile_photo: z.boolean().default(false),
  offer_photo: z.string().optional(),
  offer_input_mode: z.enum(['text', 'checklist']).default('text'),
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

const CommunityOpportunitiesEdit = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      availability_mode: 'date_range',
      venue_mode: 'no_venue',
      use_profile_photo: false,
      offer_photo: "",
      offer_input_mode: 'text',
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

  useEffect(() => {
    if (offerId && profile) fetchOffer();
  }, [offerId, profile]);

  const fetchOffer = async () => {
    if (!offerId || !profile) return;
    try {
      const { data, error } = await supabase
        .from("collab_opportunities")
        .select("*")
        .eq("id", offerId)
        .eq("creator_profile_id", profile.id)
        .single();
      if (error) throw error;

      // Determine venue mode from data
      let venueMode = 'no_venue';
      if (data.venue_mode) {
        venueMode = data.venue_mode;
      } else if (data.no_venue) {
        venueMode = 'no_venue';
      } else if (data.address) {
        venueMode = 'i_have_venue';
      } else if (data.preferred_city) {
        venueMode = 'partner_provides';
      }

      form.reset({
        title: data.title || "",
        description: data.description || "",
        availability_mode: (data.availability_mode === 'recurring' ? 'recurring' : 'date_range') as 'date_range' | 'recurring',
        availability_start: data.availability_start ? new Date(data.availability_start) : undefined,
        availability_end: data.availability_end ? new Date(data.availability_end) : undefined,
        recurring_day: data.recurring_day || undefined,
        recurring_time: data.recurring_time || undefined,
        venue_mode: venueMode as any,
        address: data.address || "",
        preferred_city: data.preferred_city || undefined,
        preferred_area: data.preferred_area || undefined,
        use_profile_photo: data.use_profile_photo || false,
        offer_photo: data.offer_photo || "",
        offer_input_mode: (data.business_offer as any)?.description ? 'text' : 'checklist',
        business_offer: {
          description: (data.business_offer as any)?.description || "",
          venue: (data.business_offer as any)?.venue || false,
          event_creation: (data.business_offer as any)?.event_creation || false,
          split_revenue: (data.business_offer as any)?.split_revenue || false,
          monetary_compensation: (data.business_offer as any)?.monetary_compensation || false,
          compensation_amount: (data.business_offer as any)?.compensation_amount,
        },
        community_deliverables: {
          tagged_stories: (data.community_deliverables as any)?.tagged_stories,
          google_reviews: (data.community_deliverables as any)?.google_reviews,
          number_of_attendees: (data.community_deliverables as any)?.number_of_attendees,
          professional_photography: (data.community_deliverables as any)?.professional_photography || false,
          professional_reel_video: (data.community_deliverables as any)?.professional_reel_video || false,
          ugc_content: (data.community_deliverables as any)?.ugc_content || false,
          collab_reel_post: (data.community_deliverables as any)?.collab_reel_post || false,
          group_picture: (data.community_deliverables as any)?.group_picture || false,
          loyalty_signups: (data.community_deliverables as any)?.loyalty_signups,
          venue: (data.community_deliverables as any)?.venue || false,
          event_creation: (data.community_deliverables as any)?.event_creation || false,
          split_revenue: (data.community_deliverables as any)?.split_revenue || false,
          monetary_compensation: (data.community_deliverables as any)?.monetary_compensation,
        },
      });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load collab request", variant: "destructive" });
      navigate("/community/my-opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async (data: OfferFormData, status: "draft" | "published") => {
    if (!offerId || !profile) return;
    setIsSubmitting(true);
    try {
      const { data: communityProfile } = await supabase
        .from('community_profiles')
        .select('profile_photo')
        .eq('profile_id', profile.id)
        .single();

      let finalOfferPhoto = data.offer_photo;
      if (data.use_profile_photo && communityProfile?.profile_photo) {
        finalOfferPhoto = communityProfile.profile_photo;
      }

      const { error } = await supabase
        .from("collab_opportunities")
        .update({
          title: data.title,
          description: data.description,
          availability_mode: data.availability_mode,
          availability_start: data.availability_mode === 'date_range' ? data.availability_start?.toISOString() : null,
          availability_end: data.availability_mode === 'date_range' ? data.availability_end?.toISOString() : null,
          recurring_day: data.availability_mode === 'recurring' ? data.recurring_day : null,
          recurring_time: data.availability_mode === 'recurring' ? data.recurring_time : null,
          venue_mode: data.venue_mode,
          address: data.venue_mode === 'i_have_venue' ? data.address : null,
          preferred_city: data.venue_mode === 'partner_provides' ? data.preferred_city : null,
          preferred_area: data.venue_mode === 'partner_provides' ? data.preferred_area : null,
          no_venue: data.venue_mode === 'no_venue',
          use_profile_photo: data.use_profile_photo,
          offer_photo: finalOfferPhoto,
          business_offer: data.business_offer,
          community_deliverables: data.community_deliverables,
          status,
        })
        .eq("id", offerId);

      if (error) throw error;

      toast({
        title: status === "draft" ? "Saved as draft" : "Published",
        description: status === "draft"
          ? "You can publish later from dashboard."
          : "Your collab request is live.",
      });

      navigate("/community/my-opportunities");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update collab request", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: BG_PAGE, padding: "32px 0" }}>
      <div className="container mx-auto px-6 space-y-6">
        <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/community/my-opportunities")}
          style={{
            background: "#fff",
            color: TEXT_DARK,
            fontWeight: 500,
            borderRadius: "8px",
            boxShadow: "0 1.5px 3px 0 rgba(55,73,87,0.08)",
            border: "1px solid #EBEBEB"
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Collab Requests
        </Button>
        <div>
          <h1 style={{ color: TEXT_DARK, fontSize: 30, fontWeight: 900 }}>Edit Collab Request</h1>
          <p style={{ color: "#606060" }}>Update your collaboration opportunity</p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information */}
          <Card style={{
            background: BG_SECTION,
            boxShadow: CARD_SHADOW,
            borderRadius: CARD_RADIUS,
            border: "1px solid #EBEBEB"
          }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT_DARK }}>Basic Information</CardTitle>
              <CardDescription style={{ color: "#606060" }}>Essential details about your collaboration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: TEXT_DARK }}>Collab Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Looking for venue partner for monthly meetup" 
                      {...field}
                      style={{
                        background: "#F5F6F8",
                        color: TEXT_DARK,
                        border: "none",
                        borderRadius: "8px",
                        fontFamily: "Open Sans, Arial, sans-serif"
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: TEXT_DARK }}>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your opportunity..." 
                      {...field}
                      style={{
                        background: "#F5F6F8",
                        color: TEXT_DARK,
                        border: "none",
                        borderRadius: "8px",
                        fontFamily: "Open Sans, Arial, sans-serif"
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Availability */}
          <Card style={{
            background: BG_SECTION,
            boxShadow: CARD_SHADOW,
            borderRadius: CARD_RADIUS,
            border: "1px solid #EBEBEB"
          }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT_DARK }}>Availability</CardTitle>
              <CardDescription style={{ color: "#606060" }}>When are you available for this collaboration?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="availability_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: TEXT_DARK }}>Availability Type</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="date_range" id="edit_date_range" />
                          <Label htmlFor="edit_date_range" style={{ color: TEXT_DARK }}>Specific date range</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recurring" id="edit_recurring" />
                          <Label htmlFor="edit_recurring" style={{ color: TEXT_DARK }}>Recurring schedule</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('availability_mode') === 'date_range' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="availability_start" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel style={{ color: TEXT_DARK }}>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant="outline" 
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              style={{
                                background: "#fff",
                                color: TEXT_DARK,
                                fontWeight: 500,
                                borderRadius: "8px",
                                boxShadow: "0 1.5px 3px 0 rgba(55,73,87,0.08)",
                                border: "1px solid #EBEBEB"
                              }}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="availability_end" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel style={{ color: TEXT_DARK }}>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant="outline" 
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              style={{
                                background: "#fff",
                                color: TEXT_DARK,
                                fontWeight: 500,
                                borderRadius: "8px",
                                boxShadow: "0 1.5px 3px 0 rgba(55,73,87,0.08)",
                                border: "1px solid #EBEBEB"
                              }}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar selected={field.value} onSelect={field.onChange} />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )} />
                </div>
              )}

              {form.watch('availability_mode') === 'recurring' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="recurring_day" render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Day of Week</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger style={{
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
                            fontFamily: "Open Sans, Arial, sans-serif"
                          }}>
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
                  )} />
                  <FormField control={form.control} name="recurring_time" render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Time (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          placeholder="e.g., 19:00" 
                          {...field}
                          style={{
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
                            fontFamily: "Open Sans, Arial, sans-serif"
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card style={{
            background: BG_SECTION,
            boxShadow: CARD_SHADOW,
            borderRadius: CARD_RADIUS,
            border: "1px solid #EBEBEB"
          }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT_DARK }}>Location</CardTitle>
              <CardDescription style={{ color: "#606060" }}>Where will this collaboration take place?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="venue_mode" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: TEXT_DARK }}>Venue Requirements</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no_venue" id="edit_no_venue" />
                        <Label htmlFor="edit_no_venue" style={{ color: TEXT_DARK }}>No physical venue required</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="i_have_venue" id="edit_i_have_venue" />
                        <Label htmlFor="edit_i_have_venue" style={{ color: TEXT_DARK }}>I have a venue</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partner_provides" id="edit_partner_provides" />
                        <Label htmlFor="edit_partner_provides" style={{ color: TEXT_DARK }}>Collab partner provides venue</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {form.watch('venue_mode') === 'i_have_venue' && (
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: TEXT_DARK }}>Venue Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the venue address" 
                        {...field}
                        style={{
                          background: "#F5F6F8",
                          color: TEXT_DARK,
                          border: "none",
                          borderRadius: "8px",
                          fontFamily: "Open Sans, Arial, sans-serif"
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {form.watch('venue_mode') === 'partner_provides' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="preferred_city" render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Preferred City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Barcelona" 
                          {...field}
                          style={{
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
                            fontFamily: "Open Sans, Arial, sans-serif"
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="preferred_area" render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: TEXT_DARK }}>Preferred Area (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Eixample, Gracia..." 
                          {...field}
                          style={{
                            background: "#F5F6F8",
                            color: TEXT_DARK,
                            border: "none",
                            borderRadius: "8px",
                            fontFamily: "Open Sans, Arial, sans-serif"
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card style={{
            background: BG_SECTION,
            boxShadow: CARD_SHADOW,
            borderRadius: CARD_RADIUS,
            border: "1px solid #EBEBEB"
          }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT_DARK }}>Collaboration Photo</CardTitle>
              <CardDescription style={{ color: "#606060" }}>Add a photo for your collaboration (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="use_profile_photo" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel style={{ color: TEXT_DARK }}>Use my community's profile photo</FormLabel>
                    <p className="text-sm" style={{ color: "#606060" }}>
                      Your profile photo will be used for this collaboration
                    </p>
                  </div>
                </FormItem>
              )} />
              
              {!form.watch('use_profile_photo') && (
                <FileUpload
                  bucket="offer-photos"
                  value={form.watch('offer_photo')}
                  onChange={(url) => form.setValue('offer_photo', url)}
                  label="Collaboration Photo"
                  accept="image/*"
                />
              )}
            </CardContent>
          </Card>

          {/* What You Offer */}
          <Card style={{
            background: BG_SECTION,
            boxShadow: CARD_SHADOW,
            borderRadius: CARD_RADIUS,
            border: "1px solid #EBEBEB"
          }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT_DARK }}>What can you offer?</CardTitle>
              <CardDescription style={{ color: "#606060" }}>Describe what you're providing to your collaboration partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="offer_input_mode" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="edit_offer_text" />
                        <Label htmlFor="edit_offer_text" style={{ color: TEXT_DARK }}>Describe in your own words</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="checklist" id="edit_offer_checklist" />
                        <Label htmlFor="edit_offer_checklist" style={{ color: TEXT_DARK }}>Select from options</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )} />

              {form.watch('offer_input_mode') === 'text' && (
                <FormField control={form.control} name="business_offer.description" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: TEXT_DARK }}>Your Offer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what you provide" 
                        {...field}
                        style={{
                          background: "#F5F6F8",
                          color: TEXT_DARK,
                          border: "none",
                          borderRadius: "8px",
                          fontFamily: "Open Sans, Arial, sans-serif"
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {form.watch('offer_input_mode') === 'checklist' && (
                <div className="space-y-4">
                  <FormField control={form.control} name="business_offer.venue" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>Venue</FormLabel>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="business_offer.event_creation" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>Event Creation</FormLabel>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="business_offer.split_revenue" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>Split Revenue</FormLabel>
                    </FormItem>
                  )} />
                  <div className="space-y-2">
                    <FormField control={form.control} name="business_offer.monetary_compensation" render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>Monetary Compensation</FormLabel>
                      </FormItem>
                    )} />
                    {form.watch('business_offer.monetary_compensation') && (
                      <FormField control={form.control} name="business_offer.compensation_amount" render={({ field }) => (
                        <FormItem className="ml-6">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Amount in €"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              style={{
                                background: "#F5F6F8",
                                color: TEXT_DARK,
                                border: "none",
                                borderRadius: "8px",
                                fontFamily: "Open Sans, Arial, sans-serif"
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card style={{
            background: BG_SECTION,
            boxShadow: CARD_SHADOW,
            borderRadius: CARD_RADIUS,
            border: "1px solid #EBEBEB"
          }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT_DARK }}>What do you expect from collaborators?</CardTitle>
              <CardDescription style={{ color: "#606060" }}>Select what you expect from your collaboration partner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliverableOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`community_deliverables.${option.id}` as any}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal" style={{ color: TEXT_DARK }}>{option.label}</FormLabel>
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
                              placeholder={option.id === 'monetary_compensation' ? 'Amount in €' : `# of ${option.label}`}
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              style={{
                                background: "#F5F6F8",
                                color: TEXT_DARK,
                                border: "none",
                                borderRadius: "8px",
                                fontFamily: "Open Sans, Arial, sans-serif"
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit((data) => handleSubmitOffer(data, "draft"))}
              disabled={isSubmitting}
              style={{
                background: "#fff",
                color: TEXT_DARK,
                fontWeight: 500,
                borderRadius: "8px",
                boxShadow: "0 1.5px 3px 0 rgba(55,73,87,0.08)",
                border: "1px solid #EBEBEB"
              }}
            >
              <Save className="w-4 h-4 mr-2" /> Save as Draft
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit((data) => handleSubmitOffer(data, "published"))}
              disabled={isSubmitting}
              style={{
                background: CHIP_YELLOW,
                color: TEXT_DARK,
                fontWeight: 700,
                borderRadius: "8px",
                boxShadow: "0 1.5px 4px 0 rgba(55, 73, 87, 0.11)",
                border: "none"
              }}
            >
              <Send className="w-4 h-4 mr-2" /> Publish
            </Button>
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
};

export default CommunityOpportunitiesEdit;