"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { 
  Play, 
  Save, 
  Code, 
  Settings, 
  Plus,
  Trash2,
  ZapOff,
  Zap,
  Eye,
  MousePointer,
  Type,
  Hash,
  ToggleLeft,
  List,
  Calendar,
  Link,
  Puzzle,
  CheckCircle
} from 'lucide-react';

interface CustomModuleBuilderTemplateProps {
  config?: {
    showLogicCanvas?: boolean;
    showPreview?: boolean;
    showCodeOutput?: boolean;
    theme?: 'light' | 'dark';
  };
}

interface LogicBlock {
  id: string;
  type: 'input' | 'action' | 'condition' | 'output';
  label: string;
  value?: any;
  position: { x: number; y: number };
  connections: string[];
  icon: React.ReactNode;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  id: string;
}

const blockTypes = [
  { type: 'input', label: 'Text Input', icon: <Type className="w-4 h-4" />, color: 'blue' },
  { type: 'input', label: 'Number Input', icon: <Hash className="w-4 h-4" />, color: 'blue' },
  { type: 'input', label: 'Toggle', icon: <ToggleLeft className="w-4 h-4" />, color: 'blue' },
  { type: 'action', label: 'Send Cast', icon: <Zap className="w-4 h-4" />, color: 'green' },
  { type: 'action', label: 'Store Data', icon: <Save className="w-4 h-4" />, color: 'green' },
  { type: 'condition', label: 'If/Then', icon: <Puzzle className="w-4 h-4" />, color: 'yellow' },
  { type: 'output', label: 'Display Text', icon: <Eye className="w-4 h-4" />, color: 'purple' },
  { type: 'output', label: 'Show Success', icon: <CheckCircle className="w-4 h-4" />, color: 'purple' },
];

