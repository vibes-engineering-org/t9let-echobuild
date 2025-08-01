"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Clock,
  Shield,
  Key
} from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useReconnect } from 'wagmi';

interface WalletConnectionHandlerProps {
  onConnectionChange?: (connected: boolean, address?: string) => void;
  showBalance?: boolean;
  showNetwork?: boolean;
  theme?: 'light' | 'dark';
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
type ErrorType = 'user_rejected' | 'network_error' | 'timeout' | 'unsupported_chain' | 'unknown';

export default function WalletConnectionHandler({ 
  onConnectionChange,
  showBalance = true,
  showNetwork = true,
  theme = 'light'
}: WalletConnectionHandlerProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<{ type: ErrorType; message: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();

  // Update connection state based on wagmi status
  useEffect(() => {
    if (isConnecting || isPending) {
      setConnectionState('connecting');
    } else if (isReconnecting) {
      setConnectionState('reconnecting');
    } else if (isConnected && address) {
      setConnectionState('connected');
      setError(null);
      setRetryCount(0);
      onConnectionChange?.(true, address);
      
      // Start session timeout (30 minutes)
      if (sessionTimeout) clearTimeout(sessionTimeout);
      const timeout = setTimeout(() => {
        handleSessionTimeout();
      }, 30 * 60 * 1000);
      setSessionTimeout(timeout);
    } else {
      setConnectionState('disconnected');
      onConnectionChange?.(false);
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }
    }

    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [isConnected, isConnecting, isReconnecting, isPending, address, onConnectionChange]);

  const handleSessionTimeout = () => {
    setError({
      type: 'timeout',
      message: 'Session expired. Please reconnect your wallet for security.'
    });
    disconnect();
  };

  const handleConnect = async (connectorId?: string) => {
    try {
      setError(null);
      setConnectionState('connecting');
      
      const connector = connectorId 
        ? connectors.find(c => c.id === connectorId) 
        : connectors[0];
      
      if (!connector) {
        throw new Error('No wallet connector available');
      }

      await connect({ connector });
    } catch (err: any) {
      console.error('Connection error:', err);
      
      let errorType: ErrorType = 'unknown';
      let errorMessage = 'Failed to connect wallet';

      if (err.message?.includes('User rejected')) {
        errorType = 'user_rejected';
        errorMessage = 'Connection cancelled by user';
      } else if (err.message?.includes('network')) {
        errorType = 'network_error';
        errorMessage = 'Network connection failed';
      } else if (err.message?.includes('chain')) {
        errorType = 'unsupported_chain';
        errorMessage = 'Unsupported network. Please switch to a supported chain.';
      } else if (err.message?.includes('timeout')) {
        errorType = 'timeout';
        errorMessage = 'Connection timeout. Please try again.';
      }

      setError({ type: errorType, message: errorMessage });
      setConnectionState('error');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    
    if (retryCount < 2) {
      // Try reconnecting first
      reconnect();
    } else {
      // Fallback to fresh connection
      handleConnect();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setError(null);
    setRetryCount(0);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  const getConnectionStatusBadge = () => {
    switch (connectionState) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'connecting':
      case 'reconnecting':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            {connectionState === 'reconnecting' ? 'Reconnecting' : 'Connecting'}
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            <WifiOff className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Wallet className="w-5 h-5 mr-2 text-blue-600" />
            Wallet Connection
          </CardTitle>
          {getConnectionStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-medium mb-1">Connection Failed</div>
              <div className="text-sm">{error.message}</div>
              {error.type === 'unsupported_chain' && (
                <div className="text-xs mt-2 text-red-600">
                  Supported networks: Base, Arbitrum, Optimism, Celo, Ethereum
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Connection State Display */}
        {connectionState === 'connected' && address ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <div className="font-medium text-green-800">Wallet Connected</div>
                <div className="text-sm text-green-600 font-mono">{formatAddress(address)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-green-600" />
                <Shield className="w-4 h-4 text-green-600" />
              </div>
            </div>

            {showNetwork && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Network:</span>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Base Mainnet
                </Badge>
              </div>
            )}

            {showBalance && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Balance:</span>
                <span className="font-mono">0.1234 ETH</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Session expires in 30min</span>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Available Connectors */}
            <div className="space-y-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={connectionState === 'connecting' || connectionState === 'reconnecting'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <div className="flex items-center space-x-3">
                    {connector.id === 'farcasterMiniApp' ? (
                      <div className="w-5 h-5 bg-purple-500 rounded"></div>
                    ) : connector.id === 'injected' ? (
                      <div className="w-5 h-5 bg-orange-500 rounded"></div>
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                    <div className="text-left">
                      <div className="font-medium">{connector.name}</div>
                      <div className="text-xs text-gray-500">
                        {connector.id === 'farcasterMiniApp' && 'Farcaster Mini App Connector'}
                        {connector.id === 'injected' && 'Browser Wallet'}
                      </div>
                    </div>
                  </div>
                  {(connectionState === 'connecting' || connectionState === 'reconnecting') && (
                    <RefreshCw className="w-4 h-4 ml-auto animate-spin" />
                  )}
                </Button>
              ))}
            </div>

            {/* Retry Button */}
            {error && (
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full"
                disabled={connectionState === 'connecting' || connectionState === 'reconnecting'}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection {retryCount > 0 && `(${retryCount}/3)`}
              </Button>
            )}

            {/* Connection Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center space-x-2">
                <Key className="w-3 h-3" />
                <span>Wallet required for secure access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>Supports Base, Arbitrum, Optimism, Celo</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}