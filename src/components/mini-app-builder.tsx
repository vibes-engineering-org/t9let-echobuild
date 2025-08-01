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

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  modules: string[];
  previewImage?: string;
}

const starterTemplates: Template[] = [
  {
    id: 'empty',
    name: 'Blank Canvas',
    description: 'Start from scratch with complete creative freedom',
    icon: <Plus className="w-6 h-6" />,
    modules: []
  },
  {
    id: 'nft-minting',
    name: 'NFT Minting App',
    description: 'Ready-to-use NFT minting interface with Base integration',
    icon: <Palette className="w-6 h-6" />,
    modules: ['nft-minting', 'base-transactions']
  },
  {
    id: 'dao-governance',
    name: 'DAO Poll App',
    description: 'Voting and proposal management for communities',
    icon: <BarChart3 className="w-6 h-6" />,
    modules: ['dao-governance', 'analytics-dashboard']
  },
  {
    id: 'social-feed',
    name: 'Cast Feed Module',
    description: 'Personalized Farcaster feed and interactions',
    icon: <Smartphone className="w-6 h-6" />,
    modules: ['personalized-feed', 'social-identity']
  },
  {
    id: 'custom-module-builder',
    name: 'Custom Module Builder',
    description: 'Create new modules from scratch using visual config panel',
    icon: <Crown className="w-6 h-6" />,
    modules: ['custom-builder']
  },
  {
    id: 'game-app',
    name: 'Game App Template',
    description: 'Lightweight canvas for gamified apps with leaderboards',
    icon: <Zap className="w-6 h-6" />,
    modules: ['game-engine', 'analytics-dashboard']
  },
  {
    id: 'encrypted-chat',
    name: 'Encrypted Group Chat',
    description: 'Peer-to-peer messaging with wallet-bound identity',
    icon: <Users className="w-6 h-6" />,
    modules: ['encrypted-messaging', 'social-identity']
  }
];

const availableModules: Module[] = [
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
    name: 'DAO Poll System',
    description: 'Voting and proposal management for communities',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'blockchain',
    enabled: false
  },
  {
    id: 'personalized-feed',
    name: 'Cast Feed',
    description: 'Custom Farcaster feed and interactions',
    icon: <Smartphone className="w-5 h-5" />,
    category: 'social',
    enabled: false
  },
  {
    id: 'social-identity',
    name: 'Profile Module',
    description: 'Farcaster profile and social connections',
    icon: <Users className="w-5 h-5" />,
    category: 'social',
    enabled: false
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'User engagement and app metrics',
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
  },
  {
    id: 'custom-builder',
    name: 'Custom Module Builder',
    description: 'Visual no-code module creation tool',
    icon: <Crown className="w-5 h-5" />,
    category: 'ui',
    enabled: false
  },
  {
    id: 'game-engine',
    name: 'Game Engine',
    description: 'Lightweight gamification and leaderboards',
    icon: <Zap className="w-5 h-5" />,
    category: 'ui',
    enabled: false
  },
  {
    id: 'encrypted-messaging',
    name: 'Encrypted Chat',
    description: 'P2P messaging with wallet authentication',
    icon: <Users className="w-5 h-5" />,
    category: 'social',
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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  // Listen for preview events from canvas
  React.useEffect(() => {
    const handlePreviewEvent = (event: any) => {
      setActiveTab('preview');
    };
    
    window.addEventListener('openPreview', handlePreviewEvent);
    return () => window.removeEventListener('openPreview', handlePreviewEvent);
  }, []);

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

  const selectTemplate = (templateId: string) => {
    const template = starterTemplates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
    
    if (template.id === 'empty') {
      // Start with empty canvas
      setCanvasModules([]);
    } else {
      // Pre-populate canvas with template modules
      const templateModules = template.modules.map((moduleId, index) => {
        const moduleData = availableModules.find(m => m.id === moduleId);
        if (!moduleData) return null;
        
        return {
          id: `${moduleId}-${Date.now()}-${index}`,
          name: moduleData.name,
          type: moduleId,
          position: { x: 50 + (index * 200), y: 50 + (index * 100) },
          size: { width: 400, height: 350 },
          config: {}
        };
      }).filter(Boolean);
      
      setCanvasModules(templateModules);
    }
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
        {/* Template Selector */}
        {showTemplateSelector && hasAccess() && (
          <Card className="bg-white border-blue-200 mb-6">
            <CardHeader>
              <CardTitle className="text-center">
                Choose Your Starting Template
              </CardTitle>
              <p className="text-center text-slate-600">
                Select a template to get started quickly, or start from scratch
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {starterTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                      template.id === 'empty' 
                        ? 'border-orange-300 bg-orange-50' 
                        : 'border-blue-200 hover:border-blue-300'
                    }`}
                    onClick={() => selectTemplate(template.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                        template.id === 'empty' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {template.icon}
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2">{template.name}</h3>
                      <p className="text-xs text-slate-600 mb-3">{template.description}</p>
                      {template.modules.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {template.modules.length} modules
                        </Badge>
                      )}
                      {template.id === 'empty' && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          Recommended
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                    {selectedTemplate && (
                      <Badge variant="outline" className="ml-3 text-xs">
                        {starterTemplates.find(t => t.id === selectedTemplate)?.name}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    {selectedTemplate && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowTemplateSelector(true);
                          setSelectedTemplate(null);
                        }}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Change Template
                      </Button>
                    )}
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
                    // Force re-render by updating timestamp and trigger state update
                    const timestamp = Date.now();
                    setCanvasModules(prev => prev.map(m => ({ ...m, _timestamp: timestamp })));
                    console.log('Refreshing preview with', canvasModules.length, 'modules');
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