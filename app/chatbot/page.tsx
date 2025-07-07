"use client";
import ChatBot from "../components/ChatBot";

export default function ChatBotPage() {
  const handleMessage = async (message: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response with potential RAG sources
    const responses = [
      {
        content: "Hello! I'm an AI assistant. How can I help you today?",
        sources: ["Knowledge Base", "FAQ Database"]
      },
      {
        content: "I understand you're asking about that topic. Based on the available information, here's what I can tell you...",
        sources: ["Document 1", "Reference Manual"]
      },
      {
        content: "That's an interesting question! Let me provide you with some relevant information.",
        sources: ["Research Paper", "Technical Documentation"]
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
          
          {/* Info Panel */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">RAG Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Document ingestion ready</li>
              <li>• Source attribution</li>
              <li>• Context-aware responses</li>
              <li>• Real-time chat interface</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">Next Steps</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Connect to LLM API</li>
              <li>• Implement vector database</li>
              <li>• Add document upload</li>
              <li>• Enable semantic search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}