export default function CustomModuleBuilderTemplate({ config = {} }: CustomModuleBuilderTemplateProps) {
  const [blocks, setBlocks] = useState<LogicBlock[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [moduleName, setModuleName] = useState('My Custom Module');
  const [previewMode, setPreviewMode] = useState(false);
  const [savedModules, setSavedModules] = useState<string[]>(['User Profile Card', 'Token Balance Display']);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const {
    showLogicCanvas = true,
    showPreview = true,
    showCodeOutput = true,
    theme = 'light'
  } = config;

  const addBlock = useCallback((blockType: any) => {
    const newBlock: LogicBlock = {
      id: `block-${Date.now()}`,
      type: blockType.type,
      label: blockType.label,
      position: { x: 100 + blocks.length * 50, y: 100 + blocks.length * 30 },
      connections: [],
      icon: blockType.icon,
      color: blockType.color
    };
    setBlocks(prev => [...prev, newBlock]);
  }, [blocks.length]);

  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !draggedBlock) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
    const y = (e.clientY - canvasRect.top - dragOffset.y) / zoom;

    setBlocks(prev => prev.map(block =>
      block.id === draggedBlock
        ? { ...block, position: { x: Math.max(0, x), y: Math.max(0, y) } }
        : block
    ));
    setDraggedBlock(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    setConnections(prev => prev.filter(c => c.from !== blockId && c.to !== blockId));
  };

  const generateCode = () => {
    const codeTemplate = `
// Generated Custom Module: ${moduleName}
import React, { useState } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export default function ${moduleName.replace(/\s+/g, '')}Module() {
  const [state, setState] = useState({});

  ${blocks.map(block => {
    switch (block.type) {
      case 'input':
        return `  const handle${block.id}Change = (value) => setState(prev => ({ ...prev, ${block.id}: value }));`;
      case 'action':
        return `  const execute${block.id} = () => { console.log('Executing ${block.label}'); };`;
      default:
        return `  // ${block.label} logic`;
    }
  }).join('\n')}

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">${moduleName}</h3>
        <div className="space-y-4">
          ${blocks.map(block => {
            switch (block.type) {
              case 'input':
                return `<Input placeholder="${block.label}" onChange={(e) => handle${block.id}Change(e.target.value)} />`;
              case 'action':
                return `<Button onClick={execute${block.id}} className="w-full">${block.label}</Button>`;
              case 'output':
                return `<div className="p-2 bg-gray-50 rounded">${block.label} Output</div>`;
              default:
                return `<div>${block.label}</div>`;
            }
          }).join('\n          ')}
        </div>
      </CardContent>
    </Card>
  );
}`;
    return codeTemplate;
  };

  const saveModule = () => {
    setSavedModules(prev => [...prev, moduleName]);
    // Simulate save with toast
    console.log(`Module "${moduleName}" saved successfully!`);
  };

  const getBlockColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      red: 'bg-red-100 border-red-300 text-red-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <Tabs defaultValue="builder" className="h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Puzzle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Custom Module Builder</h2>
            </div>
            <Input
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-48 h-8"
              placeholder="Module name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              {showPreview && <TabsTrigger value="preview">Preview</TabsTrigger>}
              {showCodeOutput && <TabsTrigger value="code">Code</TabsTrigger>}
            </TabsList>
            <Button onClick={saveModule} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Module
            </Button>
          </div>
        </div>

        <TabsContent value="builder" className="flex h-full p-0">
          {/* Block Palette */}
          <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Logic Blocks
            </h3>
            <div className="space-y-2">
              {blockTypes.map((blockType, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addBlock(blockType)}
                >
                  <CardContent className="p-3">
                    <div className={`flex items-center space-x-2 ${getBlockColor(blockType.color)}`}>
                      {blockType.icon}
                      <span className="text-sm font-medium">{blockType.label}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Saved Modules</h4>
              <div className="space-y-1">
                {savedModules.map((module, index) => (
                  <div key={index} className="text-sm text-gray-600 p-2 bg-white rounded border">
                    {module}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logic Canvas */}
          {showLogicCanvas && (
            <div className="flex-1 relative overflow-hidden">
              {/* Canvas Controls */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <Badge variant="outline">{blocks.length} blocks</Badge>
                <div className="flex items-center space-x-1 bg-white rounded border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  >
                    -
                  </Button>
                  <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  >
                    +
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Flow
                </Button>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="w-full h-full bg-grid-pattern relative overflow-auto"
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              >
                {blocks.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Puzzle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Start Building</h3>
                      <p className="text-sm">Drag blocks from the palette to create your custom module</p>
                    </div>
                  </div>
                ) : (
                  blocks.map((block) => (
                    <div
                      key={block.id}
                      className={`absolute cursor-move select-none transition-all duration-200 ${
                        selectedBlock === block.id ? 'ring-2 ring-orange-500' : ''
                      }`}
                      style={{
                        left: block.position.x,
                        top: block.position.y,
                        transform: selectedBlock === block.id ? 'scale(1.05)' : 'scale(1)'
                      }}
                      draggable
                      onDragStart={(e) => handleBlockDragStart(e, block.id)}
                      onClick={() => setSelectedBlock(block.id)}
                    >
                      <Card className={`border-2 ${getBlockColor(block.color)} min-w-32 shadow-sm hover:shadow-md transition-shadow`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {block.icon}
                              <span className="text-sm font-medium">{block.label}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-5 h-5 p-0 hover:bg-red-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBlock(block.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                          
                          {/* Connection Points */}
                          <div className="flex justify-between mt-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                )}

                {/* Connection Lines */}
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                  {connections.map((connection) => {
                    const fromBlock = blocks.find(b => b.id === connection.from);
                    const toBlock = blocks.find(b => b.id === connection.to);
                    if (!fromBlock || !toBlock) return null;

                    return (
                      <line
                        key={connection.id}
                        x1={fromBlock.position.x + 64}
                        y1={fromBlock.position.y + 32}
                        x2={toBlock.position.x + 64}
                        y2={toBlock.position.y + 32}
                        stroke="#6366f1"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          )}
        </TabsContent>

        {showPreview && (
          <TabsContent value="preview" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Module Preview - {moduleName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md mx-auto">
                  {blocks.map((block) => (
                    <div key={block.id}>
                      {block.type === 'input' && block.label.includes('Text') && (
                        <div>
                          <Label>{block.label}</Label>
                          <Input placeholder={`Enter ${block.label.toLowerCase()}`} className="mt-1" />
                        </div>
                      )}
                      {block.type === 'input' && block.label.includes('Number') && (
                        <div>
                          <Label>{block.label}</Label>
                          <Input type="number" placeholder="0" className="mt-1" />
                        </div>
                      )}
                      {block.type === 'action' && (
                        <Button className="w-full">
                          {block.icon}
                          <span className="ml-2">{block.label}</span>
                        </Button>
                      )}
                      {block.type === 'output' && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <div className="flex items-center space-x-2">
                            {block.icon}
                            <span className="text-sm">{block.label}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {blocks.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Add blocks to see the preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {showCodeOutput && (
          <TabsContent value="code" className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Generated Code - {moduleName}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">React + TypeScript</Badge>
                    <Button size="sm" variant="outline">
                      Copy Code
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm p-4 bg-gray-50 rounded overflow-auto max-h-96 font-mono">
                  <code>{generateCode()}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}