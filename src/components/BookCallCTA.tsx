import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Users, Target, TrendingUp } from 'lucide-react';
const BookCallCTA = () => {
  const handleBookCall = () => {
    window.location.href = 'mailto:kolabingbcn@gmail.com?subject=Book a Discovery Call&body=Hi! I\'m interested in learning more about Kolabing\'s services. Please let me know your availability for a discovery call.';
  };
  return;
};
export default BookCallCTA;