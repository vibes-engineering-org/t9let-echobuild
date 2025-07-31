"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Avatar } from '~/components/ui/avatar';
import { UserContext } from '~/components/user-context';
import { ProfileSearch } from '~/components/profile-search';
import { ShareCastButton } from '~/components/share-cast-button';
import { useMiniAppSdk } from '~/hooks/use-miniapp-sdk';
import { useProfile } from '~/hooks/use-profile';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Repeat2, 
  Share,
  Settings,
  User,
  Globe,
  UserPlus
} from 'lucide-react';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  followerCount: number;
  followingCount: number;
  bio?: string;
  verifications?: string[];
}

interface Cast {
  hash: string;
  text: string;
  author: FarcasterUser;
  timestamp: string;
  replies: number;
  recasts: number;
  likes: number;
}

interface FarcasterSocialModuleProps {
  config?: {
    showProfile?: boolean;
    showFeed?: boolean;
    showSocialGraph?: boolean;
    feedLimit?: number;
  };
  onConfigChange?: (config: any) => void;
}

export default function FarcasterSocialModule({ 
  config = {
    showProfile: true,
    showFeed: true,
    showSocialGraph: false,
    feedLimit: 10
  },
  onConfigChange 
}: FarcasterSocialModuleProps) {
  const { sdk, isSDKLoaded } = useMiniAppSdk();
  const profileData = useProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchResults, setSearchResults] = useState<FarcasterUser[]>([]);
  const [userFeed, setUserFeed] = useState<Cast[]>([]);
  const [socialGraph, setSocialGraph] = useState<{followers: FarcasterUser[], following: FarcasterUser[]}>({
    followers: [],
    following: []
  });
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Mock data for demonstration
  const mockUser: FarcasterUser = {
    fid: 12345,
    username: 'builder',
    displayName: 'App Builder',
    pfpUrl: '',
    followerCount: 1250,
    followingCount: 890,
    bio: 'Building the future of decentralized social apps',
    verifications: ['0x1234...5678']
  };

  const mockCasts: Cast[] = [
    {
      hash: '0xabc123',
      text: 'Just launched my new mini app on EchoBuild! The drag-and-drop interface made it so easy to integrate Farcaster social features.',
      author: mockUser,
      timestamp: '2h ago',
      replies: 12,
      recasts: 8,
      likes: 24
    },
    {
      hash: '0xdef456',
      text: 'The future of social apps is modular. Excited to see what the community builds with these tools!',
      author: mockUser,
      timestamp: '5h ago',
      replies: 6,
      recasts: 15,
      likes: 32
    }
  ];

  const mockFollowers: FarcasterUser[] = [
    { fid: 1, username: 'alice', displayName: 'Alice', followerCount: 500, followingCount: 300 },
    { fid: 2, username: 'bob', displayName: 'Bob', followerCount: 750, followingCount: 400 },
    { fid: 3, username: 'charlie', displayName: 'Charlie', followerCount: 1200, followingCount: 600 }
  ];

  useEffect(() => {
    if (isSDKLoaded && profileData) {
      // In a real implementation, this would fetch actual Farcaster data
      setUserFeed(mockCasts);
      setSocialGraph({
        followers: mockFollowers,
        following: mockFollowers.slice(0, 2)
      });
    }
  }, [isSDKLoaded, profileData]);

  const handleConfigUpdate = (updates: any) => {
    const newConfig = { ...config, ...updates };
    onConfigChange?.(newConfig);
  };

  if (isConfiguring) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Farcaster Social - Configuration
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setIsConfiguring(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Done
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Profile</label>
              <input
                type="checkbox"
                checked={config.showProfile}
                onChange={(e) => handleConfigUpdate({ showProfile: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Feed</label>
              <input
                type="checkbox"
                checked={config.showFeed}
                onChange={(e) => handleConfigUpdate({ showFeed: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Social Graph</label>
              <input
                type="checkbox"
                checked={config.showSocialGraph}
                onChange={(e) => handleConfigUpdate({ showSocialGraph: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Feed Limit</label>
              <Input
                type="number"
                value={config.feedLimit}
                onChange={(e) => handleConfigUpdate({ feedLimit: parseInt(e.target.value) })}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500"
                min="1"
                max="50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Farcaster Social
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsConfiguring(true)}
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full rounded-none border-b">
            {config.showProfile && (
              <TabsTrigger value="profile" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
            )}
            {config.showFeed && (
              <TabsTrigger value="feed" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Feed
              </TabsTrigger>
            )}
            {config.showSocialGraph && (
              <TabsTrigger value="social" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Globe className="w-4 h-4 mr-2" />
                Social
              </TabsTrigger>
            )}
          </TabsList>

          {config.showProfile && (
            <TabsContent value="profile" className="p-4 space-y-4">
              <UserContext />
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <div className="w-full h-full bg-blue-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-slate-800">{mockUser.displayName}</h3>
                      <Badge variant="secondary">@{mockUser.username}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{mockUser.bio}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-slate-600">
                        <strong>{mockUser.followerCount.toLocaleString()}</strong> followers
                      </span>
                      <span className="text-slate-600">
                        <strong>{mockUser.followingCount.toLocaleString()}</strong> following
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <ShareCastButton
                  text="Check out this mini app I built!"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                />
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </div>
            </TabsContent>
          )}

          {config.showFeed && (
            <TabsContent value="feed" className="p-4 space-y-4">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {userFeed.slice(0, config.feedLimit).map((cast) => (
                  <Card key={cast.hash} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <div className="w-full h-full bg-blue-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-slate-800">{cast.author.displayName}</span>
                            <span className="text-sm text-slate-500">@{cast.author.username}</span>
                            <span className="text-sm text-slate-500">·</span>
                            <span className="text-sm text-slate-500">{cast.timestamp}</span>
                          </div>
                          <p className="text-slate-700 mb-3">{cast.text}</p>
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <button className="flex items-center space-x-1 hover:text-blue-600">
                              <MessageCircle className="w-4 h-4" />
                              <span>{cast.replies}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-green-600">
                              <Repeat2 className="w-4 h-4" />
                              <span>{cast.recasts}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-red-600">
                              <Heart className="w-4 h-4" />
                              <span>{cast.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-600">
                              <Share className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {config.showSocialGraph && (
            <TabsContent value="social" className="p-4 space-y-4">
              <Tabs defaultValue="followers">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="followers">Followers ({socialGraph.followers.length})</TabsTrigger>
                  <TabsTrigger value="following">Following ({socialGraph.following.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="followers" className="space-y-3 max-h-60 overflow-y-auto">
                  {socialGraph.followers.map((user) => (
                    <div key={user.fid} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <div className="w-full h-full bg-blue-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-slate-800">{user.displayName}</h4>
                          <p className="text-sm text-slate-600">@{user.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-600">
                        Follow
                      </Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="following" className="space-y-3 max-h-60 overflow-y-auto">
                  {socialGraph.following.map((user) => (
                    <div key={user.fid} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <div className="w-full h-full bg-blue-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-slate-800">{user.displayName}</h4>
                          <p className="text-sm text-slate-600">@{user.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-300 text-slate-600">
                        Following
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}