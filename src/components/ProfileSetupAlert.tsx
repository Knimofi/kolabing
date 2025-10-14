import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfileSetupAlert: React.FC = () => {
  const { profile } = useAuth();
  
  if (!profile) return null;
  
  const isBusiness = profile.user_type === 'business';
  
  // Check if profile is incomplete
  const isProfileIncomplete = !profile.name || 
    !profile.city || 
    (isBusiness && !profile.business_type) ||
    (!isBusiness && !profile.community_type);
  
  if (!isProfileIncomplete) return null;
  
  const profilePath = isBusiness ? '/business/profile' : '/community/profile';
  
  return (
    <Card style={{ background: "#FFF4E6", border: "2px solid #FBBF24", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
          <div className="flex-1">
            <h3 style={{ fontFamily: "'Rubik', Arial, sans-serif", fontWeight: 600, fontSize: "16px", color: "#78350F", marginBottom: "8px" }}>
              Complete Your Profile Setup
            </h3>
            <p style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#78350F", fontSize: "14px", marginBottom: "12px" }}>
              Finish setting up your profile to start creating offers and using the platform effectively.
            </p>
            <Link to={profilePath}>
              <Button 
                size="sm"
                style={{ 
                  background: "#FFD861", 
                  border: "2px solid #FFD861", 
                  color: "#000", 
                  fontFamily: "'Darker Grotesque', Arial, sans-serif",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(255, 216, 97, 0.3)",
                  transition: "all 0.2s ease-in-out"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Settings className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSetupAlert;