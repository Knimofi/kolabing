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
    return contact
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  };

  return (
    <Card
      className="p-0 border-none shadow-none"
      style={{
        background: "none",
      }}
    >
      <div className="space-y-4">
        {isCommunityView ? (
          <div
            style={{
              background: "#FFF6D8",
              borderRadius: "20px",
              padding: "2rem 1.5rem 1.8rem 1.5rem",
              boxShadow: "0 2px 10px 0 rgba(255, 170, 0, 0.05)",
            }}
          >
            {/* Acceptance Message */}
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-[1.22rem]" style={{ color: "#232323", marginBottom: "0.2em" }}>
                  ✨ Your collab has been accepted!
                </h4>
                <p className="text-base" style={{ color: "#65676A", fontWeight: 500 }}>
                  Now it's time for you to contact the business. Here's their contact information:
                </p>
              </div>
            </div>

            {/* Scheduled Date */}
            {scheduledDate && (
              <div
                style={{
                  background: "#232323",
                  color: "#FFF6D8",
                  borderRadius: "14px",
                  padding: "1em 1.2em",
                  margin: "1.2em 0 0.1em 0",
                  display: "inline-block",
                  fontWeight: 600,
                  fontSize: 17,
                  letterSpacing: 0.01,
                }}
              >
                Scheduled For <br />
                {format(new Date(scheduledDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </div>
            )}

            {/* Contact Methods */}
            {contactMethods && Object.keys(contactMethods).length > 0 && (
              <div className="space-y-3 pt-4 mt-2 border-t border-[#efe2b3]">
                <p className="font-semibold text-base" style={{ color: "#232323" }}>
                  Contact Information
                </p>
                {contactMethods.whatsapp && (
                  <div
                    style={{
                      background: "#FFFBEF",
                      borderRadius: "10px",
                      padding: "0.7em 1em",
                    }}
                  >
                    <a
                      href={`https://wa.me/${contactMethods.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#222", fontWeight: 500 }}
                    >
                      <MessageCircle className="h-5 w-5 shrink-0 text-green-600" />
                      <span>{contactMethods.whatsapp}</span>
                    </a>
                  </div>
                )}
                {contactMethods.instagram && (
                  <div
                    style={{
                      background: "#FFFBEF",
                      borderRadius: "10px",
                      padding: "0.7em 1em",
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#222", fontWeight: 500 }}>
                      <Instagram className="h-5 w-5 shrink-0" />
                      Instagram
                    </div>
                    {parseContactList(contactMethods.instagram).map((handle, index) => (
                      <a
                        key={index}
                        href={`https://instagram.com/${handle.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm ml-7"
                        style={{ color: "#FFC355" }}
                      >
                        {handle}
                      </a>
                    ))}
                  </div>
                )}
                {contactMethods.email && (
                  <div
                    style={{
                      background: "#FFFBEF",
                      borderRadius: "10px",
                      padding: "0.7em 1em",
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#222", fontWeight: 500 }}>
                      <Mail className="h-5 w-5 shrink-0" />
                      Email
                    </div>
                    {parseContactList(contactMethods.email).map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="block text-sm ml-7 break-all"
                        style={{ color: "#FFC355" }}
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Non-community */}
            {scheduledDate && (
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-base font-medium text-muted-foreground">
                  Scheduled for: {format(new Date(scheduledDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            )}
            {contactMethods && Object.keys(contactMethods).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#efe2b3]">
                <p className="font-semibold text-sm text-muted-foreground">Contact Information</p>
                {/* ...repeat methods with matching color block if you want */}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
