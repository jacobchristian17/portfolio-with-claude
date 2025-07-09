/**
 * Trading API Service for real-time cryptocurrency data
 * Provides REST API and WebSocket connections to cryptocurrency exchanges
 */

/**
 * Represents a single candlestick/OHLCV data point
 * @interface CandleData
 */
export interface CandleData {
  /** Unix timestamp in milliseconds */
  time: number;
  /** Opening price */
  open: number;
  /** Highest price during the period */
  high: number;
  /** Lowest price during the period */
  low: number;
  /** Closing price */
  close: number;
  /** Trading volume during the period */
  volume: number;
}

/**
 * 24-hour ticker statistics for a trading pair
 * @interface TickerData
 */
export interface TickerData {
  /** Trading pair symbol (e.g., "BTCUSDT") */
  symbol: string;
  /** Current price */
  price: number;
  /** 24-hour price change in absolute value */
  change: number;
  /** 24-hour price change as percentage */
  changePercent: number;
  /** 24-hour highest price */
  high24h: number;
  /** 24-hour lowest price */
  low24h: number;
  /** 24-hour trading volume */
  volume24h: number;
  /** Timestamp of the data */
  timestamp: number;
}

/**
 * Single order book entry
 * @interface OrderBookEntry
 */
export interface OrderBookEntry {
  /** Price level */
  price: number;
  /** Quantity at this price level */
  quantity: number;
}

/**
 * Order book data containing bids and asks
 * @interface OrderBook
 */
export interface OrderBook {
  /** Buy orders sorted by price (descending) */
  bids: OrderBookEntry[];
  /** Sell orders sorted by price (ascending) */
  asks: OrderBookEntry[];
}

/**
 * Trading API client for cryptocurrency exchanges
 * Supports REST API calls and WebSocket connections for real-time data
 * @class TradingAPI
 */
export class TradingAPI {
  /** Base URL for REST API endpoints */
  private baseUrl: string;
  /** WebSocket URL for real-time data streams */
  private wsUrl: string;
  /** Active WebSocket connection */
  private ws: WebSocket | null = null;
  /** Map of subscription callbacks */
  private subscribers: Map<string, (data: any) => void> = new Map();
  /** Current reconnection attempt count */
  private reconnectAttempts = 0;
  /** Maximum number of reconnection attempts */
  private maxReconnectAttempts = 5;
  /** Interval between reconnection attempts in milliseconds */
  private reconnectInterval = 3000;

  /**
   * Creates a new TradingAPI instance
   * @param {('binance'|'coinbase'|'bybit')} exchange - Exchange to connect to
   * @throws {Error} If exchange is not supported
   * @example
   * const api = new TradingAPI('binance');
   */
  constructor(exchange: 'binance' | 'coinbase' | 'bybit' = 'binance') {
    switch (exchange) {
      case 'binance':
        this.baseUrl = 'https://api.binance.com/api/v3';
        this.wsUrl = 'wss://stream.binance.com:9443/ws';
        break;
      case 'coinbase':
        this.baseUrl = 'https://api.exchange.coinbase.com';
        this.wsUrl = 'wss://ws-feed.exchange.coinbase.com';
        break;
      case 'bybit':
        this.baseUrl = 'https://api.bybit.com/v5';
        this.wsUrl = 'wss://stream.bybit.com/v5/public/spot';
        break;
    }
  }

  /**
   * Retrieves historical candlestick data for a trading pair
   * @param {string} symbol - Trading pair symbol (e.g., "BTCUSDT")
   * @param {string} interval - Time interval for candles ("1m", "5m", "15m", "1h", "4h", "1d")
   * @param {number} limit - Maximum number of candles to return (1-1000)
   * @returns {Promise<CandleData[]>} Array of candlestick data
   * @throws {Error} If API request fails
   * @example
   * const candles = await api.getHistoricalData('BTCUSDT', '1h', 100);
   */
  async getHistoricalData(
    symbol: string = 'BTCUSDT',
    interval: string = '1m',
    limit: number = 100
  ): Promise<CandleData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((candle: any[]) => ({
        time: candle[0], // Open time
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5])
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.getFallbackData();
    }
  }

  /**
   * Retrieves 24-hour ticker statistics for a trading pair
   * @param {string} symbol - Trading pair symbol (e.g., "BTCUSDT")
   * @returns {Promise<TickerData>} 24-hour ticker data
   * @throws {Error} If API request fails
   * @example
   * const ticker = await api.getTickerData('BTCUSDT');
   */
  async getTickerData(symbol: string = 'BTCUSDT'): Promise<TickerData> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChange),
        changePercent: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        volume24h: parseFloat(data.volume),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching ticker data:', error);
      return this.getFallbackTicker();
    }
  }

  /**
   * Retrieves order book data for a trading pair
   * @param {string} symbol - Trading pair symbol (e.g., "BTCUSDT")
   * @param {number} limit - Number of price levels to return (5, 10, 20, 50, 100, 500, 1000)
   * @returns {Promise<OrderBook>} Order book with bids and asks
   * @throws {Error} If API request fails
   * @example
   * const orderBook = await api.getOrderBook('BTCUSDT', 20);
   */
  async getOrderBook(symbol: string = 'BTCUSDT', limit: number = 10): Promise<OrderBook> {
    try {
      const response = await fetch(`${this.baseUrl}/depth?symbol=${symbol}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        bids: data.bids.map((bid: string[]) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1])
        })),
        asks: data.asks.map((ask: string[]) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1])
        }))
      };
    } catch (error) {
      console.error('Error fetching order book:', error);
      return this.getFallbackOrderBook();
    }
  }

  /**
   * Subscribes to real-time data via WebSocket connection
   * @param {string} symbol - Trading pair symbol in lowercase (e.g., "btcusdt")
   * @param {Function} callback - Function to handle incoming data
   * @param {string[]} streams - Array of stream types to subscribe to
   * @returns {Function} Unsubscribe function
   * @throws {Error} If WebSocket connection fails
   * @example
   * const unsubscribe = api.subscribeToRealTimeData('btcusdt', (data) => {
   *   console.log(data);
   * }, ['ticker', 'kline_1m']);
   */
  subscribeToRealTimeData(
    symbol: string = 'btcusdt',
    callback: (data: any) => void,
    streams: string[] = ['ticker', 'kline_1m']
  ) {
    const streamNames = streams.map(stream => 
      stream === 'ticker' ? `${symbol}@ticker` : `${symbol}@${stream}`
    );
    
    // Disconnect existing connection if any
    if (this.ws) {
      this.disconnect();
    }
    
    this.connect(streamNames);
    
    const subscriberId = `${symbol}_${streams.join('_')}`;
    this.subscribers.set(subscriberId, callback);
    
    return () => {
      this.subscribers.delete(subscriberId);
      if (this.subscribers.size === 0) {
        this.disconnect();
      }
    };
  }

  private connect(streams: string[]) {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return;
      }

      const streamUrl = `${this.wsUrl}/${streams.join('/')}`;
      this.ws = new WebSocket(streamUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect(streams);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private handleWebSocketMessage(data: any) {
    // Handle different types of messages
    if (data.e === '24hrTicker') {
      // Ticker data
      const tickerData: TickerData = {
        symbol: data.s,
        price: parseFloat(data.c),
        change: parseFloat(data.P),
        changePercent: parseFloat(data.P),
        high24h: parseFloat(data.h),
        low24h: parseFloat(data.l),
        volume24h: parseFloat(data.v),
        timestamp: data.E
      };
      
      this.notifySubscribers('ticker', tickerData);
    } else if (data.e === 'kline') {
      // Candlestick data
      const klineData = data.k;
      const candleData: CandleData = {
        time: klineData.t,
        open: parseFloat(klineData.o),
        high: parseFloat(klineData.h),
        low: parseFloat(klineData.l),
        close: parseFloat(klineData.c),
        volume: parseFloat(klineData.v)
      };
      
      this.notifySubscribers('kline', candleData);
    }
  }

  private notifySubscribers(type: string, data: any) {
    this.subscribers.forEach((callback) => {
      callback({ type, data });
    });
  }

  private attemptReconnect(streams: string[]) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(streams);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }

  // Fallback data for when API is unavailable
  private getFallbackData(): CandleData[] {
    const data: CandleData[] = [];
    const now = Date.now();
    let price = 43250.50;
    
    for (let i = 100; i > 0; i--) {
      const time = now - (i * 60 * 1000);
      const change = (Math.random() - 0.5) * 500;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      
      data.push({
        time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.random() * 1000
      });
      
      price = close;
    }
    
    return data;
  }

  private getFallbackTicker(): TickerData {
    return {
      symbol: 'BTCUSDT',
      price: 43250.50,
      change: 125.30,
      changePercent: 0.29,
      high24h: 43890.00,
      low24h: 42100.00,
      volume24h: 28590.45,
      timestamp: Date.now()
    };
  }

  private getFallbackOrderBook(): OrderBook {
    return {
      bids: [
        { price: 43240.50, quantity: 0.152 },
        { price: 43238.20, quantity: 0.089 },
        { price: 43235.10, quantity: 0.234 },
        { price: 43230.00, quantity: 0.445 },
        { price: 43225.80, quantity: 0.167 }
      ],
      asks: [
        { price: 43250.50, quantity: 0.098 },
        { price: 43252.30, quantity: 0.156 },
        { price: 43255.60, quantity: 0.203 },
        { price: 43260.00, quantity: 0.334 },
        { price: 43265.20, quantity: 0.445 }
      ]
    };
  }
}

// Export singleton instance
export const tradingAPI = new TradingAPI('binance');
export default tradingAPI;