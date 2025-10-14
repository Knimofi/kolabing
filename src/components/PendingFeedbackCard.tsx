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
    <Card style={{ background: "#FFF4E6", border: "2px solid #FBBF24", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <CardTitle style={{ fontFamily: "'Rubik', Arial, sans-serif", fontWeight: 600, fontSize: "16px", color: "#78350F" }}>Pending Feedback</CardTitle>
          <Badge variant="secondary">{pendingSurveys.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingSurveys.map((survey) => (
          <div
            key={survey.id}
            style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "12px" }}
            className="flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontWeight: 500, fontSize: "14px", color: "#1A1A1A" }} className="truncate">{survey.offerTitle}</p>
              <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: "12px", color: "#6B7280" }}>with {survey.partnerName}</p>
            </div>
            <Button
              size="sm"
              onClick={() => onFillFeedback(survey.id, survey.collaboration_id, survey.partnerName)}
              style={{
                background: "#FFD861",
                border: "2px solid #FFD861",
                color: "#000",
                fontFamily: "'Darker Grotesque', Arial, sans-serif",
                textTransform: "uppercase",
                fontWeight: 600,
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
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