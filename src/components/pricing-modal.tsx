"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { 
  Crown, 
  Zap, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Star,
  ArrowRight,
  Gift
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string | number;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  earlyBird?: boolean;
  icon: React.ReactNode;
  color: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'early-bird',
    name: 'Echo Pioneer',
    price: 25,
    period: 'one-time',
    description: 'Limited to the first 500 Echo Pioneers',
    features: [
      'Lifetime access to all core builder modules',
      'Priority feedback loop for future releases',
      'Echo Pioneer Badge for Farcaster & Base',
      'Private beta channel for early features',
      'Revenue share eligibility for templates',
      'Early access to premium add-ons'
    ],
    popular: true,
    earlyBird: true,
    icon: <Crown className="w-6 h-6" />,
    color: 'orange'
  },
  {
    id: 'creator',
    name: 'Creator Tier',
    price: 35,
    period: 'one-time',
    description: 'Perfect for individual creators and developers',
    features: [
      'All builder modules included',
      'Deploy tools and GitHub integration',
      'Custom templates and themes',
      'Community support',
      'Export to Vercel/GitHub'
    ],
    icon: <Sparkles className="w-6 h-6" />,
    color: 'blue'
  },
  {
    id: 'studio',
    name: 'Studio Tier',
    price: 8,
    period: 'per month',
    description: 'For teams and power users',
    features: [
      'Everything in Creator Tier',
      'Advanced analytics dashboard',
      'NFT and DAO integration tools',
      'Live dashboard access',
      'Priority support',
      'Custom branding options'
    ],
    icon: <Users className="w-6 h-6" />,
    color: 'purple'
  }
];

interface PricingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPurchase?: (tierId: string) => void;
}

export default function PricingModal({ isOpen, onClose, onPurchase }: PricingModalProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handlePurchase = (tierId: string) => {
    setSelectedTier(tierId);
    onPurchase?.(tierId);
  };

  const getTierColor = (color: string, variant: 'bg' | 'border' | 'text') => {
    const colors = {
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600'
      }
    };
    return colors[color as keyof typeof colors][variant];
  };

  const PricingCard = ({ tier }: { tier: PricingTier }) => (
    <Card className={`relative ${tier.popular ? 'ring-2 ring-orange-500 shadow-lg' : 'shadow-sm'} hover:shadow-md transition-shadow`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-orange-500 text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      {tier.earlyBird && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-red-500 text-white px-2 py-1 text-xs">
            <Gift className="w-3 h-3 mr-1" />
            Limited
          </Badge>
        </div>
      )}
      
      <CardHeader className={`${getTierColor(tier.color, 'bg')} ${getTierColor(tier.color, 'border')} border-b`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTierColor(tier.color, 'text')}`}>
            {tier.icon}
          </div>
          <div>
            <CardTitle className="text-xl text-slate-800">{tier.name}</CardTitle>
            <p className="text-sm text-slate-600">{tier.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-slate-800">${tier.price}</span>
            {tier.period && (
              <span className="text-slate-600 text-sm">/{tier.period}</span>
            )}
          </div>
          {tier.earlyBird && (
            <p className="text-xs text-orange-600 font-medium mt-1">
              Early Bird Special - Save 30%
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          className={`w-full mt-6 ${
            tier.popular 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : `${getTierColor(tier.color, 'text')} border ${getTierColor(tier.color, 'border')} hover:${getTierColor(tier.color, 'bg')}`
          }`}
          variant={tier.popular ? 'default' : 'outline'}
          onClick={() => handlePurchase(tier.id)}
          disabled={selectedTier === tier.id}
        >
          {selectedTier === tier.id ? (
            'Processing...'
          ) : (
            <>
              {tier.earlyBird ? 'Claim Pioneer Access' : 'Get Started'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        
        {tier.earlyBird && (
          <p className="text-xs text-center text-slate-500 mt-3">
            🔥 Only {Math.floor(Math.random() * 150) + 350} spots remaining
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-3xl font-bold text-slate-800">
            Choose Your EchoBuild Plan
          </DialogTitle>
          <DialogDescription className="text-lg text-slate-600">
            Craft tools. Build culture. Echo boldly.
          </DialogDescription>
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">
              Launch your mini app in minutes, not hours
            </span>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            Ecosystem Add-ons (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-slate-800">Team Workspace</h4>
              <p className="text-sm text-slate-600 mb-2">Up to 5 collaborators</p>
              <Badge variant="outline">$30/month</Badge>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-slate-800">Template Store</h4>
              <p className="text-sm text-slate-600 mb-2">Submit & earn revenue</p>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-600">
                Free
              </Badge>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <Crown className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-slate-800">Custom Module Builder</h4>
              <p className="text-sm text-slate-600 mb-2">No-code module creation</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-600">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-center text-sm text-slate-500 mt-6">
          <p>🎯 Goal: 500 Early Bird users × $25 = $12,500 to fuel infrastructure & Base season activation</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}