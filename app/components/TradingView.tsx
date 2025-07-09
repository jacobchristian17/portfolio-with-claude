/**
 * TradingView Component
 * Interactive candlestick chart with real-time data for cryptocurrency trading
 * Features crosshair, price tooltips, and multiple timeframes
 * @fileoverview TradingView component with SVG-based candlestick chart
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { tradingAPI, CandleData, TickerData, OrderBook } from '../services/tradingAPI';

/**
 * Props for TradingView component
 * @interface TradingViewProps
 */
interface TradingViewProps {
  /** Trading pair symbol (e.g., "BTCUSDT") */
  symbol?: string;
  /** Chart height in pixels */
  height?: number;
  /** Chart width in pixels */
  width?: number;
}

/**
 * Supported time intervals for candlestick data
 * @typedef {('1m'|'5m'|'15m'|'1h'|'4h'|'1d')} TimeInterval
 */
type TimeInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

/**
 * TradingView Component
 * Interactive candlestick chart with real-time cryptocurrency data
 * @component
 * @param {TradingViewProps} props - Component props
 * @returns {React.FC} Interactive trading chart component
 * @example
 * <TradingView symbol="BTCUSDT" height={600} width={800} />
 */
const TradingView: React.FC<TradingViewProps> = ({ 
  symbol = 'BTCUSDT', 
  height = 400, 
  width = 800 
}) => {
  // State management
  /** Current price of the trading pair */
  const [currentPrice, setCurrentPrice] = useState<number>(43250.50);
  /** 24-hour price change in absolute value */
  const [priceChange, setPriceChange] = useState<number>(125.30);
  /** 24-hour price change as percentage */
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0.29);
  /** Array of candlestick data for chart rendering */
  const [chartData, setChartData] = useState<CandleData[]>([]);
  /** 24-hour ticker statistics */
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  /** Order book data */
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  /** WebSocket connection status */
  const [isConnected, setIsConnected] = useState(false);
  /** Loading state for initial data fetch */
  const [isLoading, setIsLoading] = useState(true);
  /** Currently selected time interval */
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1m');
  /** Loading state for interval changes */
  const [intervalLoading, setIntervalLoading] = useState(false);
  /** Mouse position for crosshair rendering */
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  /** Crosshair data for price and time display */
  const [crosshairData, setCrosshairData] = useState<{ price: number; time: string; candle?: CandleData } | null>(null);
  /** Zoom level for chart display */
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  /** Pan offset for zoomed chart */
  const [panOffset, setPanOffset] = useState<number>(0);
  /** Touch interaction state for mobile */
  const [touchState, setTouchState] = useState<{
    lastTouchDistance?: number;
    lastTouchCenter?: { x: number; y: number };
    isPanning?: boolean;
  }>({});
  
  /** Reference to the chart container */
  const chartContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize component with real API data
   * Fetches historical data, ticker data, and order book
   * Runs on component mount and when symbol or interval changes
   * @effect
   */
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

  /**
   * Subscribe to real-time WebSocket updates
   * Handles ticker and candlestick data updates
   * Resubscribes when symbol or interval changes
   * @effect
   */
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

  /**
   * Prevent page scrolling when interacting with chart
   * @effect
   */
  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners directly to the chart container
    chartContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    chartContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      chartContainer.removeEventListener('touchmove', handleTouchMove);
      chartContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  /**
   * Handle time interval change
   * Loads new historical data for the selected interval
   * @param {TimeInterval} newInterval - New time interval to switch to
   * @returns {Promise<void>}
   * @async
   */
  const handleIntervalChange = async (newInterval: TimeInterval) => {
    if (newInterval === selectedInterval) return;
    
    setIntervalLoading(true);
    setSelectedInterval(newInterval);
    
    // Reset zoom and pan when changing intervals
    setZoomLevel(1);
    setPanOffset(0);
    
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

  // Chart dimensions and scaling calculations
  /** Chart width in pixels */
  const chartWidth = width || 800;
  /** Chart height in pixels (minus controls space) */
  const chartHeight = height - 60;
  /** Left padding for Y-axis labels */
  const paddingX = 30;
  /** Top and bottom padding */
  const paddingY = 20;
  /** Right padding for price labels */
  const rightPadding = 100;
  /** Available width for chart content */
  const availableWidth = chartWidth - paddingX - rightPadding;
  /** Zoomed width of chart content */
  const zoomedWidth = availableWidth * zoomLevel;
  /** Width of individual candlestick with zoom */
  const candleWidth = Math.max(2, zoomedWidth / chartData.length - 2);
  /** Maximum pan offset to prevent over-panning */
  const maxPanOffset = Math.max(0, zoomedWidth - availableWidth);
  /** Constrained pan offset */
  const constrainedPanOffset = Math.max(0, Math.min(panOffset, maxPanOffset));
  
  // Price scaling for Y-axis
  /** All price values for min/max calculation */
  const allPrices = chartData.flatMap(d => [d.high, d.low]);
  /** Minimum price with small buffer */
  const minPrice = Math.min(...allPrices) * 0.999;
  /** Maximum price with small buffer */
  const maxPrice = Math.max(...allPrices) * 1.001;
  /** Price range for scaling */
  const priceRange = maxPrice - minPrice;
  
  /**
   * Convert price value to Y coordinate
   * @param {number} price - Price value to convert
   * @returns {number} Y coordinate in SVG space
   */
  const scaleY = (price: number) => {
    return paddingY + ((maxPrice - price) / priceRange) * (chartHeight - paddingY * 2);
  };

  /** Whether price change is positive */
  const isPositive = priceChange >= 0;

  /**
   * Handle mouse movement over the chart
   * Updates crosshair position and tooltip data
   * @param {React.MouseEvent<SVGSVGElement>} event - Mouse event
   */
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
    
    // Find closest candle accounting for zoom and pan
    const adjustedX = svgX - paddingX + constrainedPanOffset;
    const candleIndex = Math.round(adjustedX / (candleWidth + 2));
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

  /**
   * Handle mouse leave event
   * Clears crosshair and tooltip data
   */
  const handleMouseLeave = () => {
    setMousePosition(null);
    setCrosshairData(null);
  };

  /**
   * Handle mouse wheel event for zooming
   * @param {React.WheelEvent<SVGSVGElement>} event - Wheel event
   */
  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(5, zoomLevel * zoomFactor));
    
    // Calculate pan adjustment to zoom towards mouse position
    const mouseRatio = mouseX / rect.width;
    const panAdjustment = (zoomLevel - newZoom) * availableWidth * mouseRatio;
    
    setZoomLevel(newZoom);
    setPanOffset(prev => Math.max(0, Math.min(prev + panAdjustment, (availableWidth * newZoom) - availableWidth)));
  };

  /**
   * Handle touch start event for mobile gestures
   * @param {React.TouchEvent<SVGSVGElement>} event - Touch event
   */
  const handleTouchStart = (event: React.TouchEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.touches.length === 1) {
      // Single touch - prepare for panning
      setTouchState({
        isPanning: true,
        lastTouchCenter: {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }
      });
    } else if (event.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      setTouchState({
        lastTouchDistance: distance,
        lastTouchCenter: {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        }
      });
    }
  };

  /**
   * Handle touch move event for mobile gestures
   * @param {React.TouchEvent<SVGSVGElement>} event - Touch event
   */
  const handleTouchMove = (event: React.TouchEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.touches.length === 1 && touchState.isPanning && touchState.lastTouchCenter) {
      // Single touch panning
      const currentTouch = event.touches[0];
      const deltaX = currentTouch.clientX - touchState.lastTouchCenter.x;
      const scaleFactor = availableWidth / chartWidth;
      const panDelta = deltaX * scaleFactor * zoomLevel;
      
      setPanOffset(prev => Math.max(0, Math.min(prev - panDelta, maxPanOffset)));
      
      setTouchState({
        ...touchState,
        lastTouchCenter: {
          x: currentTouch.clientX,
          y: currentTouch.clientY
        }
      });
    } else if (event.touches.length === 2 && touchState.lastTouchDistance) {
      // Two touch pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const zoomFactor = currentDistance / touchState.lastTouchDistance;
      const newZoom = Math.max(0.5, Math.min(5, zoomLevel * zoomFactor));
      
      setZoomLevel(newZoom);
      
      setTouchState({
        ...touchState,
        lastTouchDistance: currentDistance
      });
    }
  };

  /**
   * Handle touch end event for mobile gestures
   * @param {React.TouchEvent<SVGSVGElement>} event - Touch event
   */
  const handleTouchEnd = (event: React.TouchEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setTouchState({});
  };

  return (
    <div 
      className="w-full bg-gray-900 rounded-lg p-4"
      onWheel={(e) => {
        // Prevent page scroll when interacting with chart
        const target = e.target as HTMLElement;
        if (target.closest('svg')) {
          e.preventDefault();
        }
      }}
    >
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
        className="w-full rounded border border-gray-700 bg-gray-800 relative trading-chart"
        style={{ 
          height: `${height}px`,
          overflow: 'hidden',
          touchAction: 'none'
        }}
      >
        <svg 
          width="100%" 
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full cursor-crosshair"
          style={{ backgroundColor: '#111827', touchAction: 'none' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
          
          {/* Clipping path for zoomed content */}
          <defs>
            <clipPath id="chartClip">
              <rect 
                x={paddingX} 
                y={paddingY} 
                width={availableWidth} 
                height={chartHeight - paddingY * 2} 
              />
            </clipPath>
          </defs>
          
          {/* Candlesticks with zoom and pan */}
          <g clipPath="url(#chartClip)">
            {chartData.map((candle, index) => {
              const x = paddingX + (index * (candleWidth + 2)) - constrainedPanOffset;
              
              // Skip rendering if candle is outside visible area
              if (x + candleWidth < paddingX || x > paddingX + availableWidth) {
                return null;
              }
              
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
          </g>
          
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
          
          {/* Time labels with zoom support */}
          <g clipPath="url(#chartClip)">
            {chartData.length > 0 && Array.from({ length: Math.min(10, chartData.length) }, (_, i) => {
              const visibleStart = Math.floor(constrainedPanOffset / (candleWidth + 2));
              const visibleEnd = Math.floor((constrainedPanOffset + availableWidth) / (candleWidth + 2));
              const visibleCount = visibleEnd - visibleStart;
              
              if (visibleCount <= 0) return null;
              
              const dataIndex = visibleStart + Math.floor(visibleCount * i / 9);
              const candle = chartData[dataIndex];
              if (!candle) return null;
              
              const x = paddingX + (dataIndex * (candleWidth + 2)) - constrainedPanOffset;
              
              // Skip if outside visible area
              if (x < paddingX || x > paddingX + availableWidth) return null;
              
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
          </g>
          
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev * 0.8))}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              disabled={zoomLevel <= 0.5}
            >
              −
            </button>
            <span className="text-xs">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(5, prev * 1.25))}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              disabled={zoomLevel >= 5}
            >
              +
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset(0);
              }}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Reset
            </button>
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