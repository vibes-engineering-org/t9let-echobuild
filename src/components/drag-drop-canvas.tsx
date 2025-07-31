"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { 
  GripVertical, 
  Trash2, 
  Settings,
  Eye,
  Smartphone
} from 'lucide-react';
import FarcasterSocialModule from './modules/farcaster-social-module';
import BaseBlockchainModule from './modules/base-blockchain-module';

interface DragDropModule {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
}

interface DragDropCanvasProps {
  modules: any[];
  onModuleAdd?: (moduleType: string) => void;
  onModuleRemove?: (moduleId: string) => void;
  onModuleUpdate?: (moduleId: string, config: any) => void;
  onCanvasModulesChange?: (modules: DragDropModule[]) => void;
}

export default function DragDropCanvas({ 
  modules, 
  onModuleAdd, 
  onModuleRemove, 
  onModuleUpdate,
  onCanvasModulesChange
}: DragDropCanvasProps) {
  const [canvasModules, setCanvasModules] = useState<DragDropModule[]>([]);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModule(moduleId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !draggedModule) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    // Check if it's a new module from the sidebar
    const isNewModule = modules.find(m => m.id === draggedModule);
    
    if (isNewModule) {
      // Add new module to canvas
      const newModule: DragDropModule = {
        id: `${draggedModule}-${Date.now()}`,
        name: isNewModule.name,
        type: draggedModule,
        position: { x: Math.max(0, x), y: Math.max(0, y) },
        size: { width: 400, height: 350 },
        config: {}
      };
      const updatedModules = [...canvasModules, newModule];
      setCanvasModules(updatedModules);
      onCanvasModulesChange?.(updatedModules);
    } else {
      // Move existing module
      setCanvasModules(prev =>
        prev.map(module =>
          module.id === draggedModule
            ? { ...module, position: { x: Math.max(0, x), y: Math.max(0, y) } }
            : module
        )
      );
    }

    setDraggedModule(null);
  };

  const removeModule = (moduleId: string) => {
    const updatedModules = canvasModules.filter(m => m.id !== moduleId);
    setCanvasModules(updatedModules);
    onCanvasModulesChange?.(updatedModules);
  };

  const renderModuleContent = (module: DragDropModule) => {
    const moduleStyle = { 
      width: '100%', 
      height: '100%',
      overflow: 'hidden'
    };

    switch (module.type) {
      case 'social-identity':
        return (
          <div style={moduleStyle}>
            <FarcasterSocialModule config={module.config} />
          </div>
        );
      case 'base-transactions':
        return (
          <div style={moduleStyle}>
            <BaseBlockchainModule config={module.config} />
          </div>
        );
      case 'nft-minting':
        return (
          <div style={moduleStyle}>
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
      case 'dao-governance':
        return (
          <div className="p-4 bg-green-50 rounded h-full">
            <div className="flex justify-between items-center mb-3">
              <div className="w-16 h-3 bg-green-200 rounded"></div>
              <div className="w-12 h-3 bg-green-300 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <div className="w-20 h-3 bg-green-200 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <div className="w-24 h-3 bg-green-200 rounded"></div>
              </div>
            </div>
            <div className="mt-4 p-2 bg-white rounded border">
              <p className="text-xs text-slate-600">DAO Governance Module</p>
              <p className="text-xs text-slate-500 mt-1">Vote on proposals and manage treasury</p>
            </div>
          </div>
        );
      case 'personalized-feed':
        return (
          <div style={moduleStyle}>
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
      case 'analytics-dashboard':
        return (
          <div className="p-4 bg-purple-50 rounded h-full">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded p-2 text-center">
                <div className="text-lg font-bold text-purple-700">1,234</div>
                <div className="text-xs text-slate-600">Total Views</div>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <div className="text-lg font-bold text-purple-700">56</div>
                <div className="text-xs text-slate-600">Interactions</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-purple-200 rounded"></div>
              <div className="w-3/4 h-2 bg-purple-200 rounded"></div>
              <div className="w-1/2 h-2 bg-purple-200 rounded"></div>
            </div>
            <div className="mt-4 p-2 bg-white rounded border">
              <p className="text-xs text-slate-600">Analytics Dashboard</p>
              <p className="text-xs text-slate-500 mt-1">Track user engagement and metrics</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded h-full flex items-center justify-center">
            <span className="text-gray-500 text-sm">Module Content</span>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      {/* Module Palette */}
      <div className="w-80 bg-slate-100 border-r border-blue-200 p-4 overflow-y-auto">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-orange-500" />
          Module Library
        </h3>
        <div className="space-y-3">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="cursor-move hover:shadow-md transition-shadow border-orange-200"
              draggable
              onDragStart={(e) => handleDragStart(e, module.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-orange-600">{module.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-800">{module.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{module.description}</p>
                  </div>
                  <GripVertical className="w-4 h-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-blue-200 p-3">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {canvasModules.length} modules
              </Badge>
              <span className="text-sm text-slate-600">
                Drag modules from the library to build your app
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="border-orange-500 text-orange-600">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="w-full h-full bg-white relative pt-20"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ minHeight: '600px' }}
        >
          {canvasModules.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Start Building
                </h3>
                <p className="text-slate-500 text-sm">
                  Drag modules from the library to create your mini app
                </p>
              </div>
            </div>
          ) : (
            canvasModules.map((module) => (
              <div
                key={module.id}
                className="absolute bg-white border-2 border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                style={{
                  left: module.position.x,
                  top: module.position.y,
                  width: module.size.width,
                  height: module.size.height
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, module.id)}
              >
                {/* Module Header */}
                <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                    <span className="text-sm font-medium text-slate-700">{module.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0 hover:bg-orange-100"
                    >
                      <Settings className="w-3 h-3 text-orange-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0 hover:bg-red-100"
                      onClick={() => removeModule(module.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Module Content */}
                <div className="p-0" style={{ height: module.size.height - 40 }}>
                  {renderModuleContent(module)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}