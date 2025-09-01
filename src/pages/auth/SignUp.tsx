import React, { useState, useEffect } from 'react';
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
  const { signUp, loading, user } = useAuth();

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

  useEffect(() => {
    if (user) {
      navigate(userType === 'business' ? '/business' : '/community');
    }
  }, [user, userType, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = userType === 'business' ? 'Business name is required' : 'Community name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    } else {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
      navigate(userType === 'business' ? '/business' : '/community');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center justify-between border-b border-border">
        <Link 
          to="/"
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <Link to="/auth/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Already have an account? Sign in
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Kolabing</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Join the marketplace for meaningful collaborations</p>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-3 block">Account Type</Label>
            <div className="flex p-1 bg-muted rounded-lg" role="radiogroup" aria-labelledby="account-type-label">
              <button
                type="button"
                onClick={() => setUserType('business')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md font-medium transition-all ${
                  userType === 'business' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                role="radio"
                aria-checked={userType === 'business'}
                aria-label="Business account"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Business</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('community')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md font-medium transition-all ${
                  userType === 'community' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                role="radio"
                aria-checked={userType === 'community'}
                aria-label="Community account"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm">Community</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
                {userType === 'business' ? 'Business Name' : 'Community Name'}
              </Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder={userType === 'business' ? 'Enter your business name' : 'Enter your community name'}
                className={errors.displayName ? 'border-destructive' : ''}
                aria-describedby={errors.displayName ? 'displayName-error' : undefined}
                aria-invalid={!!errors.displayName}
              />
              {errors.displayName && (
                <p id="displayName-error" role="alert" className="text-sm text-destructive mt-1">{errors.displayName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'border-destructive' : ''}
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p id="email-error" role="alert" className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  aria-describedby={errors.password ? 'password-error' : 'password-help'}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" role="alert" className="text-sm text-destructive mt-1">{errors.password}</p>
              ) : (
                <p id="password-help" className="text-sm text-muted-foreground mt-1">Must be at least 6 characters</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p id="confirmPassword-error" role="alert" className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
