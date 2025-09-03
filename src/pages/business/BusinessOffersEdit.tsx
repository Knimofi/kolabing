import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FileUpload } from '@/components/ui/file-upload';

const offerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be under 1000 characters'),
  availability_start: z.date().optional(),
  availability_end: z.date().optional(),
  address: z.string().optional(),
  no_venue: z.boolean().default(false),
  offer_photo: z.string().optional(),
  business_offer: z.object({
    description: z.string().min(1, 'Business offer is required'),
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
  timeline_days: z.number().min(1, 'Timeline is required').max(365, 'Timeline must be under 365 days'),
});

type OfferFormData = z.infer<typeof offerSchema>;

const BusinessOffersEdit = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const deliverableOptions = [
    { id: 'tagged_stories', label: 'Tagged Stories', hasAmount: true },
    { id: 'google_reviews', label: 'Google Reviews', hasAmount: true },
    { id: 'number_of_attendees', label: 'Number of Attendees', hasAmount: true },
    { id: 'professional_photography', label: 'Professional Photography', hasAmount: false },
    { id: 'professional_reel_video', label: 'Professional Reel/Video', hasAmount: false },
    { id: 'ugc_content', label: 'UGC Content', hasAmount: false },
    { id: 'collab_reel_post', label: 'Collab Reel/Post', hasAmount: false },
    { id: 'group_picture', label: 'Group Picture', hasAmount: false },
    { id: 'loyalty_signups', label: 'Loyalty Sign-ups', hasAmount: true },
  ] as const;

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: '',
      description: '',
      no_venue: false,
      offer_photo: '',
      business_offer: {
        description: '',
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
    },
  });

  useEffect(() => {
    if (offerId && profile) {
      fetchOffer();
    }
  }, [offerId, profile]);

  const fetchOffer = async () => {
    if (!offerId || !profile) return;

    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .eq('business_profile_id', profile.id)
        .single();

      if (error) throw error;

      // Convert data to form format, ensuring proper types
      const formData: OfferFormData = {
        title: data.title || '',
        description: data.description || '',
        availability_start: data.availability_start ? new Date(data.availability_start) : undefined,
        availability_end: data.availability_end ? new Date(data.availability_end) : undefined,
        address: data.address || '',
        no_venue: data.no_venue || false,
        offer_photo: data.offer_photo || '',
        business_offer: {
          description: (data.business_offer as any)?.description || '',
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
          minimum_consumption: (data.community_deliverables as any)?.minimum_consumption,
        },
        timeline_days: data.timeline_days || 7,
      };

      form.reset(formData);
    } catch (error: any) {
      console.error('Error fetching offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to load offer. Please try again.',
        variant: 'destructive',
      });
      navigate('/business/offers');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (data: OfferFormData, status: 'draft' | 'published') => {
    if (!profile || !offerId) return;

    setIsSubmitting(true);
    try {
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
        status,
      };

      const { error } = await supabase
        .from('offers')
        .update(offerData)
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: status === 'draft' ? 'Offer saved as draft' : 'Offer published successfully',
        description: status === 'draft' 
          ? 'You can publish it later from your offers dashboard.'
          : 'Your offer is now live and communities can apply.',
      });

      navigate('/business/offers');
    } catch (error: any) {
      console.error('Error updating offer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/business/offers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Offers
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Edit Offer
          </h1>
          <p className="text-muted-foreground">
            Update your collaboration opportunity
          </p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your collaboration offer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Instagram Partnership for Coffee Shop" {...field} />
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
                        placeholder="Describe your collaboration opportunity in detail..."
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
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                When is this collaboration opportunity available?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="availability_start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
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
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
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
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
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
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        No specific venue required
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check this if the collaboration doesn't require a physical location
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch('no_venue') && (
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the venue address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Offer Photo</CardTitle>
              <CardDescription>
                Upload a photo for your offer (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                bucket="offer-photos"
                value={form.watch('offer_photo')}
                onChange={(url) => form.setValue('offer_photo', url)}
                label="Offer Photo"
                accept="image/*"
              />
            </CardContent>
          </Card>

          {/* Business Offer */}
          <Card>
            <CardHeader>
              <CardTitle>What You're Offering</CardTitle>
              <CardDescription>
                Describe what you're providing to the community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="business_offer.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Offer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Free products, monetary compensation, exclusive access..."
                        className="min-h-[80px]"
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
          <Card>
            <CardHeader>
              <CardTitle>What do you expect from the community?</CardTitle>
              <CardDescription>
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
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
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
                
                {/* Always show minimum consumption */}
                <FormField
                  control={form.control}
                  name="community_deliverables.minimum_consumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Consumption in Place (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum consumption amount"
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
                    <FormLabel>Timeline (Days after collaboration)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of days to complete deliverables"
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
      onClick={form.handleSubmit((data) => handleSubmit(data, 'draft'))}
      disabled={isSubmitting}
    >
      <Save className="w-4 h-4 mr-2" />
      Save as Draft
    </Button>
    <Button
      type="button"
      onClick={form.handleSubmit((data) => handleSubmit(data, 'published'))}
      disabled={isSubmitting}
    >
      <Send className="w-4 h-4 mr-2" />
      Publish Offer
    </Button>
  </div>
</div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit((data) => handleSubmit(data, 'draft'))}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit((data) => handleSubmit(data, 'published'))}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish Offer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessOffersEdit;
