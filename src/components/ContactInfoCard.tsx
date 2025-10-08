import { Card } from "@/components/ui/card";
import { MessageCircle, Instagram, Mail, Calendar, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ContactInfoCardProps {
  scheduledDate?: string;
  contactMethods?: {
    whatsapp?: string;
    instagram?: string;
    email?: string;
  };
  isCommunityView?: boolean;
}

export const ContactInfoCard = ({ scheduledDate, contactMethods, isCommunityView = false }: ContactInfoCardProps) => {
  if (!scheduledDate && (!contactMethods || Object.keys(contactMethods).length === 0)) {
    return null;
  }

  const parseContactList = (contact: string) => {
    return contact.split(',').map(c => c.trim()).filter(Boolean);
  };

  return (
    <Card className="p-5 bg-gradient-to-br from-primary/10 via-accent/30 to-primary/5 border-primary/20">
      <div className="space-y-4">
        {isCommunityView ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-lg text-foreground">
                  Your collab has been accepted!
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Now it's time for you to contact the business. Here's their contact information:
                </p>
              </div>
            </div>
          </div>
        ) : (
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Collaboration Details
          </h4>
        )}
        
        {scheduledDate && (
          <div className="flex items-start gap-3 text-sm bg-background/50 p-3 rounded-lg">
            <Clock className="h-5 w-5 mt-0.5 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Scheduled For</p>
              <p className="text-foreground/90 font-medium">
                {format(new Date(scheduledDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        )}

        {contactMethods && Object.keys(contactMethods).length > 0 && (
          <div className="space-y-3 pt-2 border-t border-primary/20">
            <p className="font-semibold text-sm text-foreground">Contact Information</p>
            
            {contactMethods.whatsapp && (
              <div className="bg-background/50 p-3 rounded-lg">
                <a
                  href={`https://wa.me/${contactMethods.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span>{contactMethods.whatsapp}</span>
                </a>
              </div>
            )}

            {contactMethods.instagram && (
              <div className="bg-background/50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Instagram className="h-5 w-5 shrink-0" />
                  Instagram
                </div>
                {parseContactList(contactMethods.instagram).map((handle, index) => (
                  <a
                    key={index}
                    href={`https://instagram.com/${handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline ml-7"
                  >
                    {handle}
                  </a>
                ))}
              </div>
            )}

            {contactMethods.email && (
              <div className="bg-background/50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="h-5 w-5 shrink-0" />
                  Email
                </div>
                {parseContactList(contactMethods.email).map((email, index) => (
                  <a
                    key={index}
                    href={`mailto:${email}`}
                    className="block text-sm text-primary hover:underline ml-7 break-all"
                  >
                    {email}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
