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
import { CalendarIcon, ArrowLeft, Save, Send } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  availability_start: z.date().optional(),
  availability_end: z.date().optional(),
  address: z.string().optional(),
  no_venue: z.boolean().default(false),
  offer_photo: z.string().optional(),
  business_offer: z.object({ description: z.string().min(1) }),
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
  timeline_days: z.number().min(1).max(365),
});

type OfferFormData = z.infer<typeof offerSchema>;

const BusinessOffersEdit = () => {
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
  ] as const;

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      no_venue: false,
      offer_photo: "",
      business_offer: { description: "" },
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
    },
  });

  useEffect(() => {
    if (offerId && profile) fetchOffer();
  }, [offerId, profile]);

  const fetchOffer = async () => {
    if (!offerId || !profile) return;
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .eq("business_profile_id", profile.id)
        .single();
      if (error) throw error;

      form.reset({
        title: data.title || "",
        description: data.description || "",
        availability_start: data.availability_start ? new Date(data.availability_start) : undefined,
        availability_end: data.availability_end ? new Date(data.availability_end) : undefined,
        address: data.address || "",
        no_venue: data.no_venue || false,
        offer_photo: data.offer_photo || "",
        business_offer: { description: (data.business_offer as any)?.description || "" },
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
          minimum_consumption: (data.community_deliverables as any)?.minimum_consumption,
        },
        timeline_days: data.timeline_days || 7,
      });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load offer", variant: "destructive" });
      navigate("/business/offers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async (data: OfferFormData, status: "draft" | "published") => {
    if (!offerId || !profile) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("offers")
        .update({
          ...data,
          availability_start: data.availability_start?.toISOString() || null,
          availability_end: data.availability_end?.toISOString() || null,
          address: data.no_venue ? null : data.address,
          status,
        })
        .eq("id", offerId);

      if (error) throw error;

      toast({
        title: status === "draft" ? "Saved as draft" : "Published",
        description: status === "draft"
          ? "You can publish later from dashboard."
          : "Your offer is live.",
      });

      navigate("/business/offers");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update offer", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/business/offers")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Offers
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Offer</h1>
          <p className="text-muted-foreground">Update your collaboration opportunity</p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your collaboration offer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Instagram Partnership" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your offer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="timeline_days" render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={365} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Availability Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <FormField control={form.control} name="availability_start" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
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
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
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
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Venue address" disabled={form.watch("no_venue")} {...field} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="no_venue" render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>No physical venue</FormLabel>
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Business Offer */}
          <Card>
            <CardHeader>
              <CardTitle>Business Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="business_offer.description" render={({ field }) => (
                <FormItem>
                  <FormLabel>What does the business provide?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what you are offering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle>Community Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {deliverableOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name={`community_deliverables.${option.id}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        {option.hasAmount ? (
                          <Input type="number" placeholder={`# of ${option.label}`} {...field} />
                        ) : (
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      </FormControl>
                      <FormLabel>{option.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Business Contacts (read-only example) */}
          <Card>
            <CardHeader>
              <CardTitle>Business Contact</CardTitle>
              <CardDescription>Your contact details for applicants</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit((data) => handleSubmitOffer(data, "draft"))}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" /> Save as Draft
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit((data) => handleSubmitOffer(data, "published"))}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" /> Publish Offer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessOffersEdit;
