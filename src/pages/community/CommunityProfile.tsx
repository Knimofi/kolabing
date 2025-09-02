import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Users, Save, Loader2 } from 'lucide-react';

const communityTypes = [
  'run club',
  'fitness',
  'wellness',
  'arts',
  'photography',
  'food',
  'travel',
  'lifestyle',
  'tech',
  'gaming',
  'music',
  'sports',
  'education',
  'other'
];

const CommunityProfile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    city: profile?.city || '',
    phone_number: profile?.phone_number || '',
    community_type: profile?.community_type || '',
    profile_photo: profile?.profile_photo || '',
    website: profile?.website || '',
    instagram: profile?.instagram || '',
    tiktok: profile?.tiktok || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.community_type) {
      newErrors.community_type = 'Community type is required';
    }
    
    if (formData.phone_number && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must start with http:// or https://';
    }
    
    if (formData.instagram && !formData.instagram.match(/^@?[\w\.]+$/)) {
      newErrors.instagram = 'Instagram handle should contain only letters, numbers, dots and underscores';
    }

    if (formData.tiktok && !formData.tiktok.match(/^@?[\w\.]+$/)) {
      newErrors.tiktok = 'TikTok handle should contain only letters, numbers, dots and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await updateProfile(formData);
    
    if (!error) {
      toast({
        title: "Profile Updated",
        description: "Your community profile has been saved successfully.",
      });
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Profile</h1>
          <p className="text-muted-foreground">
            Manage your community information and social presence
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Community Information</CardTitle>
            <CardDescription>
              This information will be visible to businesses when you apply for collaborations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your community name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <p id="city-error" className="text-sm text-destructive" role="alert">
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="community_type">Community Type *</Label>
              <Select 
                value={formData.community_type} 
                onValueChange={(value) => handleInputChange('community_type', value)}
              >
                <SelectTrigger id="community_type" aria-invalid={!!errors.community_type}>
                  <SelectValue placeholder="Select your community type" />
                </SelectTrigger>
                <SelectContent>
                  {communityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.community_type && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.community_type}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder="Enter your phone number"
                aria-invalid={!!errors.phone_number}
                aria-describedby={errors.phone_number ? 'phone-error' : undefined}
              />
              {errors.phone_number && (
                <p id="phone-error" className="text-sm text-destructive" role="alert">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_photo">Profile Photo URL</Label>
              <Input
                id="profile_photo"
                type="url"
                value={formData.profile_photo}
                onChange={(e) => handleInputChange('profile_photo', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your community logo or representative photo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://your-community.com"
                  aria-invalid={!!errors.website}
                  aria-describedby={errors.website ? 'website-error' : undefined}
                />
                {errors.website && (
                  <p id="website-error" className="text-sm text-destructive" role="alert">
                    {errors.website}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="@yourcommunity"
                  aria-invalid={!!errors.instagram}
                  aria-describedby={errors.instagram ? 'instagram-error' : undefined}
                />
                {errors.instagram && (
                  <p id="instagram-error" className="text-sm text-destructive" role="alert">
                    {errors.instagram}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok Handle</Label>
              <Input
                id="tiktok"
                value={formData.tiktok}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
                placeholder="@yourcommunity"
                aria-invalid={!!errors.tiktok}
                aria-describedby={errors.tiktok ? 'tiktok-error' : undefined}
              />
              {errors.tiktok && (
                <p id="tiktok-error" className="text-sm text-destructive" role="alert">
                  {errors.tiktok}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommunityProfile;