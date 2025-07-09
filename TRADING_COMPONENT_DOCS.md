# Trading Component Documentation

## Overview

The Trading Component system consists of two main parts:
1. **TradingAPI** - Service for real-time cryptocurrency data
2. **TradingView** - Interactive SVG-based candlestick chart component

## Architecture

```
├── app/
│   ├── services/
│   │   └── tradingAPI.ts        # API service
│   ├── components/
│   │   ├── TradingView.tsx      # Main chart component
│   │   └── APIStatus.tsx        # Connection status component
│   └── trading/
│       └── page.tsx             # Trading dashboard page
```

## TradingAPI Service

### Purpose
Handles REST API calls and WebSocket connections to cryptocurrency exchanges.

### Supported Exchanges
- **Binance** (default)
- **Coinbase** 
- **Bybit**

### Key Methods

#### `getHistoricalData(symbol, interval, limit)`
```typescript
async getHistoricalData(
  symbol: string = 'BTCUSDT',
  interval: string = '1m',
  limit: number = 100
): Promise<CandleData[]>
```

**Parameters:**
- `symbol`: Trading pair (e.g., "BTCUSDT")
- `interval`: Time interval ("1m", "5m", "15m", "1h", "4h", "1d")
- `limit`: Number of candles (1-1000)

**Returns:** Array of candlestick data

#### `getTickerData(symbol)`
```typescript
async getTickerData(symbol: string = 'BTCUSDT'): Promise<TickerData>
```

**Parameters:**
- `symbol`: Trading pair symbol

**Returns:** 24-hour ticker statistics

#### `getOrderBook(symbol, limit)`
```typescript
async getOrderBook(
  symbol: string = 'BTCUSDT', 
  limit: number = 10
): Promise<OrderBook>
```

**Parameters:**
- `symbol`: Trading pair symbol
- `limit`: Number of price levels (5, 10, 20, 50, 100, 500, 1000)

**Returns:** Order book data with bids and asks

#### `subscribeToRealTimeData(symbol, callback, streams)`
```typescript
subscribeToRealTimeData(
  symbol: string = 'btcusdt',
  callback: (data: any) => void,
  streams: string[] = ['ticker', 'kline_1m']
): Function
```

**Parameters:**
- `symbol`: Trading pair in lowercase
- `callback`: Function to handle incoming data
- `streams`: Array of stream types

**Returns:** Unsubscribe function

### Error Handling
- Falls back to mock data on API failures
- Automatic reconnection for WebSocket connections
- Console logging for debugging

## TradingView Component

### Purpose
Interactive candlestick chart with real-time data visualization.

### Features
- SVG-based candlestick rendering
- Real-time price updates via WebSocket
- Interactive crosshair with tooltips
- Multiple timeframe support
- Responsive design

### Props

```typescript
interface TradingViewProps {
  symbol?: string;    // Trading pair (default: "BTCUSDT")
  height?: number;    // Chart height in pixels (default: 400)
  width?: number;     // Chart width in pixels (default: 800)
}
```

### State Management

#### Core State
- `currentPrice`: Current price of trading pair
- `priceChange`: 24-hour absolute price change
- `priceChangePercent`: 24-hour percentage change
- `chartData`: Array of candlestick data
- `isConnected`: WebSocket connection status
- `isLoading`: Loading state for data fetching

#### Interaction State
- `mousePosition`: Mouse coordinates for crosshair
- `crosshairData`: Data for tooltip display
- `selectedInterval`: Current time interval
- `intervalLoading`: Loading state for interval changes

### Key Methods

#### `handleIntervalChange(newInterval)`
```typescript
async handleIntervalChange(newInterval: TimeInterval): Promise<void>
```

**Purpose:** Switch between different time intervals
**Parameters:** New time interval to switch to
**Side Effects:** Loads new historical data and updates WebSocket subscription

#### `handleMouseMove(event)`
```typescript
handleMouseMove(event: React.MouseEvent<SVGSVGElement>): void
```

**Purpose:** Handle mouse movement for crosshair functionality
**Parameters:** Mouse event from SVG element
**Side Effects:** Updates crosshair position and tooltip data

#### `scaleY(price)`
```typescript
scaleY(price: number): number
```

**Purpose:** Convert price value to Y coordinate in SVG space
**Parameters:** Price value to convert
**Returns:** Y coordinate for SVG rendering

### Chart Rendering

#### Dimensions
- `chartWidth`: Total chart width
- `chartHeight`: Chart height minus controls
- `paddingX`: Left padding (30px)
- `paddingY`: Top/bottom padding (20px)
- `rightPadding`: Right padding for price labels (100px)
- `candleWidth`: Width of individual candlesticks

#### Scaling
- `minPrice`: Minimum price with 0.1% buffer
- `maxPrice`: Maximum price with 0.1% buffer
- `priceRange`: Difference between max and min prices
- `scaleY()`: Function to convert price to Y coordinate

### SVG Elements

#### Grid and Background
- Grid pattern with 40px spacing
- Horizontal price level lines
- Price labels on right side

#### Candlesticks
- Green for bullish candles (close > open)
- Red for bearish candles (close < open)
- Wicks showing high/low prices
- Body showing open/close prices

#### Interactive Elements
- Crosshair lines (vertical and horizontal)
- Price tooltip on right axis
- Floating OHLCV data tooltip
- Current price line with label

### Data Flow

1. **Initialization:**
   - Fetch historical data
   - Get ticker data
   - Load order book
   - Subscribe to WebSocket

2. **Real-time Updates:**
   - Receive ticker updates
   - Process new candlestick data
   - Update price display
   - Maintain 50-candle sliding window

3. **User Interaction:**
   - Mouse movement triggers crosshair
   - Timeframe buttons load new data
   - WebSocket resubscription for new intervals

## Error Handling

### API Failures
- Automatic fallback to mock data
- Console error logging
- Connection status indicators

### WebSocket Issues
- Automatic reconnection attempts
- Maximum retry limit (5 attempts)
- 3-second intervals between retries

### Data Validation
- Price range validation for scaling
- Candle index bounds checking
- Null/undefined data handling

## Performance Considerations

### Data Management
- 50-candle sliding window for chart data
- Efficient array operations for updates
- Memoized calculations where possible

### Rendering Optimization
- SVG-based rendering for performance
- Conditional rendering for interactive elements
- Responsive design with viewBox scaling

### Memory Management
- Proper cleanup of WebSocket connections
- Event listener removal on unmount
- Subscription cleanup functions

## Troubleshooting

### Common Issues

#### Chart Not Displaying
1. Check browser console for errors
2. Verify API connectivity
3. Ensure proper component props
4. Check for JavaScript errors

#### WebSocket Connection Failures
1. Verify internet connection
2. Check browser WebSocket support
3. Review network firewall settings
4. Monitor reconnection attempts

#### Data Not Updating
1. Check WebSocket connection status
2. Verify symbol format (uppercase for API, lowercase for WebSocket)
3. Monitor console for subscription errors
4. Check API rate limits

### Debug Information
- Enable console logging in development
- Use browser DevTools Network tab
- Monitor WebSocket messages
- Check React DevTools for state updates

## Configuration

### Environment Variables
- No specific environment variables required
- Uses public API endpoints
- CORS-enabled endpoints only

### Browser Support
- Modern browsers with WebSocket support
- SVG rendering capability required
- ES6+ JavaScript features

## Dependencies

### Required Packages
- React 19+
- TypeScript 5+
- Next.js 15+

### Optional Enhancements
- Chart.js for additional chart types
- D3.js for advanced visualizations
- WebSocket polyfills for older browsers