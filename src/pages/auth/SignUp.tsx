import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Building2, Users, Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [userType, setUserType] = useState<'business' | 'community'>(
    (searchParams.get('type') as 'business' | 'community') || 'business'
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = userType === 'business' ? 'Business name is required' : 'Community name is required';
    }

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { error } = await signUp(
      formData.email,
      formData.password,
      userType,
      formData.displayName
    );

    if (error) {
      if (error.message.includes('already registered')) {
        setErrors({ email: 'This email is already registered. Try signing in instead.' });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create account',
          variant: 'destructive'
        });
      }
      return;
    }

    toast({
      title: 'Account created!',
      description: 'Please check your email to verify your account.',
    });

    // Redirect AFTER successful signup + profile creation
    navigate(userType === 'business' ? '/business' : '/community');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-border">
        <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Back to home">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <Link to="/auth/sign-in" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Already have an account? Sign in
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Logo & Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-background font-bold text-2xl">K</span>
              </div>
              <span className="text-3xl font-bold text-foreground">Kolabing</span>
            </div>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Account</h1>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-primary"></div>
            </div>
            <p className="text-muted-foreground mt-4 text-lg">Join the marketplace for meaningful collaborations</p>
          </div>

          {/* Account Type */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-muted-foreground mb-4 block">Account Type</Label>
            <div className="flex p-1.5 bg-muted rounded-2xl">
              <button
                type="button"
                onClick={() => setUserType('business')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${userType === 'business' ? 'bg-primary text-background shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Business</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('community')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${userType === 'community' ? 'bg-primary text-background shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">Community</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div>
              <Label htmlFor="displayName" className="text-sm font-medium text-muted-foreground mb-2 block">{userType === 'business' ? 'Business Name' : 'Community Name'}</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder={userType === 'business' ? 'Enter your business name' : 'Enter your community name'}
                className={`rounded-xl bg-muted border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.displayName ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}`}
              />
              {errors.displayName && <p className="text-sm text-destructive mt-2">{errors.displayName}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground mb-2 block">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`rounded-xl bg-muted border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.email ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}`}
              />
              {errors.email && <p className="text-sm text-destructive mt-2">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground mb-2 block">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={`rounded-xl bg-muted border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-12 ${errors.password ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-2">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground mb-2 block">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`rounded-xl bg-muted border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-12 ${errors.confirmPassword ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive mt-2">{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-background font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background" 
              size="lg" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUp;

