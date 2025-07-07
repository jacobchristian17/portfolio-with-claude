"use client";
import ChatBot from "../components/ChatBot";
import RAGControls from "../components/RAGControls";

export default function ChatBotPage() {
  const handleMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          ragEnabled: true,
          selectedIndexes: ['work', 'school', 'about_me'],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      return {
        content: data.content,
        sources: data.sources || [],
      };
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to mock response if API fails
      const fallbackResponses = [
        {
          content: "I'm having trouble connecting to the LLM service right now. This is a fallback response. Please check your API configuration or try again later.",
          sources: ["Fallback System"]
        },
        {
          content: "It looks like the LLM API isn't configured yet. To enable real AI responses, please set up your environment variables with an API key.",
          sources: ["System Message"]
        }
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Chatbot with RAG</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chatbot */}
          <div className="lg:col-span-2">
            <ChatBot 
              onMessage={handleMessage}
              ragEnabled={true}
              documents={["doc1.pdf", "doc2.txt", "knowledge_base.md"]}
            />
          </div>
          
          {/* Controls and Info Panel */}
          <div className="space-y-6">
            <RAGControls />
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">RAG Demo</h2>
              <p className="text-sm text-gray-600 mb-4">
                Try asking questions about:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Work:</strong> "What's my experience with React?"</li>
                <li>• <strong>School:</strong> "Tell me about my education"</li>
                <li>• <strong>Personal:</strong> "What are my hobbies?"</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 3 specialized knowledge indexes</li>
                <li>• Similarity-based document retrieval</li>
                <li>• Context-aware responses</li>
                <li>• Source attribution & relevance scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}