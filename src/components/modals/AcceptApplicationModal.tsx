import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { MessageCircle, Instagram, Mail, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactMethods {
  whatsapp?: string;
  instagram?: string;
  email?: string;
}

interface PreferredDate {
  date: string;
  start_time: string;
  end_time: string;
}

interface AcceptApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledDate: Date, contactMethods: ContactMethods) => void;
  isSubmitting: boolean;
  businessProfile: {
    instagram?: string;
    email?: string;
  };
  application: {
    availability?: string;
  };
}

export const AcceptApplicationModal = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  businessProfile,
  application,
}: AcceptApplicationModalProps) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState<string>("");
  const [useWhatsApp, setUseWhatsApp] = useState(false);
  const [useInstagram, setUseInstagram] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramHandles, setInstagramHandles] = useState<string[]>([]);
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const [selectedInstagram, setSelectedInstagram] = useState<string[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  
  // Parse preferred dates from application
  const preferredDates: PreferredDate[] = (() => {
    try {
      if (application.availability) {
        const parsed = JSON.parse(application.availability);
        return parsed.preferred_dates || [];
      }
    } catch (e) {
      console.error("Failed to parse availability:", e);
    }
    return [];
  })();

  useEffect(() => {
    // Initialize with profile data
    const initialInstagram = [];
    const initialEmails = [];
    
    if (businessProfile.instagram) {
      initialInstagram.push(businessProfile.instagram);
    }
    if (businessProfile.email) {
      initialEmails.push(businessProfile.email);
    }
    
    setInstagramHandles(initialInstagram);
    setEmailAddresses(initialEmails);
    
    // Auto-select profile defaults
    if (businessProfile.instagram) {
      setSelectedInstagram([businessProfile.instagram]);
    }
    if (businessProfile.email) {
      setSelectedEmails([businessProfile.email]);
    }
  }, [businessProfile]);

  const handleConfirm = () => {
    if (!selectedDateIndex) return;

    const contactMethods: ContactMethods = {};
    if (useWhatsApp && whatsappNumber) {
      contactMethods.whatsapp = whatsappNumber;
    }
    if (useInstagram && selectedInstagram.length > 0) {
      contactMethods.instagram = selectedInstagram.join(", ");
    }
    if (useEmail && selectedEmails.length > 0) {
      contactMethods.email = selectedEmails.join(", ");
    }

    const selectedDate = preferredDates[parseInt(selectedDateIndex)];
    const [hours, minutes] = selectedDate.start_time.split(":");
    const scheduledDateTime = new Date(selectedDate.date);
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    onConfirm(scheduledDateTime, contactMethods);
  };

  const isValid = selectedDateIndex && (useWhatsApp || useInstagram || useEmail) && 
    (useWhatsApp ? whatsappNumber : true) &&
    (useInstagram ? selectedInstagram.length > 0 : true) &&
    (useEmail ? selectedEmails.length > 0 : true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Accept Collaboration</DialogTitle>
          <DialogDescription>
            Select a date, time, and contact methods for this collaboration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Selection from Community Proposals */}
          <div className="space-y-4">
            <Label className="mb-2 block">Select Collaboration Date * (from community's proposals)</Label>
            {preferredDates.length > 0 ? (
              <RadioGroup value={selectedDateIndex} onValueChange={setSelectedDateIndex}>
                <div className="space-y-2">
                  {preferredDates.map((dateOption, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`date-${index}`} />
                      <Label htmlFor={`date-${index}`} className="flex-1 cursor-pointer">
                        <div className="font-medium">
                          {format(new Date(dateOption.date), "EEEE, MMMM d, yyyy")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {dateOption.start_time} - {dateOption.end_time}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <p className="text-sm text-muted-foreground">No preferred dates provided by the community.</p>
            )}
          </div>

          {/* Contact Methods */}
          <div className="space-y-4">
            <Label className="text-base">Contact Methods * (Select at least one)</Label>

            {/* WhatsApp */}
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={useWhatsApp}
                  onCheckedChange={(checked) => setUseWhatsApp(checked as boolean)}
                />
                <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Label>
              </div>
              {useWhatsApp && (
                <div className="ml-6">
                  <Label htmlFor="whatsapp-number" className="text-sm">
                    WhatsApp Number (with country code)
                  </Label>
                  <Input
                    id="whatsapp-number"
                    placeholder="+34 123 456 789"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Instagram */}
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instagram"
                  checked={useInstagram}
                  onCheckedChange={(checked) => setUseInstagram(checked as boolean)}
                />
                <Label htmlFor="instagram" className="flex items-center gap-2 cursor-pointer">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
              </div>
              {useInstagram && (
                <div className="ml-6 space-y-3">
                  {instagramHandles.map((handle, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={`instagram-${index}`}
                        checked={selectedInstagram.includes(handle)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedInstagram([...selectedInstagram, handle]);
                          } else {
                            setSelectedInstagram(selectedInstagram.filter(h => h !== handle));
                          }
                        }}
                      />
                      <Label htmlFor={`instagram-${index}`} className="flex-1 text-sm cursor-pointer">
                        {handle} {index === 0 && businessProfile.instagram ? "(Profile)" : ""}
                      </Label>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setInstagramHandles(instagramHandles.filter((_, i) => i !== index));
                            setSelectedInstagram(selectedInstagram.filter(h => h !== handle));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newHandle = prompt("Enter Instagram username (with or without @):");
                      if (newHandle) {
                        const cleanHandle = newHandle.startsWith("@") ? newHandle : `@${newHandle}`;
                        setInstagramHandles([...instagramHandles, cleanHandle]);
                      }
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Instagram
                  </Button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={useEmail}
                  onCheckedChange={(checked) => setUseEmail(checked as boolean)}
                />
                <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
              </div>
              {useEmail && (
                <div className="ml-6 space-y-3">
                  {emailAddresses.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={`email-${index}`}
                        checked={selectedEmails.includes(email)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEmails([...selectedEmails, email]);
                          } else {
                            setSelectedEmails(selectedEmails.filter(e => e !== email));
                          }
                        }}
                      />
                      <Label htmlFor={`email-${index}`} className="flex-1 text-sm cursor-pointer">
                        {email} {index === 0 && businessProfile.email ? "(Profile)" : ""}
                      </Label>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEmailAddresses(emailAddresses.filter((_, i) => i !== index));
                            setSelectedEmails(selectedEmails.filter(e => e !== email));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newEmail = prompt("Enter email address:");
                      if (newEmail && newEmail.includes("@")) {
                        setEmailAddresses([...emailAddresses, newEmail]);
                      }
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Email
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm Collaboration"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
