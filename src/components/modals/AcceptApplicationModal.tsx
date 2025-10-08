import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MessageCircle, Instagram, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactMethods {
  whatsapp?: string;
  instagram?: string;
  email?: string;
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
}

export const AcceptApplicationModal = ({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  businessProfile,
}: AcceptApplicationModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [useWhatsApp, setUseWhatsApp] = useState(false);
  const [useInstagram, setUseInstagram] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramHandle, setInstagramHandle] = useState(businessProfile.instagram || "");
  const [emailAddress, setEmailAddress] = useState(businessProfile.email || "");
  const [useProfileInstagram, setUseProfileInstagram] = useState(true);
  const [useProfileEmail, setUseProfileEmail] = useState(true);

  useEffect(() => {
    if (businessProfile.instagram) {
      setInstagramHandle(businessProfile.instagram);
    }
    if (businessProfile.email) {
      setEmailAddress(businessProfile.email);
    }
  }, [businessProfile]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const contactMethods: ContactMethods = {};
    if (useWhatsApp && whatsappNumber) {
      contactMethods.whatsapp = whatsappNumber;
    }
    if (useInstagram && instagramHandle) {
      contactMethods.instagram = instagramHandle;
    }
    if (useEmail && emailAddress) {
      contactMethods.email = emailAddress;
    }

    const [hours, minutes] = selectedTime.split(":");
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    onConfirm(scheduledDateTime, contactMethods);
  };

  const isValid = selectedDate && selectedTime && (useWhatsApp || useInstagram || useEmail);

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
          {/* Date and Time Selection */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Collaboration Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time" className="mb-2 block">Collaboration Time *</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
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
                <div className="ml-6 space-y-2">
                  {businessProfile.instagram && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-profile-instagram"
                        checked={useProfileInstagram}
                        onCheckedChange={(checked) => {
                          setUseProfileInstagram(checked as boolean);
                          if (checked && businessProfile.instagram) {
                            setInstagramHandle(businessProfile.instagram);
                          }
                        }}
                      />
                      <Label htmlFor="use-profile-instagram" className="text-sm cursor-pointer">
                        Use profile Instagram: {businessProfile.instagram}
                      </Label>
                    </div>
                  )}
                  {(!businessProfile.instagram || !useProfileInstagram) && (
                    <div>
                      <Label htmlFor="instagram-handle" className="text-sm">
                        Instagram Username
                      </Label>
                      <Input
                        id="instagram-handle"
                        placeholder="@yourhandle"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value)}
                      />
                    </div>
                  )}
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
                <div className="ml-6 space-y-2">
                  {businessProfile.email && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use-profile-email"
                        checked={useProfileEmail}
                        onCheckedChange={(checked) => {
                          setUseProfileEmail(checked as boolean);
                          if (checked && businessProfile.email) {
                            setEmailAddress(businessProfile.email);
                          }
                        }}
                      />
                      <Label htmlFor="use-profile-email" className="text-sm cursor-pointer">
                        Use profile email: {businessProfile.email}
                      </Label>
                    </div>
                  )}
                  {(!businessProfile.email || !useProfileEmail) && (
                    <div>
                      <Label htmlFor="email-address" className="text-sm">
                        Email Address
                      </Label>
                      <Input
                        id="email-address"
                        type="email"
                        placeholder="your@email.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                      />
                    </div>
                  )}
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
