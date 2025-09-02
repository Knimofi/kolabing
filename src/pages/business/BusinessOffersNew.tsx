import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const offerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be under 1000 characters'),
  collaboration_goal: z.enum(['brand_awareness', 'lead_generation', 'content_creation', 'event_partnership', 'product_promotion']),
  availability_start: z.date().optional(),
  availability_end: z.date().optional(),
  address: z.string().optional(),
  no_venue: z.boolean().default(false),
  business_offer: z.object({
    description: z.string().min(1, 'Business offer is required'),
    value: z.string().optional(),
  }),
  community_deliverables: z.object({
    description: z.string().min(1, 'Community deliverables are required'),
    timeline: z.string().optional(),
  }),
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
      title: '',
      description: '',
      collaboration_goal: 'brand_awareness',
      no_venue: false,
      business_offer: {
        description: '',
        value: '',
      },
      community_deliverables: {
        description: '',
        timeline: '',
      },
    },
  });

  const collaborationGoalOptions = [
    { value: 'brand_awareness', label: 'Brand Awareness' },
    { value: 'lead_generation', label: 'Lead Generation' },
    { value: 'content_creation', label: 'Content Creation' },
    { value: 'event_partnership', label: 'Event Partnership' },
    { value: 'product_promotion', label: 'Product Promotion' },
  ];

  const handleSubmit = async (data: OfferFormData, status: 'draft' | 'published') => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const offerData = {
        title: data.title,
        description: data.description,
        collaboration_goal: data.collaboration_goal,
        availability_start: data.availability_start?.toISOString(),
        availability_end: data.availability_end?.toISOString(),
        address: data.no_venue ? null : data.address,
        no_venue: data.no_venue,
        business_offer: data.business_offer,
        community_deliverables: data.community_deliverables,
        business_profile_id: profile.id,
        status,
      };

      const { error } = await supabase
        .from('offers')
        .insert(offerData);

      if (error) throw error;

      toast({
        title: status === 'draft' ? 'Offer saved as draft' : 'Offer published successfully',
        description: status === 'draft' 
          ? 'You can publish it later from your offers dashboard.'
          : 'Your offer is now live and communities can apply.',
      });

      navigate('/business/offers');
    } catch (error: any) {
      console.error('Error creating offer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create offer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Create New Offer
          </h1>
          <p className="text-muted-foreground">
            Design your collaboration opportunity
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

              <FormField
                control={form.control}
                name="collaboration_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collaboration Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your main goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collaborationGoalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <FormLabel>Start Date</FormLabel>
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
                      <FormLabel>End Date</FormLabel>
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
                        No physical venue required
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check this if the collaboration is online or doesn't require a specific location
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
                        <Input placeholder="Enter the collaboration venue address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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

              <FormField
                control={form.control}
                name="business_offer.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $50, 5 free meals, $100 gift card" {...field} />
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
              <CardTitle>Community Deliverables</CardTitle>
              <CardDescription>
                What do you expect from the community partner?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="community_deliverables.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Deliverables</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., 3 Instagram posts, 1 story highlight, attend 2-hour event..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="community_deliverables.timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Within 1 week, By end of month" {...field} />
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
        </form>
      </Form>
    </div>
  );
};

export default BusinessOffersNew;