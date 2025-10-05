import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';

interface SurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surveyId: string;
  collaborationId: string;
  userType: 'business' | 'community';
  partnerName: string;
  onSubmitSuccess: () => void;
}

const SurveyModal = ({ 
  open, 
  onOpenChange, 
  surveyId, 
  collaborationId,
  userType, 
  partnerName,
  onSubmitSuccess 
}: SurveyModalProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Community survey fields
  const [storiesPosted, setStoriesPosted] = useState('');
  const [tagsMentions, setTagsMentions] = useState('');
  const [reelsPosts, setReelsPosts] = useState('');
  const [totalViews, setTotalViews] = useState('');
  const [productRating, setProductRating] = useState(0);
  const [businessRating, setBusinessRating] = useState(0);

  // Business survey fields
  const [revenueGenerated, setRevenueGenerated] = useState('');
  const [followersGained, setFollowersGained] = useState('');
  const [reviewsCollected, setReviewsCollected] = useState('');
  const [samplesRedeemed, setSamplesRedeemed] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState(0);
  const [communityRating, setCommunityRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let answers: any = {};
      let ratings: number[] = [];

      if (userType === 'community') {
        answers = {
          stories_posted: parseInt(storiesPosted) || 0,
          tags_mentions: parseInt(tagsMentions) || 0,
          reels_posts: parseInt(reelsPosts) || 0,
          total_views: parseInt(totalViews) || 0,
          product_rating: productRating,
          business_rating: businessRating,
        };
        ratings = [productRating, businessRating];
      } else {
        answers = {
          revenue_generated: parseFloat(revenueGenerated) || 0,
          followers_gained: parseInt(followersGained) || 0,
          reviews_collected: parseInt(reviewsCollected) || 0,
          samples_redeemed: parseInt(samplesRedeemed) || 0,
          satisfaction_rating: satisfactionRating,
          community_rating: communityRating,
        };
        ratings = [satisfactionRating, communityRating];
      }

      const averageScore = ratings.reduce((a, b) => a + b, 0) / ratings.length;

      const { error } = await supabase
        .from('surveys')
        .update({
          answers,
          score: averageScore,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', surveyId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Feedback submitted successfully!',
      });

      onSubmitSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit feedback',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const RatingStars = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none transition-colors"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Collaboration Feedback</DialogTitle>
          <DialogDescription>
            Share your feedback about your collaboration with {partnerName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {userType === 'community' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="stories">How many stories did you post?</Label>
                <Input
                  id="stories"
                  type="number"
                  min="0"
                  value={storiesPosted}
                  onChange={(e) => setStoriesPosted(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">How many tags/mentions?</Label>
                <Input
                  id="tags"
                  type="number"
                  min="0"
                  value={tagsMentions}
                  onChange={(e) => setTagsMentions(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reels">How many reels/posts?</Label>
                <Input
                  id="reels"
                  type="number"
                  min="0"
                  value={reelsPosts}
                  onChange={(e) => setReelsPosts(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="views">Approximate total views?</Label>
                <Input
                  id="views"
                  type="number"
                  min="0"
                  value={totalViews}
                  onChange={(e) => setTotalViews(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Rate the product/event overall (1-5)</Label>
                <RatingStars value={productRating} onChange={setProductRating} />
              </div>

              <div className="space-y-2">
                <Label>Rate the business (1-5)</Label>
                <RatingStars value={businessRating} onChange={setBusinessRating} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue generated (€)</Label>
                <Input
                  id="revenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={revenueGenerated}
                  onChange={(e) => setRevenueGenerated(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followers">New followers gained</Label>
                <Input
                  id="followers"
                  type="number"
                  min="0"
                  value={followersGained}
                  onChange={(e) => setFollowersGained(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviews">New reviews collected</Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={reviewsCollected}
                  onChange={(e) => setReviewsCollected(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="samples">Samples/rewards redeemed</Label>
                <Input
                  id="samples"
                  type="number"
                  min="0"
                  value={samplesRedeemed}
                  onChange={(e) => setSamplesRedeemed(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Satisfaction with results (1-5)</Label>
                <RatingStars value={satisfactionRating} onChange={setSatisfactionRating} />
              </div>

              <div className="space-y-2">
                <Label>Rate the community (1-5)</Label>
                <RatingStars value={communityRating} onChange={setCommunityRating} />
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyModal;