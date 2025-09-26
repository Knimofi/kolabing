import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://kolabing.lovable.app/auth/reset-password',
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {sent ? (
        <p className="text-green-600">Check your email for a password reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            required
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Send reset link</button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
