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

  const BUTTON_YELLOW = {
    background: "#FFD861",
    border: "2px solid #FFD861",
    color: "#000",
    fontFamily: "'Darker Grotesque', Arial, sans-serif",
    textTransform: "uppercase" as const,
    fontWeight: 600,
    letterSpacing: "0.03em",
    fontSize: 17,
    borderRadius: "12px",
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "#000" }}>
      {/* Header */}
      <header className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid #333" }}>
        <Link to="/" className="flex items-center space-x-2 transition-colors" style={{ color: "#fff" }} aria-label="Back to home">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <Link to="/auth/sign-in" className="text-sm transition-colors" style={{ color: "#FFD861" }}>
          Already have an account? Sign in
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Logo & Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "#FFD861" }}>
                <span className="font-bold text-2xl" style={{ color: "#000" }}>K</span>
              </div>
              <span className="text-3xl font-bold" style={{ color: "#fff" }}>Kolabing</span>
            </div>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold mb-2" style={{ color: "#fff", fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase" as const }}>Create Your Account</h1>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-0.5" style={{ background: "#FFD861" }}></div>
            </div>
            <p className="mt-4 text-lg" style={{ color: "#fff", fontFamily: "'Open Sans', Arial, sans-serif" }}>Join the marketplace for meaningful collaborations</p>
          </div>

          {/* Account Type */}
          <div className="mb-8">
            <Label className="text-sm font-medium mb-4 block" style={{ color: "#fff" }}>Account Type</Label>
            <div className="flex p-1.5 rounded-2xl" style={{ background: "#222" }}>
              <button
                type="button"
                onClick={() => setUserType('business')}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all"
                style={userType === 'business' ? { background: "#FFD861", color: "#000" } : { color: "#fff" }}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Business</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('community')}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all"
                style={userType === 'community' ? { background: "#FFD861", color: "#000" } : { color: "#fff" }}
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
              <Label htmlFor="displayName" className="text-sm font-medium mb-2 block" style={{ color: "#fff" }}>{userType === 'business' ? 'Business Name' : 'Community Name'}</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder={userType === 'business' ? 'Enter your business name' : 'Enter your community name'}
                className="rounded-xl transition-all"
                style={{ background: "#222", color: "#fff", border: errors.displayName ? "1px solid #ff6b6b" : "1px solid #444" }}
              />
              {errors.displayName && <p className="text-sm mt-2" style={{ color: "#ff6b6b" }}>{errors.displayName}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 block" style={{ color: "#fff" }}>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="rounded-xl transition-all"
                style={{ background: "#222", color: "#fff", border: errors.email ? "1px solid #ff6b6b" : "1px solid #444" }}
              />
              {errors.email && <p className="text-sm mt-2" style={{ color: "#ff6b6b" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium mb-2 block" style={{ color: "#fff" }}>Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="rounded-xl transition-all pr-12"
                  style={{ background: "#222", color: "#fff", border: errors.password ? "1px solid #ff6b6b" : "1px solid #444" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: "#fff" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm mt-2" style={{ color: "#ff6b6b" }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium mb-2 block" style={{ color: "#fff" }}>Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="rounded-xl transition-all pr-12"
                  style={{ background: "#222", color: "#fff", border: errors.confirmPassword ? "1px solid #ff6b6b" : "1px solid #444" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: "#fff" }}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm mt-2" style={{ color: "#ff6b6b" }}>{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full font-bold py-4 px-8 shadow-lg transition-all duration-200" 
              size="lg" 
              style={BUTTON_YELLOW}
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

