
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionInfo {
  tier: SubscriptionTier;
  queriesUsed: number;
  queriesLimit: number;
  price: string | null;
  renewalDate?: string;
}

export const SubscriptionSection = () => {
  const navigate = useNavigate();
  
  // Mock subscription data - in a real app, this would come from your API
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    tier: 'free',
    queriesUsed: 70,
    queriesLimit: 100,
    price: null
  });
  
  const [isCancelling, setIsCancelling] = useState(false);

  const usagePercentage = Math.round((subscription.queriesUsed / subscription.queriesLimit) * 100);
  
  const getBadgeVariant = (tier: SubscriptionTier) => {
    switch(tier) {
      case 'pro':
        return 'secondary';
      case 'enterprise':
        return 'default';
      default:
        return 'outline';
    }
  };
  
  const getTierDisplay = (tier: SubscriptionTier) => {
    switch(tier) {
      case 'pro':
        return 'Pro ($49/mo)';
      case 'enterprise':
        return 'Enterprise ($99/mo)';
      default:
        return 'Free';
    }
  };

  const handleOpenBillingPortal = () => {
    toast.info("Redirecting to billing portal...");
    // In a real app, this would redirect to your billing portal
    // window.location.href = "https://billing.stripe.com/session/your-session-id";
  };
  
  const handleCancelSubscription = () => {
    setIsCancelling(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Subscription cancelled successfully");
      setSubscription({
        ...subscription,
        tier: 'free',
        queriesLimit: 100,
        price: null
      });
      setIsCancelling(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Subscription & Plan</span>
        </CardTitle>
        <CardDescription>
          Manage your subscription and view usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">Current Plan</h3>
              <Badge variant={getBadgeVariant(subscription.tier)}>
                {getTierDisplay(subscription.tier)}
              </Badge>
            </div>
            {subscription.renewalDate && (
              <p className="text-sm text-muted-foreground">
                Renews on {subscription.renewalDate}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Query Usage</span>
            <span className="text-sm font-medium">
              {subscription.queriesUsed} / {subscription.queriesLimit} queries
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {subscription.tier === 'free' ? (
              <>Reset on the 1st of next month. </>
            ) : (
              <>Included with your subscription. </>
            )}
            {usagePercentage >= 80 && (
              <span className="text-amber-500">
                You're approaching your limit.
              </span>
            )}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        {subscription.tier === 'free' ? (
          <Button onClick={() => navigate('/pricing')}>
            Upgrade Plan
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleOpenBillingPortal}>
              Manage Subscription
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-100/10">
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will remain active until the end of your current billing period. 
                    After that, you'll be downgraded to the Free plan with limited features.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCancelSubscription} 
                    disabled={isCancelling}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isCancelling ? "Cancelling..." : "Yes, Cancel Subscription"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
