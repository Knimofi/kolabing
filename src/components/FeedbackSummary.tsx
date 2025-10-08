import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface FeedbackSummaryProps {
  surveys: any[];
  userType: 'business' | 'community';
  isUserFeedback?: boolean;
}

const FeedbackSummary = ({ surveys, userType, isUserFeedback = false }: FeedbackSummaryProps) => {
  if (!surveys || surveys.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No feedback submitted yet
        </CardContent>
      </Card>
    );
  }

  const RatingDisplay = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {surveys.map((survey) => {
        const answers = survey.answers || {};
        const isCommunity = answers.stories_posted !== undefined;

        return (
          <Card key={survey.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {isUserFeedback && <span className="text-green-600">🔒</span>}
                  {isCommunity ? 'Community' : 'Business'} Feedback
                </CardTitle>
                {survey.score && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    {survey.score.toFixed(1)} / 5.0
                  </Badge>
                )}
              </div>
              {isUserFeedback && (
                <p className="text-xs text-muted-foreground">
                  Submitted and locked on {new Date(survey.submitted_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isCommunity ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Stories Posted</p>
                      <p className="text-2xl font-bold">{answers.stories_posted || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tags/Mentions</p>
                      <p className="text-2xl font-bold">{answers.tags_mentions || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reels/Posts</p>
                      <p className="text-2xl font-bold">{answers.reels_posts || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{answers.total_views?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Product Rating</span>
                      <RatingDisplay rating={answers.product_rating || 0} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Business Rating</span>
                      <RatingDisplay rating={answers.business_rating || 0} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue Generated</p>
                      <p className="text-2xl font-bold">€{answers.revenue_generated?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Followers Gained</p>
                      <p className="text-2xl font-bold">{answers.followers_gained || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reviews Collected</p>
                      <p className="text-2xl font-bold">{answers.reviews_collected || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Samples Redeemed</p>
                      <p className="text-2xl font-bold">{answers.samples_redeemed || 0}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Satisfaction</span>
                      <RatingDisplay rating={answers.satisfaction_rating || 0} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Community Rating</span>
                      <RatingDisplay rating={answers.community_rating || 0} />
                    </div>
                  </div>
                </>
              )}
              {!isUserFeedback && (
                <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                  Submitted on {new Date(survey.submitted_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FeedbackSummary;