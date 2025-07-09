'use client';

import { useState, useEffect } from 'react';
import { tradingAPI } from '../services/tradingAPI';

export default function APIStatus() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('testing');
        setError(null);
        
        const ticker = await tradingAPI.getTickerData('BTCUSDT');
        setLastPrice(ticker.price);
        setStatus('connected');
      } catch (err) {
        console.error('API test failed:', err);
        setStatus('failed');
        setError(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold mb-2">API Connection Status</h3>
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'testing' ? 'bg-yellow-500' : 
          status === 'connected' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className="text-sm">
          {status === 'testing' ? 'Testing connection...' :
           status === 'connected' ? 'Connected to Binance API' :
           'Connection failed'}
        </span>
      </div>
      
      {lastPrice && (
        <div className="text-sm text-gray-400">
          BTC/USDT: ${lastPrice.toFixed(2)}
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-400 mt-2">
          Error: {error}
        </div>
      )}
    </div>
  );
}