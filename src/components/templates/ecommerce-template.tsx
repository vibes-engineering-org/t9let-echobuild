"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Search, 
  Filter, 
  Plus, 
  Minus,
  CreditCard,
  Truck,
  ArrowRight,
  X,
  Check,
  Wallet,
  Tag
} from 'lucide-react';

interface EcommerceTemplateProps {
  config?: {
    showCart?: boolean;
    showFilters?: boolean;
    showRatings?: boolean;
    theme?: 'light' | 'dark';
    paymentMethod?: 'crypto' | 'traditional' | 'both';
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  inStock: boolean;
  tags: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium NFT Collection',
    price: 0.5,
    image: '',
    rating: 4.8,
    reviews: 124,
    description: 'Exclusive digital art collection with unique traits',
    category: 'NFTs',
    inStock: true,
    tags: ['digital', 'art', 'exclusive']
  },
  {
    id: '2',
    name: 'DeFi Strategy Guide',
    price: 0.1,
    image: '',
    rating: 4.9,
    reviews: 89,
    description: 'Complete guide to DeFi yield farming strategies',
    category: 'Education',
    inStock: true,
    tags: ['defi', 'guide', 'strategy']
  },
  {
    id: '3',
    name: 'Web3 Starter Kit',
    price: 0.3,
    image: '',
    rating: 4.7,
    reviews: 156,
    description: 'Everything you need to start building on Web3',
    category: 'Tools',
    inStock: true,
    tags: ['web3', 'development', 'starter']
  },
  {
    id: '4',
    name: 'DAO Governance Token',
    price: 0.05,
    image: '',
    rating: 4.6,
    reviews: 203,
    description: 'Voting rights in our community DAO',
    category: 'Tokens',
    inStock: false,
    tags: ['dao', 'governance', 'community']
  }
];

const categories = ['All', 'NFTs', 'Education', 'Tools', 'Tokens'];
const priceRanges = ['All', '0-0.1 ETH', '0.1-0.5 ETH', '0.5+ ETH'];

export default function EcommerceTemplate({ config = {} }: EcommerceTemplateProps) {
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [favorites, setFavorites] = useState<string[]>([]);

  const {
    showCart = true,
    showFilters = true,
    showRatings = true,
    theme = 'light',
    paymentMethod = 'crypto'
  } = config;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = selectedPriceRange === 'All' || 
                        (selectedPriceRange === '0-0.1 ETH' && product.price <= 0.1) ||
                        (selectedPriceRange === '0.1-0.5 ETH' && product.price > 0.1 && product.price <= 0.5) ||
                        (selectedPriceRange === '0.5+ ETH' && product.price > 0.5);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setCheckoutStep('checkout');
  };

  const completeCheckout = () => {
    setCheckoutStep('success');
    setCart([]);
    setTimeout(() => {
      setCheckoutStep('cart');
      setIsCartOpen(false);
    }, 3000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
      !product.inStock ? 'opacity-60' : ''
    }`}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
          >
            <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </Button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="secondary" className="bg-red-500 text-white">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
            <div className="text-right">
              <div className="font-bold text-lg text-blue-600">{product.price} ETH</div>
              <div className="text-xs text-gray-500">${(product.price * 2000).toFixed(0)}</div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>

          {showRatings && (
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex items-center">
                {renderStars(Math.floor(product.rating))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          )}

          <div className="flex items-center space-x-1 mb-3">
            {product.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>

          <Button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Web3 Marketplace</h1>
            {showCart && (
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-96">
                  <SheetHeader>
                    <SheetTitle>
                      {checkoutStep === 'cart' && 'Shopping Cart'}
                      {checkoutStep === 'checkout' && 'Checkout'}
                      {checkoutStep === 'success' && 'Order Complete'}
                    </SheetTitle>
                  </SheetHeader>

                  {checkoutStep === 'cart' && (
                    <div className="mt-6">
                      {cart.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Your cart is empty</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                  <Tag className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{item.name}</h4>
                                  <p className="text-sm text-gray-500">{item.price} ETH each</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-6 h-6 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-6 h-6 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-6 h-6 p-0 text-red-500 hover:bg-red-50"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <div className="border-t pt-4 space-y-3">
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>{getTotalPrice().toFixed(3)} ETH</span>
                            </div>
                            <Button
                              onClick={handleCheckout}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Proceed to Checkout
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {checkoutStep === 'checkout' && (
                    <div className="mt-6 space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Payment Method</h3>
                        <div className="space-y-2">
                          {(paymentMethod === 'crypto' || paymentMethod === 'both') && (
                            <Button variant="outline" className="w-full justify-start">
                              <Wallet className="w-4 h-4 mr-2" />
                              Pay with Wallet (MetaMask)
                            </Button>
                          )}
                          {(paymentMethod === 'traditional' || paymentMethod === 'both') && (
                            <Button variant="outline" className="w-full justify-start">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Credit Card
                            </Button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{getTotalPrice().toFixed(3)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gas Fee:</span>
                            <span>0.001 ETH</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total:</span>
                            <span>{(getTotalPrice() + 0.001).toFixed(3)} ETH</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={completeCheckout}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Complete Purchase
                      </Button>
                    </div>
                  )}

                  {checkoutStep === 'success' && (
                    <div className="mt-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Order Complete!</h3>
                      <p className="text-gray-600 mb-4">
                        Your digital items will be delivered to your wallet shortly.
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Truck className="w-4 h-4" />
                        <span>Processing delivery...</span>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {showFilters && (
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
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {priceRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredProducts.length} products
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}