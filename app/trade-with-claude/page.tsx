import TradingView from '../components/TradingView';
import APIStatus from '../components/APIStatus';

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bitcoin Price Chart</h1>
          <p className="text-gray-400">Real-time cryptocurrency chart powered with Binance API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-3">
            <TradingView
              symbol="BTC/USDT"
              height={500}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Status */}
            <APIStatus />

            {/* Description */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Dev Notes 📝</h3>
              <div>
                <h2 className="text-md">Introduction</h2>
                <div className="text-justify text-sm italic leading-releaxed">— This price chart is a React component that integrates Binance API to display the real time  BTC/USDT trading pair.</div>
                <br />
                <h2 className="text-md">Runthrough</h2>
                <div className="text-justify text-sm italic leading-releaxed">— This UI component was built with the assistance of Anthropic&lsquo;s <a target="_blank" className="text-amber-500 hover:text-amber-600 hover:underline" href="https://www.anthropic.com/claude-code">Claude Code</a>. It abled me to ship this feature in <em>MINUTES</em>; a task that would have otherwise taken weeks to learn and develop. The models used were <span className="font-semibold italic">Sonnet 4 (98%)</span> and <span className="font-semibold italic">Haiku 3.5 (2%)</span>.</div>
                <br />
                <div className="text-sm">
                  <strong>🕒 Development Time:</strong> <em className="bg-yellow-200 text-black">~45 minutes</em>
                  <br />
                  <strong>🗒️ Prompt types used:</strong>
                  <ul className="list-inside">
                    <li className="italic"><span className="pr-2">-</span>Natural language</li>
                    <li className="italic"><span className="pr-2">-</span>Images</li>
                    <li className="italic"><span className="pr-2">-</span><a target="_blank" className="text-amber-500 hover:text-amber-600 hover:underline" href="https://github.com/denis-kralj/PromptEngineeringPrimer">Markdown Prompts Framework (MPF)</a></li>
                  </ul>
                  <br />
                  <strong>🤖 Agentic tasks executed:</strong>
                  <ul className="list-inside">
                    <li className="italic"><span className="pr-2">-</span>Read/Write files</li>
                    <li className="italic"><span className="pr-2">-</span>Execute CLI commands</li>
                    <li className="italic"><span className="pr-2">-</span>Integrated APIs</li>
                    <li className="italic"><span className="pr-2">-</span>Analyze code base</li>
                    <li className="italic"><span className="pr-2">-</span>Debug & troubleshoot errors</li>
                  </ul>
                </div>
                <br />

                <span className="text-sm italic leading-releaxed">More detailed documentation coming up <a className="text-amber-500 hover:text-amber-600 hover:underline" href="#">soon!</a></span>
              </div>
              {/* <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white">$2.1B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h High</span>
                  <span className="text-green-500">$1.0987</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Low</span>
                  <span className="text-red-500">$1.0912</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white">$118.2B</span>
                </div>
              </div> */}
            </div>

            {/* Order Book Preview */}
            {/* <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Order Book</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-400 grid grid-cols-2 gap-4">
                  <span>Price (USD)</span>
                  <span>Size</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm grid grid-cols-2 gap-4 text-red-400">
                    <span>1.0965</span>
                    <span>1,250</span>
                  </div>
                  <div className="text-sm grid grid-cols-2 gap-4 text-red-400">
                    <span>1.0962</span>
                    <span>2,100</span>
                  </div>
                  <div className="text-sm grid grid-cols-2 gap-4 text-red-400">
                    <span>1.0958</span>
                    <span>850</span>
                  </div>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="text-sm grid grid-cols-2 gap-4 text-green-400">
                    <span>1.0952</span>
                    <span>1,800</span>
                  </div>
                  <div className="text-sm grid grid-cols-2 gap-4 text-green-400">
                    <span>1.0948</span>
                    <span>950</span>
                  </div>
                  <div className="text-sm grid grid-cols-2 gap-4 text-green-400">
                    <span>1.0945</span>
                    <span>1,600</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                  Buy
                </button>
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                  Sell
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}