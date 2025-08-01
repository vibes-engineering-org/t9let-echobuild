"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { 
  Grid3X3, 
  List, 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Clock,
  Filter,
  Heart,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

interface DirectoryTemplateProps {
  config?: {
    showMap?: boolean;
    showRatings?: boolean;
    showReactions?: boolean;
    theme?: 'light' | 'dark';
    defaultView?: 'grid' | 'list';
  };
}

interface DirectoryEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  website: string;
  phone?: string;
  avatar: string;
  rating: number;
  reviews: number;
  verified: boolean;
  hours: string;
  tags: string[];
  reactions: { type: 'like' | 'love' | 'meh'; count: number }[];
  featured: boolean;
}

const mockEntries: DirectoryEntry[] = [
  {
    id: '1',
    name: 'CryptoCafe Base',
    description: 'First Web3-native coffee shop accepting Base tokens',
    category: 'Food & Drink',
    location: 'San Francisco, CA',
    website: 'cryptocafe.base',
    phone: '+1 (555) 123-4567',
    avatar: '',
    rating: 4.8,
    reviews: 124,
    verified: true,
    hours: 'Mon-Fri 7AM-8PM',
    tags: ['coffee', 'web3', 'crypto-friendly'],
    reactions: [
      { type: 'like', count: 45 },
      { type: 'love', count: 23 }
    ],
    featured: true
  },
  {
    id: '2',
    name: 'NFT Gallery Downtown',
    description: 'Curated digital art exhibitions and NFT showcases',
    category: 'Arts & Culture',
    location: 'New York, NY',
    website: 'nftgallery.eth',
    avatar: '',
    rating: 4.6,
    reviews: 89,
    verified: true,
    hours: 'Tue-Sun 10AM-7PM',
    tags: ['nft', 'art', 'gallery'],
    reactions: [
      { type: 'like', count: 67 },
      { type: 'love', count: 34 },
      { type: 'meh', count: 5 }
    ],
    featured: false
  },
  {
    id: '3',
    name: 'DeFi Learning Hub',
    description: 'Educational workshops and DeFi protocol tutorials',
    category: 'Education',
    location: 'Austin, TX',
    website: 'defilearn.base',
    avatar: '',
    rating: 4.9,
    reviews: 156,
    verified: true,
    hours: 'Mon-Sat 9AM-6PM',
    tags: ['defi', 'education', 'workshops'],
    reactions: [
      { type: 'like', count: 89 },
      { type: 'love', count: 45 }
    ],
    featured: true
  },
  {
    id: '4',
    name: 'Base Builder Coworking',
    description: 'Collaborative workspace for Web3 developers and builders',
    category: 'Coworking',
    location: 'Los Angeles, CA',
    website: 'basebuilders.co',
    phone: '+1 (555) 987-6543',
    avatar: '',
    rating: 4.7,
    reviews: 203,
    verified: false,
    hours: '24/7 Access',
    tags: ['coworking', 'developers', 'web3'],
    reactions: [
      { type: 'like', count: 112 },
      { type: 'love', count: 67 }
    ],
    featured: false
  },
  {
    id: '5',
    name: 'Crypto Wellness Spa',
    description: 'Relax and recharge while earning yield on your tokens',
    category: 'Health & Wellness',
    location: 'Miami, FL',
    website: 'cryptowellness.eth',
    avatar: '',
    rating: 4.4,
    reviews: 78,
    verified: true,
    hours: 'Daily 8AM-10PM',
    tags: ['wellness', 'spa', 'yield-farming'],
    reactions: [
      { type: 'like', count: 34 },
      { type: 'love', count: 12 },
      { type: 'meh', count: 8 }
    ],
    featured: false
  }
];

const categories = ['All', 'Food & Drink', 'Arts & Culture', 'Education', 'Coworking', 'Health & Wellness'];

export default function DirectoryTemplate({ config = {} }: DirectoryTemplateProps) {
  const [entries] = useState<DirectoryEntry[]>(mockEntries);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(config.defaultView || 'grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews'>('rating');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'love' | 'meh'>>({});

  const {
    showMap = false,
    showRatings = true,
    showReactions = true,
    theme = 'light'
  } = config;

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

  const toggleFavorite = (entryId: string) => {
    setFavorites(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleReaction = (entryId: string, reactionType: 'like' | 'love' | 'meh') => {
    setUserReactions(prev => {
      const newReactions = { ...prev };
      if (prev[entryId] === reactionType) {
        delete newReactions[entryId];
      } else {
        newReactions[entryId] = reactionType;
      }
      return newReactions;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getReactionIcon = (type: 'like' | 'love' | 'meh') => {
    switch (type) {
      case 'like':
        return <Smile className="w-4 h-4" />;
      case 'love':
        return <Heart className="w-4 h-4" />;
      case 'meh':
        return <Meh className="w-4 h-4" />;
    }
  };

  const GridCard = ({ entry }: { entry: DirectoryEntry }) => (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${entry.featured ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-0">
        {/* Header Image/Avatar */}
        <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar className="w-16 h-16 border-4 border-white shadow-md">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                {entry.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => toggleFavorite(entry.id)}
          >
            <Heart className={`w-4 h-4 ${favorites.includes(entry.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </Button>
          {entry.featured && (
            <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
              Featured
            </Badge>
          )}
          {entry.verified && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-white text-green-600 border-green-600">
                Verified
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg mb-1">{entry.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{entry.description}</p>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{entry.location}</span>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{entry.hours}</span>
          </div>

          {showRatings && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(Math.floor(entry.rating))}
                <span className="text-sm font-medium">{entry.rating}</span>
                <span className="text-xs text-gray-500">({entry.reviews})</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-1 mb-3">
            {entry.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs px-2 py-0 bg-blue-50 text-blue-600">
              {entry.category}
            </Badge>
          </div>

          {showReactions && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {['like', 'love', 'meh'].map((reactionType) => {
                  const reaction = entry.reactions.find(r => r.type === reactionType);
                  const isActive = userReactions[entry.id] === reactionType;
                  return (
                    <Button
                      key={reactionType}
                      size="sm"
                      variant="ghost"
                      className={`h-7 px-2 ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                      onClick={() => handleReaction(entry.id, reactionType as any)}
                    >
                      {getReactionIcon(reactionType as any)}
                      <span className="ml-1 text-xs">{reaction?.count || 0}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              Contact
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              Visit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ListItem = ({ entry }: { entry: DirectoryEntry }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
              {entry.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-lg">{entry.name}</h3>
                  {entry.verified && (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                      Verified
                    </Badge>
                  )}
                  {entry.featured && (
                    <Badge className="bg-blue-500 text-white text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{entry.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{entry.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{entry.hours}</span>
                  </div>
                  {entry.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{entry.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                {showRatings && (
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(Math.floor(entry.rating))}
                    <span className="text-sm font-medium">{entry.rating}</span>
                    <span className="text-xs text-gray-500">({entry.reviews})</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0"
                    onClick={() => toggleFavorite(entry.id)}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(entry.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Globe className="w-3 h-3 mr-1" />
                    Visit
                  </Button>
                </div>
              </div>
            </div>

            {showReactions && (
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
                {['like', 'love', 'meh'].map((reactionType) => {
                  const reaction = entry.reactions.find(r => r.type === reactionType);
                  const isActive = userReactions[entry.id] === reactionType;
                  return (
                    <Button
                      key={reactionType}
                      size="sm"
                      variant="ghost"
                      className={`h-7 px-2 ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                      onClick={() => handleReaction(entry.id, reactionType as any)}
                    >
                      {getReactionIcon(reactionType as any)}
                      <span className="ml-1 text-xs">{reaction?.count || 0}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Web3 Directory</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search directory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="rating">Sort by Rating</option>
                    <option value="name">Sort by Name</option>
                    <option value="reviews">Sort by Reviews</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {filteredEntries.length} entries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No entries found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                  <GridCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {filteredEntries.map((entry) => (
                  <ListItem key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Map Integration Placeholder */}
      {showMap && (
        <div className="fixed bottom-4 right-4">
          <Card className="w-64 h-48">
            <CardContent className="p-4 h-full">
              <div className="h-full bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Map integration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}