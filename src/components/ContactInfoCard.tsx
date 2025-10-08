import { Card } from "@/components/ui/card";
import { MessageCircle, Instagram, Mail, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface ContactInfoCardProps {
  scheduledDate?: string;
  contactMethods?: {
    whatsapp?: string;
    instagram?: string;
    email?: string;
  };
}

export const ContactInfoCard = ({ scheduledDate, contactMethods }: ContactInfoCardProps) => {
  if (!scheduledDate && (!contactMethods || Object.keys(contactMethods).length === 0)) {
    return null;
  }

  return (
    <Card className="p-4 bg-accent/50 border-accent">
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Collaboration Details
        </h4>
        
        {scheduledDate && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium">Scheduled For</p>
              <p className="text-muted-foreground">
                {format(new Date(scheduledDate), "PPP 'at' p")}
              </p>
            </div>
          </div>
        )}

        {contactMethods && Object.keys(contactMethods).length > 0 && (
          <div className="space-y-2 pt-2 border-t border-accent">
            <p className="font-medium text-sm">Contact Information</p>
            
            {contactMethods.whatsapp && (
              <a
                href={`https://wa.me/${contactMethods.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                {contactMethods.whatsapp}
              </a>
            )}

            {contactMethods.instagram && (
              <a
                href={`https://instagram.com/${contactMethods.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Instagram className="h-4 w-4" />
                {contactMethods.instagram}
              </a>
            )}

            {contactMethods.email && (
              <a
                href={`mailto:${contactMethods.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {contactMethods.email}
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
