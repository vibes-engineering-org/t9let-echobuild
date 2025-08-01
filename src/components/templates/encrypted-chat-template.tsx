"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { 
  Lock, 
  Send, 
  Shield, 
  Users, 
  Wallet,
  Key,
  Eye,
  EyeOff,
  MoreVertical,
  Reply,
  Heart,
  Smile,
  CheckCircle2,
  Circle,
  Zap
} from 'lucide-react';

interface EncryptedChatTemplateProps {
  config?: {
    showAccessGate?: boolean;
    showStatusIndicators?: boolean;
    showReactions?: boolean;
    theme?: 'light' | 'dark';
    requireTokenGating?: boolean;
  };
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
  replies?: Message[];
  status: 'sent' | 'delivered' | 'read';
}

interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  typing: boolean;
  wallet: string;
  hasAccess: boolean;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alice.eth', avatar: '', online: true, typing: false, wallet: '0x1234...5678', hasAccess: true },
  { id: '2', name: 'Bob.base', avatar: '', online: true, typing: true, wallet: '0x2345...6789', hasAccess: true },
  { id: '3', name: 'Charlie', avatar: '', online: false, typing: false, wallet: '0x3456...7890', hasAccess: true },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Alice.eth',
    avatar: '',
    content: 'Hey team! Ready for the NFT drop tomorrow?',
    timestamp: new Date(Date.now() - 300000),
    encrypted: true,
    reactions: [{ emoji: '🔥', count: 2, users: ['Bob.base', 'Charlie'] }],
    status: 'read'
  },
  {
    id: '2',
    sender: 'Bob.base',
    avatar: '',
    content: 'Absolutely! The artwork looks incredible',
    timestamp: new Date(Date.now() - 240000),
    encrypted: true,
    reactions: [{ emoji: '💎', count: 1, users: ['Alice.eth'] }],
    status: 'read'
  },
  {
    id: '3',
    sender: 'You',
    avatar: '',
    content: 'Can\'t wait to see the community response!',
    timestamp: new Date(Date.now() - 120000),
    encrypted: true,
    status: 'delivered'
  }
];

export default function EncryptedChatTemplate({ config = {} }: EncryptedChatTemplateProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showAccessGate, setShowAccessGate] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    showStatusIndicators = true,
    showReactions = true,
    theme = 'light',
    requireTokenGating = true
  } = config;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setHasAccess(true);
      setShowAccessGate(false);
      setIsConnecting(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: '',
      content: newMessage,
      timestamp: new Date(),
      encrypted: true,
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, 'You'] }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, users: ['You'] }]
          };
        }
      }
      return msg;
    }));
    setShowEmojiPicker(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (showAccessGate && !hasAccess) {
    return (
      <Dialog open={showAccessGate} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Access Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Private Group Chat
              </h3>
              <p className="text-gray-600 text-sm">
                This encrypted chat requires wallet verification to join
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-800">Wallet-based identity</span>
              </div>
              {requireTokenGating && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Key className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-800">Token gating enabled</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isConnecting ? (
                <>
                  <Circle className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Access...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet to Join
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Chat Header */}
      <Card className="border-b rounded-none border-indigo-200 bg-indigo-50">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-6 h-6 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <CardTitle className="text-indigo-800 text-lg">Secure Group</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-indigo-600">
                  <Users className="w-3 h-3" />
                  <span>{mockUsers.filter(u => u.online).length} online</span>
                  <Lock className="w-3 h-3 ml-2" />
                  <span>E2E Encrypted</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.sender === 'You' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-end space-x-2">
                {message.sender !== 'You' && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                      {message.sender.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`relative px-3 py-2 rounded-lg ${
                    message.sender === 'You'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.encrypted && (
                    <div className="absolute -top-1 -right-1">
                      <Lock className="w-3 h-3 text-green-500 bg-white rounded-full p-0.5" />
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                    {showStatusIndicators && message.sender === 'You' && (
                      <div className="ml-2">
                        {message.status === 'sent' && <Circle className="w-3 h-3 opacity-60" />}
                        {message.status === 'delivered' && <CheckCircle2 className="w-3 h-3 opacity-60" />}
                        {message.status === 'read' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reactions */}
              {showReactions && message.reactions && message.reactions.length > 0 && (
                <div className="flex items-center space-x-1 mt-1 ml-8">
                  {message.reactions.map((reaction, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-full"
                      onClick={() => handleReaction(message.id, reaction.emoji)}
                    >
                      {reaction.emoji} {reaction.count}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-gray-200"
                    onClick={() => setShowEmojiPicker(message.id)}
                  >
                    <Smile className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicators */}
        {mockUsers.some(u => u.typing) && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                  B
                </AvatarFallback>
              </Avatar>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <Card className="border-t rounded-none border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type an encrypted message..."
                className="pr-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-green-500" />
              <span>Messages are end-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              {mockUsers.filter(u => u.online).map(user => (
                <div key={user.id} className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 bg-white border rounded-lg shadow-lg p-2 z-50">
          <div className="grid grid-cols-6 gap-2">
            {['❤️', '👍', '😂', '😮', '😢', '😡', '🔥', '💎', '🚀', '⚡', '🎉', '👏'].map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => handleReaction(showEmojiPicker, emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}