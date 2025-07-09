'use client';

import React, { useEffect, useState } from 'react';
import { tradingAPI, CandleData, TickerData, OrderBook } from '../services/tradingAPI';

interface TradingViewProps {
  symbol?: string;
  height?: number;
  width?: number;
}

// CandleData interface is now imported from tradingAPI

type TimeInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

const TradingView: React.FC<TradingViewProps> = ({ 
  symbol = 'BTCUSDT', 
  height = 400, 
  width = 800 
}) => {
  const [currentPrice, setCurrentPrice] = useState<number>(43250.50);
  const [priceChange, setPriceChange] = useState<number>(125.30);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0.29);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1m');
  const [intervalLoading, setIntervalLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [crosshairData, setCrosshairData] = useState<{ price: number; time: string; candle?: CandleData } | null>(null);

  // Initialize real API data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        // Load historical data with selected interval
        const historicalData = await tradingAPI.getHistoricalData(symbol, selectedInterval, 50);
        setChartData(historicalData);
        
        // Load ticker data
        const ticker = await tradingAPI.getTickerData(symbol);
        setTickerData(ticker);
        setCurrentPrice(ticker.price);
        setPriceChange(ticker.change);
        setPriceChangePercent(ticker.changePercent);
        
        // Load order book
        const orderBookData = await tradingAPI.getOrderBook(symbol);
        setOrderBook(orderBookData);
        
        setIsLoading(false);
        setIsConnected(true);
        
      } catch (error) {
        console.error('Error initializing trading data:', error);
        setIsLoading(false);
        setIsConnected(false);
      }
    };
    
    initializeData();
  }, [symbol, selectedInterval]);

  // Real-time WebSocket updates
  useEffect(() => {
    const unsubscribe = tradingAPI.subscribeToRealTimeData(
      symbol.toLowerCase(),
      (message) => {
        if (message.type === 'ticker') {
          const ticker: TickerData = message.data;
          setTickerData(ticker);
          setCurrentPrice(ticker.price);
          setPriceChange(ticker.change);
          setPriceChangePercent(ticker.changePercent);
        } else if (message.type === 'kline') {
          const candle: CandleData = message.data;
          setChartData(prev => {
            const updated = [...prev.slice(-49), candle];
            return updated;
          });
        }
      },
      ['ticker', `kline_${selectedInterval}`]
    );
    
    return () => {
      unsubscribe();
    };
  }, [symbol, selectedInterval]);

  // Handle interval change
  const handleIntervalChange = async (newInterval: TimeInterval) => {
    if (newInterval === selectedInterval) return;
    
    setIntervalLoading(true);
    setSelectedInterval(newInterval);
    
    try {
      // Load new historical data for the selected interval
      const historicalData = await tradingAPI.getHistoricalData(symbol, newInterval, 50);
      setChartData(historicalData);
    } catch (error) {
      console.error('Error loading data for new interval:', error);
    } finally {
      setIntervalLoading(false);
    }
  };

  // Calculate chart dimensions and scaling
  const chartWidth = width || 800;
  const chartHeight = height - 60; // Leave space for controls
  const paddingX = 30;
  const paddingY = 20;
  const rightPadding = 100; // Extra space for price labels
  const candleWidth = Math.max(2, (chartWidth - paddingX - rightPadding) / chartData.length - 2);
  
  // Find min/max for scaling
  const allPrices = chartData.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...allPrices) * 0.999;
  const maxPrice = Math.max(...allPrices) * 1.001;
  const priceRange = maxPrice - minPrice;
  
  // Scale price to Y coordinate
  const scaleY = (price: number) => {
    return paddingY + ((maxPrice - price) / priceRange) * (chartHeight - paddingY * 2);
  };

  const isPositive = priceChange >= 0;

  // Mouse event handlers
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale mouse position to SVG coordinates
    const scaleX = chartWidth / rect.width;
    const scaleY = chartHeight / rect.height;
    const svgX = x * scaleX;
    const svgY = y * scaleY;
    
    setMousePosition({ x: svgX, y: svgY });
    
    // Calculate price at mouse position
    const price = maxPrice - ((svgY - paddingY) / (chartHeight - paddingY * 2)) * priceRange;
    
    // Find closest candle
    const candleIndex = Math.round((svgX - paddingX) / (candleWidth + 2));
    const candle = chartData[candleIndex];
    
    if (candle && candleIndex >= 0 && candleIndex < chartData.length) {
      const timeLabel = new Date(candle.time).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      setCrosshairData({
        price: Math.max(minPrice, Math.min(maxPrice, price)),
        time: timeLabel,
        candle: candle
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setCrosshairData(null);
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4">
      {/* Price Display */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white">{symbol}</h2>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-mono text-white">
              ${currentPrice.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span className="text-lg">
                {isPositive ? '↗' : '↘'}
              </span>
              <span className="font-mono">
                {isPositive ? '+' : ''}{priceChange.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
              <span className="font-mono">
                ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <div>{isConnected ? 'Live' : 'Disconnected'}</div>
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Custom Chart */}
      <div 
        className="w-full rounded border border-gray-700 bg-gray-800 relative"
        style={{ height: `${height}px` }}
      >
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full cursor-crosshair"
          style={{ backgroundColor: '#111827' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Price levels */}
          {Array.from({ length: 6 }, (_, i) => {
            const price = minPrice + (priceRange * i / 5);
            const y = scaleY(price);
            return (
              <g key={i}>
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={chartWidth - rightPadding} 
                  y2={y} 
                  stroke="#374151" 
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text 
                  x={chartWidth - rightPadding + 10} 
                  y={y + 4} 
                  fill="#9ca3af" 
                  fontSize="11"
                  fontFamily="monospace"
                >
                  ${price.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </text>
              </g>
            );
          })}
          
          {/* Candlesticks */}
          {chartData.map((candle, index) => {
            const x = paddingX + (index * (candleWidth + 2));
            const isGreen = candle.close > candle.open;
            const bodyTop = scaleY(Math.max(candle.open, candle.close));
            const bodyBottom = scaleY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(1, bodyBottom - bodyTop);
            const wickTop = scaleY(candle.high);
            const wickBottom = scaleY(candle.low);
            
            return (
              <g key={index}>
                {/* Wick */}
                <line 
                  x1={x + candleWidth / 2} 
                  y1={wickTop} 
                  x2={x + candleWidth / 2} 
                  y2={wickBottom} 
                  stroke={isGreen ? '#10b981' : '#ef4444'} 
                  strokeWidth="1"
                />
                
                {/* Body */}
                <rect 
                  x={x} 
                  y={bodyTop} 
                  width={candleWidth} 
                  height={bodyHeight}
                  fill={isGreen ? '#10b981' : '#ef4444'}
                  stroke={isGreen ? '#10b981' : '#ef4444'}
                  strokeWidth="1"
                />
              </g>
            );
          })}
          
          {/* Current price line */}
          <line 
            x1={paddingX} 
            y1={scaleY(currentPrice)} 
            x2={chartWidth - rightPadding} 
            y2={scaleY(currentPrice)} 
            stroke="#fbbf24" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Current price label */}
          <rect 
            x={chartWidth - rightPadding + 5} 
            y={scaleY(currentPrice) - 10} 
            width="90" 
            height="20" 
            fill="#fbbf24" 
            rx="3"
          />
          <text 
            x={chartWidth - rightPadding + 50} 
            y={scaleY(currentPrice) + 4} 
            fill="#000" 
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
          >
            ${currentPrice.toLocaleString('en-US', { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </text>
          
          {/* Time labels */}
          {chartData.length > 0 && Array.from({ length: 5 }, (_, i) => {
            const dataIndex = Math.floor((chartData.length - 1) * i / 4);
            const candle = chartData[dataIndex];
            if (!candle) return null;
            
            const x = paddingX + (dataIndex * (candleWidth + 2));
            const timeLabel = new Date(candle.time).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 5}
                fill="#9ca3af"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {timeLabel}
              </text>
            );
          })}
          
          {/* Crosshair lines */}
          {mousePosition && (
            <g>
              {/* Vertical line */}
              <line
                x1={mousePosition.x}
                y1={paddingY}
                x2={mousePosition.x}
                y2={chartHeight - paddingY}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              
              {/* Horizontal line */}
              <line
                x1={paddingX}
                y1={mousePosition.y}
                x2={chartWidth - rightPadding}
                y2={mousePosition.y}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
            </g>
          )}
          
          {/* Price tooltip */}
          {crosshairData && mousePosition && (
            <g>
              {/* Price label background */}
              <rect
                x={chartWidth - rightPadding + 5}
                y={mousePosition.y - 10}
                width="90"
                height="20"
                fill="#374151"
                stroke="#6b7280"
                strokeWidth="1"
                rx="3"
              />
              
              {/* Price label text */}
              <text
                x={chartWidth - rightPadding + 50}
                y={mousePosition.y + 4}
                fill="#ffffff"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ${crosshairData.price.toLocaleString('en-US', { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                })}
              </text>
            </g>
          )}
        </svg>
        
        {/* Floating tooltip */}
        {crosshairData && mousePosition && (
          <div
            className="absolute bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-white shadow-lg z-10"
            style={{
              left: Math.min(mousePosition.x / (chartWidth / 100), 70) + '%',
              top: Math.max(20, mousePosition.y - 100) + 'px',
              minWidth: '200px'
            }}
          >
            <div className="font-semibold mb-2">{crosshairData.time}</div>
            {crosshairData.candle && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Open:</span>
                  <span className="font-mono">${crosshairData.candle.open.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>High:</span>
                  <span className="font-mono text-green-400">${crosshairData.candle.high.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low:</span>
                  <span className="font-mono text-red-400">${crosshairData.candle.low.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Close:</span>
                  <span className="font-mono">${crosshairData.candle.close.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span className="font-mono text-gray-400">{crosshairData.candle.volume?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded">
            <div className="text-white">Loading chart...</div>
          </div>
        )}
      </div>

      {/* Chart Controls */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex space-x-2">
          {(['1m', '5m', '15m', '1h', '4h', '1d'] as TimeInterval[]).map((interval) => (
            <button
              key={interval}
              onClick={() => handleIntervalChange(interval)}
              disabled={intervalLoading}
              className={`px-3 py-1 rounded transition-colors ${
                selectedInterval === interval
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              } ${intervalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {interval}
            </button>
          ))}
          {intervalLoading && (
            <div className="flex items-center space-x-1 text-yellow-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <span className="text-green-500">● Up</span>
            <span className="text-red-500">● Down</span>
          </div>
          <div className="text-xs">
            {chartData.length} candles • {selectedInterval} interval
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingView;