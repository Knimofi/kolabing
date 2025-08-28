import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Wrench } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, features = [] }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>

      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Coming Soon
            </h2>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're working hard to bring you this feature. It will be available soon!
            </p>

            {features.length > 0 && (
              <div className="max-w-md mx-auto">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  What to expect:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;