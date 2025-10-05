import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface PendingFeedbackCardProps {
  pendingSurveys: Array<{
    id: string;
    collaboration_id: string;
    partnerName: string;
    offerTitle: string;
  }>;
  onFillFeedback: (surveyId: string, collaborationId: string, partnerName: string) => void;
}

const PendingFeedbackCard = ({ pendingSurveys, onFillFeedback }: PendingFeedbackCardProps) => {
  if (!pendingSurveys || pendingSurveys.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <CardTitle className="text-lg">Pending Feedback</CardTitle>
          <Badge variant="secondary">{pendingSurveys.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingSurveys.map((survey) => (
          <div
            key={survey.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg border"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{survey.offerTitle}</p>
              <p className="text-xs text-muted-foreground">with {survey.partnerName}</p>
            </div>
            <Button
              size="sm"
              onClick={() => onFillFeedback(survey.id, survey.collaboration_id, survey.partnerName)}
            >
              Fill Feedback
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingFeedbackCard;