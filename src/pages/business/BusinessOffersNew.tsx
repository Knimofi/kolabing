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


  const handleSubmit = async (data: OfferFormData, status: 'draft' | 'published') => {
  if (!profile) return;
  setIsSubmitting(true);

  try {
    // Fetch the business_profiles row for this user
    const { data: businessProfile, error: businessError } = await supabase
      .from('business_profiles')
      .select('profile_id')
      .eq('profile_id', profile.id)
      .single();

    if (businessError || !businessProfile) {
      toast({
        title: "Error",
        description: "Business profile missing. Please complete your business profile setup.",
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
      business_profile_id: businessProfile.profile_id, // Correct FK assignment
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


export default BusinessOffersNew;