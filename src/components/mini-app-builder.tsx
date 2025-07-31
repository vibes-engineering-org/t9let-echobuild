"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { 
  Palette, 
  Smartphone, 
  Zap, 
  Users, 
  Coins, 
  BarChart3, 
  Settings,
  Play,
  Save,
  Share2,
  Plus,
  Crown
} from 'lucide-react';
import DragDropCanvas from './drag-drop-canvas';
import PricingModal from './pricing-modal';
import LivePreview from './live-preview';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'social' | 'blockchain' | 'analytics' | 'ui';
  enabled: boolean;
}

const availableModules: Module[] = [
  {
    id: 'social-identity',
    name: 'Social Identity',
    description: 'Farcaster profile, followers, and social graph',
    icon: <Users className="w-5 h-5" />,
    category: 'social',
    enabled: false
  },
  {
    id: 'nft-minting',
    name: 'NFT Minting',
    description: 'Mint NFTs on Base with custom contracts',
    icon: <Palette className="w-5 h-5" />,
    category: 'blockchain',
    enabled: false
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance',
    description: 'Voting and proposal management',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'blockchain',
    enabled: false
  },
  {
    id: 'personalized-feed',
    name: 'Personalized Feed',
    description: 'Custom cast feed and interactions',
    icon: <Smartphone className="w-5 h-5" />,
    category: 'social',
    enabled: false
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'User engagement and cast analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analytics',
    enabled: false
  },
  {
    id: 'base-transactions',
    name: 'Base Transactions',
    description: 'Display and track Base on-chain activity',
    icon: <Coins className="w-5 h-5" />,
    category: 'blockchain',
    enabled: false
  }
];

export default function MiniAppBuilder() {
  const [projectName, setProjectName] = useState('My Mini App');
  const [modules, setModules] = useState<Module[]>(availableModules);
  const [activeTab, setActiveTab] = useState('builder');
  const [showPricing, setShowPricing] = useState(false);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [canvasModules, setCanvasModules] = useState<any[]>([]);

  const toggleModule = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, enabled: !module.enabled }
          : module
      )
    );
  };

  const enabledModules = modules.filter(m => m.enabled);

  const handlePurchase = (tierId: string) => {
    setUserTier(tierId);
    setShowPricing(false);
    // In a real app, this would handle the actual payment
    console.log(`Purchased tier: ${tierId}`);
  };

  const hasAccess = () => {
    return userTier !== null;
  };

  const getAccessMessage = () => {
    if (!hasAccess()) {
      return "Unlock EchoBuild to start creating your mini app";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Top Navigation */}
      <nav className="bg-slate-900 border-b border-blue-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-white">EchoBuild</span>
            </div>
            <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
              Beta
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            {userTier && (
              <Badge className="bg-orange-500 text-white">
                {userTier === 'early-bird' ? 'Echo Pioneer' : 
                 userTier === 'creator' ? 'Creator' : 'Studio'} Tier
              </Badge>
            )}
            {hasAccess() ? (
              <>
                <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Deploy
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setShowPricing(true)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Unlock EchoBuild
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border-blue-600">
            <TabsTrigger value="builder" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Builder
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Preview
            </TabsTrigger>
            <TabsTrigger value="deploy" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Deploy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-6">
            <Card className="bg-white border-blue-200" style={{ height: '700px' }}>
              <CardHeader className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-800 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-500" />
                    {projectName} - Builder
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-48 h-8 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Project name"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <DragDropCanvas 
                  modules={modules} 
                  onCanvasModulesChange={setCanvasModules}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card className="bg-white border-blue-200" style={{ height: '700px' }}>
              <CardContent className="p-6 h-full">
                <LivePreview 
                  projectName={projectName}
                  modules={canvasModules}
                  onRefresh={() => {
                    // Refresh preview
                    console.log('Refreshing preview...');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deploy" className="mt-6">
            <Card className="bg-white border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-orange-500" />
                  Deploy Your Mini App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12">
                    Deploy to Vercel
                  </Button>
                  <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 h-12">
                    Export to GitHub
                  </Button>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Your mini app will be deployed with the following modules:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {enabledModules.map(module => (
                      <li key={module.id}>{module.name}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}