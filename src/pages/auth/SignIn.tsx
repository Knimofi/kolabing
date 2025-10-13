import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, user, profile } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (user && profile) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else {
        navigate(profile.user_type === 'business' ? '/business' : '/community');
      }
    }
  }, [user, profile, navigate, location]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setErrors({ 
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to sign in',
          variant: 'destructive'
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    <div className="min-h-screen flex flex-col" style={{ background: "#000" }}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #333" }}>
        <Link 
          to="/"
          className="flex items-center space-x-2 transition-colors"
          style={{ color: "#fff" }}
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        
        <Link to="/auth/sign-up" className="text-sm transition-colors" style={{ color: "#FFD861" }}>
          Don't have an account? Sign up
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#FFD861" }}>
                <span className="font-bold text-xl" style={{ color: "#000" }}>K</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: "#fff" }}>Kolabing</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#fff", fontFamily: "'Rubik', Arial, sans-serif", textTransform: "uppercase" as const }}>
              Welcome Back
            </h1>
            <p style={{ color: "#fff", fontFamily: "'Open Sans', Arial, sans-serif" }}>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#fff" }}>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'border-destructive' : ''}
                style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "8px" }}
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
                autoComplete="email"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-sm mt-1" style={{ color: "#ff6b6b" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium" style={{ color: "#fff" }}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "8px" }}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: "#fff" }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" className="text-sm mt-1" style={{ color: "#ff6b6b" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              style={BUTTON_YELLOW}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/auth/forgot-password" 
                className="text-sm transition-colors"
                style={{ color: "#FFD861" }}
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignIn;