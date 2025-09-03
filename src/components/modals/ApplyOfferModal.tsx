import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ApplyOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: any;
  businessProfile: any;
  onSubmit: (applicationData: {
    availability: string;
    message: string;
    availability_date?: Date;
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
  const [availability, setAvailability] = useState('');
  const [message, setMessage] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      await onSubmit({
        availability,
        message: message.trim(),
        availability_date: availabilityDate
      });
      
      // Reset form
      setAvailability('');
      setMessage('');
      setAvailabilityDate(undefined);
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
          {/* Availability Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="availability-date">Preferred Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="availability-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !availabilityDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {availabilityDate ? format(availabilityDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={availabilityDate}
                  onSelect={setAvailabilityDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Additional Availability Info */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability Details (Optional)</Label>
            <Input
              id="availability"
              placeholder="e.g., Weekends preferred, Evening events only..."
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>

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