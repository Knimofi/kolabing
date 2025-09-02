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
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Complete Your Profile Setup
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
              Finish setting up your profile to start creating offers and using the platform effectively.
            </p>
            <Link to={profilePath}>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-300 text-blue-900 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-100 dark:hover:bg-blue-900/50"
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