"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';  
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import FarcasterSocialModule from './modules/farcaster-social-module';
import BaseBlockchainModule from './modules/base-blockchain-module';
import { 
  Smartphone, 
  Monitor, 
  Tablet,
  RotateCcw,
  ExternalLink,
  Code,
  Eye,
  Maximize,
  Play
} from 'lucide-react';

interface PreviewModule {
  id: string;
  name: string;
  type: string;
  config: any;
  position: { x: number; y: number };
}

interface LivePreviewProps {
  projectName: string;
  modules: PreviewModule[];
  onRefresh?: () => void;
  showModal?: boolean;
  onCloseModal?: () => void;
}

export default function LivePreview({ 
  projectName, 
  modules,
  onRefresh,
  showModal = false,
  onCloseModal 
}: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showCode, setShowCode] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Force re-render when modules change
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [modules]);

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
        return { width: '1200px', height: '800px' };
      default:
        return { width: '375px', height: '667px' };
    }
  };

  const renderPreviewModule = (module: PreviewModule) => {
    const moduleStyle = {
      width: '100%',
      marginBottom: '16px'
    };

    switch (module.type) {
      case 'social-identity':
        return (
          <div key={module.id} style={moduleStyle}>
            <FarcasterSocialModule config={module.config} />
          </div>
        );
      case 'base-transactions':
        return (
          <div key={module.id} style={moduleStyle}>
            <BaseBlockchainModule config={module.config} />
          </div>
        );
      case 'nft-minting':
        return (
          <div key={module.id} style={moduleStyle}>
            <BaseBlockchainModule 
              config={{ 
                ...module.config,
                showWallet: false,
                showTransactions: false,
                showNFTs: true,
                showGasTracker: false 
              }} 
            />
          </div>
        );
      case 'personalized-feed':
        return (
          <div key={module.id} style={moduleStyle}>
            <FarcasterSocialModule 
              config={{ 
                ...module.config,
                showProfile: false,
                showFeed: true,
                showSocialGraph: false 
              }} 
            />
          </div>
        );
      default:
        return (
          <Card key={module.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded"></div>
                <div>
                  <h4 className="font-medium">{module.name}</h4>
                  <p className="text-sm text-slate-600">Module preview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const generateCodePreview = () => {
    const codeTemplate = `
// Generated EchoBuild Mini App
import React from 'react';
import { Card } from '~/components/ui/card';
${modules.map(m => {
  switch (m.type) {
    case 'social-identity':
      return `import FarcasterSocialModule from '~/components/modules/farcaster-social-module';`;
    case 'base-transactions':
      return `import BaseBlockchainModule from '~/components/modules/base-blockchain-module';`;
    default:
      return `// Import ${m.name} module`;
  }
}).join('\n')}

export default function ${projectName.replace(/\s+/g, '')}App() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">${projectName}</h1>
      
      ${modules.map(m => {
        switch (m.type) {
          case 'social-identity':
            return `<FarcasterSocialModule config={${JSON.stringify(m.config, null, 8)}} />`;
          case 'base-transactions':
            return `<BaseBlockchainModule config={${JSON.stringify(m.config, null, 8)}} />`;
          default:
            return `{/* ${m.name} component */}`;
        }
      }).join('\n      ')}
    </div>
  );
}`;
    return codeTemplate;
  };

  const dimensions = getViewportDimensions();

  return (
    <div className="h-full">
      <Tabs value={showCode ? 'code' : 'preview'} onValueChange={(value) => setShowCode(value === 'code')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="preview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Code className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {!showCode && (
              <>
                <div className="flex items-center space-x-1 border rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                    className="h-8 px-2"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                    className="h-8 px-2"
                    onClick={() => setViewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                    className="h-8 px-2"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {dimensions.width} × {dimensions.height}
                </Badge>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="h-full">
          <div className="flex justify-center h-full bg-slate-100 rounded-lg p-8">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{ 
                width: dimensions.width, 
                height: dimensions.height,
                maxWidth: '100%',
                maxHeight: '600px'
              }}
            >
              {/* Mobile status bar simulation */}
              {viewMode === 'mobile' && (
                <div className="bg-black text-white text-xs p-2 flex justify-between">
                  <span>9:41</span>
                  <span>{projectName}</span>
                  <span>100%</span>
                </div>
              )}
              
              <div className="h-full overflow-y-auto">
                {modules.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center p-8">
                    <div>
                      <Smartphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">
                        {projectName}
                      </h3>
                      <p className="text-slate-500">
                        Add modules to see your app preview
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-slate-800">{projectName}</h1>
                      <p className="text-sm text-slate-600 mt-1">Built with EchoBuild</p>
                    </div>
                    
                    <div className="space-y-4">
                      {modules.map(renderPreviewModule)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="h-full">
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2 text-blue-600" />
                  Generated Code - {projectName}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">React + TypeScript</Badge>
                  <Button size="sm" variant="outline" className="border-orange-500 text-orange-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <pre className="text-sm p-6 overflow-auto h-full bg-slate-50 font-mono">
                <code>{generateCodePreview()}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}