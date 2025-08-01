"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useAccount, useBalance, useReadContract, useWriteContract, useConnect, useDisconnect } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatEther, parseEther } from 'viem';
import { ShowCoinBalance } from '~/components/show-coin-balance';
import { NFTMintFlow } from '~/components/nft-mint-flow';
import { DaimoPayTransferButton } from '~/components/daimo-pay-transfer-button';
import { 
  Coins, 
  Zap, 
  TrendingUp, 
  Activity, 
  Wallet,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Transaction {
  hash: string;
  type: 'sent' | 'received' | 'contract';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
}

interface BaseBlockchainModuleProps {
  config?: {
    showWallet?: boolean;
    showTransactions?: boolean;
    showNFTs?: boolean;
    showGasTracker?: boolean;
    transactionLimit?: number;
  };
  onConfigChange?: (config: any) => void;
}

export default function BaseBlockchainModule({ 
  config = {
    showWallet: true,
    showTransactions: true,
    showNFTs: false,
    showGasTracker: true,
    transactionLimit: 5
  },
  onConfigChange 
}: BaseBlockchainModuleProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: balance } = useBalance({ address, chainId: base.id });
  const { connect, connectors, error: connectError, isError: isConnectError } = useConnect();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState('wallet');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [gasPrice, setGasPrice] = useState('0.0012');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  // Mock transaction data - moved outside useEffect to avoid dependency warning
  const mockTransactions = React.useMemo<Transaction[]>(() => [
    {
      hash: '0x1a2b3c4d5e6f',
      type: 'sent',
      amount: '0.05',
      token: 'ETH',
      to: '0x7890...abcd',
      timestamp: '2 minutes ago',
      status: 'confirmed',
      gasUsed: '21000'
    },
    {
      hash: '0x2b3c4d5e6f7a',
      type: 'received',
      amount: '1.2',
      token: 'USDC',
      from: '0x1234...5678',
      timestamp: '1 hour ago',
      status: 'confirmed',
      gasUsed: '45000'
    },
    {
      hash: '0x3c4d5e6f7a8b',
      type: 'contract',
      amount: '0',
      token: 'ETH',
      to: '0xabcd...ef01',
      timestamp: '3 hours ago',
      status: 'confirmed',
      gasUsed: '150000'
    }
  ], []);

  useEffect(() => {
    setRecentTransactions(mockTransactions.slice(0, config.transactionLimit));
  }, [config.transactionLimit, mockTransactions]);

  const handleConnect = async () => {
    setConnectionAttempted(true);
    try {
      const availableConnector = connectors.find(connector => connector.id === 'io.metamask') 
        || connectors.find(connector => connector.id === 'walletConnect') 
        || connectors[0];
      
      if (availableConnector) {
        await connect({ connector: availableConnector });
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleConfigUpdate = (updates: any) => {
    const newConfig = { ...config, ...updates };
    onConfigChange?.(newConfig);
  };

  const getTransactionIcon = (tx: Transaction) => {
    switch (tx.type) {
      case 'sent':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'received':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'contract':
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  if (isConfiguring) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Coins className="w-5 h-5 mr-2 text-blue-600" />
              Base Blockchain - Configuration
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
              <label className="text-sm font-medium">Show Wallet</label>
              <input
                type="checkbox"
                checked={config.showWallet}
                onChange={(e) => handleConfigUpdate({ showWallet: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Transactions</label>
              <input
                type="checkbox"
                checked={config.showTransactions}
                onChange={(e) => handleConfigUpdate({ showTransactions: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show NFTs</label>
              <input
                type="checkbox"
                checked={config.showNFTs}
                onChange={(e) => handleConfigUpdate({ showNFTs: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Gas Tracker</label>
              <input
                type="checkbox"
                checked={config.showGasTracker}
                onChange={(e) => handleConfigUpdate({ showGasTracker: e.target.checked })}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Transaction Limit</label>
              <Input
                type="number"
                value={config.transactionLimit}
                onChange={(e) => handleConfigUpdate({ transactionLimit: parseInt(e.target.value) })}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500"
                min="1"
                max="20"
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
            <Coins className="w-5 h-5 mr-2 text-blue-600" />
            Base Blockchain
          </CardTitle>
          <div className="flex items-center space-x-2">
            {config.showGasTracker && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Gas: {gasPrice} gwei
              </Badge>
            )}
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
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full rounded-none border-b">
            {config.showWallet && (
              <TabsTrigger value="wallet" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </TabsTrigger>
            )}
            {config.showTransactions && (
              <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Activity className="w-4 h-4 mr-2" />
                Transactions
              </TabsTrigger>
            )}
            {config.showNFTs && (
              <TabsTrigger value="nfts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                NFTs
              </TabsTrigger>
            )}
          </TabsList>

          {config.showWallet && (
            <TabsContent value="wallet" className="p-4 space-y-4">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Wallet Address</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Connected
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => disconnect()}
                          className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                    <p className="font-mono text-sm text-slate-800 mb-4">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-slate-600 mb-1">ETH Balance</p>
                        <p className="font-semibold text-lg text-slate-800">
                          {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'} ETH
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-slate-600 mb-1">USD Value</p>
                        <p className="font-semibold text-lg text-slate-800">
                          ${balance ? (parseFloat(formatEther(balance.value)) * 2000).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ShowCoinBalance defaultAddress={address} />

                  <div className="flex space-x-2">
                    <DaimoPayTransferButton
                      text="Send Payment"
                      toAddress="0x1234567890123456789012345678901234567890"
                      amount="0.01"
                    />
                    <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Connect your wallet to view balance and make transactions
                  </p>
                  
                  {isConnectError && connectError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-red-600">
                          {connectError.message.includes('rejected') 
                            ? 'Connection rejected by user' 
                            : connectError.message.includes('not found')
                            ? 'No wallet found. Please install MetaMask or another wallet.'
                            : 'Connection failed. Please try again.'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleConnect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Wallet
                        </>
                      )}
                    </Button>
                    
                    {connectionAttempted && !isConnected && !isConnecting && (
                      <div className="text-sm text-slate-500">
                        <p>Available connectors:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {connectors.map((connector) => (
                            <Button
                              key={connector.id}
                              size="sm"
                              variant="outline"
                              onClick={() => connect({ connector })}
                              className="text-xs"
                              disabled={isConnecting}
                            >
                              {connector.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-400">
                      Supports MetaMask, WalletConnect, and Farcaster Mini App
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          )}

          {config.showTransactions && (
            <TabsContent value="transactions" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-800">Recent Transactions</h3>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {recentTransactions.length} transactions
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentTransactions.map((tx) => (
                  <Card key={tx.hash} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(tx)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-800 capitalize">{tx.type}</span>
                              {getStatusIcon(tx.status)}
                            </div>
                            <p className="text-xs text-slate-500 font-mono">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">
                            {tx.amount !== '0' && (
                              <span className={tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}>
                                {tx.type === 'sent' ? '-' : '+'}
                              </span>
                            )}
                            {tx.amount !== '0' ? `${tx.amount} ${tx.token}` : 'Contract Call'}
                          </p>
                          <p className="text-xs text-slate-500">{tx.timestamp}</p>
                        </div>
                      </div>
                      {tx.gasUsed && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-500">
                            Gas used: {tx.gasUsed} ({(parseInt(tx.gasUsed) * 0.000000001).toFixed(6)} ETH)
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                View All Transactions
              </Button>
            </TabsContent>
          )}

          {config.showNFTs && (
            <TabsContent value="nfts" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-800">NFT Collection</h3>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Mint NFT
                </Button>
              </div>

              <NFTMintFlow 
                contractAddress="0x1234567890123456789012345678901234567890"
                tokenId="1"
                chainId={8453}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-100 rounded-lg p-4 text-center">
                  <div className="w-full h-24 bg-slate-200 rounded mb-2"></div>
                  <p className="text-sm font-medium">NFT #001</p>
                  <p className="text-xs text-slate-600">EchoBuild Collection</p>
                </div>
                <div className="bg-slate-100 rounded-lg p-4 text-center">
                  <div className="w-full h-24 bg-slate-200 rounded mb-2"></div>
                  <p className="text-sm font-medium">NFT #002</p>
                  <p className="text-xs text-slate-600">EchoBuild Collection</p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}