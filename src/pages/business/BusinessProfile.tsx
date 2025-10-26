import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Building2, Save, Loader2, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const businessTypes = [
  'restaurant',
  'coffee',
  'retail',
  'fitness',
  'wellness',
  'beauty',
  'technology',
  'education',
  'healthcare',
  'hospitality',
  'other'
];

const BusinessProfile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    city_id: profile?.city_id || '',
    phone_number: profile?.phone_number || '',
    business_type: profile?.business_type || '',
    profile_photo: profile?.profile_photo || '',
    website: profile?.website || '',
    instagram: profile?.instagram || '',
    about: (profile as any)?.about || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching cities:', error);
        toast({
          title: "Error",
          description: "Failed to load cities",
          variant: "destructive",
        });
      } else {
        setCities(data || []);
      }
    };
    
    fetchCities();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    
    if (!formData.city_id) {
      newErrors.city_id = 'City is required';
    }
    
    if (!formData.business_type) {
      newErrors.business_type = 'Business type is required';
    }
    
    if (formData.phone_number && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number (numbers only)';
    }
    
    if (formData.phone_number && formData.phone_number.replace(/[\s\-\(\)\+]/g, '').length < 10) {
      newErrors.phone_number = 'Phone number must be at least 10 digits';
    }
    
    if (formData.instagram && !formData.instagram.match(/^@?[\w\.]+$/)) {
      newErrors.instagram = 'Instagram handle should contain only letters, numbers, dots and underscores';
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
    
    // Auto-add https:// to website if not present
    const profileData = {
      ...formData,
      website: formData.website && !formData.website.startsWith('http') 
        ? `https://${formData.website}` 
        : formData.website
    };
    
    const { error } = await updateProfile(profileData);
    
    if (!error) {
      toast({
        title: "Profile Updated",
        description: "Your business profile has been saved successfully.",
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

  const RUBIK_EXTRA_BOLD_TITLE = {
    fontFamily: "'Rubik', Arial, sans-serif",
    textTransform: "uppercase" as const,
    fontWeight: 700,
    color: "#232323",
    fontSize: 30,
    letterSpacing: "0.03em",
    margin: 0,
  };
  const OPEN_SANS_SUBTITLE = {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 400,
    fontSize: 15,
    color: "#5a5a5c",
    letterSpacing: 0,
    textTransform: "none" as const,
    margin: 0,
  };
  const BUTTON_YELLOW = {
    background: "#FFD861",
    border: "none",
    color: "#2b2b2d",
    fontFamily: "'Darker Grotesque', Arial, sans-serif",
    textTransform: "uppercase" as const,
    fontWeight: 600,
    letterSpacing: "0.03em",
    fontSize: 17,
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8" style={{ color: "#FFD861" }} />
          <div>
            <h1 style={RUBIK_EXTRA_BOLD_TITLE}>BUSINESS PROFILE</h1>
            <p style={OPEN_SANS_SUBTITLE}>
              Manage your business information and contact details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: "14px", boxShadow: "0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55,73,87,0.13)" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "'Open Sans', Arial, sans-serif", textTransform: "uppercase" as const, fontWeight: 600, fontSize: 16, color: "#232323" }}>Business Information</CardTitle>
              <CardDescription style={{ fontFamily: "'Open Sans', Arial, sans-serif", color: "#5a5a5c" }}>
                This information will be visible to communities when you create offers
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>What is the public name of your business?</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your business name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  style={{ background: '#FFFFFF' }}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="city_id">City *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the city where your business is located</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={formData.city_id} 
                  onValueChange={(value) => handleInputChange('city_id', value)}
                >
                  <SelectTrigger id="city_id" aria-invalid={!!errors.city_id} style={{ background: '#FFFFFF' }}>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent style={{ background: '#FFFFFF' }}>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city_id && (
                  <p id="city-error" className="text-sm text-destructive" role="alert">
                    {errors.city_id}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="business_type">Business Type *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose the type that's most likely describing your business.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select 
                value={formData.business_type} 
                onValueChange={(value) => handleInputChange('business_type', value)}
              >
                <SelectTrigger id="business_type" aria-invalid={!!errors.business_type} style={{ background: '#FFFFFF' }}>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent style={{ background: '#FFFFFF' }}>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.business_type && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.business_type}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Include your country code.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers, +, -, (, ), and spaces
                  if (value === '' || /^[\d\s\-\(\)\+]*$/.test(value)) {
                    handleInputChange('phone_number', value);
                  }
                }}
                placeholder="+34 600 123 456"
                aria-invalid={!!errors.phone_number}
                aria-describedby={errors.phone_number ? 'phone-error' : undefined}
                style={{ background: '#FFFFFF' }}
              />
              {errors.phone_number && (
                <p id="phone-error" className="text-sm text-destructive" role="alert">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_photo">Profile Photo</Label>
              <FileUpload
                bucket="profile-photos"
                value={formData.profile_photo}
                onChange={(url) => handleInputChange('profile_photo', url || '')}
                label="Profile Picture"
                accept="image/*"
                maxSize={5 * 1024 * 1024}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                placeholder="Describe here your business and mentality."
                className="min-h-[100px]"
                style={{ background: '#FFFFFF' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>What is your businesses website?</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="yourwebsite.com"
                  aria-invalid={!!errors.website}
                  aria-describedby={errors.website ? 'website-error' : undefined}
                  style={{ background: '#FFFFFF' }}
                />
                {errors.website && (
                  <p id="website-error" className="text-sm text-destructive" role="alert">
                    {errors.website}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Skip the @</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="yourbusiness"
                  aria-invalid={!!errors.instagram}
                  aria-describedby={errors.instagram ? 'instagram-error' : undefined}
                  style={{ background: '#FFFFFF' }}
                />
                {errors.instagram && (
                  <p id="instagram-error" className="text-sm text-destructive" role="alert">
                    {errors.instagram}
                  </p>
                )}
              </div>
            </div>

          </CardContent>
          </Card>

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={loading} size="lg" style={BUTTON_YELLOW}>
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
    </div>
  );
};

export default BusinessProfile;