import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import PreferredDatesSelector, { PreferredDate } from '@/components/PreferredDatesSelector';

interface ApplyOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: any;
  businessProfile: any;
  onSubmit: (applicationData: {
    availability: string;
    message: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

const ApplyOfferModal = ({ 
  open, 
  onOpenChange, 
  offer, 
  businessProfile, 
  onSubmit, 
  isSubmitting = false 
}: ApplyOfferModalProps) => {
  const [preferredDates, setPreferredDates] = useState<PreferredDate[]>([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      // Convert preferred dates to JSON string for storage
      const availabilityData = preferredDates.length > 0 
        ? JSON.stringify({ preferred_dates: preferredDates })
        : '';

      await onSubmit({
        availability: availabilityData,
        message: message.trim()
      });
      
      // Reset form
      setPreferredDates([]);
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to "{offer?.title}"</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preferred Dates & Times */}
          <PreferredDatesSelector
            value={preferredDates}
            onChange={setPreferredDates}
          />

          {/* Application Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Application Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell them why you're perfect for this collaboration. Include your community size, engagement rates, and relevant experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>

          {/* Business Info */}
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <p className="font-medium">You're applying to:</p>
            <p className="text-muted-foreground">
              {businessProfile?.name} • {businessProfile?.business_type}
            </p>
            {businessProfile?.city && (
              <p className="text-muted-foreground">{businessProfile.city}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyOfferModal;