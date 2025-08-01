"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { 
  Trophy, 
  Zap, 
  Star, 
  Target, 
  Clock,
  Share2,
  ArrowUp,
  ArrowDown,
  Medal,
  Play,
  Pause
} from 'lucide-react';

interface GameAppTemplateProps {
  config?: {
    showLeaderboard?: boolean;
    showScoreTracker?: boolean;
    showCastButton?: boolean;
    theme?: 'light' | 'dark';
    gameType?: 'clicker' | 'puzzle' | 'trivia';
  };
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
}

const mockPlayers: Player[] = [
  { id: '1', name: 'CryptoKing', avatar: '', score: 2450, rank: 1, trend: 'up' },
  { id: '2', name: 'NFTMaster', avatar: '', score: 2380, rank: 2, trend: 'same' },
  { id: '3', name: 'BlockchainPro', avatar: '', score: 2290, rank: 3, trend: 'down' },
  { id: '4', name: 'DeFiExplorer', avatar: '', score: 2150, rank: 4, trend: 'up' },
  { id: '5', name: 'WebThreeWiz', avatar: '', score: 2050, rank: 5, trend: 'up' },
];

export default function GameAppTemplate({ config = {} }: GameAppTemplateProps) {
  const [score, setScore] = useState(850);
  const [level, setLevel] = useState(5);
  const [progress, setProgress] = useState(65);
  const [isPlaying, setIsPlaying] = useState(false);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const {
    showLeaderboard = true,
    showScoreTracker = true,
    showCastButton = true,
    theme = 'light',
    gameType = 'clicker'
  } = config;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleGameAction = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }
    
    const points = Math.floor(Math.random() * 50) + 10;
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);
    setProgress(prev => Math.min(prev + 2, 100));
    
    if (progress >= 100) {
      setLevel(prev => prev + 1);
      setProgress(0);
    }
  };

  const handleCastScore = () => {
    const message = `Just scored ${score} points at level ${level} in my mini app! Can you beat my score? 🎮`;
    console.log('Cast to Farcaster:', message);
    // In real implementation, this would use the Farcaster SDK
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Game Header */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-yellow-800">
              <Trophy className="w-5 h-5 mr-2" />
              {gameType === 'clicker' ? 'Power Clicker' : 
               gameType === 'puzzle' ? 'Mind Puzzle' : 'Trivia Quest'}
            </CardTitle>
            <Badge className="bg-yellow-500 text-white">
              Level {level}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Score Tracker */}
      {showScoreTracker && (
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">#{mockPlayers.find(p => p.score < score)?.rank || 6}</div>
                <div className="text-xs text-gray-600">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{combo}x</div>
                <div className="text-xs text-gray-600">Combo</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Game Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
              </div>
              <Button
                onClick={handleGameAction}
                className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {isPlaying ? (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Tap to Score!
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-purple-800">
              <Medal className="w-5 h-5 mr-2" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {mockPlayers.slice(0, 5).map((player, index) => (
                <div 
                  key={player.id}
                  className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 ${
                    index === 0 ? 'bg-yellow-50' : 
                    index === 1 ? 'bg-gray-50' : 
                    index === 2 ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {player.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.score.toLocaleString()} pts</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                    {player.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
                    {index < 3 && (
                      <Star className={`w-4 h-4 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        'text-orange-500'
                      }`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cast Button */}
      {showCastButton && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-indigo-800 mb-1">Share Your Score</h4>
                <p className="text-sm text-indigo-600">Cast your achievement to Farcaster</p>
              </div>
              <Button
                onClick={handleCastScore}
                className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Cast Score
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}